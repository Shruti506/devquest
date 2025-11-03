const express = require('express')
const auth = require('../middleware/auth')
const {
  createValidators,
  listValidators,
  idValidator,
  updateValidators,
} = require('../utils/validation')
const {
  createQuest,
  getAllQuests,
  getUserQuests,
  getQuestById,
  updateQuest,
  deleteQuest,
} = require('../controllers/questController')
const router = express.Router()

router.post('/', auth, createValidators, createQuest)
router.get('/', auth, listValidators, getAllQuests)
router.get('/my-quests', auth, getUserQuests)
router.get('/:id', auth, idValidator, getQuestById)
router.put('/:id', auth, updateValidators, updateQuest)
router.delete('/:id', auth, idValidator, deleteQuest)

module.exports = router
