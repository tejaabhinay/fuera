const dotenv = require("dotenv");
const path = require("node:path");

// Load backend/.env before importing routes and controllers that depend on runtime configuration.
dotenv.config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const registrationRoutes = require("./routes/registrationRoutes");
const authRoutes = require("./routes/authRoutes");
const fixtureRoutes = require("./routes/fixtureRoutes");
const timelineRoutes = require("./routes/timelineRoutes");
const previousEditionRoutes = require("./routes/previousEditionRoutes");
const sportRoutes = require("./routes/sportRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { connectDatabase } = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/fixtures", fixtureRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/previous-editions", previousEditionRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admins", adminRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Sports Fest API is running!"
    });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    await connectDatabase();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
}

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };
