const express = require('express')
const { createAdmin, deleteAdmin, listAdmins, validateAdminRequest } = require('../controllers/adminController')
const { requireAuth } = require('../middleware/authMiddleware')
const { requireDatabase } = require('../middleware/database')
const { validateObjectId } = require('../middleware/validateObjectId')
const { noStore } = require('../middleware/cache')

const router = express.Router()

router.use(noStore, requireAuth, requireDatabase)
router.get('/', listAdmins)
router.post('/', validateAdminRequest, createAdmin)
router.delete('/:id', validateObjectId('admin'), deleteAdmin)

module.exports = router
