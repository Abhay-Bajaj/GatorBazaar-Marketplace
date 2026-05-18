const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/requireAuth')
const conversationController = require('../controllers/conversationController')

router.get('/', requireAuth, conversationController.listConversations)
router.post('/', requireAuth, conversationController.startConversation)
router.post('/:id/messages', requireAuth, conversationController.sendMessage)
router.patch('/:id/read', requireAuth, conversationController.markRead)

module.exports = router
