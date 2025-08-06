const BankAccount = require("../models/BankAccount");
const User = require("../models/user");

// Utility to get or create a MongoDB user based on Clerk session
const getUserIdFromRequest = async (req) => {
  console.log("🔍 Full req object keys:", Object.keys(req));
  console.log("🔍 req.auth:", req.auth);
  console.log("🔍 req.user:", req.user); 
  console.log("🔍 req.headers:", req.headers);
  
  // Try different ways Clerk might attach user info
  const clerkUser = req.auth || req.user;

  if (!clerkUser) {
    console.error("❌ No Clerk user found in request");
    throw new Error("Unauthorized: No authentication data found");
  }

  const userId = clerkUser.userId || clerkUser.sub || clerkUser.id;
  
  if (!userId) {
    console.error("❌ No userId found in Clerk data:", clerkUser);
    throw new Error("Unauthorized: User ID not found");
  }

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    console.log("📝 Creating new user for clerkId:", userId);
    
    // Try to get email and username from different possible locations
    const email = clerkUser.email || 
                  clerkUser.emailAddress || 
                  clerkUser.primaryEmailAddress?.emailAddress ||
                  clerkUser.sessionClaims?.email || 
                  "noemail@clerk.com";
                  
    const username = clerkUser.username || 
                     clerkUser.firstName || 
                     clerkUser.sessionClaims?.username || 
                     email.split('@')[0];

    user = await User.create({
      clerkId: userId,
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
