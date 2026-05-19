const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/requireAuth')
const multer = require('multer')
const upload = require('../middleware/upload')
const { getListing, getMyListings, postListing, getListingsBought, getNewListings, deleteListing} = require('../controllers/listingController')

router.get("/bought-listings", getListingsBought)

router.get("/my-listings", getMyListings)
router.get('/new', getNewListings)
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