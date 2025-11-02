import toast from "react-hot-toast";

let lastToastTime = 0;
const TOAST_COOLDOWN = 10000; // 10 seconds between toasts

export const showMotivationalToast = (streak, points) => {
  const now = Date.now();
  
  // ✅ Prevent showing toasts too frequently
  if (now - lastToastTime < TOAST_COOLDOWN) {
    return;
  }
  
  lastToastTime = now;
  
  // ✅ Show streak toast with unique ID
  if (streak >= 10) {
    toast.success(`🏆 Incredible! ${streak}-day streak — you're setting records!`, {
      id: 'streak-toast',
      duration: 3000,
    });
  } else if (streak >= 5) {
    toast(`🔥 ${streak}-day streak! You're on fire!`, { 
      icon: "💪",
      id: 'streak-toast',
      duration: 3000,
    });
  } else if (streak >= 3) {
    toast(`💫 ${streak}-day streak! Keep building the habit!`, { 
      icon: "✨",
      id: 'streak-toast',
      duration: 3000,
    });
  } else if (streak > 0) {
    toast(`🌱 New streak started! Let's grow stronger every day!`, { 
      icon: "🌟",
      id: 'streak-toast',
      duration: 3000,
    });
  }

  // ✅ Show points toast with unique ID (delayed)
  if (points > 0) {
    setTimeout(() => {
      toast.success(`⭐ You've earned ${points} total points — awesome work!`, {
        id: 'points-toast',
        duration: 3000,
      });
    }, 1000);
  }
};