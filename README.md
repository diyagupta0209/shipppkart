# ShipKart

Full-stack shopping platform for product browsing, cart management, and order workflows.

## Stack

React, JavaScript, HTML, CSS, Node.js, Express.js, MongoDB, REST APIs, JWT

## Features

- Public product catalog with inventory-aware stock counts
- JWT registration/login and protected cart/order routes
- Cart CRUD with inventory checks
- Checkout that creates an order, decrements stock, and clears the cart
- Order history plus cancellation that restores inventory
- Request validation and structured API error responses

## Project layout

- `src/` React storefront
- `server/` Express REST API and MongoDB models
- `public/products/` catalog images

## Setup

```bash
npm install
npm install --prefix server
cp server/.env.example server/.env
```

Set `MONGO_URI` in `server/.env` to a MongoDB instance. If you omit it, the API starts an in-memory MongoDB database for local demos.

## Run

```bash
npm run dev
```

- Storefront: http://localhost:3000
- API: http://localhost:5000/api/health

Seeded admin (when the catalog is empty):

- Email: `admin@shipkart.dev`
- Password: `AdminPass123!`

## API

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Sign in and receive a JWT |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/products` | No | List products |
| POST | `/api/products` | Admin | Create product |
| GET | `/api/cart` | Yes | Get cart |
| POST | `/api/cart/items` | Yes | Add item |
| PATCH | `/api/cart/items/:productId` | Yes | Update quantity |
| DELETE | `/api/cart/items/:productId` | Yes | Remove item |
| POST | `/api/orders` | Yes | Place order |
| GET | `/api/orders` | Yes | List orders |
| PATCH | `/api/orders/:id/cancel` | Yes | Cancel order |

## Tests

```bash
npm run test:server
CI=true npm test
```

## Deploy (Render + MongoDB Atlas)

GitHub Pages can host only the React files. This app also needs Node/Express and MongoDB, so use one web service that serves the API and the built storefront together.

### 1. Create a free MongoDB Atlas database

1. Sign up at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **free M0** cluster.
3. Under **Database Access**, add a user with a password you will remember.
4. Under **Network Access**, add IP `0.0.0.0/0` so Render can connect.
5. Click **Connect → Drivers** and copy the URI. It looks like:

```
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/shipkart?retryWrites=true&w=majority
```

Replace `USER` and `PASSWORD`. Keep the database name `shipkart`.

### 2. Push this branch to GitHub

```bash
git checkout cursor/fullstack-shopping-platform-c8f7
git pull
```

Merge the pull request into `main` if you want production to track `main`.

### 3. Create a Render web service

1. Sign up at [https://render.com](https://render.com) with GitHub.
2. **New + → Web Service →** select `diyagupta0209/shipppkart`.
3. Use these settings:

| Setting | Value |
| --- | --- |
| Branch | `main` (or `cursor/fullstack-shopping-platform-c8f7`) |
| Runtime | Node |
| Build command | `npm install && npm install --prefix server && npm run build` |
| Start command | `npm run start:prod` |

4. Add environment variables:

| Key | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `MONGO_URI` | Atlas connection string from step 1 |
| `JWT_SECRET` | a long random string |
| `JWT_EXPIRES_IN` | `7d` |
| `SEED_ON_START` | `true` |
| `ADMIN_EMAIL` | `admin@shipkart.dev` |
| `ADMIN_PASSWORD` | a strong password you choose |

5. Click **Deploy**. When it is live, open the Render URL. You should see ShipKart and `/api/health` should return JSON.

If images or login fail after deploy, confirm `MONGO_URI` is correct and the Atlas user password has no unescaped special characters (`@`, `#`, `%` must be URL-encoded).

### Local production check

```bash
npm install
npm install --prefix server
npm run build
MONGO_URI="your-atlas-uri" JWT_SECRET="test-secret" NODE_ENV=production npm run start:prod
```

Then open http://localhost:5000.
