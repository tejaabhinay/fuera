const path = require('node:path')
const readline = require('node:readline')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Admin = require('../models/Admin')
const { connectDatabase, isDatabaseReady } = require('../config/database')

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const emailPattern = /^\S+@\S+\.\S+$/

function ask(question) {
  const input = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => input.question(question, (answer) => {
    input.close()
    resolve(answer)
  }))
}

function askHidden(question) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) return ask(question)

  return new Promise((resolve, reject) => {
    let password = ''
    const onData = (chunk) => {
      const character = chunk.toString()
      if (character === '\u0003') {
        process.stdin.setRawMode(false)
        process.stdin.pause()
        process.stdin.removeListener('data', onData)
        reject(new Error('Password entry cancelled.'))
        return
      }
      if (character === '\r' || character === '\n') {
        process.stdout.write('\n')
        process.stdin.setRawMode(false)
        process.stdin.pause()
        process.stdin.removeListener('data', onData)
        resolve(password)
        return
      }
      if (character === '\u007f') {
        password = password.slice(0, -1)
        return
      }
      password += character
    }

    process.stdout.write(question)
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.on('data', onData)
  })
}

async function collectCredentials() {
  const emailArgument = process.argv[2]
  const email = emailArgument || process.env.ADMIN_EMAIL || await ask('Admin email: ')
  const password = process.env.ADMIN_PASSWORD || await askHidden('Admin password: ')
  return { email, password }
}

function validateCredentials(emailValue, password) {
  const email = emailValue.trim().toLowerCase()
  if (!emailPattern.test(email)) throw new Error('Admin email must be a valid email address.')
  if (typeof password !== 'string' || password.length < 12) throw new Error('Admin password must be at least 12 characters long.')
  return { email, password }
}

async function createAdmin(credentials) {
  const input = credentials || await collectCredentials()
  const { email, password } = validateCredentials(input.email, input.password)

  const connected = await connectDatabase()
  if (!connected || !isDatabaseReady()) throw new Error('MongoDB connection unavailable; admin was not created.')

  const existingAdmin = await Admin.findOne({ email }).select('_id')
  if (existingAdmin) throw new Error('An admin with that email already exists.')

  const passwordHash = await bcrypt.hash(password, 12)
  await Admin.create({ email, passwordHash })
  console.log('Admin created successfully.')
}

if (require.main === module) {
  createAdmin()
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
    .finally(async () => {
      await mongoose.disconnect()
    })
}

module.exports = { createAdmin, validateCredentials }
