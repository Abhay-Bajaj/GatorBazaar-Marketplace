const conversationModel = require('../models/conversationModel')

function formatTime(dateValue) {
  const date = new Date(dateValue)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatPrice(price) {
  return `$${Number(price || 0).toFixed(2)}`
}

function mapMessage(row, userId) {
      console.log(row.sender_id, userId)

  return {
    id: row.message_id,
    sender: row.sender_id === userId ? 'own' : 'other',
    text: row.body,
    timestamp: formatTime(row.created_at),
  }
}

function otherPartyName(row, userId) {
  if (userId === row.buyer_id) {
    return row.seller_fullname || row.seller_username
  }
  return row.buyer_fullname || row.buyer_username
}

async function buildConversationPayload(conversationId, userId) {
  const conversation = await conversationModel.getConversationForUser(
    conversationId,
    userId
  )
  if (!conversation) return null

  const rows = await conversationModel.getConversationsForUser(userId)
  const row = rows.find((r) => r.conversation_id === conversationId)
  if (!row) return null

  const messages = await conversationModel.getMessages(conversationId)
  return formatConversation(row, userId, messages)
}

function formatConversation(row, userId, messageRows) {
  const unreadCount = Number(row.unread_count || 0)
  return {
    id: row.conversation_id,
    itemId: row.listing_id,
    itemName: row.item_name,
    itemImage: row.item_image || '/images/item-placeholder.png',
    sellerName: otherPartyName(row, userId),
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    price: formatPrice(row.price),
    lastMessage: row.last_message || '',
    read: unreadCount === 0,
    messages: messageRows.map((m) => mapMessage(m, userId)),
    currentUserId: userId,
  }
}

async function listConversations(req, res) {
  try {
    const userId = req.session.userId
    const rows = await conversationModel.getConversationsForUser(userId)
    const conversations = []

    for (const row of rows) {
      const messages = await conversationModel.getMessages(row.conversation_id)
      conversations.push(formatConversation(row, userId, messages))
    }

    res.json(conversations)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

async function startConversation(req, res) {
  try {
    const userId = req.session.userId
    const listingId = Number(req.body.listingId)
    const body = (req.body.body || '').trim()

    if (!listingId || !body) {
      return res.status(400).json({ error: 'listingId and body are required' })
    }

    if (body.length > 2000) {
      return res.status(400).json({ error: 'Message is too long' })
    }

    const listing = await conversationModel.getListingSellerId(listingId)
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' })
    }

    if (listing.seller_id === userId) {
      return res.status(400).json({ error: 'You cannot message yourself' })
    }

    let conversation = await conversationModel.findConversation(listingId, userId)
    if (!conversation) {
      const conversationId = await conversationModel.createConversation(
        listingId,
        userId,
        listing.seller_id
      )
      conversation = { conversation_id: conversationId, buyer_id: userId }
    }

    await conversationModel.insertMessage(
      conversation.conversation_id,
      userId,
      body
    )

    const payload = await buildConversationPayload(
      conversation.conversation_id,
      userId
    )

    res.status(201).json(payload)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

async function sendMessage(req, res) {
  try {
    const userId = req.session.userId
    const conversationId = Number(req.params.id)
    const body = (req.body.body || '').trim()

    if (!body) {
      return res.status(400).json({ error: 'body is required' })
    }

    if (body.length > 2000) {
      return res.status(400).json({ error: 'Message is too long' })
    }

    const conversation = await conversationModel.getConversationForUser(
      conversationId,
      userId
    )
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    const messageRow = await conversationModel.insertMessage(
      conversationId,
      userId,
      body
    )

    res.status(201).json(mapMessage(messageRow, userId))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

async function markRead(req, res) {
  try {
    const userId = req.session.userId
    const conversationId = Number(req.params.id)

    const conversation = await conversationModel.getConversationForUser(
      conversationId,
      userId
    )
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    await conversationModel.markMessagesRead(conversationId, userId)
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  listConversations,
  startConversation,
  sendMessage,
  markRead,
}
