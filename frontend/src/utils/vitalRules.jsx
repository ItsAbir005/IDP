export const checkAbnormalVitals = (vitals) => {
  const alerts = [];

  if (!vitals) return alerts;

  const { heartRate, spo2, bp, temp } = vitals;

  // Convert numeric values safely
  const hr = Number(heartRate);
  const sp = Number(spo2);
  const tp = Number(temp);

  if (hr > 120) alerts.push("High Heart Rate detected (>120 bpm)");
  else if (hr < 50) alerts.push("Low Heart Rate detected (<50 bpm)");

  if (sp < 95) alerts.push("Low SpO₂ detected (<95%)");

  const [sys, dia] = bp.split("/").map(Number);
  if (sys > 140 || dia > 90) alerts.push("High Blood Pressure detected");
  else if (sys < 90 || dia < 60) alerts.push("Low Blood Pressure detected");

  if (tp > 100.4) alerts.push("High Body Temperature detected (>100.4°F)");
  else if (tp < 95) alerts.push("Low Body Temperature detected (<95°F)");

  return alerts;
};
