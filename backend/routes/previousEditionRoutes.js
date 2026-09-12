const express = require('express')
const { requireDatabase } = require('../middleware/database')
const { requireAuth } = require('../middleware/authMiddleware')
const { validateObjectId } = require('../middleware/validateObjectId')
const {
  createPreviousEdition,
  deletePreviousEdition,
  listAdminPreviousEditions,
  listPreviousEditions,
  updatePreviousEdition,
  validatePreviousEditionRequest,
} = require('../controllers/previousEditionController')

const router = express.Router()

router.get('/', requireDatabase, listPreviousEditions)
router.get('/admin', requireAuth, requireDatabase, listAdminPreviousEditions)
router.post('/', requireAuth, validatePreviousEditionRequest, requireDatabase, createPreviousEdition)
router.patch('/:id', requireAuth, validateObjectId('archive image'), validatePreviousEditionRequest, requireDatabase, updatePreviousEdition)
router.delete('/:id', requireAuth, validateObjectId('archive image'), requireDatabase, deletePreviousEdition)

module.exports = router
