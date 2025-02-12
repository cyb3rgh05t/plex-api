import React from "react";

function PlexActivity({ activity }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="mb-2">
        <h3 className="text-xl font-semibold text-gray-100">
          {activity.subtitle}
        </h3>
        <p className="text-gray-400 text-sm">{activity.title}</p>
      </div>

      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-900 text-blue-300">
              {activity.type}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-300">
              {activity.progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
          <div
            style={{ width: `${activity.progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

export default PlexActivity;
