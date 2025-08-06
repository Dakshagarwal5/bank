const dotenv = require("dotenv");
dotenv.config(); // load env before anything else

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

const app = express();

app.use(cors());
app.use(express.json());
app.use(ClerkExpressWithAuth());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/banks", require("./routes/bankRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

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
