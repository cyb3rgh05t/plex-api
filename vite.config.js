import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Use environment variables with fallback defaults
    host: process.env.VITE_HOST || "0.0.0.0",
    port: parseInt(process.env.VITE_PORT || "3005"),

    // Handle host checking based on environment variables
    ...(process.env.VITE_DISABLE_HOST_CHECK === "true"
      ? {
          // Completely disable host checking
          host: "0.0.0.0",
          disableHostCheck: true,
        }
      : {}),

    // Allow specific hosts or all hosts
    ...(process.env.VITE_ALLOWED_HOSTS
      ? {
          allowedHosts:
            process.env.VITE_ALLOWED_HOSTS === "*"
              ? "all"
              : process.env.VITE_ALLOWED_HOSTS.split(","),
        }
      : {}),
    proxy: {
      "/api/plex": {
        target: "http://your-plex-server:32400",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/plex/, ""),
        secure: false,
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
      "/api/tautulli": {
        target: "http://your-tautulli-server:8181",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tautulli/, ""),
        secure: false,
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
});
