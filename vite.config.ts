import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/images/icons')],
      symbolId: '[dir]-[name]',
      customDomId: 'svg-sprite',
    }),
    VitePWA({
      includeAssets: ['favicon.png', 'robots.txt', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
      registerType: 'prompt',
      manifest: {
        name: 'polkadot-devground',
        description: '...',
        short_name: 'pd',
        lang: 'en-EN',
        background_color: '#FFFFFF',
        display: 'standalone',
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,json,ico,png,jpg,jpeg,svg}'],
        navigateFallback: null,
      },
    }),
  ],
});
