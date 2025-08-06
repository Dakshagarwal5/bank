const express = require("express");
const {
  addBankAccount,
  getUserBankAccounts,
  updateBankAccount,
  deleteBankAccount,
  getAllBankAccounts,
  searchBankAccounts,
} = require("../controllers/bankController");

const router = express.Router();

// All routes are protected by JWT middleware in server.js
router.post("/", addBankAccount);
router.get("/user", getUserBankAccounts);
router.put("/:id", updateBankAccount);
router.delete("/:id", deleteBankAccount);

// Admin routes
router.get("/all", getAllBankAccounts);
router.get("/search", searchBankAccounts);

module.exports = router;
