const BankAccount = require("../models/BankAccount");
const User = require("../models/user");

// Utility to get or create a MongoDB user based on Clerk session
const getUserIdFromRequest = async (req) => {
  console.log("🔍 Getting user from request...");
  console.log("Auth object:", req.auth);
  
  const clerkUser = req.auth;

  if (!clerkUser || !clerkUser.userId) {
    console.error("❌ No Clerk user found in request");
    throw new Error("Unauthorized: Clerk user not found");
  }

  console.log("✅ Clerk user ID:", clerkUser.userId);

  let user = await User.findOne({ clerkId: clerkUser.userId });

  if (!user) {
    console.log("👤 Creating new user in database...");
    const sessionClaims = clerkUser.sessionClaims || {};
    const email = sessionClaims.email || "noemail@clerk.com";
    const username = sessionClaims.username || email;

    user = await User.create({
      clerkId: clerkUser.userId,
      email,
      username,
    });
    console.log("✅ User created:", user);
  } else {
    console.log("✅ User found:", user);
  }

  return user;
};

// ------------------ USER ROUTES ------------------

// Create a new bank account
exports.addBankAccount = async (req, res) => {
  try {
    console.log("📝 Adding new bank account...");
    const user = await getUserIdFromRequest(req);

    const bankAccount = new BankAccount({
      ...req.body,
      user: user._id,
    });

    await bankAccount.save();
    console.log("✅ Bank account saved:", bankAccount);
    res.status(201).json(bankAccount);
  } catch (err) {
    console.error("❌ Error adding bank account:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all bank accounts for the logged-in user
exports.getUserBankAccounts = async (req, res) => {
  try {
    console.log("📋 Fetching user bank accounts...");
    const user = await getUserIdFromRequest(req);
    
    const accounts = await BankAccount.find({ user: user._id });
    console.log(`✅ Found ${accounts.length} accounts for user`);
    res.status(200).json(accounts);
  } catch (error) {
    console.error("❌ Error in getUserBankAccounts:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Update a bank account
exports.updateBankAccount = async (req, res) => {
  try {
    console.log("✏️ Updating bank account:", req.params.id);
    const updated = await BankAccount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log("✅ Bank account updated:", updated);
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating bank account:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a bank account
exports.deleteBankAccount = async (req, res) => {
  try {
    console.log("🗑️ Deleting bank account:", req.params.id);
    await BankAccount.findByIdAndDelete(req.params.id);
    console.log("✅ Bank account deleted");
    res.json({ message: "Bank account deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting bank account:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------ ADMIN ROUTES ------------------

// Get all bank accounts (admin only)
exports.getAllBankAccounts = async (req, res) => {
  try {
    console.log("👨‍💼 Admin: Fetching all bank accounts...");
    const accounts = await BankAccount.find().populate("user");
    console.log(`✅ Found ${accounts.length} total accounts`);
    res.json(accounts);
  } catch (err) {
    console.error("❌ Error fetching all bank accounts:", err);
    res.status(500).json({ error: err.message });
  }
};

// Search bank accounts by bankName or IFSC (admin only)
exports.searchBankAccounts = async (req, res) => {
  try {
    console.log("🔍 Admin: Searching bank accounts with query:", req.query.query);
    const { query } = req.query;

    const accounts = await BankAccount.find({
      $or: [
        { bankName: { $regex: query, $options: "i" } },
        { ifscCode: { $regex: query, $options: "i" } },
      ],
    }).populate("user");

    console.log(`✅ Found ${accounts.length} matching accounts`);
    res.json(accounts);
  } catch (err) {
    console.error("❌ Error searching bank accounts:", err);
    res.status(500).json({ error: err.message });
  }
};
