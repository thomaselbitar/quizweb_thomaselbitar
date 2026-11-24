# Game Store checks

From a clean start:

```bash
npm run data:reset
npm run db:setup
npm run dev
```

Query example:

```text
GET /games?minPrice=20&maxPrice=50&sortBy=price&order=desc
```

Admin login, then create:

```bash
curl.exe -c cookies.txt -X POST http://localhost:3000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@gamestore.com\",\"password\":\"admin123\"}"

curl.exe -b cookies.txt -X POST http://localhost:3000/admin/games ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Hades\",\"studio\":\"Supergiant Games\",\"price\":19.99,\"stock\":10}"
```

Use the `PORT` value from `.env` in those URLs.
