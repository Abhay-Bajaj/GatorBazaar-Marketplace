const { pool } = require('../database')

async function addUserFavorite(userId, listingId) {
  const [favorite] = await pool.execute(
    `INSERT INTO user_favorites (user_id, listing_id, created_at)
    VALUES (?, ?, NOW())`,
    [userId, listingId]
  );
  return favorite.insertId;
};

async function removeUserFavorite(userId, listingId) {
  const [result] = await pool.execute(
    `DELETE FROM user_favorites
    WHERE user_id = ? AND listing_id = ?`,
    [userId, listingId]
  )

  return result;
};

async function getFavoritesList(userId) {
  const [rows] = await pool.execute(
    `SELECT 
      l.listing_id,
      l.title,
      l.price,
      c.category_name,
      uf.created_at AS favorited_at,
      (
        SELECT li.image_url
        FROM listing_images li
        WHERE li.listing_id = l.listing_id
        LIMIT 1
      ) AS image_url
    FROM user_favorites uf
    JOIN listings l
      ON uf.listing_id = l.listing_id
    JOIN Categories c
      ON l.category = c.category_id
    WHERE uf.user_id = ?
    ORDER BY uf.created_at DESC`,
    [userId]
  );

  return rows;
};

module.exports = {
  addUserFavorite,
  removeUserFavorite,
  getFavoritesList
}