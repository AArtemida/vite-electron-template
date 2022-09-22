import path from 'path'
import { BrowserWindow, app, dialog, ipcMain, shell } from 'electron'
import { getPath, getRecommendTitleFromMarkdownString } from './utils'
import { writeMarkdownFile } from './markdown'
import { readFile } from './fileSystem'

export function bindEvents(win) {
  ipcMain.on('app-open-files-by-id', (windowId, fileList) => {
    console.log(windowId, fileList)
  })

  ipcMain.on('mt::response-file-save', () => {})

  // 监听读取文件
  ipcMain.on('app-open-files', fileList => {
    let filePath = fileList[0]
    readFile(filePath).then(res => {
      win.win.webContents.send('get-md-content', res)
    })
  })
  // 监听保存获取数据
  ipcMain.on('get-save-file', () => {
    console.log('ok ok ok')
    setTimeout(() => {
      win.win.webContents.send('send-save-file', 'send')
    }, 500)
  })

  ipcMain.on('start-save-file', (event, args) => {
    console.log('=============')
    console.log(args)
  })
}
