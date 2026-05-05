const { getListingById } = require('../models/listingModel')

async function getListing(req, res) {
  try {

    const listing = await getListingById(req.params.id)

    if(!listing) {
        return res.status(404).json({ message: 'Item not found'})
    }

    res.json(listing)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getListing,
}