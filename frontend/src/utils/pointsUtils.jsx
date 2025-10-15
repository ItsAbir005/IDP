// frontend/src/utils/pointsUtils.js
import { getLocalStorage, setLocalStorage } from "./storageUtils";

export function calculatePoints(v) {
  let points = 0;
  if (v.heartRate >= 60 && v.heartRate <= 100) points += 20;
  if (v.spo2 >= 95) points += 20;
  if (v.temp >= 97 && v.temp <= 99) points += 20;
  if (v.bp === "120/80") points += 20;
  if (v.steps >= 5000) points += 20;
  return points;
}

export function updatePoints(earned) {
  const current = Number(getLocalStorage("points") || 0);
  const total = current + earned;
  setLocalStorage("points", total);
  return total;
}
