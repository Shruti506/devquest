const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    }, // hashed
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    badges: [
      {
        type: String,
      },
    ],
    completedQuests: [{ type: mongoose.Schema.Types.ObjectId }],
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
)

UserSchema.methods.generateAccessToken = function generateAccessToken() {
  const secret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRE || '15m'
  const payload = {
    sub: this._id.toString(),
    tv: this.tokenVersion,
    type: 'access',
  }
  return jwt.sign(payload, secret, { expiresIn })
}

UserSchema.methods.generateRefreshToken = function generateRefreshToken() {
  const secret = process.env.JWT_REFRESH_SECRET
  const expiresIn = process.env.JWT_REFRESH_EXPIRE || '7d'
  const payload = {
    sub: this._id.toString(),
    tv: this.tokenVersion,
    type: 'refresh',
  }
  return jwt.sign(payload, secret, { expiresIn })
}

UserSchema.methods.generateAuthToken = function generateAuthToken() {
  return this.generateAccessToken()
}

UserSchema.methods.comparePassword = async function comparePassword(
  candidatePassword,
) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
