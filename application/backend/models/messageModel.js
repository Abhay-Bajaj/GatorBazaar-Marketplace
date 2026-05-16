const { pool } = require('../database')

async function getConversation(user_id, request_id) {
    const [rows] = await pool.query (
        `
        SELECT *
        FROM messages
        WHERE
            request_id = ?
            AND (sender_id = ? OR receiver_id = ?)
        ORDER BY sent_at ASC;
        `,
        [request_id, user_id, user_id]
    )
    return rows;
}

async function getPreviews(user_id) {
    const [rows] = await pool.query (
        `
        SELECT 
            message_id,
            request_id,
            sender_id,
            receiver_id,
            message_content,
            sent_at,
            other_user_id
        FROM (
            SELECT 
                m.*,
                CASE
                    WHEN sender_id = ? THEN receiver_id
                    ELSE sender_id
                END AS other_user_id
                ROW_NUMBER() OVER (
                    PARTITION BY request_id
                    ORDER BY sent_at DESC
                ) AS rn
            FROM messages m
            WHERE sender_id = ? OR receiver_id = ?
        ) ranked
        WHERE rn = 1
        ORDER BY sent_at DESC;
        `,
        [user_id, user_id]
    )
    return rows
}

// just creating a new message and adding it to the message table
async function sendMessage(request_id, user_id, receiver_id, message_content) {
    const [message] = await pool.execute(
    `INSERT INTO messages (request_id, sender_id, receiver_id, message_content, sent_at)
    VALUES (?, ?, ?, ?, NOW())`,
    [request_id, user_id, receiver_id, message_content]
  );

  return message.insertId;
}

// message_id (Primary Key)
// request_id (Foreign Key → Sent Requests)
// sender_id (Foreign Key → Registered Users)
// receiver_id (Foreign Key → Registered Users)
// message_content
// sent_at
