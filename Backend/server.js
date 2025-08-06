const dotenv = require("dotenv");
dotenv.config(); // load env before anything else

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));
app.use(ClerkExpressWithAuth());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/banks", require("./routes/bankRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
