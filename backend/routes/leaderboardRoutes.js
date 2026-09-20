const express = require('express')
const { requireDatabase } = require('../middleware/database')
const { requireAuth } = require('../middleware/authMiddleware')
const { validateObjectId } = require('../middleware/validateObjectId')
const { noStore, publicCache } = require('../middleware/cache')
const {
  createLeaderboardEntry,
  deleteLeaderboardEntry,
  listAdminLeaderboard,
  listLeaderboard,
  updateLeaderboardEntry,
  validateLeaderboardRequest,
} = require('../controllers/leaderboardController')

const router = express.Router()

router.get('/', publicCache(60), requireDatabase, listLeaderboard)
router.get('/admin', noStore, requireAuth, requireDatabase, listAdminLeaderboard)
router.post('/', noStore, requireAuth, validateLeaderboardRequest, requireDatabase, createLeaderboardEntry)
router.patch('/:id', noStore, requireAuth, validateObjectId('leaderboard entry'), validateLeaderboardRequest, requireDatabase, updateLeaderboardEntry)
router.delete('/:id', noStore, requireAuth, validateObjectId('leaderboard entry'), requireDatabase, deleteLeaderboardEntry)

module.exports = router
