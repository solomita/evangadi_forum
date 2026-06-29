import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    // Must match the backend's CORS allow-list (FRONTEND_URL, default 5001).
    // strictPort makes Vite FAIL instead of silently bumping to 5002+, which
    // would then be blocked by CORS and surface as "Unable to connect to server".
    port: 5001,
    strictPort: true,
  },
  plugins: [react()],
});
