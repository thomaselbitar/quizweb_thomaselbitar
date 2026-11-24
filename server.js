require('dotenv').config();

const app = require('./app');
const pool = require('./db/pool');

const PORT = Number(process.env.PORT) || 3000;

pool.on('error', (err) => {
  console.warn(`MySQL pool error (${err.code || 'ERROR'}) - ${err.message}`);
});

// Express 5 calls this function with an error when the port cannot be opened.
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
    return;
  }

  console.log(`Server running at http://localhost:${PORT}`);

  pool
    .query('SELECT 1')
    .then(() => {
      console.log('MySQL: connected');
    })
    .catch((dbErr) => {
      console.warn(`MySQL: unavailable (${dbErr.code || 'ERROR'}) - ${dbErr.message}`);
      console.warn('Server is running. /api/files works. /api/items returns 503 until MySQL is ready.');
    });
});
