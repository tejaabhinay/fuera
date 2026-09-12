const TimelineEvent = require('../models/TimelineEvent')
const {
  isPlainObject,
  isValidDateValue,
  isValidHttpUrl,
  normalizeTimelinePayload,
  pickFields,
  sendValidationError,
} = require('./contentUtils')

const timelineFields = ['title', 'date']

function validateTimelinePayload(payload, partial = false) {
  if (!partial && (typeof payload.title !== 'string' || !payload.title)) return 'title is required'
  if (Object.prototype.hasOwnProperty.call(payload, 'title') && (typeof payload.title !== 'string' || !payload.title)) return 'title is required'
  if (!partial && !isValidDateValue(payload.date)) return 'date must be a valid date'
  if (Object.prototype.hasOwnProperty.call(payload, 'date') && !isValidDateValue(payload.date)) return 'date must be a valid date'
  return null
}

function isValidationError(error) {
  return error?.name === 'ValidationError' || error?.name === 'CastError'
}

function validateTimelineRequest(req, res, next) {
  if (!isPlainObject(req.body)) return res.status(400).json({ message: 'Invalid timeline event data' })

  const payload = normalizeTimelinePayload(pickFields(req.body, timelineFields))
  if (req.method === 'PATCH' && !Object.keys(payload).length) return res.status(400).json({ message: 'Invalid timeline event data' })

  const validationMessage = validateTimelinePayload(payload, req.method === 'PATCH')
  if (validationMessage) return res.status(400).json({ message: 'Invalid timeline event data', errors: { timeline: validationMessage } })

  req.timelinePayload = payload
  return next()
}

async function listTimelineEvents(req, res) {
  const events = await TimelineEvent.find().select('title date createdAt updatedAt').sort({ date: 1, createdAt: 1, _id: 1 }).lean()
  return res.json({ events })
}

async function listAdminTimelineEvents(req, res) {
  const events = await TimelineEvent.find().select('title date createdAt updatedAt').sort({ date: 1, createdAt: 1, _id: 1 }).lean()
  return res.json({ events })
}

async function getTimelineEvent(req, res) {
  const event = await TimelineEvent.findById(req.params.id).select('title date createdAt updatedAt').lean()
  if (!event) return res.status(404).json({ message: 'Timeline event not found' })
  return res.json({ event })
}

async function createTimelineEvent(req, res) {
  const payload = req.timelinePayload || normalizeTimelinePayload(pickFields(req.body, timelineFields))

  try {
    const event = await TimelineEvent.create(payload)
    return res.status(201).json({ event })
  } catch (error) {
    if (isValidationError(error)) return sendValidationError(res, 'timeline event', error)
    throw error
  }
}

async function updateTimelineEvent(req, res) {
  const payload = req.timelinePayload || normalizeTimelinePayload(pickFields(req.body, timelineFields))

  try {
    const event = await TimelineEvent.findByIdAndUpdate(req.params.id, payload, { returnDocument: 'after', runValidators: true }).lean()
    if (!event) return res.status(404).json({ message: 'Timeline event not found' })
    return res.json({ event })
  } catch (error) {
    if (isValidationError(error)) return sendValidationError(res, 'timeline event', error)
    throw error
  }
}

async function deleteTimelineEvent(req, res) {
  const event = await TimelineEvent.findByIdAndDelete(req.params.id).lean()
  if (!event) return res.status(404).json({ message: 'Timeline event not found' })
  return res.status(204).send()
}

module.exports = { listTimelineEvents, listAdminTimelineEvents, getTimelineEvent, createTimelineEvent, updateTimelineEvent, deleteTimelineEvent, validateTimelineRequest }
