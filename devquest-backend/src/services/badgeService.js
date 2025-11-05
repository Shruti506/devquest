const Badge = require('../models/Badge')
const User = require('../models/User')
const Quest = require('../models/Quest')
const { logActivity } = require('./activityService')

const seedInitialBadges = async () => {
  const seeds = [
    {
      name: 'First Steps',
      description: 'Complete your first quest',
      icon: '🥇',
      requirement: { type: 'quests_completed', count: 1 },
      rarity: 'common',
    },
    {
      name: 'Quest Hunter',
      description: 'Complete 5 quests',
      icon: '🏹',
      requirement: { type: 'quests_completed', count: 5 },
      rarity: 'rare',
    },
    {
      name: 'Rising Star',
      description: 'Complete 10 quests',
      icon: '🌟',
      requirement: { type: 'quests_completed', count: 10 },
      rarity: 'epic',
    },
    {
      name: 'Legend',
      description: 'Complete 25 quests',
      icon: '🏆',
      requirement: { type: 'quests_completed', count: 25 },
      rarity: 'legendary',
    },
    {
      name: 'Early Bird',
      description: 'Complete your first quest within 24 hours of signup',
      icon: '🐣',
      requirement: { type: 'early_bird', count: 1 },
      rarity: 'rare',
    },
    {
      name: 'Diverse Learner',
      description: 'Complete quests in 3 different categories',
      icon: '🎯',
      requirement: { type: 'diverse_categories', count: 3 },
      rarity: 'epic',
    },
  ]

  for (const data of seeds) {
    // upsert by name
    await Badge.updateOne(
      { name: data.name },
      { $setOnInsert: data },
      { upsert: true },
    )
  }
}

const getAllBadges = async () => {
  return Badge.find({}).sort({ createdAt: 1 })
}

const getUserBadges = async (userId) => {
  const user = await User.findById(userId).populate('badges')
  return user?.badges || []
}

const checkRequirement = async (user, badge) => {
  const type = badge.requirement?.type
  const count = Number(badge.requirement?.count) || 0

  if (type === 'quests_completed') {
    const completed = Array.isArray(user.completedQuests)
      ? user.completedQuests.length
      : 0
    return completed >= count
  }

  if (type === 'early_bird') {
    // first quest within 24h of signup
    const completed = Array.isArray(user.completedQuests)
      ? user.completedQuests.length
      : 0
    if (completed < 1) return false
    const signupAt = user.createdAt?.getTime?.() || 0
    // naive: assume now is first completion time if just awarded after completion
    const within24h = Date.now() - signupAt <= 24 * 60 * 60 * 1000
    return within24h
  }

  if (type === 'diverse_categories') {
    const ids = Array.isArray(user.completedQuests) ? user.completedQuests : []
    if (ids.length === 0) return false
    const quests = await Quest.find({ _id: { $in: ids } }, { category: 1 })
    const categories = new Set(
      quests.map((q) => (q.category || '').toLowerCase()).filter(Boolean),
    )
    return categories.size >= count
  }

  return false
}

const checkAndAwardBadges = async (userId) => {
  const user = await User.findById(userId).populate('badges')
  if (!user) return []
  const ownedIds = new Set(
    (user.badges || [])
      .map((b) => {
        if (!b) return null
        return b._id ? b._id.toString() : b.toString()
      })
      .filter(Boolean),
  )

  const badges = await getAllBadges()
  const newlyEarned = []

  for (const badge of badges) {
    if (ownedIds.has(badge._id.toString())) continue
    const ok = await checkRequirement(user, badge)
    if (ok) {
      user.badges.push(badge._id)
      newlyEarned.push(badge)
    }
  }

  if (newlyEarned.length > 0) {
    await user.save()
    for (const badge of newlyEarned) {
      await logActivity(
        user._id,
        'badge_earned',
        `Earned badge: ${badge.name}`,
        { badgeId: badge._id },
      )
    }
  }

  return newlyEarned
}

module.exports = {
  seedInitialBadges,
  checkAndAwardBadges,
  getAllBadges,
  getUserBadges,
}
