const express = require('express')
const { createSport, deleteSport, listSports, updateSport, validateSportRequest } = require('../controllers/sportController')
const { requireDatabase } = require('../middleware/database')
const { requireAuth } = require('../middleware/authMiddleware')
const { validateObjectId } = require('../middleware/validateObjectId')

const router = express.Router()

router.get('/', requireDatabase, listSports)
router.post('/', requireAuth, validateSportRequest, requireDatabase, createSport)
router.patch('/:id', requireAuth, validateObjectId('sport'), validateSportRequest, requireDatabase, updateSport)
router.delete('/:id', requireAuth, validateObjectId('sport'), requireDatabase, deleteSport)

module.exports = router
