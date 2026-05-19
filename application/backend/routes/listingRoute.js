const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = require('../middleware/upload')
const { getListing, getMyListings, postListing, getListingsBought} = require('../controllers/listingController')

router.get("/my-listings", getMyListings)
router.get("/bought-listings", getListingsBought)
router.get('/:id', getListing)

router.post(
  '/',
  upload.array('images', 9),
  postListing
)

module.exports = router