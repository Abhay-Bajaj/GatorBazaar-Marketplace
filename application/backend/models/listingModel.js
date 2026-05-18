const { pool } = require('../database')

async function getListingById(id, userId = null) {
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
        ) AS image_url,
        CASE
          WHEN uf.favorite_id IS NOT NULL THEN TRUE
          ELSE FALSE
        END AS isFavorited,
        CASE
          WHEN l.user_id = ? THEN TRUE
          ELSE FALSE
        END AS isOwner,
        l.user_id AS seller_id,
        u.username AS seller_username,
        u.fullname AS seller_fullname
    FROM listings l
    JOIN Categories c ON l.category = c.category_id
    JOIN registered_users u ON l.user_id = u.user_id
    LEFT JOIN user_favorites uf
      ON uf.listing_id = l.listing_id
      AND uf.user_id = ?
    WHERE l.listing_id = ?`,
    [userId, userId, id]
  )

  if (!rows.length) return null

  return rows[0]
}

async function getListingsByUser(userId) {

  const [rows] = await pool.execute(
    `SELECT *
    FROM listings
    WHERE user_id = ?
    ORDER BY created_at DESC`,
    [userId]
  );

  return rows;

}

async function removeListing(listingId, userId) {
  const [result] = await pool.query (
    `
    DELETE FROM listings 
    WHERE listing_id = ?
    AND user_id = ?
    `,
    [listingId, userId]
  );
  return result.affectedRows > 0
}

module.exports = {
  getListingById,
  getListingsByUser,
  removeListing
}