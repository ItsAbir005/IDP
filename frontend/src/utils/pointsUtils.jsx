// frontend/src/utils/pointsUtils.jsx
export function calculatePoints(vital) {
  let points = 10; // base for logging
  if (vital.heartRate >= 60 && vital.heartRate <= 100) points += 5;
  if (vital.spo2 >= 95) points += 5;
  if (vital.temp >= 97 && vital.temp <= 99) points += 5;
  if (vital.steps > 5000) points += 10;
  return points;
}

export function updatePoints(newPoints) {
  const total = parseInt(localStorage.getItem("points") || "0") + newPoints;
  localStorage.setItem("points", total);
  return total;
}
