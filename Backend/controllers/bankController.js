const BankAccount = require("../models/BankAccount");
const User = require("../models/user");

// Utility to get or create a MongoDB user based on Clerk session
const getUserIdFromRequest = async (req) => {
  const clerkUser = req.auth;

  if (!clerkUser || !clerkUser.userId) {
    throw new Error("Unauthorized: Clerk user not found");
  }

  let user = await User.findOne({ clerkId: clerkUser.userId });

  if (!user) {
    const sessionClaims = clerkUser.sessionClaims || {};
    const email = sessionClaims.email || "noemail@clerk.com";
    const username = sessionClaims.username || email;

    user = await User.create({
      clerkId: clerkUser.userId,
      email,
      username,
    });
  }

  return user;
};

// ------------------ USER ROUTES ------------------

// Create a new bank account
exports.addBankAccount = async (req, res) => {
  try {
    const user = await getUserIdFromRequest(req);

    const bankAccount = new BankAccount({
      ...req.body,
      user: user._id,
    });

    await bankAccount.save();
    res.status(201).json(bankAccount);
  } catch (err) {
    console.error("Error adding bank account:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all bank accounts for the logged-in user
exports.getUserBankAccounts = async (req, res) => {
  try {
    const user = await getUserIdFromRequest(req);
    
    const accounts = await BankAccount.find({ user: user._id });
    res.status(200).json(accounts);
  } catch (error) {
    console.error("❌ Error in getUserBankAccounts:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Update a bank account
exports.updateBankAccount = async (req, res) => {
  try {
    const updated = await BankAccount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error("Error updating bank account:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a bank account
exports.deleteBankAccount = async (req, res) => {
  try {
    await BankAccount.findByIdAndDelete(req.params.id);
    res.json({ message: "Bank account deleted successfully" });
  } catch (err) {
    console.error("Error deleting bank account:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------ ADMIN ROUTES ------------------

// Get all bank accounts (admin only)
exports.getAllBankAccounts = async (req, res) => {
  try {
    const accounts = await BankAccount.find().populate("user");
    res.json(accounts);
  } catch (err) {
    console.error("Error fetching all bank accounts:", err);
    res.status(500).json({ error: err.message });
  }
};

// Search bank accounts by bankName or IFSC (admin only)
exports.searchBankAccounts = async (req, res) => {
  try {
    const { query } = req.query;

    const accounts = await BankAccount.find({
      $or: [
        { bankName: { $regex: query, $options: "i" } },
        { ifscCode: { $regex: query, $options: "i" } },
      ],
    }).populate("user");

    res.json(accounts);
  } catch (err) {
    console.error("Error searching bank accounts:", err);
    res.status(500).json({ error: err.message });
  }
};
