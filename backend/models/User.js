import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  streak: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  vitals: [
    {
      heartRate: String,
      spo2: String,
      bp: String,
      temp: String,
      steps: String,
      timestamp: String,
    },
  ],
});

export default mongoose.model("User", userSchema);
