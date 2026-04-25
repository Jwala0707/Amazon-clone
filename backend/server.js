require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Mock payment route — no Stripe needed
app.post("/payment", (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  // Simulate a successful payment intent
  res.json({
    clientSecret: `mock_secret_${Date.now()}`,
    amount,
    currency: "inr",
    status: "succeeded",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
