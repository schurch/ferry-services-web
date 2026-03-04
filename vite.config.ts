import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://scottishferryapp.com",
        changeOrigin: true,
        secure: true
      }
    }
  },
  preview: {
    proxy: {
      "/api": {
        target: "https://scottishferryapp.com",
        changeOrigin: true,
        secure: true
      }
    }
  },
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts"
  }
});
