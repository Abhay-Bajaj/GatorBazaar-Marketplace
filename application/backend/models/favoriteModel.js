const {pool} = require('../database')

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
}

async function getFavoritesList(userId) {
  const [rows] = await pool.execute(
    `SELECT * FROM user_favorites 
    WHERE user_id = ?`,
    [userId]
  );

  return rows;
};

module.exports = {
  addUserFavorite,
  removeUserFavorite,
  getFavoritesList
}