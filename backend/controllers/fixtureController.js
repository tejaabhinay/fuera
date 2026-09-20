const Fixture = require('../models/Fixture')
const {
  createRequestValidator,
  has,
  isOptionalNumber,
  isValidDateValue,
  isValidHttpUrl,
  isValidationError,
  normalizeFixturePayload,
  sendValidationError,
} = require('./contentUtils')

const LIST_LIMIT = 500

const fixtureFields = [
  'sport',
  'round',
  'teamA',
  'teamB',
  'date',
  'time',
  'venue',
  'status',
  'scoreA',
  'scoreB',
  'imageUrl',
  'notes',
]

function validateFixturePayload(payload, partial = false) {
  if ((!partial || has(payload, 'sport')) && (typeof payload.sport !== 'string' || !payload.sport)) return 'sport is required'
  if ((!partial || has(payload, 'date')) && !isValidDateValue(payload.date)) return 'date must be a valid date'
  if (has(payload, 'scoreA') && !isOptionalNumber(payload.scoreA)) return 'scoreA must be a number'
  if (has(payload, 'scoreB') && !isOptionalNumber(payload.scoreB)) return 'scoreB must be a number'
  if (has(payload, 'status') && typeof payload.status !== 'string') return 'status must be a valid status'
  if (has(payload, 'imageUrl') && !isValidHttpUrl(payload.imageUrl)) return 'imageUrl must be a valid HTTP or HTTPS URL'
  return null
}

const validateFixtureRequest = createRequestValidator({
  entity: 'fixture',
  fields: fixtureFields,
  normalize: normalizeFixturePayload,
  validate: validateFixturePayload,
  payloadKey: 'fixturePayload',
})

async function listFixtures(req, res) {
  const fixtures = await Fixture.find().sort({ date: 1, time: 1, createdAt: 1, _id: 1 }).limit(LIST_LIMIT).lean()
  return res.json({ fixtures })
}

async function getFixture(req, res) {
  const fixture = await Fixture.findById(req.params.id).lean()
  if (!fixture) return res.status(404).json({ message: 'Fixture not found' })
  return res.json({ fixture })
}

async function createFixture(req, res) {
  try {
    const fixture = await Fixture.create(req.fixturePayload)
    return res.status(201).json({ fixture })
  } catch (error) {
    if (isValidationError(error)) return sendValidationError(res, 'fixture', error)
    throw error
  }
}

async function updateFixture(req, res) {
  try {
    const fixture = await Fixture.findByIdAndUpdate(req.params.id, req.fixturePayload, { returnDocument: 'after', runValidators: true }).lean()
    if (!fixture) return res.status(404).json({ message: 'Fixture not found' })
    return res.json({ fixture })
  } catch (error) {
    if (isValidationError(error)) return sendValidationError(res, 'fixture', error)
    throw error
  }
}

async function deleteFixture(req, res) {
  const fixture = await Fixture.findByIdAndDelete(req.params.id).lean()
  if (!fixture) return res.status(404).json({ message: 'Fixture not found' })
  return res.status(204).send()
}

module.exports = { listFixtures, getFixture, createFixture, updateFixture, deleteFixture, validateFixtureRequest }
