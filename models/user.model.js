const pool = require('../db/pool');

async function findByEmail(email) {
  const [rows] = await pool.query(
    'SELECT id, email, password_hash, role FROM users WHERE email = ?',
    [email]
  );

  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, email, role FROM users WHERE id = ?',
    [id]
  );

  return rows[0] || null;
}

module.exports = {
  findByEmail,
  findById,
};
