const { v2: cloudinary } = require('cloudinary')

function getCloudinaryConfig() {
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  }
}

function isCloudinaryConfigured(config) {
  return Object.values(config).every((value) => typeof value === 'string' && value.trim())
}

function configureCloudinary() {
  const config = getCloudinaryConfig()
  if (!isCloudinaryConfigured(config)) return false
  cloudinary.config(config)
  return true
}

function uploadImageBuffer(buffer, folder) {
  if (!configureCloudinary()) {
    const error = new Error('Image uploads are not configured')
    error.code = 'CLOUDINARY_NOT_CONFIGURED'
    return Promise.reject(error)
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ fetch_format: 'auto', quality: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error)
        return resolve(result)
      },
    )
    stream.end(buffer)
  })
}

module.exports = { uploadImageBuffer }
