import { resolve } from 'path';

import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const isVisualizer = mode === 'dev';

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/images/icons')],
        symbolId: '[dir]-[name]',
        customDomId: 'svg-sprite',
      }),
      VitePWA({
        includeAssets: [
          'favicon.png',
          'robots.txt',
          'apple-touch-icon.png',
          'safari-pinned-tab.svg',
        ],
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
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MB limit
        },
      }),
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/prism-themes/themes/prism-one-dark.css',
            dest: 'prismjs/css',
          },
          {
            src: 'node_modules/prism-themes/themes/prism-one-light.css',
            dest: 'prismjs/css',
          },
        ],
      }),
      isVisualizer && visualizer({ filename: './dist/stats.html', open: false }),

    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (
              id.includes('/node_modules/react/')
              || id.includes('/node_modules/react-dom/')
              || id.includes('/node_modules/react-is/')
              || id.includes('/node_modules/scheduler/')
              || id.includes('/node_modules/prop-types/')
            ) {
              return 'react';
            }

            if (
              id.includes('/node_modules/tailwindcss/')
            || id.includes('/node_modules/tailwind-merge/')
              || id.includes('/node_modules/clsx/')
            ) {
              return 'tailwind';
            }

            if (id.includes('/node_modules/@radix')) {
              return 'radix';
            }

            if (id.includes('/node_modules/zustand')) {
              return 'zustand';
            }

            if (id.includes('/node_modules/monaco')) {
              return 'monaco';
            }

            if (
              id.includes('/node_modules/date-fns')
              || id.includes('/node_modules/lodash')
              || id.includes('/node_modules/@pivanov')
            ) {
              return 'utils';
            }

            if (id.includes('/node_modules/prettier')) {
              return 'prettier';
            }

            if (id.includes('/node_modules/typescript') || id.includes('/node_modules/sucrase')) {
              return 'typescript-sucrase';
            }

            if (
              id.includes('/node_modules/file-saver/')
              || id.includes('/node_modules/jszip/')
            ) {
              return 'file-utils';
            }

            if (
              id.includes('/node_modules/@shikijs/')
              || id.includes('/node_modules/shiki/')
              || id.includes('/node_modules/prismjs/')
              || id.includes('/node_modules/prism-themes/')
            ) {
              return 'syntax-highlighting';
            }

            if (id.includes('/node_modules/')) {
              return 'vendor';
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        'monaco-editor',
        'react',
        'react-dom',
        'tailwindcss',
        'zustand',
        'lodash',
        'date-fns',
      ],
    },
  };
});
