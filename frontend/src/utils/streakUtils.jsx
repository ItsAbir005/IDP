// frontend/src/utils/streakUtils.jsx
export function updateStreak() {
  const today = new Date().toDateString();
  const lastLogDate = localStorage.getItem("lastLogDate");
  const streak = parseInt(localStorage.getItem("streak") || "0");

  if (lastLogDate === today) return streak; // already logged today

  let newStreak = streak;
  if (lastLogDate && new Date(lastLogDate).getDate() + 1 === new Date().getDate()) {
    newStreak += 1; // consecutive day
  } else {
    newStreak = 1; // reset streak
  }

  localStorage.setItem("streak", newStreak);
  localStorage.setItem("lastLogDate", today);
  return newStreak;
}
