const pool = require('../database')

async function getListingById(id) {
  const [rows] = await pool.query(
    `SELECT 
        l.listing_id,
        l.title,
        l.description,
        l.price,
        c.category_name,
        (
            SELECT li.image_url
            FROM listing_images li
            WHERE li.listing_id = l.listing_id
            LIMIT 1
        ) AS image_url
    FROM listings l
    JOIN Categories c ON l.category = c.category_id
    WHERE l.listing_id = ?`,
    [id]
  )

  if (!rows.length) return null

  return rows[0]
}

module.exports = {
  getListingById,
}