function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  return typeof secret === 'string' && secret.trim() ? secret : null
}

function getJwtExpiresIn() {
  return process.env.JWT_EXPIRES_IN || '8h'
}

module.exports = { getJwtSecret, getJwtExpiresIn }
