/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
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
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              console.log(`[SW Spy] Checking URL: ${url.pathname}`);
              return url.pathname.includes("/api/v1/audits");
            },
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "api-audits-cache", 
              cacheableResponse: {
                statuses: [0, 200],
              },
              plugins: [
                {
                  cacheDidUpdate: async ({
                    cacheName,
                    request,
                    newResponse,
                  }) => {
                    if (newResponse) {
                      console.log(
                        `%c[SW SUCCESS] Cache updated for: ${request.url}`,
                        "color: #28a745; font-weight: bold;"
                      );
                    }
                  },
                },
              ],
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
  build: {
    chunkSizeWarningLimit: 600,
  },
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
