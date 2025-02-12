const config = {
  plexServerUrl: process.env.REACT_APP_PLEX_SERVER_URL || "",
  plexToken: process.env.REACT_APP_PLEX_TOKEN || "",
  refreshInterval: 15000, // 15 seconds
};

if (!config.plexServerUrl || !config.plexToken) {
  console.error("Missing Plex configuration:", {
    hasUrl: !!config.plexServerUrl,
    hasToken: !!config.plexToken,
    url: config.plexServerUrl ? "Set" : "Missing",
    envVars: process.env,
  });
}

export default config;
