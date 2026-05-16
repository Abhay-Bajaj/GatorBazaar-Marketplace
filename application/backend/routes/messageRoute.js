const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messageController')

router.get('/:conversation_id', messageController.getConversation)
router.get('/', messageController.getPreviews)
router.post('/:conversation_id', messageController.sendMessage)

module.exports = router