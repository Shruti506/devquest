const User = require('../models/User')
const bcrypt = require('bcrypt')
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
  const user = await User.find({}).toSorted({ createAt: -1 })
  res.status
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

    const token = user.generateAuthToken()
    return res.status(201).json({ user: user.toJSON(), token })
  } catch (error) {
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
    const token = user.generateAuthToken()
    return res.status(200).json({ user: user.toJSON(), token })
  } catch (error) {
    return res.status(500).json({ message: 'Login failed' })
  }
}

const Logout = async (req, res) => {
  try {
    if (req.token) addToBlacklist(req.token)
    return res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Logout failed' })
  }
}

module.exports = { GetUser, CreateUser, Register, Login, Logout }
