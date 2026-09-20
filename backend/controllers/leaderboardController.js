const LeaderboardEntry = require('../models/LeaderboardEntry')
const {
  createRequestValidator,
  has,
  isFiniteNumber,
  isValidationError,
  sendValidationError,
  trimFields,
} = require('./contentUtils')

const LIST_LIMIT = 200
const safeFields = 'department gold silver bronze order isPublished'
const medalFields = ['gold', 'silver', 'bronze']

const leaderboardFields = ['department', ...medalFields, 'order', 'isPublished']

function normalizeLeaderboardPayload(payload) {
  return trimFields(payload, ['department'])
}

function validateLeaderboardPayload(payload, partial = false) {
  if ((!partial || has(payload, 'department')) && (typeof payload.department !== 'string' || !payload.department)) {
    return 'department is required'
  }
  for (const field of medalFields) {
    if (has(payload, field) && (!isFiniteNumber(payload[field]) || payload[field] < 0)) {
      return `${field} must be a number of 0 or more`
    }
  }
  if (has(payload, 'order') && !isFiniteNumber(payload.order)) return 'order must be a number'
  if (has(payload, 'isPublished') && typeof payload.isPublished !== 'boolean') return 'isPublished must be a boolean'
  return null
}

const validateLeaderboardRequest = createRequestValidator({
  entity: 'leaderboard entry',
  fields: leaderboardFields,
  normalize: normalizeLeaderboardPayload,
  validate: validateLeaderboardPayload,
  payloadKey: 'leaderboardPayload',
})

function findEntries(filter) {
  return LeaderboardEntry.find(filter)
    .select(safeFields)
    .sort({ gold: -1, silver: -1, bronze: -1, order: 1, department: 1 })
    .limit(LIST_LIMIT)
    .lean()
}

// Rank is derived, never stored: departments level on all three medals share a
// rank, and the next distinct tally resumes at the real position (1,2,2,4).
function withRanks(entries) {
  let lastKey = null
  let lastRank = 0

  return entries.map((entry, index) => {
    const key = `${entry.gold}-${entry.silver}-${entry.bronze}`
    if (key !== lastKey) {
      lastKey = key
      lastRank = index + 1
    }
    return {
      ...entry,
      rank: lastRank,
      total: entry.gold + entry.silver + entry.bronze,
    }
  })
}

async function listLeaderboard(req, res) {
  const entries = await findEntries({ isPublished: true })
  return res.json({ leaderboard: withRanks(entries) })
}

async function listAdminLeaderboard(req, res) {
  const entries = await findEntries({})
  return res.json({ leaderboard: withRanks(entries) })
}

async function createLeaderboardEntry(req, res) {
  try {
    const entry = await LeaderboardEntry.create(req.leaderboardPayload)
    return res.status(201).json({ entry })
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'That department is already on the leaderboard' })
    if (isValidationError(error)) return sendValidationError(res, 'leaderboard entry', error)
    throw error
  }
}

async function updateLeaderboardEntry(req, res) {
  try {
    const entry = await LeaderboardEntry.findByIdAndUpdate(req.params.id, req.leaderboardPayload, {
      returnDocument: 'after',
      runValidators: true,
    }).select(safeFields).lean()
    if (!entry) return res.status(404).json({ message: 'Leaderboard entry not found' })
    return res.json({ entry })
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'That department is already on the leaderboard' })
    if (isValidationError(error)) return sendValidationError(res, 'leaderboard entry', error)
    throw error
  }
}

async function deleteLeaderboardEntry(req, res) {
  const entry = await LeaderboardEntry.findByIdAndDelete(req.params.id).lean()
  if (!entry) return res.status(404).json({ message: 'Leaderboard entry not found' })
  return res.status(204).send()
}

module.exports = {
  listLeaderboard,
  listAdminLeaderboard,
  createLeaderboardEntry,
  updateLeaderboardEntry,
  deleteLeaderboardEntry,
  validateLeaderboardRequest,
}
