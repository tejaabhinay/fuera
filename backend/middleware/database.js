const { isDatabaseReady } = require('../config/database')

function requireDatabase(req, res, next) {
  if (!isDatabaseReady()) {
    return res.status(503).json({ message: 'Database unavailable' })
  }

  return next()
}

module.exports = { requireDatabase }
