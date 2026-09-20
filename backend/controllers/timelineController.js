const TimelineEvent = require('../models/TimelineEvent')
const {
  createRequestValidator,
  has,
  isValidDateValue,
  isValidationError,
  normalizeTimelinePayload,
  sendValidationError,
} = require('./contentUtils')

const LIST_LIMIT = 500
const safeFields = 'title date createdAt updatedAt'

const timelineFields = ['title', 'date']

function validateTimelinePayload(payload, partial = false) {
  if ((!partial || has(payload, 'title')) && (typeof payload.title !== 'string' || !payload.title)) return 'title is required'
  if ((!partial || has(payload, 'date')) && !isValidDateValue(payload.date)) return 'date must be a valid date'
  return null
}

const validateTimelineRequest = createRequestValidator({
  entity: 'timeline event',
  fields: timelineFields,
  normalize: normalizeTimelinePayload,
  validate: validateTimelinePayload,
  payloadKey: 'timelinePayload',
})

// Timeline events have no draft state, so the public and admin listings are the same query.
async function listTimelineEvents(req, res) {
  const events = await TimelineEvent.find().select(safeFields).sort({ date: 1, createdAt: 1, _id: 1 }).limit(LIST_LIMIT).lean()
  return res.json({ events })
}

async function getTimelineEvent(req, res) {
  const event = await TimelineEvent.findById(req.params.id).select(safeFields).lean()
  if (!event) return res.status(404).json({ message: 'Timeline event not found' })
  return res.json({ event })
}

async function createTimelineEvent(req, res) {
  try {
    const event = await TimelineEvent.create(req.timelinePayload)
    return res.status(201).json({ event })
  } catch (error) {
    if (isValidationError(error)) return sendValidationError(res, 'timeline event', error)
    throw error
  }
}

async function updateTimelineEvent(req, res) {
  try {
    const event = await TimelineEvent.findByIdAndUpdate(req.params.id, req.timelinePayload, { returnDocument: 'after', runValidators: true }).select(safeFields).lean()
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

module.exports = { listTimelineEvents, getTimelineEvent, createTimelineEvent, updateTimelineEvent, deleteTimelineEvent, validateTimelineRequest }
