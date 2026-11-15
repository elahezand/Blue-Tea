# Blue Tea backend (simple, for development)

Express + MongoDB (Mongoose). Only the main site for now: categories, products, reviews,
**Works with the older Blue Tea data too** (parentId, productID, menu items by category, wishlists collection).

> ⚠️ `npm run seed` deletes products, categories, reviews, articles, menu and carts. Use it only on an empty test database.

cart (+ guest cart sync), favorites, phone login, journal, menu, about page, table booking, contact form.

## Run

1. Install and start MongoDB (local, default port 27017).
2. In this folder:
   ```bash
   npm install
   cp .env.example .env      # then change the secrets
   npm run seed              # fake data: categories, products, reviews, articles, menu
   npm run dev               # http://localhost:4000/api
   ```
3. In the frontend `.env`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

## Login

There is no SMS yet: after "Send code" the code is printed in this terminal
(and returned as `code` in the response while not in production).
The phone number in `ADMIN_PHONE` becomes ADMIN.

## Discount codes

`TEA10` (10%) and `WELCOME5` (5%), in `src/config/env.js`.

## Routes (all under /api)

| Method | Path | |
|---|---|---|
| POST | /auth/send-code, /auth/verify-code, /auth/refresh, /auth/signout | phone login, cookies `token` + `refreshToken` |
| GET / PATCH | /users/profile | logged in (`PATCH { name, email }`) |
| GET | /users?page&limit&q&role, /users/banned | admin, page-based `{ data, totalCount, pageCount, page, limit }` |
| PATCH | /users/ban/:id, /users/unban/:id | admin (a banned user can not log in) |
| DELETE | /users/:id | admin (also deletes their cart and favorites) |
| GET | /categories/tree | |
| GET | /products?category&q&min&max&sort&limit&cursor, /products/:id | the only product list (home uses ?limit=12) |
| GET | /tickets/me | logged in |
| GET / POST | /products/:id/comments | new reviews wait for the admin |
| GET | /comments/latest | |
| GET / POST / DELETE | /cart, /cart/items, /cart/items/:itemId, /cart/discount, /cart/sync | logged in |
| GET / POST / DELETE | /wishlist, /wishlist/:productId | logged in |
| GET | /articles?q&limit&cursor, /articles/:id | |
| GET | /menu, /pages/about | |
| POST | /reservations, /contacts | |

Every answer has the same shape (`src/utils/http.js` -> `send`, `sendList`, `sendMessage`):

```
one thing:  { success: true, data }
a list:     { success: true, data: [...], pagination: { nextCursor, limit, hasMore } }      ("load more")
            { success: true, data: [...], pagination: { page, pageCount, totalCount, limit } } (admin tables)
a message:  { success: true, data: null, message }
an error:   { success: false, message, errors? }
```

## Folders

```
src/
  app.js          express app (routes, CORS, errors)
  server.js       connects to MongoDB and starts the app
  seed.js         fake data
  config/         .env values, db connection
  models/         mongoose models
  routes/         one file per part of the site
  middlewares/    requireAuth, error handler
  utils/          paginate, tokens (cookies), cart prices, validation
  data/about.js   About page content
```
