import React from "react";
import ProgressBar from "./ProgressBar";

const ActivityCard = ({ activity }) => (
  <div className="bg-gray-800 rounded-lg p-4 shadow-lg mb-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-white">
          {activity.subtitle || "Unnamed Download"}
        </h2>
        <p className="text-gray-400 text-sm">{activity.title}</p>
      </div>
      <div className="text-right">
        <span className="text-2xl font-bold text-blue-400">
          {activity.progress}%
        </span>
      </div>
    </div>
    <ProgressBar progress={activity.progress} />
  </div>
);

export default ActivityCard;
