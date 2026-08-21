require("dotenv").config();
const User = require("./models/User");
const Product = require("./models/Product");

const CATALOG = [
  {
    name: "Carry Bag",
    sku: "BAG-001",
    description: "Durable everyday carry bag for shopping and travel.",
    price: 500,
    imageUrl: "/products/carry-bag.jpeg",
    category: "Accessories",
    stock: 40,
  },
  {
    name: "Smart Watch",
    sku: "WATCH-001",
    description: "Fitness tracking smart watch with notifications.",
    price: 10000,
    imageUrl: "/products/smart-watch.jpeg",
    category: "Electronics",
    stock: 25,
  },
  {
    name: "Sports Shoes",
    sku: "SHOE-001",
    description: "Lightweight shoes built for running and training.",
    price: 4000,
    imageUrl: "/products/sports-shoes.jpeg",
    category: "Footwear",
    stock: 30,
  },
  {
    name: "iPhone",
    sku: "PHONE-001",
    description: "Flagship smartphone with a high-resolution camera.",
    price: 50000,
    imageUrl: "/products/iphone.jpeg",
    category: "Electronics",
    stock: 12,
  },
  {
    name: "Facewash",
    sku: "BEAUTY-001",
    description: "Gentle daily facewash for all skin types.",
    price: 200,
    imageUrl: "/products/facewash.jpeg",
    category: "Beauty",
    stock: 80,
  },
  {
    name: "Top",
    sku: "APPAREL-001",
    description: "Casual everyday top with a comfortable fit.",
    price: 700,
    imageUrl: "/products/top.jpeg",
    category: "Apparel",
    stock: 50,
  },
  {
    name: "Lipstick",
    sku: "BEAUTY-002",
    description: "Long-wear lipstick with rich color payoff.",
    price: 300,
    imageUrl: "/products/lipstick.jpeg",
    category: "Beauty",
    stock: 60,
  },
  {
    name: "MacBook",
    sku: "LAPTOP-001",
    description: "Portable laptop for work, study, and creative projects.",
    price: 80000,
    imageUrl: "/products/macbook.jpeg",
    category: "Electronics",
    stock: 8,
  },
  {
    name: "OnePlus Earpods",
    sku: "AUDIO-001",
    description: "Wireless earbuds with clear sound and long battery life.",
    price: 12000,
    imageUrl: "/products/earpods.jpeg",
    category: "Electronics",
    stock: 20,
  },
  {
    name: "Canon Camera",
    sku: "CAM-001",
    description: "DSLR camera for photography and video.",
    price: 40000,
    imageUrl: "/products/camera.jpeg",
    category: "Electronics",
    stock: 10,
  },
];

const seedIfEmpty = async () => {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(CATALOG);
    console.log(`Seeded ${CATALOG.length} products`);
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@shipkart.dev";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: "ShipKart Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log(`Seeded admin user ${adminEmail}`);
  }
};

if (require.main === module) {
  const { connectDb, disconnectDb } = require("./config/db");
  connectDb()
    .then(seedIfEmpty)
    .then(disconnectDb)
    .then(() => {
      console.log("Seed complete");
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { CATALOG, seedIfEmpty };
