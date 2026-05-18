const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/requireAuth')
const { getListing, getMyListings, deleteListing } = require('../controllers/listingController')

router.get("/my-listings", getMyListings)
router.get('/:id', getListing)
router.delete(
  '/:id',
  requireAuth,
  deleteListing
)

module.exports = router