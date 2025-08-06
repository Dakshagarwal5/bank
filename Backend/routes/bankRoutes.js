const express = require("express");
const {
  addBankAccount,
  getUserBankAccounts,
  updateBankAccount,
  deleteBankAccount,
  getAllBankAccounts,
  searchBankAccounts,
} = require("../controllers/bankController");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const User = require("../models/user");

const router = express.Router();

// Middleware to create a default user for testing when not authenticated
const createDefaultUserMiddleware = async (req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    console.log("🔧 No authentication found, creating default user for testing...");
    
    // Create or find a default test user
    let defaultUser = await User.findOne({ clerkId: "default-test-user" });
    
    if (!defaultUser) {
      defaultUser = await User.create({
        clerkId: "default-test-user",
        email: "test@example.com",
        username: "Test User",
      });
      console.log("✅ Default test user created:", defaultUser);
    }
    
    // Mock the auth object
    req.auth = {
      userId: "default-test-user",
      sessionClaims: {
        email: "test@example.com",
        username: "Test User"
      }
    };
    
    console.log("✅ Using default test user for request");
  }
  next();
};

// Test route to check authentication
router.get("/test-auth", ClerkExpressRequireAuth(), (req, res) => {
  console.log("🧪 Test auth route hit");
  console.log("Auth object:", req.auth);
  res.json({ 
    message: "Authentication working!", 
    userId: req.auth?.userId,
    sessionClaims: req.auth?.sessionClaims 
  });
});

// Routes with fallback authentication for testing
router.post("/", createDefaultUserMiddleware, addBankAccount);
router.get("/user", createDefaultUserMiddleware, getUserBankAccounts);
router.put("/:id", createDefaultUserMiddleware, updateBankAccount);
router.delete("/:id", createDefaultUserMiddleware, deleteBankAccount);

// Admin routes (with fallback for testing)
router.get("/all", createDefaultUserMiddleware, getAllBankAccounts);
router.get("/search", createDefaultUserMiddleware, searchBankAccounts);

module.exports = router;
