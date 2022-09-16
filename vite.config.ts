import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";
import electron from 'vite-plugin-electron'

fs.rmSync('dist', { recursive: true, force: true }) // v14.14.0

export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: "electron-main/main.ts",
      },
      preload: {
        input: {
          // Must be use absolute path, this is the restrict of Rollup
          preload: path.join(__dirname, "electron-preload/main.ts"),
        },
      },
      // Enables use of Node.js API in the Renderer-process
      // https://github.com/electron-vite/vite-plugin-electron/tree/main/packages/electron-renderer#electron-renderervite-serve
      renderer: {},
    }),
  ],
});
