const dns = require('node:dns')
const mongoose = require('mongoose')

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not configured; content APIs require MongoDB.')
    return false
  }

  try {
    // Node's default resolver can fail MongoDB Atlas SRV lookups on some Windows setups.
    dns.setServers(['8.8.8.8', '1.1.1.1'])

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log('MongoDB connected.')
    return true
  } catch {
    console.warn('MongoDB is unavailable; content APIs will return a service-unavailable response.')
    return false
  }
}

function isDatabaseReady() {
  return mongoose.connection.readyState === 1
}

module.exports = { connectDatabase, isDatabaseReady }
