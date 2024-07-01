import { resolve } from "path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/assets/images/icons")],
      symbolId: "[dir]-[name]",
      customDomId: "svg-sprite",
    }),
    VitePWA({
      includeAssets: [
        "favicon.png",
        "robots.txt",
        "apple-touch-icon.png",
        "safari-pinned-tab.svg",
      ],
      registerType: "prompt",
      manifest: {
        name: "polkadot-devground",
        description: "...",
        short_name: "pd",
        lang: "en-EN",
        background_color: "#FFFFFF",
        display: "standalone",
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,json,ico,png,jpg,jpeg,svg}"],
        navigateFallback: null,
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MB limit
      },
    }),
  ],
  // build: {
  //   minify: "terser",
  //   rollupOptions: {
  //     output: {
  //       manualChunks: (id) => {
  //         // if (
  //         //   id.includes("/node_modules/react/") ||
  //         //   id.includes("/node_modules/react-dom/") ||
  //         //   id.includes("/node_modules/react-is/") ||
  //         //   id.includes("/node_modules/scheduler/") ||
  //         //   id.includes("/node_modules/prop-types/")
  //         // ) {
  //         //   return "react";
  //         // }

  //         if (
  //           id.includes("/node_modules/tailwindcss/") ||
  //           id.includes("/node_modules/tailwind-merge/")
  //         ) {
  //           return "tailwind";
  //         }

  //         if (id.includes("/node_modules/@radix")) {
  //           return "radix";
  //         }

  //         if (id.includes("/node_modules/monaco-editor")) {
  //           return "monaco-editor";
  //         }

  //         if (id.includes("/node_modules/prettier")) {
  //           return "prettier";
  //         }

  //         if (id.includes("/node_modules/typescript")) {
  //           return "typescript";
  //         }

  //         if (id.includes("/node_modules/sucrase")) {
  //           return "sucrase";
  //         }

  //         if (id.includes("/node_modules/@polkadot")) {
  //           return "@polkadot";
  //         }

  //         if (id.includes("/node_modules/polkadot-api")) {
  //           return "polkadot-api";
  //         }

  //         if (id.includes("/node_modules/")) {
  //           return "vendor";
  //         }
  //       },
  //     },
  //   },
  //   sourcemap: true,
  // },
});
