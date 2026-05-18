const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = require('../middleware/upload')
const { getListing, getMyListings, postListing} = require('../controllers/listingController')

router.get("/my-listings", getMyListings)
router.get('/:id', getListing)

router.post(
  '/',
  upload.array('images', 9),
  postListing
)

module.exports = router