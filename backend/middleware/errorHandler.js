function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body must be valid JSON' })
  }

  const status = Number.isInteger(error.status) && error.status >= 400 ? error.status : 500
  const message = status >= 500 ? 'Internal server error' : error.message || 'Request failed'

  return res.status(status).json({ message })
}

module.exports = errorHandler
