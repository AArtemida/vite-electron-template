import fs from "fs";
import path from "path";
import { app, ipcMain, Menu } from 'electron'
import { isOsx, isWindows } from "../config";
import * as actions from "./file";

const RECENTLY_USED_DOCUMENTS_FILE_NAME = "";
const MAX_RECENTLY_USED_DOCUMENTS = 8;
class AppMenu {
  isOsxOrWindows: boolean;
  _keybindings: any;
  RECENTS_PATH: any;
  constructor(keybindings) {
    this.isOsxOrWindows = isOsx || isWindows;
    this._keybindings = keybindings;
    this.RECENTS_PATH = "C:";
  }
  addMenus() {
    let template : any = [
      {
        label: "文件",
        submenu: [
          {
            label: "新建",
            // accelerator: this._keybindings.getAccelerator("file.new-tab"),
            click(menuItem, browserWindow) {
              actions.newBlankTab();
            },
          },
          {
            label: "打开",
            click(menuItem, browserWindow) {
              actions.openFile(browserWindow);
            },
          },
          {
            type: "separator",
          },
          {
            label: "保存",
            click(menuItem, browserWindow) {
              actions.save()
            },
          },
          {
            label: "另存为",
            click(menuItem, browserWindow) {
              actions.saveAs(browserWindow);
            },
          },
          {
            type: "separator",
          },
          {
            label: "关闭",
            click(menuItem, browserWindow) {
              actions.closeWindow(browserWindow);
            },
          },
        ],
      },
      {
        label: "编辑",
        submenu: [
          { label: "撤销" },
          { label: "剪贴" },
          { label: "复制" },
          { label: "粘贴" },
        ],
      },
      {
        label: "主题",
      },
      {
        label: "帮助",
      },
    ];

    // 构建菜单模版
    const m = Menu.buildFromTemplate(template);

    // 设置菜单模版
    Menu.setApplicationMenu(m);
  }
  addRecentlyUsedDocument(filePath) {
    const { isOsxOrWindows, RECENTS_PATH } = this;

    if (isOsxOrWindows) app.addRecentDocument(filePath);
    if (isOsx) return;

    const recentDocuments = this.getRecentlyUsedDocuments();
    const index = recentDocuments.indexOf(filePath);
    let needSave = index !== 0;
    if (index > 0) {
      recentDocuments.splice(index, 1);
    }
    if (index !== 0) {
      recentDocuments.unshift(filePath);
    }

    if (recentDocuments.length > MAX_RECENTLY_USED_DOCUMENTS) {
      needSave = true;
      recentDocuments.splice(
        MAX_RECENTLY_USED_DOCUMENTS,
        recentDocuments.length - MAX_RECENTLY_USED_DOCUMENTS
      );
    }

    this.updateAppMenu(recentDocuments);

    if (needSave) {
      const json = JSON.stringify(recentDocuments, null, 2);
      fs.writeFileSync(RECENTS_PATH, json, "utf-8");
    }
  }
  // 获取最近打开文件
  getRecentlyUsedDocuments() {
    return [];
  }
  // 更新菜单
  updateAppMenu(recentDocuments) {}
}
export default AppMenu;
