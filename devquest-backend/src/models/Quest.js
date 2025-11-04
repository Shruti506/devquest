const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuestSchema = new Schema(
  {
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    xpReward: { type: Number, required: true },
    description: { type: String },
    status: { type: String, enum: ['Unsolved', 'Solved'], default: 'Unsolved' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    completedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Quest', QuestSchema)
