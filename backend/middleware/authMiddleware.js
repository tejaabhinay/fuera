const jwt = require('jsonwebtoken')
const { getJwtSecret } = require('../config/auth')

function requireAuth(req, res, next) {
  const authorization = req.get('authorization')
  const match = authorization?.match(/^Bearer\s+(.+)$/i)

  if (!match) return res.status(401).json({ message: 'Authentication required' })

  const secret = getJwtSecret()
  if (!secret) return res.status(503).json({ message: 'Authentication is not configured' })

  try {
    const payload = jwt.verify(match[1].trim(), secret)
    if (!payload || typeof payload !== 'object' || typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    req.admin = { id: payload.sub, email: payload.email }
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = { requireAuth }
