const ActivityLog = require('../models/ActivityLog')

const logActivity = async (arg1, type, description, metadata) => {
  if (typeof arg1 === 'object' && arg1 !== null && !type) {
    userId = arg1.userId
    activityType = (arg1.action || '').replace(':', '_')
    desc = undefined
    meta = arg1.details || {}
  } else {
    userId = arg1
    activityType = type
    desc = description
    meta = metadata || {}
  }

  try {
    await ActivityLog.create({
      user: userId,
      activityType,
      description: desc,
      metadata: meta,
    })
  } catch (_) {
    // eslint-disable-next-line no-console
    console.log('[Activity][fallback]', {
      activityType,
      userId: userId?.toString?.(),
      desc,
      meta,
    })
  }
}

async function getUserActivities(userId, { limit = 20, skip = 0 } = {}) {
  const lim = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100)
  const sk = Math.max(parseInt(skip, 10) || 0, 0)
  const [items, total] = await Promise.all([
    ActivityLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(sk)
      .limit(lim),
    ActivityLog.countDocuments({ user: userId }),
  ])
  return { items, total }
}

module.exports = { logActivity, getUserActivities }
