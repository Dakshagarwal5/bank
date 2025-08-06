const express = require("express");
const router = express.Router();
const bankController = require("../controllers/bankController");

router.get("/all", bankController.getAllBankAccounts);
router.get("/search", bankController.searchBankAccounts);

module.exports = router;
