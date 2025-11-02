// frontend/src/pages/Rewards.jsx
import React, { useEffect, useState } from "react";
import { getUserData, setUserData } from "../hooks/useLocalStorage";

const GamifiedRewards = () => {
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login first!");
          setLoading(false);
          return;
        }

        // ✅ Try to fetch from backend first
        const res = await fetch("http://localhost:5000/api/user/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setStreak(data.streak || 0);
          setPoints(data.points || 0);
          
          // ✅ Sync with user-specific localStorage
          setUserData("streak", data.streak || 0);
          setUserData("points", data.points || 0);
        } else {
          // ✅ Fallback to localStorage
          const localStreak = getUserData("streak") || 0;
          const localPoints = getUserData("points") || 0;
          setStreak(localStreak);
          setPoints(localPoints);
        }
      } catch (err) {
        console.error("⚠️ Error loading progress:", err);
        
        // ✅ Fallback to user-specific localStorage
        const localStreak = getUserData("streak") || 0;
        const localPoints = getUserData("points") || 0;
        setStreak(localStreak);
        setPoints(localPoints);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgress();
  }, []);

  const level = Math.floor(points / 100) + 1;
  const progress = points % 100;

  const badges = [
    { id: 1, name: "Getting Started", streak: 3, emoji: "🥉", desc: "Log vitals for 3 consecutive days" },
    { id: 2, name: "Consistency Hero", streak: 7, emoji: "🥈", desc: "Maintain a 7-day streak" },
    { id: 3, name: "Wellness Warrior", streak: 14, emoji: "🥇", desc: "Achieve a 14-day streak" },
    { id: 4, name: "Health Champion", streak: 30, emoji: "🏆", desc: "Master a 30-day streak" },
  ];

  const earned = badges.filter((b) => streak >= b.streak);
  const nextBadge = badges.find((b) => streak < b.streak);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          🏅 Your Wellness Rewards
        </h1>

        {/* Level and Progress Bar */}
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            🏋️ Level {level}
          </h2>
          
          <div className="w-full bg-gray-200 rounded-full h-6 mb-4 relative overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              {progress > 20 && (
                <span className="text-xs font-bold text-white">
                  {progress}%
                </span>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            {100 - progress} points to reach Level {level + 1}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mt-6">
            <div className="flex items-center justify-center gap-2 bg-orange-50 p-4 rounded-lg">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="text-sm text-gray-500">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600">{streak} days</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 bg-yellow-50 p-4 rounded-lg">
              <span className="text-3xl">⭐</span>
              <div>
                <p className="text-sm text-gray-500">Total Points</p>
                <p className="text-2xl font-bold text-yellow-600">{points}</p>
              </div>
            </div>
          </div>

          {/* Next Badge Progress */}
          {nextBadge && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                🎯 Next Badge: <strong>{nextBadge.name}</strong>
              </p>
              <p className="text-xs text-gray-500">
                {nextBadge.streak - streak} more day{nextBadge.streak - streak !== 1 ? 's' : ''} to unlock!
              </p>
            </div>
          )}
        </div>

        {/* Earned Badges */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            🎖️ Earned Badges ({earned.length}/{badges.length})
          </h2>
          
          {earned.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {earned.map((b) => (
                <div
                  key={b.id}
                  className="bg-white shadow-lg rounded-xl p-6 text-center border-2 border-green-400 hover:border-green-500 transition transform hover:scale-105 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ✓ Earned
                  </div>
                  <div className="text-6xl mb-3 animate-bounce">{b.emoji}</div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {b.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">{b.desc}</p>
                  <p className="text-green-600 text-xs font-semibold">
                    Earned at {b.streak}-day streak
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-xl text-gray-700 mb-2 font-semibold">
                Start Your Journey!
              </p>
              <p className="text-gray-500 mb-4">
                Log your vitals for 3 consecutive days to earn your first badge!
              </p>
              <div className="inline-block bg-blue-100 px-6 py-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Log vitals daily to build your streak!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Locked Badges */}
        {earned.length < badges.length && (
          <div>
            <h3 className="text-lg font-semibold text-gray-600 mb-4 text-center">
              🔒 Upcoming Badges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges
                .filter((b) => streak < b.streak)
                .map((b) => (
                  <div
                    key={b.id}
                    className="bg-gray-50 shadow rounded-xl p-6 text-center border-2 border-dashed border-gray-300 relative"
                  >
                    <div className="absolute top-2 right-2 bg-gray-400 text-white text-xs px-2 py-1 rounded-full">
                      🔒 Locked
                    </div>
                    <div className="text-6xl mb-3 opacity-30 filter grayscale">
                      {b.emoji}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">
                      {b.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">{b.desc}</p>
                    <p className="text-blue-600 text-xs font-semibold">
                      {b.streak - streak} more days needed
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className="mt-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 text-center shadow-lg">
          <p className="text-lg font-semibold text-gray-700 mb-2">
            {streak >= 30 
              ? "🏆 You're a Health Champion! Keep up the amazing work!"
              : streak >= 14
              ? "💪 You're a Wellness Warrior! Keep building those healthy habits!"
              : streak >= 7
              ? "🔥 Great consistency! You're halfway to the next badge!"
              : streak >= 3
              ? "⭐ Awesome start! Keep going to unlock more badges!"
              : "🌟 Every great journey starts with a single step. Log your vitals today!"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default GamifiedRewards;