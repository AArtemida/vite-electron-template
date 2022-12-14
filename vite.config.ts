import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";
import electron from 'vite-plugin-electron'

fs.rmSync('dist', { recursive: true, force: true }) // v14.14.0

export default defineConfig({
  // base: path.resolve(__dirname, "./dist/"),
  plugins: [
    vue(),
    electron({
      main: {
        entry: "src/main/main.ts",
      },
      preload: {
        input: {
          // Must be use absolute path, this is the restrict of Rollup
          preload: path.join(__dirname, "src/preload/main.ts"),
        },
      },
      // Enables use of Node.js API in the Renderer-process
      // https://github.com/electron-vite/vite-plugin-electron/tree/main/packages/electron-renderer#electron-renderervite-serve
      renderer: {},
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/renderer"),
      "@components": path.resolve(__dirname, "./src/renderer/components"),
    },
  },
});
