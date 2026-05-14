const favoriteModel = require("../models/favoriteModel");

async function addFavorite(req, res) {
    try {

        const userId = req.session.user.user_id
        const listingId = req.params.listing_id

        await favoriteModel.addUserFavorite(userId, listingId)

        res.json({ success: true })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}

async function removeFavorite(req, res) {
    try {

        const userId = req.session.user.user_id
        const listingId = req.params.listing_id

        await favoriteModel.removeUserFavorite(userId, listingId)

        res.json({ success: true })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }

}

async function checkFavorite(req, res) {
    try {

        const userId = req.session.user.user_id
        const listingId = req.params.listing_id

        const favorite = await favoriteModel.getFavoritesList(userId, listingId)

        res.json({ isFavorited: !!favorite })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}

async function getFavorites(req, res) {
    try {

        const userId = req.session.user.user_id

        const favorites = await favoriteModel.getFavoritesList(userId)

        res.json(favorites)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    addFavorite,
    removeFavorite,
    checkFavorite,
    getFavorites
}