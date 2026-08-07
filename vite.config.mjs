// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  // This forces Vite to generate relative links so the Tizen file system can read them
  base: "./",

  build: {
    // Keeps your output targeting your Tizen 4.0 Chrome 56 environment
    target: "chrome56"  // Ensures output JS/CSS is fully compatible with Chromium 56
    , cssTarget: 'chrome56'
  }
});
