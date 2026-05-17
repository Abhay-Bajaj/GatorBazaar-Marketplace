const express = require('express')
const router = express.Router()
const { getConversation, getPreviews, sendMessage } = require('../controllers/messageController')

router.get('/:conversation_id', getConversation)
router.get('/', getPreviews)
router.post('/:conversation_id', sendMessage)

module.exports = router