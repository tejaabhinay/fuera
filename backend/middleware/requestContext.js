const crypto = require('node:crypto')
const logger = require('../config/logger')

// Tags every request so a 500 in the logs can be traced back to the client that saw it.
function requestContext(req, res, next) {
  req.id = req.get('x-request-id') || crypto.randomUUID()
  res.setHeader('X-Request-Id', req.id)

  const startedAt = process.hrtime.bigint()
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6
    if (res.statusCode < 400 && req.path === '/health') return

    logger.info('request', {
      requestId: req.id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Number(durationMs.toFixed(1)),
    })
  })

  return next()
}

module.exports = { requestContext }
