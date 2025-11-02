import React, { useState } from "react";
import { useLocalStorage, setUserData } from "../hooks/useLocalStorage";

const LogVitals = () => {
  const [form, setForm] = useState({
    heartRate: "",
    spo2: "",
    bp: "",
    temp: "",
    steps: "",
  });

  const [vitals, setVitals] = useLocalStorage("vitals", []);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first!");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/vitals/log-vitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to log vitals");

      // ✅ Update user-specific vitals storage
      const newVitals = { ...form, timestamp: new Date().toLocaleString() };
      setVitals([...vitals, newVitals]);

      // ✅ Sync streak + points with user-specific keys
      setUserData("streak", data.newStreak);
      setUserData("points", data.totalPoints);

      alert(
        `✅ Vitals logged successfully!\n🔥 Streak: ${data.newStreak} days\n⭐ Total Points: ${data.totalPoints}`
      );

      setForm({ heartRate: "", spo2: "", bp: "", temp: "", steps: "" });
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          📝 Log Your Vitals
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              💓 Heart Rate (bpm)
            </label>
            <input
              type="number"
              name="heartRate"
              value={form.heartRate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., 72"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              🩸 SpO₂ (%)
            </label>
            <input
              type="number"
              name="spo2"
              value={form.spo2}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., 98"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              🩺 Blood Pressure (mmHg)
            </label>
            <input
              type="text"
              name="bp"
              value={form.bp}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., 120/80"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              🌡️ Temperature (°F)
            </label>
            <input
              type="number"
              step="0.1"
              name="temp"
              value={form.temp}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., 98.6"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              👟 Steps
            </label>
            <input
              type="number"
              name="steps"
              value={form.steps}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., 8000"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
          }`}
        >
          {loading ? "Saving..." : "💾 Save Vitals"}
        </button>
      </form>
    </div>
  );
};

export default LogVitals;