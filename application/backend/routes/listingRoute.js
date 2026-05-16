const express = require('express')
const router = express.Router()
const { getListing, getMyListings, getNewListings } = require('../controllers/listingController')

router.get("/my-listings", getMyListings)
router.get('/new', getNewListings)
router.get('/:id', getListing)


module.exports = router