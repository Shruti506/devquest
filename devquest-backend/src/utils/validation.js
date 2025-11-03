const { body } = require('express-validator')

const registerValidators = [
  body('name').isString().trim().isLength({ min: 3 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6 }),
]

const loginValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6 }),
]

module.exports = {
  registerValidators,
  loginValidators,
}
