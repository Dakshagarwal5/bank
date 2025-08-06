const mongoose = require("mongoose");

const bankAccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ifscCode: String,
  branchName: String,
  bankName: String,
  accountNumber: String,
  accountHolderName: String,
});

module.exports = mongoose.model("BankAccount", bankAccountSchema);
