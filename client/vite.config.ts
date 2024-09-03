import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,
    proxy: {
      "/api": {
        target: "http://localhost:9000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      src: "/src",
      components: "/src/components",
    },
  },
  assetsInclude: ["**/*.jpg"],
  plugins: [react()],
});
