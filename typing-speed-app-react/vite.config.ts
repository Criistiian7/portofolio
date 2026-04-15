<<<<<<< HEAD
import { defineConfig } from "vitest/config";
=======
import { defineConfig } from "vite";
>>>>>>> 3984937 (fix(typing-speed-app-react): split vite and vitest config for Vercel build)
import react from "@vitejs/plugin-react";

// Keep this file Vite-only so `tsc -b` uses one Vite `Plugin` type (Vercel-safe).
// Vitest options live in `vitest.config.ts`.
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
=======
>>>>>>> 3984937 (fix(typing-speed-app-react): split vite and vitest config for Vercel build)
});
