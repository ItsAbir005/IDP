// frontend/src/utils/gamify.js

// ✅ Calculate health score based on vitals
export function calculateHealthScore(v) {
  let score = 0;

  if (v.heartRate >= 60 && v.heartRate <= 100) score += 20;
  if (v.spo2 >= 95) score += 20;
  if (v.temp >= 97 && v.temp <= 99) score += 20;
  if (v.steps >= 5000) score += 20;
  if (v.bp === "120/80") score += 20;

  return score;
}

// ✅ Convert total points into a level name
export function getLevel(points) {
  if (points < 100) return "Beginner";
  if (points < 200) return "Active";
  if (points < 300) return "Fit Champ";
  return "Health Hero";
}

// ✅ Award badges
export function getBadges(v) {
  const badges = [];
  if (v.heartRate >= 60 && v.heartRate <= 100) badges.push("🏅 Steady Heart");
  if (v.steps >= 10000) badges.push("🚶 Walker");
  if (
    v.heartRate >= 60 &&
    v.heartRate <= 100 &&
    v.spo2 >= 95 &&
    v.temp >= 97 &&
    v.temp <= 99
  ) {
    badges.push("💧 Wellness Wizard");
  }
  return badges;
}
