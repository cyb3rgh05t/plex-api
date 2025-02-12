import React from "react";
import { useFormat } from "../context/FormatContext";

export const ActivityCard = ({ activity }) => {
  const { format } = useFormat();

  const formatOutput = (format, activity) => {
    let output = format;
    Object.keys(activity).forEach((key) => {
      const regex = new RegExp(`{${key}}`, "g");
      output = output.replace(regex, activity[key]);
    });
    return output;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4 shadow-lg">
      <div className="space-y-2">
        {/* Original Plex Output */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {activity.subtitle}
            </h3>
            <p className="text-gray-400 text-sm">{activity.title}</p>
          </div>
          <span className="text-sm font-medium text-white">
            {activity.progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${activity.progress}%` }}
          />
        </div>

        {/* Custom Format Output */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-sm text-gray-400">Custom Format:</p>
          <p className="text-white">{formatOutput(format, activity)}</p>
        </div>
      </div>
    </div>
  );
};
