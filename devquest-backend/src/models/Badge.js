const mongoose = require('mongoose')

const RequirementSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    count: { type: Number },
  },
  { _id: false },
)

const BadgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String },
    requirement: { type: RequirementSchema, required: true },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

module.exports = mongoose.model('Badge', BadgeSchema)
