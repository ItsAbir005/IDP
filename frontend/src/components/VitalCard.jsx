//frontend/src/components/VitalCard.jsx
import React from "react";

const getColor = (title, value) => {
  const num = Number(value);
  if (title === "Heart Rate") return num > 120 || num < 50 ? "border-red-500" : "border-green-500";
  if (title === "SpO₂") return num < 95 ? "border-red-500" : "border-green-500";
  if (title === "Temperature") return num > 100.4 ? "border-red-500" : "border-green-500";
  if (title === "Blood Pressure") {
    const [sys, dia] = value.split("/").map(Number);
    return sys > 140 || dia > 90 ? "border-red-500" : "border-green-500";
  }
  return "border-yellow-500";
};

const VitalCard = ({ title, value, unit }) => {
  const color = getColor(title, value);

  return (
    <div className={`p-4 border-4 ${color} rounded-2xl shadow-md text-center`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value} <span className="text-gray-500 text-sm">{unit}</span></p>
    </div>
  );
};

export default VitalCard;
