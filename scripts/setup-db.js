require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

function getDbName() {
  const dbName = process.env.DB_NAME;
  if (!dbName || !/^[A-Za-z0-9_]+$/.test(dbName)) {
    throw new Error('DB_NAME must contain only letters, numbers, and underscores');
  }
  return dbName;
}

async function seedUsers(connection) {
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user1234', 10);

  await connection.query('DELETE FROM users');
  await connection.query('ALTER TABLE users AUTO_INCREMENT = 1');
  await connection.query(
    `INSERT INTO users (email, password_hash, role) VALUES
      (?, ?, 'admin'),
      (?, ?, 'user')`,
    ['admin@gamestore.com', adminHash, 'user@gamestore.com', userHash]
  );
}

async function main() {
  const dbName = getDbName();
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await connection.query(`USE \`${dbName}\``);

    const schema = await fs.readFile(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
    const seed = await fs.readFile(path.join(__dirname, '..', 'db', 'seed.sql'), 'utf8');
    await connection.query(schema);
    await connection.query(seed);
    await seedUsers(connection);
    console.log(`Tables and seed data are ready in "${dbName}".`);
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error('Failed to set up database:', err.message);
  process.exit(1);
});
