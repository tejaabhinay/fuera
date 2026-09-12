const bcrypt = require('bcryptjs')

const emailPattern = /^\S+@\S+\.\S+$/

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function validateEmail(value) {
  return emailPattern.test(normalizeEmail(value))
}

function validatePassword(value) {
  return typeof value === 'string' && value.length >= 12
}

function validateCredentials(email, password) {
  const normalizedEmail = normalizeEmail(email)
  if (!validateEmail(normalizedEmail)) return 'Email must be valid'
  if (!validatePassword(password)) return 'Password must be at least 12 characters long'
  return null
}

async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash)
}

module.exports = { normalizeEmail, validateEmail, validatePassword, validateCredentials, hashPassword, verifyPassword }
