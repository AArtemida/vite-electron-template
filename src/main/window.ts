import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import path from "path";

export const ROOT_PATH = {
  // /dist
  dist: path.join(__dirname, ".."),
  // /dist or /public
  public: path.join(__dirname, app.isPackaged ? "../.." : "../../../public"),
};
const preload = path.join(__dirname, "../preload/main.js");
const url = process.env["VITE_DEV_SERVER_URL"];

export const windowsCfg = {
  id: "", //唯一id
  title: "", //窗口标题
  width: 1000,
  height: 700,
  minWidth: "", //最小宽度
  minHeight: "", //最小高度
  route: "", // 页面路由URL '/manage?id=123'
  resizable: true, //是否支持调整窗口大小
  maximize: false, //是否最大化
  backgroundColor: "#eee", //窗口背景色
  data: null, //数据
  isMultiWindow: false, //是否支持多开窗口 (如果为false，当窗体存在，再次创建不会新建一个窗体 只focus显示即可，，如果为true，即使窗体存在，也可以新建一个)
  isMainWin: false, //是否主窗口(当为true时会替代当前主窗口)
  parentId: "", //父窗口id  创建父子窗口 -- 子窗口永远显示在父窗口顶部 【父窗口可以操作】
  modal: false, //模态窗口 -- 模态窗口是禁用父窗口的子窗口，创建模态窗口必须设置 parent 和 modal 选项 【父窗口不能操作】
};

/**
 * 窗口配置
 */
export class Window {
  main: any;
  group: any;
  tray: any;
  win: any;
  constructor() {
    this.main = null; //当前页
    this.group = {}; //窗口组
    this.tray = null; //托盘
    this.win = null;
  }

  // 窗口配置
  winOpts(wh = []) {
    return {
      width: 1000,
      height: 700,
      resizable: true, //可拉伸
      // frame: false,
      show: false,
      webPreferences: {
        webSecurity: false,
        contextIsolation: false, //是否开启上下文隔离
        enableRemoteModule: true, //是否启用远程模块（即在渲染进程页面使用remote）
        nodeIntegration: true, //是否支持开启node
        // preload,
      },
    };
  }

  // 获取窗口
  getWindow(id) {
    return BrowserWindow.fromId(id);
  }

  // 获取全部窗口
  getAllWindows() {
    return BrowserWindow.getAllWindows();
  }

  // 创建窗口
  createWindows(options) {
    let args = Object.assign({}, windowsCfg, options);

    // 判断窗口是否存在
    for (let i in this.group) {
      if (
        this.getWindow(Number(i)) &&
        this.group[i].route === args.route &&
        !this.group[i].isMultiWindow
      ) {
        this.getWindow(Number(i)).focus();
        return;
      }
    }

    let opt = this.winOpts([args.width || 800, args.height || 600]);
    if (args.parentId) {
      opt.parent = this.getWindow(args.parentId);
    }

    if (typeof args.resizable === "boolean") opt.resizable = args.resizable;

    this.win = new BrowserWindow(opt);
    console.log("窗口id：" + this.win.id);
    this.group[this.win.id] = {
      route: args.route,
      isMultiWindow: args.isMultiWindow,
    };
    // 是否最大化
    if (args.maximize && args.resizable) {
      this.win.maximize();
    }
    // 是否主窗口
    if (args.isMainWin) {
      if (this.main) {
        delete this.group[this.main.id];
        this.main.close();
      }
      this.main = this.win;
    }
    args.id = this.win.id;
    this.win.on("close", () => this.win.setOpacity(0));

    // if (process.env.WEBPACK_DEV_SERVER_URL) {//开发环境
    // }
    // 如果打包了，渲染index.html
    if (app.isPackaged) {
      // loadfile加载本地文件
      this.win.loadFile(path.join(ROOT_PATH.dist, "index.html"));
    } else {
      this.win.loadURL(url);
      // 打开开发者调试工具
      // if (!process.env.IS_TEST) win.webContents.openDevTools()
    }

    this.win.once("ready-to-show", () => {
      this.win.show();
    });

    // 屏蔽窗口菜单（-webkit-app-region: drag）
    this.win.hookWindowMessage(278, function (e) {
      this.win.setEnabled(false);
      setTimeout(() => {
        this.win.setEnabled(true);
      }, 100);

      return true;
    });
  }

  // 关闭所有窗口
  closeAllWindow() {
    for (let i in this.group) {
      if (this.group[i]) {
        if (this.getWindow(Number(i))) {
          this.getWindow(Number(i)).close();
        } else {
          app.quit();
        }
      }
    }
  }

  // 创建托盘
  createTray() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "显示",
        click: () => {
          for (let i in this.group) {
            if (this.group[i]) {
              // this.getWindow(Number(i)).show()
              let win = this.getWindow(Number(i));
              if (!win) return;
              if (win.isMinimized()) win.restore();
              win.show();
            }
          }
        },
      },
      {
        label: "退出",
        click: () => {
          app.quit();
        },
      },
    ]);
    const trayIco = path.join(__dirname, "../static/logo.png");
    this.tray = new Tray(trayIco);
    this.tray.setContextMenu(contextMenu);
    this.tray.setToolTip(app.name);
  }

  // 开启监听
  listen() {
    // 关闭
    ipcMain.on("window-closed", (event, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).close();
        if (this.group[Number(winId)]) delete this.group[Number(winId)];
      } else {
        this.closeAllWindow();
      }
    });

    // 隐藏
    ipcMain.on("window-hide", (event, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).hide();
      } else {
        for (let i in this.group)
          if (this.group[i]) this.getWindow(Number(i)).hide();
      }
    });

    // 显示
    ipcMain.on("window-show", (event, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).show();
      } else {
        for (let i in this.group)
          if (this.group[i]) this.getWindow(Number(i)).show();
      }
    });

    // 最小化
    ipcMain.on("window-mini", (event, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).minimize();
      } else {
        for (let i in this.group)
          if (this.group[i]) this.getWindow(Number(i)).minimize();
      }
    });

    // 最大化
    ipcMain.on("window-max", (event, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).maximize();
      } else {
        for (let i in this.group)
          if (this.group[i]) this.getWindow(Number(i)).maximize();
      }
    });

    // 最大化/最小化
    ipcMain.on("window-max-min-size", (event, winId) => {
      if (winId) {
        if (this.getWindow(winId).isMaximized()) {
          this.getWindow(winId).unmaximize();
        } else {
          this.getWindow(winId).maximize();
        }
      }
    });

    // 还原
    ipcMain.on("window-restore", (event, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).restore();
      } else {
        for (let i in this.group)
          if (this.group[i]) this.getWindow(Number(i)).restore();
      }
    });

    // 重新加载
    ipcMain.on("window-reload", (event, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).reload();
      } else {
        for (let i in this.group)
          if (this.group[i]) this.getWindow(Number(i)).reload();
      }
    });

    // 创建窗口
    ipcMain.on("window-new", (event, args) => {
      console.log("创建窗口");
      this.createWindows(args);
    });
  }
}
