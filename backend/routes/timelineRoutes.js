const express = require('express')
const { requireDatabase } = require('../middleware/database')
const { requireAuth } = require('../middleware/authMiddleware')
const { validateObjectId } = require('../middleware/validateObjectId')
const {
  createTimelineEvent,
  deleteTimelineEvent,
  getTimelineEvent,
  listAdminTimelineEvents,
  listTimelineEvents,
  updateTimelineEvent,
  validateTimelineRequest,
} = require('../controllers/timelineController')

const router = express.Router()

router.get('/', requireDatabase, listTimelineEvents)
router.get('/admin', requireAuth, requireDatabase, listAdminTimelineEvents)
router.post('/', requireAuth, validateTimelineRequest, requireDatabase, createTimelineEvent)
router.get('/:id', validateObjectId('timeline event'), requireDatabase, getTimelineEvent)
router.patch('/:id', requireAuth, validateObjectId('timeline event'), validateTimelineRequest, requireDatabase, updateTimelineEvent)
router.delete('/:id', requireAuth, validateObjectId('timeline event'), requireDatabase, deleteTimelineEvent)

module.exports = router
