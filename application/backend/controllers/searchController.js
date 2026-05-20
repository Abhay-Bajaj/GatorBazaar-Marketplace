// Public search: keyword, category, price range, sort. Favorites flag if session exists.
const { getListings } = require('../models/searchModel')

async function searchListings(req, res) {
  try {
    const { keyword, sort, priceMin, priceMax } = req.query
    const category = req.query.category
    const userId = req.session.userId || null

    const listings = await getListings({
      keyword,
      category,
      sort,
      priceMin,
      priceMax,
      userId
    })

    res.json({
      items: listings,
      total: listings.length,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  searchListings,
}
