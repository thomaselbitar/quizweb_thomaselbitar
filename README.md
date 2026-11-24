# Game Store API

Node.js and Express API for the game shop exam. Parts 2 and 3 store games in `data/games.json`. Part 4 stores new admin games in MySQL. The bonus uses a session and the `users` table.

## Run

```bash
npm install
npm run data:reset
npm run db:setup
npm run dev
```

The server uses `PORT` from `.env`.

## Routes

| Method | Route | Success |
|---|---|---|
| GET | `/` | 200, `Welcome To Our Game Store` |
| GET | `/games` | 200 and the games. Optional `sortBy`, `order`, `minPrice`, `maxPrice` |
| GET | `/games/:id` | 200 and that game |
| POST | `/games` | 201 and the new game in the JSON file |
| PUT | `/games/:id` | 200. `title`, `studio`, `price`, and `stock` are all required |
| PATCH | `/games/:id` | 200. Send any of those four fields |
| DELETE | `/games/:id` | 204 with an empty body |
| POST | `/admin/games` | 201 and the MySQL row. An admin session is required |
| POST | `/auth/login` | 200 and the user without `password_hash` |

Errors use `{ "error": "..." }`.

`GET /games` defaults to `sortBy=id` and `order=asc`. A bad query value returns 400.

Login accounts created by `npm run db:setup`:

| Email | Password | Role |
|---|---|---|
| admin@gamestore.com | admin123 | admin |
| user@gamestore.com | user1234 | user |
