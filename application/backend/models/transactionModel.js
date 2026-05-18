const { pool } = require('../database')

// the compelete transaction page uses this fill out the page.
async function getTransactionById(transaction_id) {
    const [rows] = await pool.query(
        `
        SELECT 
            buyer.fullname AS buyer_name,
            seller.fullname AS seller_name,
            t.buyer_user_id,
            t.seller_user_id,
            t.transaction_id,
            t.listing_id,
            l.title AS item_name,
            i.image_url AS item_pic,
            t.amount,
            t.status,
            t.exchange_location,
            t.exchange_time
        FROM transactions t
        JOIN listings l
            ON l.listing_id = t.listing_id
        LEFT JOIN listing_images i
            ON i.listing_id = (
                SELECT li.listing_id
                FROM listing_images li
                WHERE li.listing_id = l.listing_id
                ORDER BY li.image_id ASC
                LIMIT 1
            )
        JOIN registered_users buyer
            ON t.buyer_user_id = buyer.user_id
        JOIN registered_users seller
            ON t.seller_user_id = seller.user_id
        WHERE t.transaction_id = ?
        `,
        [transaction_id]
    )
    return rows[0]
}
// this will return the information for the view proposal button on
// on the message window
async function getConversationTransaction(conversation_id) {
    const [rows] = await pool.query(
        `
        SELECT
            t.buyer_user_id,
            t.seller_user_id,
            t.transaction_id,
            t.proposed_by_user_id,
            t.amount,
            t.status,
            t.exchange_location,
            t.exchange_time
        FROM transactions t
        WHERE t.conversation_id = ?
        `,
        [conversation_id]
    )
    return rows[0]
}

async function getTransactionReviews(transaction_id) {
    const [rows] = await pool.query(
        `
        SELECT
            reviewer.fullname AS reviewer_name,
            reviewed.fullname AS reviewed_name,
            r.reviewer_user_id,
            r.reviewed_user_id,
            r.rating,
            r.comment,
            r.confirmed,
            r.review_id
        FROM transaction_reviews r
        JOIN registered_users reviewer
            ON r.reviewer_user_id = reviewer.user_id
        JOIN registered_users reviewed
            ON r.reviewed_user_id = reviewed.user_id
        WHERE r.transaction_id = ?
        `,
        [transaction_id]
    )
    return rows

}

async function createTransaction(
    listing_id,
    buyer_user_id,
    seller_user_id,
    conversation_id,
    amount,
    exchange_location,
    exchange_time,
    proposed_by_user_id
) {
    const [transaction] = await pool.query(
        `
        INSERT INTO transactions (listing_id, buyer_user_id, seller_user_id, conversation_id, amount, exchange_location, exchange_time, proposed_by_user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [listing_id, buyer_user_id, seller_user_id, conversation_id, amount, exchange_location, exchange_time, proposed_by_user_id]
    )
    return transaction.insertId
}
async function createReview(
    transaction_id,
    reviewer_user_id,
    reviewed_user_id,
    confirmed,
    rating,
    comment
) {
    const [review] = await pool.query(
        `
        INSERT INTO transaction_reviews (
            transaction_id,
            reviewer_user_id,
            reviewed_user_id,
            confirmed,
            rating,
            comment
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            transaction_id,
            reviewer_user_id,
            reviewed_user_id,
            confirmed,
            rating,
            comment
        ]
    )

    return review.insertId
}
// updates the transaction. eg: rejecting, accepting, counteroffering
async function updateTransaction(transaction_id, updates) {
    const [result] = await pool.query(
        `
        UPDATE transactions
        SET ?
        WHERE transaction_id = ?
        `,
        [updates, transaction_id]
    )

    return result.affectedRows
}

async function markListingAsBought(
    listing_id,
    buyer_id,
) {
    const [updateResult] = await pool.query(
        `
        UPDATE listings
        SET active = 0
        WHERE listing_id = ?
        `,
        [listing_id]
    )

    await pool.query(
        `
        INSERT INTO bought_listings (
            listing_id,
            buyer_id
        )
        VALUES (?, ?)
        `,
        [listing_id, buyer_id]
    )

    return updateResult.affectedRows
}

module.exports = {
    getTransactionById,
    getConversationTransaction,
    getTransactionReviews,
    createTransaction,
    createReview,
    updateTransaction,
    markListingAsBought
}