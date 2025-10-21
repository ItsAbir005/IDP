import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

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

      // ✅ Update local vitals storage
      const newVitals = { ...form, timestamp: new Date().toLocaleString() };
      setVitals([...vitals, newVitals]);

      // ✅ Sync streak + points locally
      localStorage.setItem("streak", data.newStreak);
      localStorage.setItem("points", data.totalPoints);

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
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl p-8 rounded-2xl w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Log Your Vitals
        </h2>

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
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save Vitals"}
        </button>
      </form>
    </div>
  );
};

export default LogVitals;
