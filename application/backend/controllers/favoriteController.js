const favoriteModel = require("../models/favoriteModel");

async function addFavorite(req, res) {
    try {
        if (!req.session.userId) {
            return res.json({ loggedIn: false })
        }

        const userId = req.session.userId
        const listingId = req.params.listingId

        await favoriteModel.addUserFavorite(userId, listingId)

        res.json({ success: true })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}

async function removeFavorite(req, res) {
    try {

        if (!req.session.userId) {
            return res.json({ loggedIn: false })
        }

        const userId = req.session.userId
        const listingId = req.params.listingId

        await favoriteModel.removeUserFavorite(userId, listingId)

        res.json({ success: true })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }

}

async function getFavorites(req, res) {
    try {

        if (!req.session.userId) {
            return res.status(401).json({ error: 'Not authenticated' })
        }
        const userId = req.session.userId

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
    getFavorites
}