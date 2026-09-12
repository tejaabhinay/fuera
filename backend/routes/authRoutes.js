const express = require('express')
const { login, setupStatus, signup, validateLoginRequest, validateSignupRequest } = require('../controllers/authController')
const { requireDatabase } = require('../middleware/database')

const router = express.Router()

router.post('/login', validateLoginRequest, requireDatabase, login)
router.get('/setup-status', requireDatabase, setupStatus)
router.post('/signup', validateSignupRequest, requireDatabase, signup)

module.exports = router
