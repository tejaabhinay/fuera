const express = require('express')
const { createSport, deleteSport, listSports, updateSport, validateSportRequest } = require('../controllers/sportController')
const { requireDatabase } = require('../middleware/database')
const { requireAuth } = require('../middleware/authMiddleware')
const { validateObjectId } = require('../middleware/validateObjectId')
const { noStore, publicCache } = require('../middleware/cache')

const router = express.Router()

router.get('/admin', noStore, requireAuth, requireDatabase, listSports)
router.get('/', publicCache(60), requireDatabase, listSports)
router.post('/', noStore, requireAuth, validateSportRequest, requireDatabase, createSport)
router.patch('/:id', noStore, requireAuth, validateObjectId('sport'), validateSportRequest, requireDatabase, updateSport)
router.delete('/:id', noStore, requireAuth, validateObjectId('sport'), requireDatabase, deleteSport)

module.exports = router
