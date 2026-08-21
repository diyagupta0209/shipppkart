const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config();

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }
  process.env.JWT_SECRET = "dev-only-change-me";
}

const { connectDb } = require("./config/db");
const { seedIfEmpty } = require("./seed");
const app = require("./app");

const PORT = process.env.PORT || 5000;

const start = async () => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ShipKart listening on port ${PORT}`);
  });

  try {
    await connectDb();
    if (process.env.SEED_ON_START !== "false") {
      await seedIfEmpty();
    }
  } catch (error) {
    console.error("Failed to connect to MongoDB");
    console.error(error.message);
    console.error(
      "On Atlas go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0), wait until it is Active, then redeploy on Render."
    );
    process.exit(1);
  }
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
