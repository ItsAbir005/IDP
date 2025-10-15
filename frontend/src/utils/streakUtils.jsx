// frontend/src/utils/streakUtils.js

import { getLocalStorage, setLocalStorage } from "./storageUtils";

export function updateStreak() {
  const today = new Date().toLocaleDateString();
  const lastLog = getLocalStorage("lastLogDate");
  let streak = Number(getLocalStorage("streak") || 0);

  if (!lastLog) {
    // first time logging
    streak = 1;
  } else {
    const lastDate = new Date(lastLog);
    const diffDays = Math.floor(
      (new Date(today) - lastDate) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      streak += 1; // consecutive day
    } else if (diffDays > 1) {
      streak = 1; // streak broken, restart
    }
  }

  setLocalStorage("streak", streak);
  setLocalStorage("lastLogDate", today);
  return streak;
}
