// vite.config.js
import { defineConfig } from "vite";
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  // This forces Vite to generate relative links so the Tizen file system can read them
  base: "./",

  build: {
    // Keeps your output targeting your Tizen 4.0 Chrome 56 environment
    target: "chrome56",  // Ensures output JS/CSS is fully compatible with Chromium 56
    cssTarget: 'chrome56'
  },
  server: {
    host: true,
    watch: {
      usePolling: true, // Helpful if editing across Docker/VM mount boundaries
      interval: 100,
    },
  },
  plugins: [
    legacy({
      targets: ['chrome < 60'], // Compiles code for Chrome 56 / Tizen 4
      renderModernChunks: false,
    }),
    {
      name: 'watch-external',
      handleHotUpdate({ server }) {
        // Force full browser reload on any file change
        server.ws.send({ type: 'full-reload' });
      },
    },
  ]
});
