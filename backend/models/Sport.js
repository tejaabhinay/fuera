const mongoose = require('mongoose')

function isHttpUrl(value) {
  if (!value) return true

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const sportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    formUrl: {
      type: String,
      trim: true,
      validate: {
        validator: isHttpUrl,
        message: 'formUrl must be a valid HTTP or HTTPS URL',
      },
    },
    imageUrl: {
      type: String,
      trim: true,
      validate: {
        validator: isHttpUrl,
        message: 'imageUrl must be a valid HTTP or HTTPS URL',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
)

sportSchema.index({ isActive: 1, order: 1, name: 1 })

module.exports = mongoose.model('Sport', sportSchema)
