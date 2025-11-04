const express = require('express')
const auth = require('../middleware/auth')
const { query, param } = require('express-validator')
const {
  completeQuest,
  getUserProgress,
  getActivityLog,
} = require('../controllers/progressController')
const router = express.Router()

router.post(
  '/complete/:questId',
  auth,
  [param('questId').isMongoId()],
  completeQuest,
)

router.get('/my-progress', auth, getUserProgress)

router.get(
  '/activity-log',
  auth,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  getActivityLog,
)

module.exports = router
