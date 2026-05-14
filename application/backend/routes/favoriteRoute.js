const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

router.post('/:listing_id', favoriteController.addFavorite);
route.delete('/:listing_id', favoriteController.removeFavorite);
route.get('/:listing_id/status', favoriteController.checkFavorite)
router.get('/', favoriteController.getFavorites);

module.exports = router;