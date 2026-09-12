const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const { getJwtExpiresIn, getJwtSecret } = require('../config/auth')
const { hashPassword, normalizeEmail, validateCredentials, verifyPassword } = require('../services/adminCredentials')

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function validateLoginRequest(req, res, next) {
  const { email, password } = req.body || {}
  const validationMessage = validateCredentials(email, password)

  if (!isPlainObject(req.body) || validationMessage) return res.status(400).json({ message: 'Invalid login data' })
  req.loginCredentials = { email: normalizeEmail(email), password }
  return next()
}

function validateSignupRequest(req, res, next) {
  const { email, password, confirmPassword } = req.body || {}
  const validationMessage = validateCredentials(email, password)

  if (!isPlainObject(req.body) || validationMessage || password !== confirmPassword) {
    return res.status(400).json({ message: validationMessage || 'Passwords do not match' })
  }
  req.signupCredentials = { email: normalizeEmail(email), password }
  return next()
}

function signAdminToken(admin) {
  const secret = getJwtSecret()
  if (!secret) return null
  return jwt.sign({ sub: admin._id.toString(), email: admin.email }, secret, { expiresIn: getJwtExpiresIn() })
}

async function setupStatus(req, res) {
  const setupRequired = (await Admin.exists({})) === null
  return res.json({ setupRequired })
}

async function signup(req, res) {
  const { email, password } = req.signupCredentials
  if ((await Admin.exists({})) !== null) return res.status(403).json({ message: 'Admin setup is already complete' })

  try {
    const passwordHash = await hashPassword(password)
    await Admin.create({ email, passwordHash, isBootstrap: true })
    return res.status(201).json({ message: 'Admin account created successfully' })
  } catch (error) {
    if (error?.code === 11000) return res.status(403).json({ message: 'Admin setup is already complete' })
    throw error
  }
}

async function login(req, res) {
  const { email, password } = req.loginCredentials
  const secret = getJwtSecret()
  if (!secret) return res.status(503).json({ message: 'Authentication is not configured' })

  const admin = await Admin.findOne({ email }).select('+passwordHash')
  const passwordMatches = admin ? await verifyPassword(password, admin.passwordHash) : false
  if (!admin || !passwordMatches) return res.status(401).json({ message: 'Invalid email or password' })

  const token = signAdminToken(admin)
  return res.json({ token, admin: { id: admin._id.toString(), email: admin.email } })
}

module.exports = { validateLoginRequest, validateSignupRequest, setupStatus, signup, login, isPlainObject }
