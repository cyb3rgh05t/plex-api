const config = {
  // Ensure we're using HTTP instead of HTTPS
  plexServerUrl: (process.env.REACT_APP_PLEX_SERVER_URL || "").replace(
    "https://",
    "http://"
  ),
  plexToken: process.env.REACT_APP_PLEX_TOKEN || "",
  refreshInterval: 15000, // 15 seconds
};

if (!config.plexServerUrl || !config.plexToken) {
  console.error("Missing Plex configuration:", {
    hasUrl: !!config.plexServerUrl,
    hasToken: !!config.plexToken,
    url: config.plexServerUrl ? "Set" : "Missing",
  });
}

export default config;
