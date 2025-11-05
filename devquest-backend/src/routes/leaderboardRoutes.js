const express = require('express')
const auth = require('../middleware/auth')
const { query } = require('express-validator')
const {
  getLeaderboard,
  getUserRank,
} = require('../controllers/leaderboardController')

const router = express.Router()

router.get(
  '/',
  auth,
  [
    query('scope').optional().isIn(['global', 'weekly', 'monthly']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('sort').optional().isIn(['asc', 'desc']),
  ],
  getLeaderboard,
)

router.get('/my-rank', auth, getUserRank)

module.exports = router
