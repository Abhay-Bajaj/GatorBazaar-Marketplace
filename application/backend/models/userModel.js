const pool = require('../database')

async function getUserById() {
  const [rows] = await pool.query(
    `SELECT * FROM registered_users WHERE user_id = 1`
  );
  if (!rows.length) return null
  return rows[0]
}

module.exports = {
  getUserById,
}