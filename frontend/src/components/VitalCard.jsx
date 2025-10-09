// frontend/src/components/VitalCard.jsx
import React from "react";

const VitalCard = ({ title, value, unit, statusColor }) => {
  return (
    <div className={`rounded-2xl shadow-md p-4 flex flex-col items-center w-48 border-l-4 ${statusColor}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}<span className="text-sm ml-1">{unit}</span></p>
    </div>
  );
};

export default VitalCard;
