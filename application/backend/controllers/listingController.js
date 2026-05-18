const { getListingById, getListingsByUser, createListing } = require('../models/listingModel')

async function getListing(req, res) {
  try {

    const userId = req.session.userId || null
    const listing = await getListingById(req.params.id, userId)

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

async function postListing(req, res) {
  try {
    const userId = req.session.userId

    if (!userId) {
      return res.status(401).json({
        error: 'Not authenticated'
      })
    }

    const {
      title,
      description,
      price,
      category,
      tag
    } = req.body

    if (!title || !price || !category) {
      return res.status(400).json({
        error: 'Missing required listing fields'
      })
    }

    const numericPrice = Number(price)

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        error: 'Invalid price'
      })
    }

    const imageUrls = req.files
      ? req.files.map(file => `/uploads/images/${file.filename}`)
      : []

    const listingId = await createListing(
      userId,
      title.trim(),
      description || null,
      numericPrice,
      category,
      tag || null,
      imageUrls
    )

    res.status(201).json({
      listingId
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: 'Failed to create listing'
    })
  }
}

module.exports = {
  getListing,
  getMyListings,
  postListing,
}