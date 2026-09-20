const express = require('express')
const multer = require('multer')
const { requireAuth } = require('../middleware/authMiddleware')
const { noStore } = require('../middleware/cache')
const { uploadLimiter } = require('../middleware/rateLimit')
const { uploadImage } = require('../controllers/uploadController')

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error('Only JPEG, PNG, and WebP images are supported')
      error.code = 'INVALID_IMAGE_TYPE'
      return callback(error)
    }
    return callback(null, true)
  },
})

function parseImageUpload(req, res, next) {
  upload.single('image')(req, res, (error) => {
    if (!error) return next()
    if (error.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ message: 'Image must be 5 MB or smaller' })
    if (error.code === 'INVALID_IMAGE_TYPE') return res.status(400).json({ message: error.message })
    return res.status(400).json({ message: 'Malformed image upload' })
  })
}

const router = express.Router()
// requireAuth runs first so the limiter can meter per admin rather than per shared proxy IP.
router.post('/image', noStore, requireAuth, uploadLimiter, parseImageUpload, uploadImage)

module.exports = router
