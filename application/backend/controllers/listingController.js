const { getListingById, getListingsByUser } = require('../models/listingModel')

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

async function getMyListings(req, res) {
  try {

    if (!req.session.userId) {
      return res.status(401).json({
        error: "Not authenticated"
      });
    }
    
    const listings = await getListingsByUser(
      req.session.userId
    );

    const currentListings = listings.filter(
      listing => listing.active
    );

    const soldListings = listings.filter(
      listing => !listing.active
    );

    res.json({
      currentListings,
      soldListings
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error"
    });
  }
}

module.exports = {
  getListing,
  getMyListings,
}