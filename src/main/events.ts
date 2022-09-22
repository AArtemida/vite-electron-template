import path from 'path'
import { BrowserWindow, app, dialog, ipcMain, shell } from 'electron'
import { readFile, saveFile, saveAsFile } from './fileSystem'

export function bindEvents(win) {
  // 监听读取文件
  ipcMain.on('app-open-files', fileList => {
    let filePath = fileList[0]
    readFile(filePath).then(res => {
      win.win.webContents.send('get-md-content', res)
    })
  })
  // 监听保存获取数据
  ipcMain.on('get-save-file', isDirSave => {
    //isDirSave 是否另存
    win.win.webContents.send('send-save-file', isDirSave)
  })

  // 调用存文件
  ipcMain.on('start-save-file', (event, args, isDirSave) => {
    // 另存文件
    if (isDirSave) {
      saveAsFile(args)
    } else {
      // 保存文件
      saveFile(args)
    }
  })
}
