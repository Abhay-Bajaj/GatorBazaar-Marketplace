const { pool } = require('../database')

async function getCategories() {
  const [rows] = await pool.execute(
    `
    SELECT category_id, category_name
    FROM categories
    ORDER BY category_name
    `
  )

  return rows
}

module.exports = {
  getCategories
}