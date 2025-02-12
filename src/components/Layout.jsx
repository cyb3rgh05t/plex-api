import React from "react";

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-white">
            Plex Activity Monitor
          </h1>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};
