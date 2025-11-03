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
    badges: [
      {
        type: String,
      },
    ],
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
)

UserSchema.methods.generateAuthToken = function generateAuthToken() {
  const secret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRE || '7d'
  const payload = { sub: this._id.toString(), tv: this.tokenVersion }
  return jwt.sign(payload, secret, { expiresIn })
}

UserSchema.methods.comparePassword = async function comparePassword(
  candidatePassword,
) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
