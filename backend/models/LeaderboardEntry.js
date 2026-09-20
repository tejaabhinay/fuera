const mongoose = require('mongoose')

const leaderboardEntrySchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gold: { type: Number, default: 0, min: 0 },
    silver: { type: Number, default: 0, min: 0 },
    bronze: { type: Number, default: 0, min: 0 },
    // Manual tiebreak for departments that are otherwise level on medals.
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
)

// Championship order: gold first, then silver, then bronze, then the manual
// override, then name so the sort is fully deterministic for pagination.
leaderboardEntrySchema.index({ isPublished: 1, gold: -1, silver: -1, bronze: -1, order: 1 })

module.exports = mongoose.model('LeaderboardEntry', leaderboardEntrySchema)
