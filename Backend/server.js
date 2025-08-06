const dotenv = require("dotenv");
dotenv.config(); // load env before anything else

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ MongoDB connected successfully");
  console.log("📍 Database:", mongoose.connection.db.databaseName);
  console.log("🔗 Connection state:", mongoose.connection.readyState);
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Add connection event listeners
mongoose.connection.on('connected', () => {
  console.log('🔄 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/banks", require("./routes/bankRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
