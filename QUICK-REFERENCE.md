# Quiz quick reference

CommonJS only. Load environment variables before any file that reads `process.env`.

## Express server initialization

```js
// server.js
require('dotenv').config();

const app = require('./app');
const PORT = Number(process.env.PORT) || 3000;

// Express 5 passes a listen error as the first argument.
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
    return;
  }
  console.log(`Server running at http://localhost:${PORT}`);
});
```

```js
// app.js
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/items', require('./routes/item.routes'));
app.use(require('./middlewares/notFound'));
app.use(require('./middlewares/errorHandler')); // last

module.exports = app;
```

Require `app.js` in tests. Start listening only from `server.js`.

## Creating routes

```js
const express = require('express');
const controller = require('../controllers/item.controller');
const validateId = require('../middlewares/validateId');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', validateId, controller.getOne);
router.post('/', controller.create);
router.put('/:id', validateId, controller.replace);
router.patch('/:id', validateId, controller.update);
router.delete('/:id', validateId, controller.remove);

module.exports = router;
```

Routes connect a method and a path to a controller. No SQL and no business rules here.

## Creating controllers

```js
const itemModel = require('../models/item.model');

async function getOne(req, res, next) {
  try {
    const item = await itemModel.findById(req.validatedId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
}

module.exports = { getOne };
```

## Creating middleware

```js
function logger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}

function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  req.validatedId = id;
  next();
}

module.exports = validateId;
```

Error middleware has four parameters. Express recognizes it by that signature.

```js
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal server error' : err.message,
  });
}
```

## req.params, req.query, req.body

```js
// GET /api/items/3?sort=name
req.params.id;   // "3"
req.query.sort;  // "name"

// POST /api/items  with JSON body
req.body.name;
req.body.price;
```

`express.json()` fills `req.body` for `Content-Type: application/json`.
`express.urlencoded({ extended: true })` fills it for HTML form posts.

## res.json() and res.status()

```js
res.json(items);                         // 200
res.status(201).json(item);              // created
res.status(400).json({ error: 'Invalid input' });
res.status(404).json({ error: 'Item not found' });
res.status(503).json({ error: 'Database unavailable' });
```

`return` after sending a response so the function does not continue.

## Reading and writing JSON files

```js
const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'items.json');

async function readJSON(filePath) {
  try {
    const text = await fs.readFile(path.resolve(filePath), 'utf8');
    return JSON.parse(text);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

async function writeJSON(filePath, data) {
  const resolved = path.resolve(filePath);
  await fs.mkdir(path.dirname(resolved), { recursive: true });
  await fs.writeFile(resolved, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
```

To add one entry to a JSON array, read the array, `push`, then write it back. Do not append raw text onto a JSON file.

Use a fixed path inside the project. Do not read a path from `req.body` or `req.query`.

## Connecting to MySQL

```js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  decimalNumbers: true,
});

module.exports = pool;
```

```js
const pool = require('../db/pool');
const [rows] = await pool.query('SELECT 1 AS ok');
```

Enable `multipleStatements` only in a setup script, not on this pool.

## SELECT, INSERT, UPDATE, DELETE

```js
const [rows] = await pool.query(
  'SELECT id, name, description, price FROM items WHERE id = ?',
  [id]
);
const item = rows[0] || null;

const [result] = await pool.query(
  'INSERT INTO items (name, description, price) VALUES (?, ?, ?)',
  [name, description, price]
);
const newId = result.insertId;

const [updated] = await pool.query(
  'UPDATE items SET name = ? WHERE id = ?',
  [name, id]
);
updated.affectedRows;

const [deleted] = await pool.query('DELETE FROM items WHERE id = ?', [id]);
deleted.affectedRows;
```

Always use `?` placeholders. Never join user input into the SQL string.

A partial update can build the assignments from a fixed column list:

```js
const fields = [];
const values = [];
if (changes.name !== undefined) {
  fields.push('name = ?');
  values.push(changes.name);
}
values.push(id);
await pool.query(`UPDATE items SET ${fields.join(', ')} WHERE id = ?`, values);
```

## app.use() vs router.get() / router.post()

`app.use(fn)` runs for every method and path that reaches it. Use it for logger, `express.json()`, a whole router, 404, and the error handler.

`app.use('/api/items', itemRoutes)` mounts that router at `/api/items`.

`router.get('/')` handles `GET /api/items`.
`router.post('/')` handles `POST /api/items`.
`router.get` and `router.post` run only for that method and path.

## next() vs next(err)

`next()` moves to the next normal middleware.

`next(err)` skips the remaining normal middleware and goes to the error handler.

```js
app.get('/api/error-demo', (req, res, next) => {
  next(new Error('Demonstrated failure'));
});
```

In Express 5, a rejected promise from an `async` route also reaches the error handler. `try/catch` plus `next(err)` makes that path obvious.

## Middleware execution order

Register in this order:

1. Logger
2. `express.json()` and `express.urlencoded()`
3. Routes and route middleware such as `validateId`
4. 404 handler
5. Error handler last

A request runs from top to bottom. The first response ends it. `validateId` runs before the controller on `/:id` routes. Unknown paths fall through to the 404 handler. Errors sent with `next(err)` land in the error handler.
