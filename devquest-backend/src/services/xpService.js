const User = require('../models/User')

function calculateLevel(xp) {
  const totalXp = Math.max(0, Number(xp) || 0)
  return Math.floor(totalXp / 100) + 1
}

const awardXP = async (userId, amount) => {
  const inc = Math.max(0, Number(amount) || 0)
  const user = await User.findById(userId)
  if (!user) return null
  user.xp += inc
  user.level = calculateLevel(user.xp)
  await user.save()
  return user
}

const checkLevelUp = async (userId) => {
  const user = await User.findById(userId)
  if (!user) return { leveledUp: false, level: null }
  const computedLevel = calculateLevel(user.xp)
  if (computedLevel !== user.level) {
    user.level = computedLevel
    await user.save()
    return { leveledUp: true, level: user.level }
  }
  return { leveledUp: false, level: user.level }
}

module.exports = { awardXP, calculateLevel, checkLevelUp }
