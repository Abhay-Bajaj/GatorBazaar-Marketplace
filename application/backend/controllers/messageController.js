const messageModel = require('../models/messageModel')

async function getConversation(req, res) {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                error: "Not authenticated"
            });
        }
        const user_id = req.session.userId
        if (!req.params.conversation_id) {
            return res.status(400).json({
                error: "conversation id required"
            });
        }
        const conversation_id = Number(req.params.conversation_id)

        const conversation = await messageModel.getConversation(user_id, conversation_id)
        res.json(conversation)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Server error" });
    }
}

async function getPreviews(req, res) {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                error: "Not authenticated"
            });
        }
        const user_id = req.session.userId

        const previews = await messageModel.getPreviews(user_id)
        res.json(
            previews.map(conversation => ({
                ...conversation, 
                current_user_id: user_id
            }))
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Server error" });
    }
}

async function sendMessage(req, res) {
    try {
        // need request_id, user_id(sender_id), receiver_id, message_content
        if (!req.session.userId) {
            return res.status(401).json({
                error: "Not authenticated"
            });
        }

        const sender_user_id = req.session.userId
        const conversation_id = Number(req.params.conversation_id)
        const { message_content } = req.body

        if (!conversation_id || !sender_user_id || !message_content || !message_content.trim()) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }

        const message_id = await messageModel.sendMessage(
            conversation_id,
            sender_user_id,
            message_content.trim()
        )

        res.status(201).json({ message_id })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    getConversation,
    getPreviews,
    sendMessage
}