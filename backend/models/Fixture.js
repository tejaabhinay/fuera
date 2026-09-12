const mongoose = require('mongoose')

const fixtureSchema = new mongoose.Schema(
  {
    sport: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    round: {
      type: String,
      trim: true,
    },
    teamA: {
      type: String,
      trim: true,
    },
    teamB: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      trim: true,
    },
    venue: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed', 'postponed', 'cancelled'],
      default: 'upcoming',
      lowercase: true,
      trim: true,
    },
    scoreA: {
      type: Number,
      min: 0,
    },
    scoreB: {
      type: Number,
      min: 0,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, versionKey: false },
)

fixtureSchema.index({ date: 1, time: 1, createdAt: 1 })

module.exports = mongoose.model('Fixture', fixtureSchema)
