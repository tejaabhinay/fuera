const { ipKeyGenerator, rateLimit } = require('express-rate-limit')

const MINUTE = 60 * 1000

function createLimiter({ windowMs, limit, message, keyGenerator }) {
  return rateLimit({
    windowMs,
    limit,
    keyGenerator,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({ message }),
  })
}

// Brute-forcing a 12-character password is the main risk on the admin account, so the
// login window is deliberately tight. bcrypt at cost 12 also makes this a CPU DoS vector.
const loginLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  limit: 10,
  message: 'Too many sign-in attempts. Please try again in a few minutes.',
})

const signupLimiter = createLimiter({
  windowMs: 60 * MINUTE,
  limit: 5,
  message: 'Too many setup attempts. Please try again later.',
})

const registrationLimiter = createLimiter({
  windowMs: 60 * MINUTE,
  limit: 15,
  message: 'Too many registrations from this network. Please try again later.',
})

// Uploads cost Cloudinary quota, so they are metered per admin rather than per IP.
const uploadLimiter = createLimiter({
  windowMs: 60 * MINUTE,
  limit: 60,
  message: 'Upload limit reached. Please try again later.',
  keyGenerator: (req) => (req.admin ? `admin:${req.admin.id}` : ipKeyGenerator(req.ip)),
})

const apiLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  limit: 600,
  message: 'Too many requests. Please slow down and try again shortly.',
})

module.exports = { apiLimiter, loginLimiter, registrationLimiter, signupLimiter, uploadLimiter }
