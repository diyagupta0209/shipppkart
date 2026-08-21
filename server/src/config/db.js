const mongoose = require("mongoose");

let memoryServer;

const sanitizeMongoUri = (value) => {
  if (!value) {
    return "";
  }

  let uri = String(value).trim();
  if (
    (uri.startsWith('"') && uri.endsWith('"')) ||
    (uri.startsWith("'") && uri.endsWith("'")) ||
    (uri.startsWith("`") && uri.endsWith("`"))
  ) {
    uri = uri.slice(1, -1).trim();
  }
  if (uri.startsWith("MONGO_URI=")) {
    uri = uri.slice("MONGO_URI=".length).trim();
  }
  return uri.replace(/\s+/g, "");
};

const connectDb = async () => {
  let uri = sanitizeMongoUri(process.env.MONGO_URI);

  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGO_URI is required in production");
    }
    const { MongoMemoryServer } = require("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.warn("MONGO_URI is not set; using in-memory MongoDB");
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    throw new Error(
      'MONGO_URI must start with mongodb:// or mongodb+srv://. On Render, paste only the URI in the Value field — no quotes and no "MONGO_URI=" prefix.'
    );
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

module.exports = { connectDb, disconnectDb, sanitizeMongoUri };
