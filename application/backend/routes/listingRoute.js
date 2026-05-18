const express = require('express')
const router = express.Router()
const { getListing, getMyListings, createListing} = require('../controllers/listingController')

router.get("/my-listings", getMyListings)
router.get('/:id', getListing)
router.post('/:id', createListing)

module.exports = router