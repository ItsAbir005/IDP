import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import TrendChart from "../components/TrendChart";

const History = () => {
  const [vitals] = useLocalStorage("vitals", []);

  if (!vitals.length)
    return <p className="text-center text-gray-500 mt-10">No data available yet.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Health History</h1>

      <TrendChart data={vitals} dataKey="heartRate" color="#ef4444" title="Heart Rate Over Time" />
      <TrendChart data={vitals} dataKey="spo2" color="#3b82f6" title="SpO₂ Level Over Time" />
      <TrendChart data={vitals} dataKey="temp" color="#f97316" title="Temperature Trend" />
      <TrendChart data={vitals} dataKey="steps" color="#10b981" title="Steps Activity Trend" />
    </div>
  );
};

export default History;
