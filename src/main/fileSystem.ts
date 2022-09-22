import { saveAs } from './menu/file'
import fs from 'fs'
import fsExtra from 'fs-extra'
import path from 'path'
import { hasMarkdownExtension } from './markdown'
import { dialog } from 'electron'

// 读文件
export function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { flag: 'r', encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject('出错啦')
      }
      resolve(data)
    })
  })
}

/* 保存文件 */
export function saveFile(value) {
  const res = dialog.showSaveDialogSync({
    title: '保存文件',
    buttonLabel: '保存',
    filters: [
      {
        // 只读取js文件
        name: 'index',
        extensions: ['md'],
      },
    ],
  })
  fs.writeFileSync(res, value)
}

export function saveAsFile(value) {
  const res = dialog.showSaveDialogSync({
    title: '保存文件',
    buttonLabel: '保存',
    filters: [
      {
        // 只读取js文件
        name: 'index',
        extensions: ['md'],
      },
    ],
  })
  fs.writeFileSync(res, value)
}

/* 写文件 */
export const writeFile = (pathname, content, extension, options = 'utf-8') => {
  if (!pathname) {
    return Promise.reject(new Error('[ERROR] Cannot save file without path.'))
  }
  pathname =
    !extension || pathname.endsWith(extension)
      ? pathname
      : `${pathname}${extension}`

  return fsExtra.outputFile(pathname, content, options)
}

export const isSymbolicLink = filepath => {
  try {
    return fs.existsSync(filepath) && fs.lstatSync(filepath).isSymbolicLink()
  } catch (_) {
    return false
  }
}
