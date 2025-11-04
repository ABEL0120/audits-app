/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // VitePWA config (per Ionic/VitePWA guidance). We add a navigation fallback so
    // SPA routes (e.g. /dashboard) serve index.html when offline. Keep devOptions
    // enabled for local testing only.
    VitePWA({
      registerType: "autoUpdate",
      // Enable the SW in dev for easier testing (only enable while developing).
      // Remove or set to false for production builds if you don't want a dev SW.
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Audits App",
        short_name: "Audits",
        description: "Auditorías - app",
        theme_color: "#071018",
        background_color: "#071018",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      // Workbox options: runtimeCaching stays the same; add navigateFallback
      // so SPA navigations return index.html (allowing offline navigation).
      workbox: {
        // --- AÑADE ESTA LÍNEA ---
        // Esto le dice a Workbox que precachee todos los archivos generados en la carpeta 'dist'.
        // Es la solución para que el "cascarón" de tu app (HTML, JS, CSS) funcione sin conexión.
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff,woff2}"],

        // Tu configuración existente está bien, la mantenemos.
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              try {
                return (
                  url.origin === self.location.origin &&
                  /\/api\/v1\/.*/.test(url.pathname) &&
                  !/auth\/login/.test(url.pathname)
                );
              } catch {
                return false;
              }
            },
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "api-cache",
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: /\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
    }),
  ],
  // Build tuning: split common vendor libraries into separate chunks to avoid
  // extremely large single bundles and reduce the chunk-size warnings.
  build: {
    // Raise the warning limit a bit (KB) — still prefer splitting, see manualChunks
    chunkSizeWarningLimit: 600,
    // Note: manualChunks removed temporarily to test source of 'Unknown input options' warning.
  },
  // Dev server proxy: forward /api to backend to avoid CORS and cross-origin fetch issues
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
