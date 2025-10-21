// frontend/src/pages/Rewards.jsx
import React, { useEffect, useState } from "react";

const GamifiedRewards = () => {
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStreak(data.streak || 0);
        setPoints(data.points || 0);
      } catch (err) {
        console.error("⚠️ Error loading progress:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const level = Math.floor(points / 100) + 1;
  const progress = points % 100;

  const badges = [
    { id: 1, name: "Getting Started", streak: 3, emoji: "🥉" },
    { id: 2, name: "Consistency Hero", streak: 7, emoji: "🥈" },
    { id: 3, name: "Wellness Warrior", streak: 14, emoji: "🥇" },
    { id: 4, name: "Health Champion", streak: 30, emoji: "🏆" },
  ];

  const earned = badges.filter(b => streak >= b.streak);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading your progress...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">🏅 Your Wellness Rewards</h1>

      {/* Level and Progress Bar */}
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center max-w-md mx-auto mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">🏋️ Level {level}</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-gray-500 text-sm">{progress}% to next level</p>
        <p className="mt-3 text-gray-700">🔥 Streak: <b>{streak} days</b> | ⭐ Points: <b>{points}</b></p>
      </div>

      {/* Badges */}
      <div className="flex justify-center flex-wrap gap-6">
        {earned.length ? (
          earned.map(b => (
            <div key={b.id} className="bg-white shadow-md rounded-xl p-5 w-60 text-center border border-green-200">
              <div className="text-5xl mb-2">{b.emoji}</div>
              <h3 className="text-lg font-semibold text-gray-700">{b.name}</h3>
              <p className="text-gray-500 text-sm">Unlocked at {b.streak}-day streak</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No badges yet. Keep tracking your vitals! 💪</p>
        )}
      </div>
    </div>
  );
};

export default GamifiedRewards;
