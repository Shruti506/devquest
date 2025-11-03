const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ActivityLogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: {
      type: String,
      enum: [
        'quest_created',
        'quest_completed',
        'badge_earned',
        'level_up',
        'quest_updated',
        'quest_deleted',
      ],
      required: true,
    },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

module.exports = mongoose.model('ActivityLog', ActivityLogSchema)

try {
  ActivityLogSchema.index({ createdAt: -1, user: 1 })
} catch (_) {}
