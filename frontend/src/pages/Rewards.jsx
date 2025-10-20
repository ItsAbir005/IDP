// frontend/src/pages/Rewards.jsx
import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const GamifiedRewards = () => {
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [prevLevel, setPrevLevel] = useState(1);

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem("streak") || 0);
    const savedPoints = parseInt(localStorage.getItem("points") || 0);
    setStreak(savedStreak);
    setPoints(savedPoints);
  }, []);

  const level = Math.floor(points / 100) + 1;
  const progress = points % 100;

  // 🎉 Confetti when level up
  useEffect(() => {
    if (level > prevLevel) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    setPrevLevel(level);
  }, [level]);

  // 🏅 Reward Badges
  const badges = [
    { id: 1, name: "Getting Started", streak: 3, emoji: "🥉" },
    { id: 2, name: "Consistency Hero", streak: 7, emoji: "🥈" },
    { id: 3, name: "Wellness Warrior", streak: 14, emoji: "🥇" },
    { id: 4, name: "Health Champion", streak: 30, emoji: "🏆" },
  ];
  const earnedBadges = badges.filter((b) => streak >= b.streak);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl text-center">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-4 text-gray-800">🎯 Your Health Journey</h1>
        <p className="text-gray-600 mb-2">
          🔥 Streak: <span className="font-bold text-blue-600">{streak} days</span>
        </p>
        <p className="text-gray-600 mb-6">
          ⭐ Points: <span className="font-bold text-green-600">{points}</span>
        </p>

        {/* Level Progress */}
        <h2 className="text-xl font-semibold text-gray-700 mb-3">🏋️ Level {level}</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-gray-500 text-sm mb-8">{progress}% to next level</p>

        {/* Earned Badges */}
        <h3 className="text-lg font-semibold text-gray-700 mb-3">🏅 Earned Badges</h3>
        {earnedBadges.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 text-yellow-800 rounded-2xl px-5 py-3 shadow-md transition transform hover:scale-105"
              >
                <div className="text-3xl mb-1">{badge.emoji}</div>
                <h4 className="text-sm font-semibold">{badge.name}</h4>
                <p className="text-xs text-gray-600">Unlocked at {badge.streak}-day streak</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-8">
            No badges yet — keep logging your vitals to unlock your first reward 🎯
          </p>
        )}

        {/* Motivation */}
        <div className="text-sm text-gray-600 italic">
          {streak >= 7
            ? "💪 You're crushing it! Keep your healthy streak going strong!"
            : "🌱 Every log builds a better you — stay consistent!"}
        </div>
      </div>
    </div>
  );
};

export default GamifiedRewards;
