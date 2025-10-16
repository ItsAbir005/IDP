// frontend/src/pages/Rewards.jsx
import React from "react";

const Reward = () => {
  const streak = parseInt(localStorage.getItem("streak") || 0);
  const points = parseInt(localStorage.getItem("points") || 0);

  const badges = [
    { id: 1, name: "Getting Started", streak: 3, emoji: "🥉" },
    { id: 2, name: "Consistency Hero", streak: 7, emoji: "🥈" },
    { id: 3, name: "Wellness Warrior", streak: 14, emoji: "🥇" },
    { id: 4, name: "Health Champion", streak: 30, emoji: "🏆" },
  ];

  const earned = badges.filter(b => streak >= b.streak);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">🏅 Your Rewards</h1>

      <div className="flex justify-center gap-6 flex-wrap">
        {earned.length ? (
          earned.map(b => (
            <div
              key={b.id}
              className="bg-white shadow-lg rounded-2xl p-6 w-64 text-center border border-green-200 hover:shadow-xl transition"
            >
              <div className="text-5xl mb-3">{b.emoji}</div>
              <h2 className="text-xl font-semibold text-gray-700">{b.name}</h2>
              <p className="text-gray-500 text-sm">Unlocked at {b.streak}-day streak</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">
            No badges yet. Keep logging your vitals daily to earn rewards 🎯
          </p>
        )}
      </div>

      <div className="mt-10 text-center">
        <p className="text-lg text-gray-600">
          ⭐ Total Points: <span className="font-bold text-green-600">{points}</span>
        </p>
        <p className="text-lg text-gray-600">
          🔥 Current Streak: <span className="font-bold text-blue-600">{streak} days</span>
        </p>
      </div>
    </div>
  );
};

export default Reward;
