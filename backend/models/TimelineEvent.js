const mongoose = require('mongoose')

const timelineEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
)

timelineEventSchema.index({ date: 1, createdAt: 1 })

module.exports = mongoose.model('TimelineEvent', timelineEventSchema)
