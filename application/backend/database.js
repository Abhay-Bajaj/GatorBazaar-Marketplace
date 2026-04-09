require('dotenv').config();
const mysql = require('mysql2/promise'); // <- promise version for async/await

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

async function test() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('Connected! Test query result:', rows[0].solution);
  } catch (err) {
    console.error('DB connection failed:', err);
  }
}

test();