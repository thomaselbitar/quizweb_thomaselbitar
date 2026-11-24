const pool = require('../db/pool');

// mysql2/promise: SELECT returns [rows, fields].
// INSERT, UPDATE, and DELETE return [result], where result has insertId and affectedRows.

async function findAll() {
  const [rows] = await pool.query(
    'SELECT id, name, description, price FROM items ORDER BY id'
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, description, price FROM items WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const [result] = await pool.query(
    'INSERT INTO items (name, description, price) VALUES (?, ?, ?)',
    [data.name, data.description, data.price]
  );
  return findById(result.insertId);
}

async function replace(id, data) {
  const existing = await findById(id);
  if (!existing) {
    return null;
  }

  await pool.query(
    'UPDATE items SET name = ?, description = ?, price = ? WHERE id = ?',
    [data.name, data.description, data.price, id]
  );
  return findById(id);
}

async function update(id, changes) {
  const existing = await findById(id);
  if (!existing) {
    return null;
  }

  const columns = ['name', 'description', 'price'];
  const fields = [];
  const values = [];

  for (const column of columns) {
    if (Object.prototype.hasOwnProperty.call(changes, column)) {
      fields.push(`${column} = ?`);
      values.push(changes[column]);
    }
  }

  if (fields.length === 0) {
    return existing;
  }

  values.push(id);
  await pool.query(`UPDATE items SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM items WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  replace,
  update,
  remove,
};
