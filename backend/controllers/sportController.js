const Sport = require('../models/Sport')
const {
  createRequestValidator,
  has,
  isFiniteNumber,
  isValidHttpUrl,
  isValidationError,
  sendValidationError,
  trimFields,
} = require('./contentUtils')

const LIST_LIMIT = 200

const sportFields = ['name', 'formUrl', 'imageUrl', 'isActive', 'order']

function normalizeSportPayload(payload) {
  return trimFields(payload, ['name', 'formUrl', 'imageUrl'])
}

function validateSportPayload(payload, partial = false) {
  if ((!partial || has(payload, 'name')) && (typeof payload.name !== 'string' || !payload.name)) return 'name is required'
  if (has(payload, 'formUrl') && !isValidHttpUrl(payload.formUrl)) return 'formUrl must be a valid HTTP or HTTPS URL'
  if (has(payload, 'imageUrl') && !isValidHttpUrl(payload.imageUrl)) return 'imageUrl must be a valid HTTP or HTTPS URL'
  if (has(payload, 'isActive') && typeof payload.isActive !== 'boolean') return 'isActive must be a boolean'
  if (has(payload, 'order') && !isFiniteNumber(payload.order)) return 'order must be a number'
  return null
}

const validateSportRequest = createRequestValidator({
  entity: 'sport',
  fields: sportFields,
  normalize: normalizeSportPayload,
  validate: validateSportPayload,
  payloadKey: 'sportPayload',
})

// Mounted on both /api/sports and /api/sports/admin; only the admin route runs requireAuth,
// so req.admin is what decides whether inactive sports are included.
async function listSports(req, res) {
  const filter = req.admin ? {} : { isActive: true }
  const sports = await Sport.find(filter).sort({ order: 1, name: 1, _id: 1 }).limit(LIST_LIMIT).lean()
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
