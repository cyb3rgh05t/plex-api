import React, { useState } from "react";
import { useConfig } from "../../context/ConfigContext";
import { testPlexConnection } from "../../services/plexService";
import { testTautulliConnection } from "../../services/tautulliService";
import { logInfo, logError } from "../../utils/logger";
import toast from "react-hot-toast";

const SetupWizard = () => {
  const { updateConfig } = useConfig();
  const [formData, setFormData] = useState({
    plexUrl: "",
    plexToken: "",
    tautulliUrl: "",
    tautulliApiKey: "",
  });
  const [testing, setTesting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTesting(true);

    try {
      const loadingToast = toast.loading("Testing connections...");

      // Configure the proxy server first
      await fetch("http://localhost:3006/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plexUrl: formData.plexUrl,
          plexToken: formData.plexToken,
          tautulliUrl: formData.tautulliUrl,
          tautulliApiKey: formData.tautulliApiKey,
        }),
      });

      // Test connections
      await Promise.all([
        testPlexConnection(formData.plexUrl, formData.plexToken),
        testTautulliConnection(formData.tautulliUrl, formData.tautulliApiKey),
      ]);

      // Update local config if tests pass
      updateConfig(formData);

      toast.success("Setup completed successfully!", {
        id: loadingToast,
        duration: 3000,
      });

      logInfo("Setup completed successfully");
    } catch (err) {
      toast.error(err.message || "Setup failed. Please check your settings.", {
        duration: 4000,
      });
      logError("Setup failed", err);
    } finally {
      setTesting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Remove trailing slashes from URLs
    const formattedValue = name.includes("Url")
      ? value.replace(/\/$/, "")
      : value;
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">
          Setup Configuration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Plex Server URL</label>
            <input
              type="url"
              name="plexUrl"
              value={formData.plexUrl}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              placeholder="http://your-plex-server:32400"
              required
              disabled={testing}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Plex Token</label>
            <input
              type="password"
              name="plexToken"
              value={formData.plexToken}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              required
              disabled={testing}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Tautulli URL</label>
            <input
              type="url"
              name="tautulliUrl"
              value={formData.tautulliUrl}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              placeholder="http://your-tautulli-server:8181"
              required
              disabled={testing}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Tautulli API Key</label>
            <input
              type="password"
              name="tautulliApiKey"
              value={formData.tautulliApiKey}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              required
              disabled={testing}
            />
          </div>

          <button
            type="submit"
            disabled={testing}
            className={`w-full p-2 rounded text-white transition-colors ${
              testing
                ? "bg-blue-600/50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {testing ? "Testing Connection..." : "Save Configuration"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupWizard;
