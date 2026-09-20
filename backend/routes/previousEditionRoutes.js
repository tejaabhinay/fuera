const express = require('express')
const { requireDatabase } = require('../middleware/database')
const { requireAuth } = require('../middleware/authMiddleware')
const { validateObjectId } = require('../middleware/validateObjectId')
const { noStore, publicCache } = require('../middleware/cache')
const {
  createPreviousEdition,
  deletePreviousEdition,
  listAdminPreviousEditions,
  listPreviousEditions,
  updatePreviousEdition,
  validatePreviousEditionRequest,
} = require('../controllers/previousEditionController')

const router = express.Router()

router.get('/', publicCache(120), requireDatabase, listPreviousEditions)
router.get('/admin', noStore, requireAuth, requireDatabase, listAdminPreviousEditions)
router.post('/', noStore, requireAuth, validatePreviousEditionRequest, requireDatabase, createPreviousEdition)
router.patch('/:id', noStore, requireAuth, validateObjectId('archive image'), validatePreviousEditionRequest, requireDatabase, updatePreviousEdition)
router.delete('/:id', noStore, requireAuth, validateObjectId('archive image'), requireDatabase, deletePreviousEdition)

module.exports = router
