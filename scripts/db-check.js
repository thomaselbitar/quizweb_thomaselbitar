require('dotenv').config();

const pool = require('../db/pool');

async function main() {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    console.log('Database connection successful.');
    console.log(rows[0]);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Database connection failed:', err.message);
  process.exit(1);
});
