//frontend/src/utils/vitalRules.jsx
export const checkAbnormalVitals = (vitals) => {
  const alerts = [];

  if (vitals.heartRate < 60 || vitals.heartRate > 100) {
    alerts.push(`⚠️ Abnormal Heart Rate: ${vitals.heartRate} bpm`);
  }

  if (vitals.spo2 < 95) {
    alerts.push(`🩸 Low SpO₂: ${vitals.spo2}%`);
  }

  const [systolic, diastolic] = vitals.bp.split("/").map(Number);
  if (systolic > 130 || diastolic > 85) {
    alerts.push(`💢 High Blood Pressure: ${vitals.bp} mmHg`);
  }

  if (vitals.temp > 99.5) {
    alerts.push(`🌡️ High Temperature: ${vitals.temp}°F`);
  } else if (vitals.temp < 95) {
    alerts.push(`🥶 Low Temperature: ${vitals.temp}°F`);
  }

  if (vitals.steps < 5000) {
    alerts.push(`🚶‍♂️ Low Activity Level: Only ${vitals.steps} steps today`);
  }

  return alerts;
};
