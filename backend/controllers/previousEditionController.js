const PreviousEdition = require('../models/PreviousEdition')
const {
  createRequestValidator,
  has,
  isFiniteNumber,
  isRequiredHttpUrl,
  isValidationError,
  sendValidationError,
  trimFields,
} = require('./contentUtils')

const LIST_LIMIT = 200
const safeFields = 'imageUrl year title order isPublished'

const previousEditionFields = ['imageUrl', 'year', 'title', 'order', 'isPublished']

function normalizePreviousEditionPayload(payload) {
  return trimFields(payload, ['imageUrl', 'year', 'title'])
}

function validatePreviousEditionPayload(payload, partial = false) {
  if ((!partial || has(payload, 'imageUrl')) && !isRequiredHttpUrl(payload.imageUrl)) return 'imageUrl must be a valid HTTP or HTTPS URL'
  for (const field of ['year', 'title']) {
    if (has(payload, field) && typeof payload[field] !== 'string') return `${field} must be a string`
  }
  if (has(payload, 'order') && !isFiniteNumber(payload.order)) return 'order must be a number'
  if (has(payload, 'isPublished') && typeof payload.isPublished !== 'boolean') return 'isPublished must be a boolean'
  return null
}

const validatePreviousEditionRequest = createRequestValidator({
  entity: 'archive image',
  fields: previousEditionFields,
  normalize: normalizePreviousEditionPayload,
  validate: validatePreviousEditionPayload,
  payloadKey: 'previousEditionPayload',
})

function findEditions(filter) {
  return PreviousEdition.find(filter).select(safeFields).sort({ order: 1, _id: 1 }).limit(LIST_LIMIT).lean()
}

async function listPreviousEditions(req, res) {
  const previousEditions = await findEditions({ isPublished: true })
  return res.json({ previousEditions })
}

async function listAdminPreviousEditions(req, res) {
  const previousEditions = await findEditions({})
  return res.json({ previousEditions })
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
