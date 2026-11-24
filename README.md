# Express Quiz Starter

Express 5 starter for the university quiz. It uses CommonJS, a MySQL `items` resource, and JSON file read/write against `data/items.json`.

## Install and start

```bash
npm install
npm start
```

The API listens at `http://localhost:3000` unless `PORT` is changed. If startup prints `EADDRINUSE`, another program is already using that port. Stop it, or set a free port in `.env`.

The server still starts when MySQL is down. `/api/files` keeps working. `/api/items` then returns `503` until the database is ready.

## Folder structure

```text
project/
├── server.js
├── app.js
├── package.json
├── .env
├── .env.example
├── .gitignore
├── controllers/
│   ├── item.controller.js
│   └── file.controller.js
├── models/
│   └── item.model.js
├── routes/
│   ├── item.routes.js
│   └── file.routes.js
├── middlewares/
│   ├── logger.js
│   ├── validateId.js
│   ├── notFound.js
│   └── errorHandler.js
├── db/
│   ├── pool.js
│   ├── schema.sql
│   └── seed.sql
├── data/
│   └── items.json
├── utils/
│   └── fileHandler.js
└── scripts/
    ├── create-db.js
    ├── setup-db.js
    └── db-check.js
```

## API endpoints

| Method | Route | Function |
|---|---|---|
| GET | `/` | Server status |
| GET | `/api/items` | All items from MySQL |
| GET | `/api/items/:id` | One item |
| POST | `/api/items` | Create an item |
| PUT | `/api/items/:id` | Replace an item |
| PATCH | `/api/items/:id` | Update selected fields |
| DELETE | `/api/items/:id` | Delete an item |
| GET | `/api/files` | Read `data/items.json` |
| POST | `/api/files` | Replace `data/items.json` with a JSON array |
| POST | `/api/files/append` | Add one object to the JSON array |
| GET | `/api/error-demo` | Sends an error to the error handler |

Item body:

```json
{
  "name": "Notebook",
  "description": "Lined A5 notebook",
  "price": 4.5
}
```

`PUT` needs `name` and `price`. `description` is optional and becomes `null` when omitted. `PATCH` accepts any of those fields.

## Configure MySQL

Edit `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=express_quiz
```

If your MySQL user has a password, put it in `DB_PASSWORD`. The project does not invent one.

Start the MySQL service before the commands below.

## Create the database

```bash
npm run db:check
npm run db:create
```

`db:create` connects without selecting a database and runs `CREATE DATABASE IF NOT EXISTS`.

## Initialize tables and seed data

```bash
npm run db:setup
```

This runs `db/schema.sql`, then `db/seed.sql`. Running it again clears `items` and inserts the sample rows.

`multipleStatements` is enabled only in `scripts/setup-db.js`. The application pool does not use it.

## Test file operations

`/api/files` always uses `data/items.json`. A request cannot pass a filesystem path.

```bash
curl.exe http://localhost:3000/api/files

curl.exe -X POST http://localhost:3000/api/files ^
  -H "Content-Type: application/json" ^
  -d "[{\"id\":1,\"name\":\"Notebook\",\"price\":4.5}]"

curl.exe -X POST http://localhost:3000/api/files/append ^
  -H "Content-Type: application/json" ^
  -d "{\"id\":2,\"name\":\"Pen\",\"price\":1.25}"
```

Reusable file helpers live in `utils/fileHandler.js`: `readFile`, `writeFile`, `readJSON`, `writeJSON`, and `appendToFile`.

See `QUICK-REFERENCE.md` for short code examples.
