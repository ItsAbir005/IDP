import React, { useEffect } from "react";
import VitalCard from "../components/VitalCard";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { checkAbnormalVitals } from "../utils/vitalRules";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const [vitals] = useLocalStorage("vitals", []);
  const latest = vitals.length ? vitals[vitals.length - 1] : null;

  useEffect(() => {
    if (latest) {
      const alerts = checkAbnormalVitals(latest);
      alerts.forEach(msg => toast.error(msg, { duration: 4000 }));
    }
  }, [latest]);

  if (!latest) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>No vitals logged yet. Go to “Log Vitals” to get started!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Health Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <VitalCard title="Heart Rate" value={latest.heartRate} unit="bpm" statusColor="border-green-500" />
        <VitalCard title="SpO₂" value={latest.spo2} unit="%" statusColor="border-green-500" />
        <VitalCard title="Blood Pressure" value={latest.bp} unit="mmHg" statusColor="border-green-500" />
        <VitalCard title="Temperature" value={latest.temp} unit="°F" statusColor="border-green-500" />
        <VitalCard title="Steps" value={latest.steps} unit="steps" statusColor="border-yellow-500" />
      </div>

      <p className="mt-6 text-gray-500 text-sm">Last updated: {latest.timestamp}</p>
    </div>
  );
};

export default Dashboard;
