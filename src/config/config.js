const config = {
  plexServerUrl: process.env.REACT_APP_PLEX_SERVER_URL,
  plexToken: process.env.REACT_APP_PLEX_TOKEN,
  refreshInterval: 15000, // 15 seconds
};

// Add validation
if (!config.plexServerUrl || !config.plexToken) {
  console.error(
    "Missing required environment variables. Please check your .env file."
  );
}

export default config;
