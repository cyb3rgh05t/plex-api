import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-white">Loading Dashboard</h2>
        <p className="text-gray-400 mt-2">
          Please wait while we connect to your services...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
