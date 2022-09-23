// import electronLocalshortcut from '@hfelix/electron-localshortcut'
import { Menu } from 'electron'
const isMac = process.platform === 'darwin'

/* 快捷键 */
export default class KeyBindings {
  // keys: any
  constructor () {
    this.keys = new Map([
      // File menu
      ["file.new-window", "Command+N"],
      ["file.new-tab", "Command+T"],
      ["file.open-file", "Command+O"],
      ["file.open-folder", "Command+Shift+O"],
      ["file.save", "Command+S"],
      ["file.save-as", "Command+Shift+S"],
      ["file.move-file", ""],
      ["file.rename-file", ""],
      ["file.print", ""],
      ["file.close-tab", "Command+W"],
      ["file.close-window", "Command+Shift+W"],
      ["file.quit", "Command+Q"],

      // Edit menu
      ["edit.undo", "Command+Z"],
      ["edit.redo", "Command+Shift+Z"],
      ["edit.cut", "Command+X"],
      ["edit.copy", "Command+C"],
      ["edit.paste", "Command+V"],
      ["edit.copy-as-markdown", "Command+Shift+C"],
      ["edit.copy-as-html", ""],
      ["edit.paste-as-plaintext", "Command+Shift+V"],
      ["edit.select-all", "Command+A"],
      ["edit.duplicate", "Command+Option+D"],
      ["edit.create-paragraph", "Shift+Command+N"],
      ["edit.delete-paragraph", "Shift+Command+D"],
      ["edit.find", "Command+F"],
      ["edit.find-next", "Cmd+G"],
      ["edit.find-previous", "Cmd+Shift+G"],
      ["edit.replace", "Command+Option+F"],
      ["edit.find-in-folder", "Shift+Command+F"],
      ["edit.screenshot", "Command+Option+A"], // macOS only
    ]);
  }

  getAccelerator (id) {
    const name = this.keys.get(id)
    if (!name) {
      return ''
    }
    return name
  }

  registerKeyHandlers (win, acceleratorMap) {
    // for (const item of acceleratorMap) {
    //   const { accelerator } = item

    //   electronLocalshortcut.register(win, accelerator, () => {
    //     console.log(`You pressed ${accelerator}`)
    //     callMenuCallback(item, win)
    //     return true // prevent default action
    //   })
    // }
  }
}

const callMenuCallback = (menuInfo, win) => {
  const { click, id } = menuInfo
  if (click) {
    let menuItem = null
    if (id) {
      const menus = Menu.getApplicationMenu()
      menuItem = menus.getMenuItemById(id)
    }

    // Allow all shortcuts/menus without id and only enabled menus with id (GH#980).
    if (!menuItem || menuItem.enabled !== false) {
      click(menuItem, win)
    }
  } else {
    console.error('ERROR: callback function is not defined.')
  }
}
