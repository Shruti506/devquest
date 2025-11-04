const express = require('express')
const auth = require('../middleware/auth')
const {
  getAllBadges,
  getUserBadges,
  getBadgeProgress,
} = require('../controllers/badgeController')
const router = express.Router()

router.get('/', auth, getAllBadges)
router.get('/my-badges', auth, getUserBadges)
router.get('/progress', auth, getBadgeProgress)

module.exports = router
