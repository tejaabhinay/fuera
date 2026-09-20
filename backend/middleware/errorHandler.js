const logger = require('../config/logger')

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body must be valid JSON' })
  }

  const status = Number.isInteger(error.status) && error.status >= 400 ? error.status : 500

  // Unexpected failures were previously swallowed, leaving nothing to debug in production.
  if (status >= 500) {
    logger.error('unhandled_error', {
      requestId: req.id,
      method: req.method,
      path: req.path,
      name: error.name,
      error: error.message,
      stack: error.stack,
    })
  }

  const message = status >= 500 ? 'Internal server error' : error.message || 'Request failed'
  return res.status(status).json({ message, requestId: req.id })
}

module.exports = errorHandler
