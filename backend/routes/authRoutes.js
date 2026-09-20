const express = require('express')
const { login, setupStatus, signup, validateLoginRequest, validateSignupRequest } = require('../controllers/authController')
const { requireDatabase } = require('../middleware/database')
const { noStore } = require('../middleware/cache')
const { loginLimiter, signupLimiter } = require('../middleware/rateLimit')

const router = express.Router()

router.use(noStore)
router.post('/login', loginLimiter, validateLoginRequest, requireDatabase, login)
router.get('/setup-status', requireDatabase, setupStatus)
router.post('/signup', signupLimiter, validateSignupRequest, requireDatabase, signup)

module.exports = router
