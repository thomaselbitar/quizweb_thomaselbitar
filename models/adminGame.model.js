const pool = require('../db/pool');

async function create(fields) {
  const [result] = await pool.query(
    'INSERT INTO games (title, studio, price, stock) VALUES (?, ?, ?, ?)',
    [fields.title, fields.studio, fields.price, fields.stock]
  );

  const [rows] = await pool.query(
    'SELECT id, title, studio, price, stock FROM games WHERE id = ?',
    [result.insertId]
  );

  return rows[0];
}

module.exports = {
  create,
};
