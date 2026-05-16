const messageModel = require('../models/messageModel')

async function getConversation(req, res) {
    try{
        if (!req.session.userId) {
            return res.status(401).json({
                error: "Not authenticated"
            });
        }
        const user_id = req.session.userId
        if (!req.params.request_id) {
            return res.status(400).json({
                error: "request id required"
            });
        }
        const request_id = req.params.request_id

        const conversation = await messageModel.getConversation(user_id, request_id)
        return res.json(conversation)
    } catch(err) {
        console.log(err)
        return res.status(500).json({ error: "Server error" });
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
        return res.json(previews)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Server error" });
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

        const sender_id = req.session.userId
        const {
            request_id,
            receiver_id,
            message_content
        } = req.body

        if (!request_id || !receiver_id || !message_content) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }

        const message_id = await messageModel.sendMessage(
            request_id,
            sender_id,
            receiver_id,
            message_content
        )

        return res.status(201).json({message_id})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    getConversation,
    getPreviews,
    sendMessage
}