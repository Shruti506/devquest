const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { addToBlacklist } = require('../utils/tokenBlacklist')

function handleValidation(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  return null
}

const GetUser = async (req, res) => {
  const user = await User.find({}).sort({ createdAt: -1 })
  res.status(200).json(user)
}

const CreateUser = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: 'Name, email, and password are required' })
  }

  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser })
  } catch (err) {
    console.error('Error creating user:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const Register = async (req, res) => {
  const err = handleValidation(req, res)
  if (err) return err

  try {
    const { name, email, password } = req.body

    const existing = await User.findOne({ $or: [{ email }, { name }] })
    if (existing) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({ name, email, password: hashedPassword })
    await user.save()

    // Generate both tokens
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    return res.status(201).json({
      user: user.toJSON(),
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ message: 'Registration failed' })
  }
}

const Login = async (req, res) => {
  const err = handleValidation(req, res)
  if (err) return err

  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Generate both tokens
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    return res.status(200).json({
      user: user.toJSON(),
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Login failed' })
  }
}

const RefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Invalid token type' })
    }

    // Find user and check token version
    const user = await User.findById(decoded.sub)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.tokenVersion !== decoded.tv) {
      return res.status(401).json({ message: 'Token has been revoked' })
    }

    // Generate new access token
    const accessToken = user.generateAccessToken()

    return res.status(200).json({ accessToken })
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expired' })
    }
    console.error('Refresh token error:', error)
    return res.status(500).json({ message: 'Token refresh failed' })
  }
}

const Logout = async (req, res) => {
  try {
    // Optionally increment tokenVersion to invalidate all tokens
    await User.findByIdAndUpdate(req.user.sub, {
      $inc: { tokenVersion: 1 },
    })

    if (req.token) addToBlacklist(req.token)
    return res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({ message: 'Logout failed' })
  }
}

module.exports = {
  GetUser,
  CreateUser,
  Register,
  Login,
  RefreshToken,
  Logout,
}
