import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/images/icons')],
      symbolId: '[dir]-[name]',
      customDomId: 'svg-sprite',
    }),
  ],
})
