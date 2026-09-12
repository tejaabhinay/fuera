const Fixture = require('../models/Fixture')
const {
  isOptionalNumber,
  isPlainObject,
  isValidDateValue,
  isValidHttpUrl,
  normalizeFixturePayload,
  pickFields,
  sendValidationError,
} = require('./contentUtils')

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
  if (!partial && (typeof payload.sport !== 'string' || !payload.sport)) return 'sport is required'
  if (Object.prototype.hasOwnProperty.call(payload, 'sport') && (typeof payload.sport !== 'string' || !payload.sport)) return 'sport is required'
  if (!partial && !isValidDateValue(payload.date)) return 'date must be a valid date'
  if (Object.prototype.hasOwnProperty.call(payload, 'date') && !isValidDateValue(payload.date)) return 'date must be a valid date'
  if (Object.prototype.hasOwnProperty.call(payload, 'scoreA') && !isOptionalNumber(payload.scoreA)) return 'scoreA must be a number'
  if (Object.prototype.hasOwnProperty.call(payload, 'scoreB') && !isOptionalNumber(payload.scoreB)) return 'scoreB must be a number'
  if (Object.prototype.hasOwnProperty.call(payload, 'status') && typeof payload.status !== 'string') return 'status must be a valid status'
  if (Object.prototype.hasOwnProperty.call(payload, 'imageUrl') && !isValidHttpUrl(payload.imageUrl)) return 'imageUrl must be a valid HTTP or HTTPS URL'
  return null
}

function isValidationError(error) {
  return error?.name === 'ValidationError' || error?.name === 'CastError'
}

function validateFixtureRequest(req, res, next) {
  if (!isPlainObject(req.body)) return res.status(400).json({ message: 'Invalid fixture data' })

  const payload = normalizeFixturePayload(pickFields(req.body, fixtureFields))
  if (req.method === 'PATCH' && !Object.keys(payload).length) return res.status(400).json({ message: 'Invalid fixture data' })

  const validationMessage = validateFixturePayload(payload, req.method === 'PATCH')
  if (validationMessage) return res.status(400).json({ message: 'Invalid fixture data', errors: { fixture: validationMessage } })

  req.fixturePayload = payload
  return next()
}

async function listFixtures(req, res) {
  const fixtures = await Fixture.find().sort({ date: 1, time: 1, createdAt: 1, _id: 1 }).lean()
  return res.json({ fixtures })
}

async function getFixture(req, res) {
  const fixture = await Fixture.findById(req.params.id).lean()
  if (!fixture) return res.status(404).json({ message: 'Fixture not found' })
  return res.json({ fixture })
}

async function createFixture(req, res) {
  const payload = req.fixturePayload || normalizeFixturePayload(pickFields(req.body, fixtureFields))

  try {
    const fixture = await Fixture.create(payload)
    return res.status(201).json({ fixture })
  } catch (error) {
    if (isValidationError(error)) return sendValidationError(res, 'fixture', error)
    throw error
  }
}

async function updateFixture(req, res) {
  const payload = req.fixturePayload || normalizeFixturePayload(pickFields(req.body, fixtureFields))

  try {
    const fixture = await Fixture.findByIdAndUpdate(req.params.id, payload, { returnDocument: 'after', runValidators: true }).lean()
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
