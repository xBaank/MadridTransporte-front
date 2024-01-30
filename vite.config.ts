import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,json}"],
        maximumFileSizeToCacheInBytes: 10000000,
      },
    }),
  ],
});
