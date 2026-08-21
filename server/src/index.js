require("dotenv").config();
process.env.JWT_SECRET = process.env.JWT_SECRET || "dev-only-change-me";
const { connectDb } = require("./config/db");
const { seedIfEmpty } = require("./seed");
const app = require("./app");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDb();
  if (process.env.SEED_ON_START !== "false") {
    await seedIfEmpty();
  }

  app.listen(PORT, () => {
    console.log(`ShipKart API listening on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
