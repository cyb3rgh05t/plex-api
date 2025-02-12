import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3005,
  },
  preview: {
    host: true,
    port: 3005,
  },
  build: {
    outDir: "dist",
  },
});
