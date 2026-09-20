const crypto = require('node:crypto')
const mongoose = require('mongoose')
const Registration = require('../models/Registration')

function createRegistrationId() {
  return `FUERA-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
}

function isDatabaseReady() {
  return mongoose.connection.readyState === 1
}

async function saveRegistration(data) {
  if (!isDatabaseReady()) {
    const error = new Error('Database unavailable')
    error.code = 'DATABASE_UNAVAILABLE'
    throw error
  }

  const registration = {
    registrationId: createRegistrationId(),
    ...data,
    createdAt: new Date(),
  }

  return Registration.create(registration)
}

module.exports = { saveRegistration }
