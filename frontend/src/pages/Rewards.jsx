// frontend/src/pages/Rewards.jsx
import React, { useEffect, useState } from "react";
import { getLocalStorage } from "../utils/storageUtils";

const Rewards = () => {
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const s = Number(getLocalStorage("streak") || 0);
    const p = Number(getLocalStorage("points") || 0);
    setStreak(s);
    setPoints(p);

    // Determine badges dynamically
    const earned = [];
    if (s >= 3) earned.push("🔥 3-Day Consistency");
    if (s >= 7) earned.push("🏅 Weekly Warrior");
    if (p >= 100) earned.push("💪 Health Hero");
    if (p >= 300) earned.push("🌟 Wellness Champion");
    setBadges(earned);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">🏆 Your Health Rewards</h1>

      <div className="bg-white shadow-xl rounded-2xl p-8 w-96 text-center">
        <p className="text-lg text-gray-600 mb-2">🔥 Current Streak</p>
        <p className="text-4xl font-bold text-blue-600 mb-4">{streak} days</p>

        <p className="text-lg text-gray-600 mb-2">⭐ Total Points</p>
        <p className="text-4xl font-bold text-yellow-500 mb-6">{points}</p>

        <h2 className="text-lg font-semibold text-gray-700 mb-2">🎖 Earned Badges</h2>
        {badges.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2">
            {badges.map((b, i) => (
              <span
                key={i}
                className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm"
              >
                {b}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No badges yet — keep going! 💪</p>
        )}
      </div>
    </div>
  );
};

export default Rewards;
