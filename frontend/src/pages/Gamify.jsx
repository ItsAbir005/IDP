// frontend/src/pages/Gamify.jsx
import React from "react";

const Gamify = () => {
  const streak = parseInt(localStorage.getItem("streak") || 0);
  const points = parseInt(localStorage.getItem("points") || 0);

  const level = Math.floor(points / 100) + 1;
  const progress = points % 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col items-center justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-96 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">🎯 Health Progress</h1>
        <p className="text-gray-600 mb-2">🔥 Current Streak: <span className="font-bold text-blue-600">{streak} days</span></p>
        <p className="text-gray-600 mb-6">⭐ Total Points: <span className="font-bold text-green-600">{points}</span></p>

        <h2 className="text-xl font-semibold text-gray-700 mb-3">🏋️ Level {level}</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-gray-500 text-sm">{progress}% to next level</p>

        <div className="mt-6 text-sm text-gray-600 italic">
          {streak >= 7
            ? "You're building a healthy habit! Keep going 💪"
            : "Every small step counts toward a better you 🌱"}
        </div>
      </div>
    </div>
  );
};

export default Gamify;
