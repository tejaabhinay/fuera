const mongoose = require('mongoose')

const previousEditionSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => {
          try {
            const url = new URL(value)
            return url.protocol === 'http:' || url.protocol === 'https:'
          } catch {
            return false
          }
        },
        message: 'imageUrl must be a valid HTTP or HTTPS URL',
      },
    },
    year: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
)

previousEditionSchema.index({ isPublished: 1, order: 1, _id: 1 })

module.exports = mongoose.model('PreviousEdition', previousEditionSchema)
