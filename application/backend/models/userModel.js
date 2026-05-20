// registered_users table — passwords are already hashed in authController.
const { pool } = require('../database')

async function createUser(fullname, username, email, hashedPassword) {
  const [user] = await pool.execute(
    `INSERT INTO registered_users (fullname, username, email, password_hash, created_at, user_rating, is_suspended)
    VALUES (?, ?, ?, ?, NOW(), 0, 0)`,
    [fullname, username, email, hashedPassword]
  );

  return user.insertId;
}

async function getUserByUsername(username) {
  const [rows] = await pool.execute(
    "SELECT * FROM registered_users WHERE username = ?",
    [username]
  );
  return rows[0];
}

async function getUserByEmail(email) {
  const [rows] = await pool.execute(
    "SELECT * FROM registered_users WHERE email = ?",
    [email]
  );
  return rows[0];
}

async function getUserById(userId) {
  const [rows] = await pool.execute(
    'SELECT * FROM registered_users WHERE user_id = ?',
    [userId]
  );
  if (!rows.length) return null
  return rows[0]
}

async function changeUserPassword(userId, hashedPassword) {
  const [rows] = await pool.execute(
    `UPDATE registered_users
    SET password_hash = ?
    WHERE user_id = ?`,
    [hashedPassword, userId]
  );
  if(!rows.length) return null
  return rows[0]
}

module.exports = {
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  changeUserPassword
}