// SQL for conversations + messages tables (buyer/seller per listing).
const { pool } = require('../database')

async function getListingSellerId(listingId) {
  const [rows] = await pool.execute(
    'SELECT listing_id, user_id AS seller_id FROM listings WHERE listing_id = ?',
    [listingId]
  )
  return rows[0] || null
}

async function findConversation(listingId, buyerId) {
  const [rows] = await pool.execute(
    `SELECT conversation_id, listing_id, buyer_id, seller_id
     FROM conversations
     WHERE listing_id = ? AND buyer_id = ?`,
    [listingId, buyerId]
  )
  return rows[0] || null
}

async function createConversation(listingId, buyerId, sellerId) {
  const [result] = await pool.execute(
    `INSERT INTO conversations (listing_id, buyer_id, seller_id)
     VALUES (?, ?, ?)`,
    [listingId, buyerId, sellerId]
  )
  return result.insertId
}

// Only participants can read or post in a thread.
async function getConversationForUser(conversationId, userId) {
  const [rows] = await pool.execute(
    `SELECT conversation_id, listing_id, buyer_id, seller_id
     FROM conversations
     WHERE conversation_id = ?
       AND (buyer_id = ? OR seller_id = ?)`,
    [conversationId, userId, userId]
  )
  return rows[0] || null
}

async function insertMessage(conversationId, senderId, body) {
  const [result] = await pool.execute(
    `INSERT INTO messages (conversation_id, sender_id, body)
     VALUES (?, ?, ?)`,
    [conversationId, senderId, body.trim()]
  )

  await pool.execute(
    'UPDATE conversations SET updated_at = NOW() WHERE conversation_id = ?',
    [conversationId]
  )

  const [rows] = await pool.execute(
    `SELECT message_id, conversation_id, sender_id, body, created_at, read_at
     FROM messages
     WHERE message_id = ?`,
    [result.insertId]
  )
  return rows[0]
}

async function getMessages(conversationId) {
  const [rows] = await pool.execute(
    `SELECT message_id, conversation_id, sender_id, body, created_at, read_at
     FROM messages
     WHERE conversation_id = ?
     ORDER BY created_at ASC`,
    [conversationId]
  )
  return rows
}

// Marks the other person's messages as read when the user opens the thread.
async function markMessagesRead(conversationId, userId) {
  await pool.execute(
    `UPDATE messages
     SET read_at = NOW()
     WHERE conversation_id = ?
       AND sender_id != ?
       AND read_at IS NULL`,
    [conversationId, userId]
  )
}

async function getConversationsForUser(userId) {
  const [rows] = await pool.execute(
    `SELECT
        c.conversation_id,
        c.listing_id,
        c.buyer_id,
        c.seller_id,
        l.title AS item_name,
        l.price,
        (
          SELECT li.image_url
          FROM listing_images li
          WHERE li.listing_id = l.listing_id
          LIMIT 1
        ) AS item_image,
        buyer.username AS buyer_username,
        buyer.fullname AS buyer_fullname,
        seller.username AS seller_username,
        seller.fullname AS seller_fullname,
        (
          SELECT m.body
          FROM messages m
          WHERE m.conversation_id = c.conversation_id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) AS last_message,
        (
          SELECT m.sender_id
          FROM messages m
          WHERE m.conversation_id = c.conversation_id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) AS last_sender_id,
        (
          SELECT COUNT(*)
          FROM messages m
          WHERE m.conversation_id = c.conversation_id
            AND m.sender_id != ?
            AND m.read_at IS NULL
        ) AS unread_count
     FROM conversations c
     JOIN listings l ON c.listing_id = l.listing_id
     JOIN registered_users buyer ON c.buyer_id = buyer.user_id
     JOIN registered_users seller ON c.seller_id = seller.user_id
     WHERE c.buyer_id = ? OR c.seller_id = ?
     ORDER BY c.updated_at DESC`,
    [userId, userId, userId]
  )
  return rows
}

module.exports = {
  getListingSellerId,
  findConversation,
  createConversation,
  getConversationForUser,
  insertMessage,
  getMessages,
  markMessagesRead,
  getConversationsForUser,
}
