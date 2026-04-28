const express = require('express')
const router = express.Router()
const { getListing } = require('../controllers/listingController')

router.get('/:id', getListing)

module.exports = router