const express = require('express')
const { requireDatabase } = require('../middleware/database')
const { requireAuth } = require('../middleware/authMiddleware')
const { validateObjectId } = require('../middleware/validateObjectId')
const { noStore, publicCache } = require('../middleware/cache')
const {
  createTimelineEvent,
  deleteTimelineEvent,
  getTimelineEvent,
  listTimelineEvents,
  updateTimelineEvent,
  validateTimelineRequest,
} = require('../controllers/timelineController')

const router = express.Router()

router.get('/', publicCache(60), requireDatabase, listTimelineEvents)
router.get('/admin', noStore, requireAuth, requireDatabase, listTimelineEvents)
router.post('/', noStore, requireAuth, validateTimelineRequest, requireDatabase, createTimelineEvent)
router.get('/:id', publicCache(60), validateObjectId('timeline event'), requireDatabase, getTimelineEvent)
router.patch('/:id', noStore, requireAuth, validateObjectId('timeline event'), validateTimelineRequest, requireDatabase, updateTimelineEvent)
router.delete('/:id', noStore, requireAuth, validateObjectId('timeline event'), requireDatabase, deleteTimelineEvent)

module.exports = router
