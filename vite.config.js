import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This allows all hosts
    port: 3005,
    strictPort: false,

    // This disables host checking completely
    ...(process.env.VITE_ALLOW_ALL_HOSTS === "true" && {
      host: "0.0.0.0",
      disableHostCheck: true,
    }),
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
