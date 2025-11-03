const jwt = require('jsonwebtoken')
// const User = require('../models/User');
const { isBlacklisted, addToBlacklist } = require('../utils/tokenBlacklist')
const User = require('../models/User')

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const [scheme, token] = authHeader.split(' ')
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    if (isBlacklisted(token)) {
      return res
        .status(401)
        .json({ message: 'Session expired. Please log in again.' })
    }

    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      // Auto-logout on any JWT error
      addToBlacklist(token)
      if (err.name === 'TokenExpiredError') {
        return res
          .status(401)
          .json({ message: 'Token expired. Please log in again.' })
      }
      if (err.name === 'JsonWebTokenError') {
        return res
          .status(401)
          .json({ message: 'Invalid token. Please log in again.' })
      }
      if (err.name === 'NotBeforeError') {
        return res.status(401).json({ message: 'Token not active yet.' })
      }
      return res.status(401).json({ message: 'Authentication failed' })
    }

    const userId = payload.sub
    const tokenVersion = payload.tv
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token payload' })
    }

    const user = await User.findById(userId).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    if (
      typeof tokenVersion !== 'number' ||
      tokenVersion !== user.tokenVersion
    ) {
      addToBlacklist(token)
      return res
        .status(401)
        .json({ message: 'Session revoked. Please log in again.' })
    }

    req.user = user
    req.token = token
    return next()
  } catch (error) {
    return res.status(500).json({ message: 'Authentication error' })
  }
}

module.exports = auth
