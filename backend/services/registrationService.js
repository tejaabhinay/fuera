const crypto = require('node:crypto')
const mongoose = require('mongoose')
const Registration = require('../models/Registration')

const memoryRegistrations = []

function createRegistrationId() {
  return `FUERA-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
}

function isDatabaseReady() {
  return mongoose.connection.readyState === 1
}

async function saveRegistration(data) {
  const registration = {
    registrationId: createRegistrationId(),
    ...data,
    createdAt: new Date(),
  }

  if (isDatabaseReady()) {
    return Registration.create(registration)
  }

  memoryRegistrations.push(registration)
  return registration
}

module.exports = { saveRegistration }
