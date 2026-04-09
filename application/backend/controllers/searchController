const { getListings } = require('../models/searchModel')

async function searchListings(req, res) {
  try {
    const { keyword, category, sort } = req.query

    const listings = await getListings({
      keyword,
      category,
      sort,
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