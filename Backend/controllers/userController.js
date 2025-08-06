const User = require("../models/user");

exports.syncUser = async (req, res) => {
  try {
    const { clerkId, email, username } = req.body;

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({ clerkId, email, username });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
