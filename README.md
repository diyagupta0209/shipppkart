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
