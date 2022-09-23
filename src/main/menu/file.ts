import fs from "fs";
import path from "path";
import { BrowserWindow, app, dialog, ipcMain, shell } from "electron";
import { ElWindow } from '../window'

const MARKDOWN_EXTENSIONS = Object.freeze([
  "markdown",
  "mdown",
  "mkdn",
  "md",
  "mkd",
  "mdwn",
  "mdtxt",
  "mdtext",
  "text",
  "txt",
]);

/* 保存文件 */
export function save() {
  // 通知主线程获取数据
  ipcMain.emit('get-save-file', false)
  // win.webContents.send('send-save-file', 'send')
}

/* 另存文件 */
export function saveAs() {
  // 通知主线程获取数据
  ipcMain.emit('get-save-file', true)
  // win.webContents.send('send-save-file', 'send')
}

/* 新建窗口 */
export const newBlankTab = () => {
   let win = new ElWindow()

   win.listen();
   win.createWindows({ isMainWin: false });
};

/* 打开文件 */
export const openFile = async (win) => {
  const { filePaths } = await dialog.showOpenDialog(win, {
    properties: ["openFile", "multiSelections"],
    filters: [
      {
        name: "Markdown document",
        extensions: ['md'],
      },
    ],
  });

  if (Array.isArray(filePaths) && filePaths.length > 0) {
    ipcMain.emit('app-open-files', filePaths)
  }
};


/* 关闭 */
export const closeWindow = (win) => {
  if (win) {
    win.close();
  }
};