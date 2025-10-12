//frontend/src/components/VitalCard.jsx
import React from "react";

const VitalCard = ({ title, value, unit, statusColor }) => {
  return (
    <div
      className={`border-l-4 ${statusColor} bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition`}
    >
      <h3 className="text-gray-600 font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-1">
        {value} <span className="text-sm text-gray-500">{unit}</span>
      </p>
    </div>
  );
};

export default VitalCard;
