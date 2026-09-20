const dns = require('node:dns')
const mongoose = require('mongoose')
const logger = require('./logger')

const MAX_ATTEMPTS = 5
const BASE_RETRY_DELAY_MS = 1000

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function registerConnectionLogging() {
  mongoose.connection.on('disconnected', () => logger.warn('mongo_disconnected'))
  mongoose.connection.on('reconnected', () => logger.info('mongo_reconnected'))
  mongoose.connection.on('error', (error) => logger.error('mongo_error', { error: error.message }))
}

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    logger.warn('mongo_uri_missing', { detail: 'MONGODB_URI is not configured; content APIs require MongoDB.' })
    return false
  }

  // Node's default resolver can fail MongoDB Atlas SRV lookups on some Windows setups.
  // This overrides the resolver process-wide, so it stays opt-in rather than always on.
  if (process.env.FORCE_PUBLIC_DNS === 'true') {
    dns.setServers(['8.8.8.8', '1.1.1.1'])
    logger.info('dns_servers_overridden')
  }

  registerConnectionLogging()

  // Without a retry the process would come up permanently degraded after one blip:
  // every content endpoint would answer 503 until someone restarted it by hand.
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
      logger.info('mongo_connected', { attempt })
      return true
    } catch (error) {
      const isFinalAttempt = attempt === MAX_ATTEMPTS
      logger.warn('mongo_connect_failed', { attempt, maxAttempts: MAX_ATTEMPTS, error: error.message })
      if (isFinalAttempt) break
      await wait(BASE_RETRY_DELAY_MS * 2 ** (attempt - 1))
    }
  }

  logger.error('mongo_unavailable', { detail: 'Content APIs will return a service-unavailable response.' })
  return false
}

async function disconnectDatabase() {
  if (mongoose.connection.readyState === 0) return
  await mongoose.connection.close()
  logger.info('mongo_disconnected_on_shutdown')
}

function isDatabaseReady() {
  return mongoose.connection.readyState === 1
}

module.exports = { connectDatabase, disconnectDatabase, isDatabaseReady }
