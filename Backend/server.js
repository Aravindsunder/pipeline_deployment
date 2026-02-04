const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

function logger(req, res, next) {
  console.log(`request received: ${req.originalUrl}`);
  next();
}
app.use(logger);

// ✅ Read env vars FIRST
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB } =
  process.env;

// ✅ Validate env vars
if (
  !MONGO_USERNAME ||
  !MONGO_PASSWORD ||
  !MONGO_HOST ||
  !MONGO_PORT ||
  !MONGO_DB
) {
  console.error("❌ Missing MongoDB environment variables");
  process.exit(1);
}

// ✅ Build Mongo URI
const MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// Routes
app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello World!</h1>");
});

app.get("/hello", (req, res) => {
  res.json({ hello: "World" });
});

app.use("/items", require("./routes/items"));
app.use("/orders", require("./routes/orders"));
app.use("/restaurant", require("./routes/restaurant"));
app.use("/users", require("./routes/users"));

// ✅ Start server ONLY after DB connects
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(5000, "0.0.0.0", () => {
      console.log("🚀 Backend running on port 5000");
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

startServer();
