// frontend/src/pages/LogVitals.jsx
import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { updateStreak } from "../utils/streakUtils";
import { calculatePoints, updatePoints } from "../utils/pointsUtils";

const LogVitals = () => {
  const [vitals, setVitals] = useLocalStorage("vitals", []);
  const [form, setForm] = useState({
    heartRate: "",
    spo2: "",
    bp: "",
    temp: "",
    steps: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  const timestamp = new Date().toLocaleString();
  const newVitals = { ...form, timestamp };

  setVitals([...vitals, newVitals]);
  window.dispatchEvent(new Event("storage"));

  // 🔥 Gamification logic
  const streak = updateStreak();
  const earnedPoints = calculatePoints(form);
  const totalPoints = updatePoints(earnedPoints);

  alert(`✅ Vitals logged! Streak: ${streak} days | +${earnedPoints} pts | Total: ${totalPoints} ⭐`);

  setForm({ heartRate: "", spo2: "", bp: "", temp: "", steps: "" });
};


  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl p-8 rounded-2xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Log Your Vitals</h2>

        {["heartRate", "spo2", "bp", "temp", "steps"].map((field) => (
          <div key={field} className="mb-3">
            <label className="block text-gray-600 capitalize mb-1">{field}</label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${field}`}
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          Save Vitals
        </button>
      </form>
    </div>
  );
};

export default LogVitals;
