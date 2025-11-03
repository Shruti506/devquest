const express = require('express')
const {
  CreateUser,
  GetUser,
  Register,
  Login,
  Logout,
} = require('../controllers/authController')
const { registerValidators, loginValidators } = require('../utils/validation')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', GetUser)
router.post('/', CreateUser)
router.post('/register', registerValidators, Register)
router.post('/login', loginValidators, Login)
router.post('/logout', auth, Logout)

module.exports = router
