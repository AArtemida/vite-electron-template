import { join } from 'path'
import { app, BrowserWindow, ipcMain, Menu, globalShortcut } from 'electron'
import AppMenu from './menu/menu'
import keyboard from './keyboard/shortcut'
import { bindEvents } from "./events";
import { Window } from "./window";

let appMenu = new AppMenu({
  keybindings: keyboard,
});

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, '..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let win // BrowserWindow | null
// Here, you can also use other preload
const preload = join(__dirname, "../preload/main.js");
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const url = process.env['VITE_DEV_SERVER_URL']

// 新建主窗口
function createWindow() {
  win = new Window()

  win.listen()
  win.createWindows({ isMainWin: true })
  /*win = new BrowserWindow({
    width: 1000,
    height: 700,
    resizable: true, //可拉伸
    icon: join(ROOT_PATH.public, "logo.svg"),
    webPreferences: {
      contextIsolation: false, //是否开启上下文隔离
      nodeIntegration: true, //是否支持开启node
      preload,
    },
  });

  
  // 设置窗口名称
  win.setTitle("未命名");

  // 如果打包了，渲染index.html
  if (app.isPackaged) {
    console.log("渲染index.html");
    // loadfile加载本地文件
    win.loadFile(join(ROOT_PATH.dist, "index.html"));
  } else {
    console.log("url", url);
    win.loadURL(url);
  }

  //设置窗口显示位置
  // win.setBounds({
  //   x: 50,
  //   y: 50,
  // })*/
  // Test active push message to Renderer-process.
  // win.webContents.on('did-finish-load', () => {
  //   win.webContents.send('main-process-message', new Date().toLocaleString())
  // })

  // 注册全局快捷键-打开开发者工具（方便查看问题）
  // globalShortcut.register('CommandOrControl+alt+shift+l', () => {
  //   win.win.webContents.openDevTools()
  // })
}

app.on('window-all-closed', () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
  win = null
})

app.whenReady().then(() => {
  createWindow(); // 创建窗口
  
  Menu.setApplicationMenu(Menu.buildFromTemplate([]))
  appMenu.addMenus()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // 监听渲染进程方法（ipcMain)
  // ipcMain.on("window-new", (e: Event, data: string) => {
  //   console.log(data);
  // });

  bindEvents(win);

  ipcMain.on('sendMessage', (event, args) => {
    console.log('bbbbbbbbbbbbb', args)
    win.win.webContents.send('receiveMessage', '文字该' + args)
  })
})
