function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function has(payload, field) {
  return Object.prototype.hasOwnProperty.call(payload, field)
}

function pickFields(body, fields) {
  return fields.reduce((payload, field) => {
    if (has(body, field)) payload[field] = body[field]
    return payload
  }, {})
}

function trimFields(payload, fields) {
  fields.forEach((field) => {
    if (typeof payload[field] === 'string') payload[field] = payload[field].trim()
  })
  return payload
}

function normalizeFixturePayload(payload) {
  trimFields(payload, ['sport', 'round', 'teamA', 'teamB', 'time', 'venue', 'imageUrl', 'notes'])
  if (typeof payload.sport === 'string') payload.sport = payload.sport.toLowerCase()
  if (typeof payload.status === 'string') payload.status = payload.status.trim().toLowerCase()
  return payload
}

function normalizeTimelinePayload(payload) {
  trimFields(payload, ['title'])
  return payload
}

function isValidDateValue(value) {
  if (typeof value !== 'string' && !(value instanceof Date)) return false
  return !Number.isNaN(new Date(value).getTime())
}

// Shared by every content model: an empty string clears the field, anything else must be http(s).
function isValidHttpUrl(value) {
  if (value === '') return true
  return isRequiredHttpUrl(value)
}

function isRequiredHttpUrl(value) {
  if (typeof value !== 'string' || !value) return false

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isOptionalNumber(value) {
  return value === null || (typeof value === 'number' && Number.isFinite(value))
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

function isValidationError(error) {
  return error?.name === 'ValidationError' || error?.name === 'CastError'
}

function getValidationDetails(error) {
  if (!error?.errors) return undefined

  return Object.fromEntries(Object.entries(error.errors).map(([field, detail]) => [field, detail.message]))
}

function sendValidationError(res, entity, error) {
  const response = { message: `Invalid ${entity} data` }
  const details = getValidationDetails(error)
  if (details) response.errors = details
  return res.status(400).json(response)
}

// Every content controller validates the same way: reject non-objects, pick the known
// fields, reject empty PATCH bodies, then run the model-specific rules.
function createRequestValidator({ entity, fields, normalize, validate, payloadKey }) {
  return (req, res, next) => {
    if (!isPlainObject(req.body)) return res.status(400).json({ message: `Invalid ${entity} data` })

    const payload = normalize(pickFields(req.body, fields))
    if (req.method === 'PATCH' && !Object.keys(payload).length) {
      return res.status(400).json({ message: `Invalid ${entity} data` })
    }

    const validationMessage = validate(payload, req.method === 'PATCH')
    if (validationMessage) {
      return res.status(400).json({ message: `Invalid ${entity} data`, errors: { [payloadKey]: validationMessage } })
    }

    req[payloadKey] = payload
    return next()
  }
}

module.exports = {
  isPlainObject,
  has,
  pickFields,
  trimFields,
  normalizeFixturePayload,
  normalizeTimelinePayload,
  isValidDateValue,
  isValidHttpUrl,
  isRequiredHttpUrl,
  isOptionalNumber,
  isFiniteNumber,
  isValidationError,
  sendValidationError,
  createRequestValidator,
}
