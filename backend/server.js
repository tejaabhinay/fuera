const dotenv = require("dotenv");
const path = require("node:path");

// Load backend/.env before importing routes and controllers that depend on runtime configuration.
dotenv.config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const registrationRoutes = require("./routes/registrationRoutes");
const authRoutes = require("./routes/authRoutes");
const fixtureRoutes = require("./routes/fixtureRoutes");
const timelineRoutes = require("./routes/timelineRoutes");
const previousEditionRoutes = require("./routes/previousEditionRoutes");
const sportRoutes = require("./routes/sportRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { connectDatabase, disconnectDatabase, isDatabaseReady } = require("./config/database");
const { getCorsOptions } = require("./config/cors");
const logger = require("./config/logger");
const errorHandler = require("./middleware/errorHandler");
const { requestContext } = require("./middleware/requestContext");
const { apiLimiter } = require("./middleware/rateLimit");

const app = express();

// Render and Vercel terminate TLS upstream; without this every client shares one proxy IP
// and the rate limiters would throttle all traffic together.
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(requestContext);
app.use(helmet({
    // This is a JSON API that serves no HTML, so a CSP adds nothing; the framing and
    // sniffing guards below are what actually matter for it.
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));
app.use(compression());
app.use(cors(getCorsOptions()));
app.use(express.json({ limit: "100kb" }));

// Platform health probes run before the limiter so monitoring never gets throttled.
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
app.get("/ready", (req, res) => {
    if (!isDatabaseReady()) {
        return res.status(503).json({ status: "not_ready", database: "unavailable" });
    }

    return res.json({ status: "ready", database: "connected" });
});

app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/fixtures", fixtureRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/previous-editions", previousEditionRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admins", adminRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Sports Fest API is running!"
    });
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

function registerShutdownHandlers(server) {
    let shuttingDown = false;

    const shutdown = async (signal) => {
        if (shuttingDown) return;
        shuttingDown = true;
        logger.info("shutdown_started", { signal });

        // Stop accepting connections, drain in-flight requests, then close MongoDB cleanly.
        server.close(async () => {
            try {
                await disconnectDatabase();
            } catch (error) {
                logger.error("shutdown_error", { error: error.message });
            }
            logger.info("shutdown_complete");
            process.exit(0);
        });

        setTimeout(() => {
            logger.error("shutdown_forced", { detail: "Timed out waiting for connections to drain." });
            process.exit(1);
        }, 10000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("unhandledRejection", (reason) => {
        logger.error("unhandled_rejection", { error: reason instanceof Error ? reason.message : String(reason) });
    });
}

async function startServer() {
    await connectDatabase();

    const server = app.listen(PORT, "0.0.0.0", () => {
        logger.info("server_listening", { port: PORT });
    });

    registerShutdownHandlers(server);
    return server;
}

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };
