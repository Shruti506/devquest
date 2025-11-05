const { body, param, query } = require('express-validator')

const registerValidators = [
  body('name').isString().trim().isLength({ min: 3 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6 }),
]

const loginValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6 }),
]


const createValidators = [
  body('title').isString().trim().notEmpty(),
  body('description').isString().notEmpty(),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']),
  body('xpReward').isNumeric(),
  body('category').optional().isString().trim(),
]

const updateValidators = [
  param('id').isMongoId(),
  body('title').optional().isString().trim().notEmpty(),
  body('description').optional().isString().notEmpty(),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),
  body('xpReward').optional().isNumeric(),
  body('category').optional().isString().trim(),
  body('status').optional().isIn(['Unsolved', 'Solved']),
]

const idValidator = [param('id').isMongoId()]

const listValidators = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),
  query('status').optional().isIn(['Unsolved', 'Solved']),
  query('category').optional().isString(),
  query('sort').optional().isIn(['newest', 'xp', '-xp']),
]

const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1)
  const limitRaw = Math.max(parseInt(query.limit, 10) || 50, 1)
  const limit = Math.min(limitRaw, 50)
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

const getDateRange = (scope) => {
  const now = new Date()
  if (scope === 'weekly') {
    const start = new Date(now)
    start.setDate(now.getDate() - 7)
    return { start, end: now }
  }
  if (scope === 'monthly') {
    const start = new Date(now)
    start.setMonth(now.getMonth() - 1)
    return { start, end: now }
  }
  return null // global
}

module.exports = {
  registerValidators,
  loginValidators,
  createValidators,
  updateValidators,
  idValidator,
  listValidators,
  parsePagination,
  getDateRange,
}
