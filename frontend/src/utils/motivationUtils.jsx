import toast from "react-hot-toast";

export const showMotivationalToast = (streak, points) => {
  if (streak >= 10) {
    toast.success(`🏆 Incredible! ${streak}-day streak — you’re setting records!`);
  } else if (streak >= 5) {
    toast(`🔥 ${streak}-day streak! You’re on fire!`, { icon: "💪" });
  } else if (streak >= 3) {
    toast(`💫 ${streak}-day streak! Keep building the habit!`, { icon: "✨" });
  } else if (streak > 0) {
    toast(`🌱 New streak started! Let’s grow stronger every day!`, { icon: "🌟" });
  }

  if (points > 0) {
    toast.success(`⭐ You’ve earned ${points} total points — awesome work!`);
  }
};
