const PreviousEdition = require('../models/PreviousEdition')
const { isPlainObject, pickFields, sendValidationError } = require('./contentUtils')

const previousEditionFields = ['imageUrl', 'year', 'title', 'order', 'isPublished']

function normalizePreviousEditionPayload(payload) {
  for (const field of ['imageUrl', 'year', 'title']) {
    if (typeof payload[field] === 'string') payload[field] = payload[field].trim()
  }
  return payload
}

function isValidHttpUrl(value) {
  if (typeof value !== 'string' || !value) return false

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function validatePreviousEditionPayload(payload, partial = false) {
  if (!partial && !isValidHttpUrl(payload.imageUrl)) return 'imageUrl must be a valid HTTP or HTTPS URL'
  if (Object.prototype.hasOwnProperty.call(payload, 'imageUrl') && !isValidHttpUrl(payload.imageUrl)) return 'imageUrl must be a valid HTTP or HTTPS URL'
  for (const field of ['year', 'title']) {
    if (Object.prototype.hasOwnProperty.call(payload, field) && typeof payload[field] !== 'string') return `${field} must be a string`
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'order') && (typeof payload.order !== 'number' || !Number.isFinite(payload.order))) return 'order must be a number'
  if (Object.prototype.hasOwnProperty.call(payload, 'isPublished') && typeof payload.isPublished !== 'boolean') return 'isPublished must be a boolean'
  return null
}

function isValidationError(error) {
  return error?.name === 'ValidationError' || error?.name === 'CastError'
}

function validatePreviousEditionRequest(req, res, next) {
  if (!isPlainObject(req.body)) return res.status(400).json({ message: 'Invalid archive image data' })

  const payload = normalizePreviousEditionPayload(pickFields(req.body, previousEditionFields))
  if (req.method === 'PATCH' && !Object.keys(payload).length) return res.status(400).json({ message: 'Invalid archive image data' })

  const validationMessage = validatePreviousEditionPayload(payload, req.method === 'PATCH')
  if (validationMessage) return res.status(400).json({ message: 'Invalid archive image data', errors: { archive: validationMessage } })

  req.previousEditionPayload = payload
  return next()
}

const safeFields = 'imageUrl year title order isPublished'

async function listPreviousEditions(req, res) {
  const editions = await PreviousEdition.find({ isPublished: true }).select(safeFields).sort({ order: 1, _id: 1 }).lean()
  return res.json(editions)
}

async function listAdminPreviousEditions(req, res) {
  const editions = await PreviousEdition.find().select(safeFields).sort({ order: 1, _id: 1 }).lean()
  return res.json({ previousEditions: editions })
}

async function createPreviousEdition(req, res) {
  try {
    const edition = await PreviousEdition.create(req.previousEditionPayload)
    return res.status(201).json({ previousEdition: edition })
  } catch (error) {
    if (isValidationError(error)) return sendValidationError(res, 'archive image', error)
    throw error
  }
}

async function updatePreviousEdition(req, res) {
  try {
    const edition = await PreviousEdition.findByIdAndUpdate(req.params.id, req.previousEditionPayload, { returnDocument: 'after', runValidators: true }).select(safeFields).lean()
    if (!edition) return res.status(404).json({ message: 'Archive image not found' })
    return res.json({ previousEdition: edition })
  } catch (error) {
    if (isValidationError(error)) return sendValidationError(res, 'archive image', error)
    throw error
  }
}

async function deletePreviousEdition(req, res) {
  const edition = await PreviousEdition.findByIdAndDelete(req.params.id).lean()
  if (!edition) return res.status(404).json({ message: 'Archive image not found' })
  return res.status(204).send()
}

module.exports = {
  listPreviousEditions,
  listAdminPreviousEditions,
  createPreviousEdition,
  updatePreviousEdition,
  deletePreviousEdition,
  validatePreviousEditionRequest,
}
