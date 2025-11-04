import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  streak: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  lastLogDate: { type: String }, // Store date as YYYY-MM-DD string
  vitals: [
    {
      heartRate: String,
      spo2: String,
      bp: String,
      temp: String,
      steps: String,
      timestamp: { type: Date, default: Date.now }, // Store as Date object
    },
  ],
}, {
  timestamps: true // Auto-add createdAt and updatedAt
});

// ✅ Method to check if user logged today
userSchema.methods.hasLoggedToday = function() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return this.lastLogDate === today;
};

// ✅ Method to update streak
userSchema.methods.updateStreak = function() {
  const today = new Date().toISOString().split('T')[0];
  
  if (!this.lastLogDate) {
    // First log ever
    this.streak = 1;
  } else if (this.lastLogDate === today) {
    // Already logged today - no change
    return this.streak;
  } else {
    // Calculate day difference
    const lastDate = new Date(this.lastLogDate);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate - lastDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day
      this.streak += 1;
    } else {
      // Streak broken
      this.streak = 1;
    }
  }
  
  this.lastLogDate = today;
  return this.streak;
};

export default mongoose.model("User", userSchema);