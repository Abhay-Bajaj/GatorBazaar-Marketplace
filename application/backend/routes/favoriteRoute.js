// /api/favorites — add, remove, list saved listings.
const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");


router.post('/:listingId', favoriteController.addFavorite);
router.delete('/:listingId', favoriteController.removeFavorite);
router.get('/', favoriteController.getFavorites);

module.exports = router;