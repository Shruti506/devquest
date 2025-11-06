const mongoose = require('mongoose')
const User = require('../models/User')
const { parsePagination, getDateRange } = require('../utils/validation')

const getLeaderboard = async (req, res) => {
  try {
    const scope = (req.query.scope || 'global').toLowerCase()
    const { page, limit, skip } = parsePagination(req.query)
    const sortOrder = req.query.sort === 'asc' ? 1 : -1

    if (scope === 'global') {
      const pipeline = [
        {
          $addFields: {
            badgesCount: { $size: { $ifNull: ['$badges', []] } },
            completedQuestsCount: {
              $size: { $ifNull: ['$completedQuests', []] },
            },
          },
        },
        {
          $setWindowFields: {
            sortBy: { xp: sortOrder },
            output: { rank: { $rank: {} } },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            xp: 1,
            level: 1,
            badgesCount: 1,
            completedQuestsCount: 1,
            rank: 1,
          },
        },
        { $sort: { xp: sortOrder } },
        {
          $facet: {
            items: [{ $skip: skip }, { $limit: limit }],
            total: [{ $count: 'count' }],
          },
        },
      ]

      const [result] = await User.aggregate(pipeline)
      const items = result?.items || []
      const total = result?.total?.[0]?.count || 0

      return res.status(200).json({
        items,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          scope,
          sort: req.query.sort || 'desc',
        },
      })
    }

    // ===== ⏳ WEEKLY / MONTHLY LEADERBOARD =====
    const range = getDateRange(scope)
    if (!range) return res.status(400).json({ message: 'Invalid scope' })

    const pipeline = [
      {
        $match: {
          activityType: 'quest_completed',
          createdAt: { $gte: range.start, $lte: range.end },
        },
      },
      {
        $group: {
          _id: '$user',
          earnedXp: { $sum: { $ifNull: ['$metadata.xp', 0] } },
        },
      },
      {
        $setWindowFields: {
          sortBy: { earnedXp: sortOrder },
          output: { rank: { $rank: {} } },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $addFields: {
          userId: '$user._id',
          name: '$user.name',
          email: '$user.email',
          xp: '$user.xp',
          level: '$user.level',
          badgesCount: { $size: { $ifNull: ['$user.badges', []] } },
          completedQuestsCount: {
            $size: { $ifNull: ['$user.completedQuests', []] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: 1,
          name: 1,
          email: 1,
          xp: 1,
          level: 1,
          earnedXp: 1,
          badgesCount: 1,
          completedQuestsCount: 1,
          rank: 1,
        },
      },
      { $sort: { earnedXp: sortOrder } },
      {
        $facet: {
          items: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
    ]

    const [result] = await ActivityLog.aggregate(pipeline)
    const items = result?.items || []
    const total = result?.total?.[0]?.count || 0

    return res.status(200).json({
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        scope,
        sort: req.query.sort || 'desc',
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch leaderboard' })
  }
}

const getUserRank = async (req, res) => {
  try {
    const me = await User.findById(req.user._id)
    if (!me) return res.status(404).json({ message: 'User not found' })

    const higherCount = await User.countDocuments({ xp: { $gt: me.xp } })
    const rank = higherCount + 1

    const above = await User.find({ xp: { $gt: me.xp } })
      .sort({ xp: 1, _id: 1 })
      .limit(5)
      .lean()
    const below = await User.find({ xp: { $lt: me.xp } })
      .sort({ xp: -1, _id: 1 })
      .limit(5)
      .lean()

    function mapUser(u) {
      return {
        _id: u._id,
        name: u.name,
        xp: u.xp,
        level: u.level,
        badgesCount: Array.isArray(u.badges) ? u.badges.length : 0,
        completedQuestsCount: Array.isArray(u.completedQuests)
          ? u.completedQuests.length
          : 0,
      }
    }

    return res.status(200).json({
      user: mapUser(me.toObject()),
      rank,
      nearby: {
        above: above.map(mapUser).reverse(),
        below: below.map(mapUser),
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user rank' })
  }
}

module.exports = { getLeaderboard, getUserRank }
