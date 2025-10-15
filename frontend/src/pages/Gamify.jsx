// frontend/src/pages/Gamify.jsx
import React, { useEffect, useState } from "react";
import { getLocalStorage } from "../utils/storageUtils";

const Gamify = () => {
  const [latestVitals, setLatestVitals] = useState(null);
  const [challenge, setChallenge] = useState("");

  useEffect(() => {
    const vitals = JSON.parse(localStorage.getItem("vitals")) || [];
    if (vitals.length > 0) setLatestVitals(vitals[vitals.length - 1]);
  }, []);

  useEffect(() => {
    if (!latestVitals) return;

    const { heartRate, spo2, steps, temp } = latestVitals;
    let msg = "";

    if (steps < 5000) msg = "🚶 Walk 5000+ steps today to boost stamina!";
    else if (heartRate > 100) msg = "🧘 Try deep breathing — your heart rate seems high.";
    else if (spo2 < 95) msg = "💨 Spend time in fresh air to improve oxygen levels.";
    else if (temp > 99) msg = "🌡️ Rest and hydrate — your body temperature seems elevated.";
    else msg = "🌟 Great job! Maintain your healthy routine today.";

    setChallenge(msg);
  }, [latestVitals]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">🎮 Daily Health Challenge</h1>

      <div className="bg-white shadow-xl rounded-2xl p-8 w-96 text-center">
        {latestVitals ? (
          <>
            <p className="text-gray-600 mb-3">Your latest vitals are logged.</p>
            <p className="text-lg font-semibold text-blue-600">{challenge}</p>
          </>
        ) : (
          <p className="text-gray-500">Please log your vitals first 🩺</p>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        Complete your challenge and earn bonus points tomorrow! 💫
      </div>
    </div>
  );
};

export default Gamify;
