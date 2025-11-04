const User = require('../models/User')
const Quest = require('../models/Quest')
const { validationResult } = require('express-validator')
const { awardXP, calculateLevel } = require('../services/xpService')
const { checkAndAwardBadges } = require('../services/badgeService')
const {
  logActivity,
  getUserActivities,
} = require('../services/activityService')

function handleValidation(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  return null
}

const completeQuest = async (req, res) => {
  const err = handleValidation(req, res)
  if (err) return err
  try {
    const { questId } = req.params
    const quest = await Quest.findById(questId)
    if (!quest) return res.status(404).json({ message: 'Quest not found' })

    if (quest.createdBy.toString() === req.user._id.toString()) {
      return res.status(403).json({
        message: 'You cannot complete a quest that you created.',
      })
    }

    // Already completed by this user?
    const alreadyCompleted =
      Array.isArray(quest.completedBy) &&
      quest.completedBy.some((u) => u.toString() === req.user._id.toString())
    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Quest already completed' })
    }

    // Add completion
    quest.completedBy.push(req.user._id)
    quest.status = 'Solved'
    await quest.save()

    // Update user progress
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (!Array.isArray(user.completedQuests)) user.completedQuests = []
    user.completedQuests.push(quest._id)
    await user.save()

    const updatedUser = await awardXP(user._id, quest.xpReward)

    // Level-up check (calculate based on new xp)
    const newLevel = calculateLevel(updatedUser.xp)
    const leveledUp = newLevel > (user.level || 1)

    // Badge milestones
    const newBadges = await checkAndAwardBadges(req.user._id)

    // Log activities
    await logActivity(
      req.user._id,
      'quest_completed',
      `Completed quest: ${quest.title}`,
      { questId: quest._id, xp: quest.xpReward },
    )
    if (leveledUp) {
      await logActivity(req.user._id, 'level_up', `Reached level ${newLevel}`, {
        level: newLevel,
      })
    }

    return res.status(200).json({
      user: updatedUser.toJSON(),
      gainedXp: quest.xpReward,
      leveledUp,
      newLevel,
      newBadges,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to complete quest' })
  }
}

const getUserProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const completedCount = Array.isArray(user.completedQuests)
      ? user.completedQuests.length
      : 0

    // Completion rate placeholder: if we want total quests, compute against total available
    const totalQuests = await Quest.countDocuments()
    const completionRate =
      totalQuests > 0 ? +((completedCount / totalQuests) * 100).toFixed(2) : 0

    return res.status(200).json({
      xp: user.xp,
      level: user.level,
      completedQuests: completedCount,
      completionRate,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch progress' })
  }
}

const getActivityLog = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      100,
    )
    const skip = (page - 1) * limit
    const { items, total } = await getUserActivities(req.user._id, {
      limit,
      skip,
    })
    return res.status(200).json({
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch activity log' })
  }
}

module.exports = {
  completeQuest,
  getUserProgress,
  getActivityLog,
}
