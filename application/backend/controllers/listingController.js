const { getListingById, getListingsByUser, removeListing } = require('../models/listingModel')

async function getListing(req, res) {
  try {

    const userId = req.session.userId || null
    const listing = await getListingById(req.params.id, userId)

    if (!listing) {
      return res.status(404).json({ message: 'Item not found' })
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

async function deleteListing(req, res) {
  try {
    const { listing_id } = req.params
    const userId = req.session.userId

    if (!listing_id) {
      return res.status(400).json({ error: 'Listing id required' })
    }

    const deleted = await listingModel.deleteListing(listing_id, userId)

    if (!deleted) {
      return res.status(404).json({
        error: 'Listing not found or not authorized',
      })
    }

    return res.json({
      message: 'Listing deleted successfully',
    })
  } catch (err) {
    console.error('deleteListing error:', err)

    return res.status(500).json({
      error: 'Server error',
    })
  }
}

module.exports = {
  getListing,
  getMyListings,
  deleteListing
}