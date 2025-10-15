import React, { useEffect, useState } from "react";
import VitalCard from "../components/VitalCard";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { checkAbnormalVitals } from "../utils/vitalRules";
import toast, { Toaster } from "react-hot-toast";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const Dashboard = () => {
  const [vitals] = useLocalStorage("vitals", []);
  const [data, setData] = useState([]);
  const streak = localStorage.getItem("streak") || 0;
  const points = localStorage.getItem("points") || 0;

  const latest = vitals.length ? vitals[vitals.length - 1] : null;

  // 🌟 Elegant Notifications for Abnormal Vitals
  useEffect(() => {
    if (latest) {
      const alerts = checkAbnormalVitals(latest);
      alerts.forEach(msg =>
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-sm w-full bg-white border-l-4 border-red-500 shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}
            >
              <div className="flex flex-col w-0 flex-1">
                <p className="text-sm font-semibold text-red-600 mb-1">⚠️ Health Alert</p>
                <p className="text-gray-700 text-sm">{msg}</p>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="ml-4 text-gray-400 hover:text-gray-600 transition"
              >
                ✖
              </button>
            </div>
          ),
          { duration: 5000 }
        )
      );
    }
  }, [latest]);

  // 📈 Prepare chart data
  useEffect(() => {
    setData(
      vitals.map((v, index) => ({
        name: `#${index + 1}`,
        heartRate: Number(v.heartRate),
        spo2: Number(v.spo2),
        temp: Number(v.temp),
      }))
    );
  }, [vitals]);

  if (!latest) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>No vitals logged yet. Go to “Log Vitals” to get started!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <h1 className="text-3xl font-bold mb-6 text-gray-700 text-center">🏥 Health Dashboard</h1>

      {/* Vital Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <VitalCard title="Heart Rate" value={latest.heartRate} unit="bpm" statusColor="border-green-500" />
        <VitalCard title="SpO₂" value={latest.spo2} unit="%" statusColor="border-green-500" />
        <VitalCard title="Blood Pressure" value={latest.bp} unit="mmHg" statusColor="border-green-500" />
        <VitalCard title="Temperature" value={latest.temp} unit="°F" statusColor="border-green-500" />
        <VitalCard title="Steps" value={latest.steps} unit="steps" statusColor="border-yellow-500" />
      </div>

      {/* Streak and Points */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="bg-white shadow p-4 rounded-xl text-center w-40">
          <h3 className="text-gray-600">🔥 Streak</h3>
          <p className="text-2xl font-bold text-blue-600">{streak} days</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl text-center w-40">
          <h3 className="text-gray-600">⭐ Points</h3>
          <p className="text-2xl font-bold text-green-600">{points}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">📈 Heart Rate & SpO₂ Trend</h2>
        {data.length > 1 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="spo2" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm text-center">Not enough data for trend chart yet</p>
        )}
      </div>

      <p className="mt-6 text-gray-500 text-sm text-center">
        Last updated: {latest.timestamp}
      </p>
    </div>
  );
};

export default Dashboard;
