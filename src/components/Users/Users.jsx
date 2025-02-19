import React, { useState, useEffect } from "react";
import { useConfig } from "../../context/ConfigContext";
import { logError } from "../../utils/logger";

const Users = () => {
  const { config } = useConfig();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAllUsers = async () => {
    if (!config.tautulliApiKey) return;

    try {
      let allUsers = [];
      let start = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(
          `http://localhost:3006/api/tautulli/api/v2?apikey=${config.tautulliApiKey}&cmd=get_users_table&start=${start}`
        );
        const data = await response.json();

        if (data?.response?.result !== "success") {
          throw new Error("Failed to fetch users data");
        }

        const users = data.response.data.data;
        if (!users || users.length === 0) {
          hasMore = false;
        } else {
          allUsers = [...allUsers, ...users];
          start += 25;
        }
      }

      // Filter out 'Local' users and sort by last_played
      const filteredAndSortedUsers = allUsers
        .filter((user) => user.friendly_name !== "Local")
        .sort((a, b) => {
          if (!a.last_played && !b.last_played) return 0;
          if (!a.last_played) return 1;
          if (!b.last_played) return -1;
          return b.last_played - a.last_played;
        });

      setUsers(filteredAndSortedUsers);
    } catch (err) {
      setError("Failed to load users. Please try again later.");
      logError("Error fetching users:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllUsers();
  };

  useEffect(() => {
    fetchAllUsers();
  }, [config.tautulliApiKey]);

  if (loading) {
    return (
      <div className="w-full p-4">
        <div className="animate-pulse">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800/50 h-16 mb-4 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Plex Users</h2>
          <div className="mt-2 bg-gray-800 rounded-lg px-4 py-2 inline-block">
            <span className="text-gray-400">Total Users: </span>
            <span className="text-blue-400 font-semibold">{users.length}</span>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-medium 
            hover:bg-blue-700 transition-colors flex items-center gap-2
            ${isRefreshing ? "opacity-90 cursor-not-allowed" : ""}`}
        >
          {isRefreshing && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {isRefreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-right">Plays</th>
              <th className="px-4 py-3 text-right">Duration</th>
              <th className="px-4 py-3 text-left">Last Seen</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 font-medium">{user.friendly_name}</td>
                <td className="px-4 py-3 text-gray-300">
                  {user.email || "N/A"}
                </td>
                <td className="px-4 py-3 text-right">
                  {user.plays.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {Math.round(user.duration / 3600)} hrs
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {user.last_seen
                    ? new Date(user.last_seen * 1000).toLocaleString()
                    : "Never"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.is_active
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
