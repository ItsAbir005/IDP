import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Save vitals
router.post("/", auth, async (req, res) => {
  const { heartRate, spo2, bp, temp, steps } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const newVitals = { heartRate, spo2, bp, temp, steps, timestamp: new Date().toISOString() };
  user.vitals.push(newVitals);
  await user.save();
  res.json({ message: "Vitals saved successfully", vitals: newVitals });
});

// Get latest vitals
router.get("/latest", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || user.vitals.length === 0)
    return res.json({ message: "No vitals found" });

  const latest = user.vitals[user.vitals.length - 1];
  res.json(latest);
});

export default router;
