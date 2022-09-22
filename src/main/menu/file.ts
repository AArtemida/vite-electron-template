import fs from "fs";
import path from "path";
import { BrowserWindow, app, dialog, ipcMain, shell } from "electron";
import { Window } from "../window";

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

/* 将文件保存到本地 */
export function saveFileInTempPath(file, ext = ".md", specificPath = null) {
  const p = path.join(specificPath || app.getPath("temp"), `${file}${ext}`);
  if (fs.existsSync(p)) return p;
  fs.writeFileSync(p, file);
  return p;
}

/* 保存文件 */
export function save() {
  // 通知主线程获取数据
  ipcMain.emit('get-save-file')
}

/* 新建窗口 */
export const newBlankTab = () => {
   let win = new Window();

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
        extensions: MARKDOWN_EXTENSIONS,
      },
    ],
  });

  if (Array.isArray(filePaths) && filePaths.length > 0) {
    ipcMain.emit('app-open-files', filePaths)
  }
};


/* 另存 */
export const saveAs = (win) => {
  // if (win && win.webContents) {
  //   win.webContents.send("mt::editor-ask-file-save-as");
  // }
  let window = win.webContents;
  let res = dialog
    .showSaveDialogSync(window, {
      title: "保存文件",
      buttonLabel: "保存",
      filters: [
        {
          name: "未命名",
          extensions: ["md"],
        },
      ],
    })

    // fs.writeFileSync(res, textareaEl.value);
};

/* 关闭 */
export const closeWindow = (win) => {
  if (win) {
    win.close();
  }
};