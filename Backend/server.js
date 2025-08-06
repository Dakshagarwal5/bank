const dotenv = require("dotenv");
dotenv.config(); // load env before anything else

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

console.log("🔍 Debug: JWT_SECRET exists =", !!process.env.JWT_SECRET);
console.log("🔍 Debug: MONGO_URI exists =", !!process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());

// Simple JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/banks", authenticateToken, require("./routes/bankRoutes"));
app.use("/api/admin", authenticateToken, require("./routes/adminRoutes"));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB connected successfully");
  console.log("📊 Database:", mongoose.connection.name);
}).catch((err) => {
  console.log("❌ MongoDB connection error:", err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Backend URL: http://localhost:${PORT}`);
});
