import React from "react";
import { FaGithub } from "react-icons/fa";

export const Layout = ({ children }) => {
  const appVersion = "v1.0.0";
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">
                Plex Activity Monitor
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">
                {appVersion}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/cyb3rgh05t/plex-api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="View on GitHub"
              >
                <FaGithub size={24} />
              </a>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="py-6">{children}</div>
      </main>
      <footer className="bg-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="text-center text-gray-400 text-sm">
            Created by{" "}
            <a
              href="https://github.com/cyb3rgh05t"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              cyb3rgh05t
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
