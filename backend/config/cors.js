const logger = require('./logger')

function getAllowedOrigins() {
  return (process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean)
}

// With no allowlist configured the API stays open, which keeps local development and a
// first deploy working; production should always set CORS_ALLOWED_ORIGINS.
function getCorsOptions() {
  const allowedOrigins = getAllowedOrigins()

  if (!allowedOrigins.length) {
    logger.warn('cors_allowlist_missing', { detail: 'CORS_ALLOWED_ORIGINS is not set; allowing all origins.' })
    return { origin: '*' }
  }

  return {
    origin(origin, callback) {
      // Same-origin requests, curl and server-to-server calls send no Origin header.
      if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ''))) return callback(null, true)
      return callback(null, false)
    },
    credentials: false,
  }
}

module.exports = { getAllowedOrigins, getCorsOptions }
