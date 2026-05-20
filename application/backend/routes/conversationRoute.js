// Buyer–seller messaging: one thread per listing + buyer.
const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/requireAuth')
const conversationController = require('../controllers/conversationController')

router.get('/', requireAuth, conversationController.listConversations)       // inbox list
router.post('/', requireAuth, conversationController.startConversation)      // first message from item page
router.post('/:id/messages', requireAuth, conversationController.sendMessage)
router.patch('/:id/read', requireAuth, conversationController.markRead)

module.exports = router
