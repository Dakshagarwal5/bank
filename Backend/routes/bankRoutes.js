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

const router = express.Router();

// Protect all routes below
router.post("/", ClerkExpressRequireAuth(), addBankAccount);
router.get("/user", ClerkExpressRequireAuth(), getUserBankAccounts);
router.put("/:id", ClerkExpressRequireAuth(), updateBankAccount);
router.delete("/:id", ClerkExpressRequireAuth(), deleteBankAccount);

// Admin routes (should be protected)
router.get("/all", ClerkExpressRequireAuth(), getAllBankAccounts);
router.get("/search", ClerkExpressRequireAuth(), searchBankAccounts);

module.exports = router;
