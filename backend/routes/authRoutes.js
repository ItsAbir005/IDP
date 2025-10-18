import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  console.log("📝 Register request received:", req.body);
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash });
    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log("🔐 Login request received:", req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log("✅ Login successful:", user.email);
    res.json({ token, name: user.name, email: user.email });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;