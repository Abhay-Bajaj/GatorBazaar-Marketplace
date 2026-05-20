// Shared MySQL connection pool for all models.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
})

// Used at startup in server.js to confirm DB credentials and network.
async function verifyDatabase() {
  const connection = await pool.getConnection()
  connection.release()
}

module.exports = { pool, verifyDatabase }
