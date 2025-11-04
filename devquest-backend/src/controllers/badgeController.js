const User = require('../models/User')
const {
  getAllBadges,
  getUserBadges,
  checkAndAwardBadges,
} = require('../services/badgeService')

const getAllBadgesHandler = async (req, res) => {
  try {
    const badges = await getAllBadges()
    return res.status(200).json({ badges })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch badges' })
  }
}
const getUserBadgesHandler = async (req, res) => {
  try {
    const badges = await getUserBadges(req.user._id)
    return res.status(200).json({ badges })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user badges' })
  }
}
const getBadgeProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('badges')
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Optionally auto-check and award any missed badges
    const newlyEarned = await checkAndAwardBadges(user._id)

    // For progress display, compute simple stats
    const owned = new Set(user.badges.map((b) => b._id.toString()))
    const all = await getAllBadges()
    const progress = all.map((b) => ({
      badge: b,
      earned:
        owned.has(b._id.toString()) ||
        newlyEarned.some((nb) => nb._id.toString() === b._id.toString()),
    }))

    return res.status(200).json({ progress, newlyEarned })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch badge progress' })
  }
}

module.exports = {
  getAllBadges: getAllBadgesHandler,
  getUserBadges: getUserBadgesHandler,
  getBadgeProgress,
}
