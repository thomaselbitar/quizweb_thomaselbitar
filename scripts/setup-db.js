require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
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
    database: dbName,
    multipleStatements: true,
  });

  try {
    const schema = await fs.readFile(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
    const seed = await fs.readFile(path.join(__dirname, '..', 'db', 'seed.sql'), 'utf8');
    await connection.query(schema);
    await connection.query(seed);
    console.log(`Tables and seed data are ready in "${dbName}".`);
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error('Failed to set up database:', err.message);
  process.exit(1);
});
