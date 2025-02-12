import React from "react";

const ProgressBar = ({ progress }) => (
  <div className="mt-4 w-full bg-gray-700 rounded-full h-4">
    <div
      className="bg-blue-500 h-4 rounded-full transition-all duration-500"
      style={{ width: `${progress}%` }}
    />
  </div>
);

export default ProgressBar;
