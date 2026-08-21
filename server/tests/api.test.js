const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");

process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "1h";
process.env.NODE_ENV = "test";

const app = require("../src/app");
const User = require("../src/models/User");
const Product = require("../src/models/Product");
const Cart = require("../src/models/Cart");
const Order = require("../src/models/Order");

let mongod;

const shippingAddress = {
  fullName: "Diya Gupta",
  street: "12 Market Street",
  city: "Delhi",
  state: "DL",
  postalCode: "110001",
  country: "India",
};

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
  ]);
});

const createUser = async (overrides = {}) => {
  const user = await User.create({
    name: "Shopper",
    email: "shopper@example.com",
    password: "Password123",
    role: "user",
    ...overrides,
  });
  return { user, token: user.signToken() };
};

const createProduct = (overrides = {}) =>
  Product.create({
    name: "Carry Bag",
    sku: `SKU-${Math.random().toString(36).slice(2, 8)}`,
    description: "A sturdy bag",
    price: 500,
    imageUrl: "/products/carry-bag.jpeg",
    category: "Accessories",
    stock: 10,
    ...overrides,
  });

describe("Auth", () => {
  test("registers a user and returns a JWT", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Diya",
      email: "diya@example.com",
      password: "Password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.data.user.email).toBe("diya@example.com");
    expect(res.body.data.user.password).toBeUndefined();
  });

  test("rejects weak passwords", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Diya",
      email: "diya@example.com",
      password: "short",
    });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("fail");
  });

  test("logs in with valid credentials", async () => {
    await createUser({ email: "login@example.com" });
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "Password123",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  test("rejects invalid login", async () => {
    await createUser();
    const res = await request(app).post("/api/auth/login").send({
      email: "shopper@example.com",
      password: "WrongPass1",
    });
    expect(res.status).toBe(401);
  });
});

describe("Products", () => {
  test("lists active catalog items", async () => {
    await createProduct({ name: "MacBook", price: 80000 });
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.results).toBe(1);
    expect(res.body.data.products[0].name).toBe("MacBook");
  });

  test("blocks unauthenticated product creation", async () => {
    const res = await request(app).post("/api/products").send({ name: "Nope" });
    expect(res.status).toBe(401);
  });

  test("allows admins to create products", async () => {
    const { token } = await createUser({ email: "admin@example.com", role: "admin" });
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Smart Watch",
        sku: "WATCH-001",
        description: "Fitness watch",
        price: 10000,
        imageUrl: "/products/smart-watch.jpeg",
        category: "Electronics",
        stock: 5,
      });
    expect(res.status).toBe(201);
    expect(res.body.data.product.sku).toBe("WATCH-001");
  });
});

describe("Cart and orders", () => {
  test("adds items, checks inventory, and places an order", async () => {
    const { token } = await createUser();
    const product = await createProduct({ stock: 3, price: 500 });

    const add = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: product.id, quantity: 2 });
    expect(add.status).toBe(201);
    expect(add.body.data.cart.subtotal).toBe(1000);

    const overstock = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: product.id, quantity: 5 });
    expect(overstock.status).toBe(400);

    const checkout = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ shippingAddress });
    expect(checkout.status).toBe(201);
    expect(checkout.body.data.order.subtotal).toBe(1000);
    expect(checkout.body.data.order.status).toBe("confirmed");

    const updated = await Product.findById(product.id);
    expect(updated.stock).toBe(1);

    const cart = await request(app).get("/api/cart").set("Authorization", `Bearer ${token}`);
    expect(cart.body.data.cart.items).toHaveLength(0);
  });

  test("cancels an order and restores inventory", async () => {
    const { token } = await createUser();
    const product = await createProduct({ stock: 4 });

    await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: product.id, quantity: 2 });

    const checkout = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ shippingAddress });

    const cancel = await request(app)
      .patch(`/api/orders/${checkout.body.data.order._id}/cancel`)
      .set("Authorization", `Bearer ${token}`);
    expect(cancel.status).toBe(200);
    expect(cancel.body.data.order.status).toBe("cancelled");

    const updated = await Product.findById(product.id);
    expect(updated.stock).toBe(4);
  });

  test("requires auth for cart access", async () => {
    const res = await request(app).get("/api/cart");
    expect(res.status).toBe(401);
  });
});
