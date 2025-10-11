export const getBotReply = (msg, vitals = null) => {
  const text = msg.toLowerCase();

  // 🫀 Heart
  if (text.includes("heart")) {
    if (vitals?.heartRate > 120) return "Your heart rate is high. Try relaxing and deep breathing.";
    if (vitals?.heartRate < 50) return "Your heart rate is quite low. Ensure you’re hydrated and rested.";
    return "Your heart rate looks okay right now.";
  }

  // 🩸 SpO₂
  if (text.includes("spo2") || text.includes("oxygen")) {
    if (vitals?.spo2 < 95) return "Low SpO₂ detected. Try breathing exercises or check the sensor placement.";
    return "Your oxygen levels seem normal. Keep it up!";
  }

  // 🌡️ Temperature
  if (text.includes("fever") || text.includes("temperature")) {
    if (vitals?.temp > 100.4) return "You might have a fever. Stay hydrated and rest.";
    return "Your temperature is normal.";
  }

  // 🩺 BP
  if (text.includes("pressure") || text.includes("bp")) {
    if (!vitals?.bp) return "Please log your blood pressure first.";
    const [sys, dia] = vitals.bp.split("/").map(Number);
    if (sys > 140 || dia > 90) return "High blood pressure detected. Consider relaxation and low-salt diet.";
    return "Your BP seems stable.";
  }

  // 👣 General
  if (text.includes("steps") || text.includes("walk")) {
    return "Regular walking helps maintain a healthy heart. Aim for 8–10k steps per day!";
  }

  // 🤖 Default
  return "I’m here to help with your vitals. Try asking about heart rate, SpO₂, BP, or temperature.";
};
