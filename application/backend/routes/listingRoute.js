const express = require('express')
const router = express.Router()
const { getListing, getMyListings } = require('../controllers/listingController')

router.get("/my-listings", getMyListings)
router.get('/:id', getListing)


module.exports = router