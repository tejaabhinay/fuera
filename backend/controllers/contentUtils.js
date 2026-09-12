function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function pickFields(body, fields) {
  return fields.reduce((payload, field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) payload[field] = body[field]
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

function isOptionalNumber(value) {
  return value === null || (typeof value === 'number' && Number.isFinite(value))
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

module.exports = {
  isPlainObject,
  pickFields,
  normalizeFixturePayload,
  normalizeTimelinePayload,
  isValidDateValue,
  isValidHttpUrl,
  isOptionalNumber,
  sendValidationError,
}
