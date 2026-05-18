const express = require('express')
const router = express.Router()
const {
    getTransactionById,
    getConversationTransaction,
    getTransactionReviews,
    createTransaction,
    createReview,
    updateTransaction
} = require('../controllers/transactionController')


router.get('/conversation/:conversation_id', getConversationTransaction)
router.get('/:transaction_id/reviews', getTransactionReviews)
router.get('/:transaction_id', getTransactionById)

router.post('/', createTransaction)
router.post('/:transaction_id/reviews', createReview)
router.patch('/:transaction_id', updateTransaction)

module.exports = router