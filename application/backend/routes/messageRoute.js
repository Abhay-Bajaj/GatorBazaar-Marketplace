const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messageController')

router.get('/:request_id', messageController.getConversation)
router.get('/', messageController.getPreviews)
router.post('/', messageController.sendMessage)

module.exports = router