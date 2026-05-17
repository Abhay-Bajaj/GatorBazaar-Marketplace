const transactionModel = require('../models/transactionModel')

async function getTransactionById(req, res) {
    try {
        const user_id = req.session.userId
        const transaction_id = Number(req.params.transaction_id)

        if (!user_id) {
            return res.status(401).json({ error: 'Not logged in' })
        }

        if (!transaction_id) {
            return res.status(400).json({ error: 'Invalid transaction id' })
        }
        // ensure current user is authorized or the transaction exists
        const transaction = await transactionModel.getTransactionById(transaction_id)

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' })
        }

        if (
            Number(transaction.buyer_user_id) !== Number(user_id) &&
            Number(transaction.seller_user_id) !== Number(user_id)
        ) {
            return res.status(403).json({ error: 'Not authorized' })
        }

        res.json(transaction)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to get transaction' })
    }
}

async function getConversationTransaction(req, res) {
    try {
        const user_id = req.session.userId
        const conversation_id = Number(req.params.conversation_id)

        if (!user_id) {
            return res.status(401).json({ error: 'Not logged in' })
        }

        if (!conversation_id) {
            return res.status(400).json({ error: 'Invalid conversation id' })
        }

        const transaction = await transactionModel.getConversationTransaction(conversation_id)

        if (!transaction) {
            return res.json(null)
        }

        if (
            Number(transaction.buyer_user_id) !== Number(user_id) &&
            Number(transaction.seller_user_id) !== Number(user_id)
        ) {
            return res.status(403).json({ error: 'Not authorized' })
        }

        res.json({
            ...transaction,
            current_user_id: user_id
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to get conversation transaction' })
    }
}

async function getTransactionReviews(req, res) {
    try {
        const user_id = req.session.userId
        const transaction_id = Number(req.params.transaction_id)

        if (!user_id) {
            return res.status(401).json({ error: 'Not logged in' })
        }

        if (!transaction_id) {
            return res.status(400).json({ error: 'Invalid transaction id' })
        }

        // ensure current user is authorized or the transaction exists
        const transaction = await transactionModel.getTransactionById(transaction_id)

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' })
        }

        if (
            Number(transaction.buyer_user_id) !== Number(user_id) &&
            Number(transaction.seller_user_id) !== Number(user_id)
        ) {
            return res.status(403).json({ error: 'Not authorized' })
        }

        const reviews = await transactionModel.getTransactionReviews(transaction_id)

        res.json(reviews)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to get transaction reviews' })
    }
}

async function createTransaction(req, res) {
    try {
        const user_id = req.session.userId

        if (!user_id) {
            return res.status(401).json({ error: 'Not logged in' })
        }

        const {
            listing_id,
            buyer_user_id,
            seller_user_id,
            conversation_id,
            amount,
            exchange_location,
            exchange_time
        } = req.body

        if (!listing_id || !buyer_user_id || !seller_user_id || !conversation_id) {
            return res.status(400).json({ error: 'Missing required transaction fields' })
        }

        const numericAmount = Number(amount)

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' })
        }

        if (!exchange_location || exchange_location.trim().length < 2) {
            return res.status(400).json({ error: 'Invalid exchange location' })
        }

        if (!exchange_time || Number.isNaN(new Date(exchange_time).getTime())) {
            return res.status(400).json({ error: 'Invalid exchange time' })
        }

        if (
            Number(user_id) !== Number(buyer_user_id) &&
            Number(user_id) !== Number(seller_user_id)
        ) {
            return res.status(403).json({ error: 'Not authorized' })
        }

        const existingTransaction =
            await transactionModel.getConversationTransaction(conversation_id)

        if (existingTransaction) {
            return res.status(409).json({
                error: 'This conversation already has a transaction'
            })
        }

        const transaction_id = await transactionModel.createTransaction(
            listing_id,
            buyer_user_id,
            seller_user_id,
            conversation_id,
            numericAmount,
            exchange_location.trim(),
            exchange_time,
            user_id
        )

        res.status(201).json({ transaction_id })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create transaction' })
    }
}

async function updateTransaction(req, res) {
    try {
        const user_id = req.session.userId
        const transaction_id = Number(req.params.transaction_id)

        if (!user_id) {
            return res.status(401).json({ error: 'Not logged in' })
        }

        if (!transaction_id) {
            return res.status(400).json({ error: 'Invalid transaction id' })
        }
        // ensure current user is authorized or the transaction exists
        const transaction = await transactionModel.getTransactionById(transaction_id)

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' })
        }

        if (
            Number(transaction.buyer_user_id) !== Number(user_id) &&
            Number(transaction.seller_user_id) !== Number(user_id)
        ) {
            return res.status(403).json({ error: 'Not authorized' })
        }

        const { action, amount, exchange_location, exchange_time } = req.body

        let updates = {}

        if (action === 'accept') {
            updates.status = 'Accepted'
        } else if (action === 'reject') {
            updates.status = 'Rejected'
        } else if (action === 'cancel') {
            updates.status = 'Cancelled'
        } else if (action === 'counter') {
            const numericAmount = Number(amount)

            if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
                return res.status(400).json({ error: 'Invalid amount' })
            }

            if (!exchange_location || exchange_location.trim().length < 2) {
                return res.status(400).json({ error: 'Invalid exchange location' })
            }

            if (!exchange_time || Number.isNaN(new Date(exchange_time).getTime())) {
                return res.status(400).json({ error: 'Invalid exchange time' })
            }

            updates = {
                amount: numericAmount,
                exchange_location: exchange_location.trim(),
                exchange_time,
                proposed_by_user_id: user_id,
                status: 'Proposed'
            }
        } else if (action === 'in_progress') {
            updates.status = 'In Progress'
        } else if (action === 'complete') {
            updates.status = 'Completed'
        } else {
            return res.status(400).json({ error: 'Invalid transaction action' })
        }

        const affectedRows = await transactionModel.updateTransaction(
            transaction_id,
            updates
        )

        res.json({ updated: affectedRows > 0 })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to update transaction' })
    }
}

async function createReview(req, res) {
    try {
        const user_id = req.session.userId
        const transaction_id = Number(req.params.transaction_id)

        if (!user_id) {
            return res.status(401).json({ error: 'Not logged in' })
        }

        if (!transaction_id) {
            return res.status(400).json({ error: 'Invalid transaction id' })
        }

        const transaction = await transactionModel.getTransactionById(transaction_id)

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' })
        }

        const isBuyer = Number(transaction.buyer_user_id) === Number(user_id)
        const isSeller = Number(transaction.seller_user_id) === Number(user_id)

        if (!isBuyer && !isSeller) {
            return res.status(403).json({ error: 'Not authorized' })
        }

        const reviewed_user_id = isBuyer
            ? transaction.seller_user_id
            : transaction.buyer_user_id

        const { confirmed, rating, comment } = req.body

        const numericRating =
            rating === null || rating === undefined || rating === ''
                ? null
                : Number(rating)

        if (
            numericRating !== null &&
            (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5)
        ) {
            return res.status(400).json({ error: 'Invalid rating' })
        }

        const review_id = await transactionModel.createReview(
            transaction_id,
            user_id,
            reviewed_user_id,
            confirmed ? 1 : 0,
            numericRating,
            comment || null
        )

        res.status(201).json({ review_id })
    } catch (err) {
        console.error(err)

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: 'You already submitted a review for this transaction'
            })
        }

        res.status(500).json({ error: 'Failed to create review' })
    }
}

module.exports = {
    getTransactionById,
    getConversationTransaction,
    getTransactionReviews,
    createTransaction,
    updateTransaction,
    createReview
}