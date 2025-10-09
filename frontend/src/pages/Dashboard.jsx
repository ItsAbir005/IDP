// frontend/src/pages/Dashboard.jsx
import React from "react";
import VitalCard from "../components/VitalCard.jsx";

const Dashboard = () => {
  // Dummy vitals data
  const vitals = [
    { title: "Heart Rate", value: 78, unit: "bpm", statusColor: "border-green-500" },
    { title: "SpO₂", value: 96, unit: "%", statusColor: "border-green-500" },
    { title: "Blood Pressure", value: "120/80", unit: "mmHg", statusColor: "border-green-500" },
    { title: "Temperature", value: 98.6, unit: "°F", statusColor: "border-green-500" },
    { title: "Steps", value: 4500, unit: "steps", statusColor: "border-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Health Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {vitals.map((v, i) => (
          <VitalCard key={i} {...v} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
