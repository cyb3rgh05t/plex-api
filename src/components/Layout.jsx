import React from "react";

export const Layout = ({ children }) => {
  const appVersion = "v1.0.0";

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">
              Plex Activity Monitor
            </h1>
            <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">
              {appVersion}
            </span>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};
