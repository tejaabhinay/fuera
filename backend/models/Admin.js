const mongoose = require('mongoose')

const emailPattern = /^\S+@\S+\.\S+$/

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [emailPattern, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    isBootstrap: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true, versionKey: false },
)

adminSchema.index({ isBootstrap: 1 }, { unique: true, partialFilterExpression: { isBootstrap: true } })

module.exports = mongoose.model('Admin', adminSchema)
