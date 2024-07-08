import nixix from "./vite-plugin";
// @ts-expect-error
import { resolve } from "path";
import { defineConfig } from "vite";
// @ts-expect-error
import viteJsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig({
  plugins: [viteJsconfigPaths(), nixix({
    projectRoot: 'src/index.tsx',
    hmr: true,
    dev: true
  })],
  resolve: {
    alias: {
      // @ts-expect-error
      "~": resolve(__dirname),
    },
  },
});