const { pool } = require('../database')

// get only the rows of messages matching conversation id and user id ordered oldest to youngest
async function getConversation(user_id, conversation_id) {
    const [rows] = await pool.query (
        `
        SELECT 
            m.message_id,
            m.conversation_id,
            m.sender_user_id,
            m.body,
            m.created_at
        FROM messages m
        JOIN conversations c
            ON c.conversation_id = m.conversation_id
        JOIN listings l
            ON l.listing_id = c.listing_id 
        WHERE
            c.conversation_id = ?
            AND (
                c.buyer_user_id = ? 
                OR l.user_id = ?
            )
        ORDER BY m.created_at ASC;
        `,
        [conversation_id, user_id, user_id]
    )
    return rows;
}
// what I need is everything but the message
// create a temp table of (conversation+message+listing+users+listing_image) grouped by conversation id and ordered by message creation time
// from that table get only the rows with the most recent message and the current user matches the seller or buyer id ordered by createAt
// from this table get only the necessary columns
async function getPreviews(user_id) {
    const [rows] = await pool.query (
        `
        SELECT 
            ranked.conversation_id,
            ranked.listing_id,
            ranked.title AS itemName,
            ranked.image_url AS itemImage,
            ranked.fullname AS sellerName,
            ranked.user_id AS seller_user_id,
            ranked.buyer_user_id,
            ranked.price,
            ranked.body AS lastMessage
        FROM (
            SELECT 
                c.conversation_id,
                c.listing_id,
                c.buyer_user_id,
                l.title,
                li.image_url,
                l.user_id,
                u.fullname,
                l.price,
                m.body,
                m.created_at,
                ROW_NUMBER() OVER (
                    PARTITION BY c.conversation_id
                    ORDER BY m.created_at DESC
                ) AS rn
            FROM conversations c
            JOIN messages m
                ON c.conversation_id = m.conversation_id
            JOIN listings l
                ON c.listing_id = l.listing_id
            JOIN registered_users u
                ON l.user_id = u.user_id
            LEFT JOIN listing_images li
                ON l.listing_id = li.listing_id
            WHERE 
                c.buyer_user_id = ?
                OR l.user_id = ?
        ) ranked
        WHERE rn = 1
        ORDER BY created_at DESC;
        `,
        [user_id, user_id]
    )
    return rows
}

// just creating a new message and adding it to the message table
async function sendMessage(conversation_id, sender_user_id, body) {
    const [message] = await pool.execute(
    `INSERT INTO messages (conversation_id, sender_user_id, body)
    VALUES (?, ?, ?)`,
    [conversation_id, sender_user_id, body]
  )

  return message.insertId
}

module.exports = {
    getConversation,
    getPreviews,
    sendMessage
}