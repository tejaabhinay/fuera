const Sport = require('../models/Sport')
const { isPlainObject, pickFields, sendValidationError } = require('./contentUtils')

const sportFields = ['name', 'formUrl', 'imageUrl', 'isActive', 'order']

function normalizeSportPayload(payload) {
  const stringFields = ['name', 'formUrl', 'imageUrl']
  stringFields.forEach((field) => {
    if (typeof payload[field] === 'string') payload[field] = payload[field].trim()
  })
  return payload
}

function isValidHttpUrl(value) {
  if (value === '') return true
  if (typeof value !== 'string') return false

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function validateSportPayload(payload, partial = false) {
  if (!partial && (typeof payload.name !== 'string' || !payload.name)) return 'name is required'
  if (Object.prototype.hasOwnProperty.call(payload, 'name') && (typeof payload.name !== 'string' || !payload.name)) return 'name is required'
  if (Object.prototype.hasOwnProperty.call(payload, 'formUrl') && !isValidHttpUrl(payload.formUrl)) return 'formUrl must be a valid HTTP or HTTPS URL'
  if (Object.prototype.hasOwnProperty.call(payload, 'imageUrl') && !isValidHttpUrl(payload.imageUrl)) return 'imageUrl must be a valid HTTP or HTTPS URL'
  if (Object.prototype.hasOwnProperty.call(payload, 'isActive') && typeof payload.isActive !== 'boolean') return 'isActive must be a boolean'
  if (Object.prototype.hasOwnProperty.call(payload, 'order') && (typeof payload.order !== 'number' || !Number.isFinite(payload.order))) return 'order must be a number'
  return null
}

function isValidationError(error) {
  return error?.name === 'ValidationError' || error?.name === 'CastError' || error?.code === 11000
}

function validateSportRequest(req, res, next) {
  if (!isPlainObject(req.body)) return res.status(400).json({ message: 'Invalid sport data' })

  const payload = normalizeSportPayload(pickFields(req.body, sportFields))
  if (req.method === 'PATCH' && !Object.keys(payload).length) return res.status(400).json({ message: 'Invalid sport data' })

  const validationMessage = validateSportPayload(payload, req.method === 'PATCH')
  if (validationMessage) return res.status(400).json({ message: 'Invalid sport data', errors: { sport: validationMessage } })

  req.sportPayload = payload
  return next()
}

async function listSports(req, res) {
  const sports = await Sport.find().sort({ order: 1, name: 1, _id: 1 }).lean()
  return res.json({ sports })
}

async function createSport(req, res) {
  try {
    const sport = await Sport.create(req.sportPayload)
    return res.status(201).json({ sport })
  } catch (error) {
    if (isValidationError(error)) return sendValidationError(res, 'sport', error)
    throw error
  }
}

async function updateSport(req, res) {
  try {
    const sport = await Sport.findByIdAndUpdate(req.params.id, req.sportPayload, { returnDocument: 'after', runValidators: true }).lean()
    if (!sport) return res.status(404).json({ message: 'Sport not found' })
    return res.json({ sport })
  } catch (error) {
    if (isValidationError(error)) return sendValidationError(res, 'sport', error)
    throw error
  }
}

async function deleteSport(req, res) {
  const sport = await Sport.findByIdAndDelete(req.params.id).lean()
  if (!sport) return res.status(404).json({ message: 'Sport not found' })
  return res.status(204).send()
}

module.exports = { listSports, createSport, updateSport, deleteSport, validateSportRequest }
