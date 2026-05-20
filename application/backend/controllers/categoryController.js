// Dropdown / filter options from Categories table.
const categoryModel = require('../models/categoryModel')

async function getCategories(req, res) {
  try {
    const categories = await categoryModel.getCategories()
    res.json(categories)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get categories' })
  }
}

module.exports = {
  getCategories
}