const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/requireAuth')
const multer = require('multer')
const upload = require('../middleware/upload')
const { getListing, getMyListings, postListing, deleteListing} = require('../controllers/listingController')

router.get("/my-listings", getMyListings)
router.get('/:id', getListing)

router.post(
  '/',
  upload.array('images', 9),
  postListing
)
router.delete(
  '/:id',
  requireAuth,
  deleteListing
)

module.exports = router