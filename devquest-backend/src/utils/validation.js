const { body, param, query } = require('express-validator')

// Auth Validation

const registerValidators = [
  body('name').isString().trim().isLength({ min: 3 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6 }),
]

const loginValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6 }),
]

// Quest validation

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

module.exports = {
  registerValidators,
  loginValidators,
  createValidators,
  updateValidators,
  idValidator,
  listValidators,
}
