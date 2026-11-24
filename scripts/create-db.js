require('dotenv').config();

const mysql = require('mysql2/promise');

function getDbName() {
  const dbName = process.env.DB_NAME;
  if (!dbName || !/^[A-Za-z0-9_]+$/.test(dbName)) {
    throw new Error('DB_NAME must contain only letters, numbers, and underscores');
  }
  return dbName;
}

async function main() {
  const dbName = getDbName();
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`Database "${dbName}" is ready.`);
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error('Failed to create database:', err.message);
  process.exit(1);
});
