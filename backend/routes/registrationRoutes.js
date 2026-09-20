const express = require('express')
const { createRegistration } = require('../controllers/registrationController')
const { requireDatabase } = require('../middleware/database')
const { noStore } = require('../middleware/cache')
const { registrationLimiter } = require('../middleware/rateLimit')

const router = express.Router()

router.post('/', noStore, registrationLimiter, requireDatabase, createRegistration)

module.exports = router
