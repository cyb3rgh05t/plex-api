import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3005,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 3005,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  envPrefix: "VITE_", // This ensures Vite picks up our env variables
});
