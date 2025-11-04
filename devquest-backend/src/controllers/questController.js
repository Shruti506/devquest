const { validationResult } = require('express-validator')
const Quest = require('../models/Quest')
const { logActivity } = require('../services/activityService')

function handleValidation(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  return null
}

const createQuest = async (req, res) => {
  const err = handleValidation(req, res)
  if (err) return err
  try {
    const { title, description, difficulty, xpReward, category } = req.body
    const quest = await Quest.create({
      title,
      description,
      difficulty,
      xpReward,
      category,
      createdBy: req.user._id,
    })

    await logActivity({
      action: 'quest:created',
      details: { questId: quest._id },
      userId: req.user._id,
    })
    return res.status(201).json({ quest })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create quest' })
  }
}

const getAllQuests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      difficulty,
      category,
      status,
      sort = 'newest', // 'newest' | 'xp' | '-xp'
    } = req.query

    const pageNum = Math.max(parseInt(page, 10) || 1, 1)
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100)

    const filter = {}
    if (difficulty) filter.difficulty = difficulty
    if (category) filter.category = category
    if (status) filter.status = status

    filter.createdBy = { $ne: req.user._id }

    let sortSpec = { createdAt: -1 }
    if (sort === 'xp') sortSpec = { xpReward: 1 }
    if (sort === '-xp') sortSpec = { xpReward: -1 }

    const [items, total] = await Promise.all([
      Quest.find(filter)
        .sort(sortSpec)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('createdBy', 'username email'),
      Quest.countDocuments(filter),
    ])

    return res.status(200).json({
      items,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch quests' })
  }
}

const getUserQuests = async (req, res) => {
  try {
    const quests = await Quest.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    })
    const items = quests.map((q) => ({
      ...q.toObject(),
      completionCount: Array.isArray(q.completedBy) ? q.completedBy.length : 0,
    }))
    return res.status(200).json({ items, count: items.length })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user quests' })
  }
}

const getQuestById = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id).populate(
      'createdBy',
      'name email',
    )
    if (!quest) return res.status(404).json({ message: 'Quest not found' })
    return res.status(200).json({ quest })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch quest' })
  }
}

const updateQuest = async (req, res) => {
  const err = handleValidation(req, res)
  if (err) return err
  try {
    const quest = await Quest.findById(req.params.id)
    if (!quest) return res.status(404).json({ message: 'Quest not found' })
    if (quest.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this quest' })
    }

    const updatable = [
      'title',
      'description',
      'difficulty',
      'xpReward',
      'category',
      'status',
    ]
    for (const field of updatable) {
      if (req.body[field] !== undefined) quest[field] = req.body[field]
    }
    await quest.save()

    await logActivity({
      action: 'quest:updated',
      details: { questId: quest._id },
      userId: req.user._id,
    })
    return res.status(200).json({ quest })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update quest' })
  }
}

const deleteQuest = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id)
    if (!quest) return res.status(404).json({ message: 'Quest not found' })
    if (quest.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this quest' })
    }

    await quest.deleteOne()
    await logActivity({
      action: 'quest:deleted',
      details: { questId: quest._id },
      userId: req.user._id,
    })
    return res.status(200).json({ message: 'Quest deleted' })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete quest' })
  }
}

module.exports = {
  createQuest,
  getAllQuests,
  getUserQuests,
  getQuestById,
  updateQuest,
  deleteQuest,
}
