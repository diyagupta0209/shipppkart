const mongoose = require("mongoose");

let memoryServer;

const connectDb = async () => {
  let uri = process.env.MONGO_URI;

  if (!uri) {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.warn("MONGO_URI is not set; using in-memory MongoDB");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
};

const disconnectDb = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = { connectDb, disconnectDb };
