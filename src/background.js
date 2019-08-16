/*
 * @Author: w
 * @Date: 2019-08-06 17:58:22
 * @LastEditors: w
 * @LastEditTime: 2019-08-16 18:19:18
 */

'use strict'
import {
  app,
  protocol,
  BrowserWindow,
  Menu,
  MenuItem,
  globalShortcut,
  ipcMain, //更新用的
} from 'electron'
import {
  autoUpdater
} from "electron-updater" //更新用的
import fs from 'fs';
import fetch from './assets/scripts/fetch.js';
import path from 'path';
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const request = require('request');
const isDevelopment = process.env.NODE_ENV !== 'production'
// node自带的子进程
const child_process = require("child_process");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let update
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1920,
    height: 1080, // eslint-disable-next-line no-undef
    webPreferences: {
      // 跨域
      webSecurity: false,
      nodeIntegration: true
    },
    icon: `${__static}/app.ico`,
    // 先不显示
    show: false
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })

  // ready后show
  win.on('ready-to-show', () => {
    win.show();
    // updateHandle();
    regeistUpdate()
  })
  createMenu()

}

function regeistUpdate() {
  // updateNow();
  // 监听渲染进程的更新事件
  ipcMain.on('updateData', (event, arg) => {
    updateNow()
  });
}

function updateNow() {
  fetch({
    method: 'get',
    url: '/update'
  }).then(({
    data
  }) => {
    if (data.code == 200) {
      let final = compareVersion(app.getVersion(), data.version);
      console.log(final);
      let url;
      switch (final.status) {
        case 1:
          getResource('http://localhost:888/client/win-unpacked/resources','app.asar',function(){
            
          })
          break;
        case 2:

          break;
      }
      sendUpdateMessage(final);
    }

  })
}

function compareVersion(v1, v2) {
  if (v1 == v2) {
    return {
      status: 0,
      msg: '暂无更新'
    }
  }
  var v1Arr = v1.toString().split('.');
  var v2Arr = v2.toString().split('.');
  if (v1Arr[1] > v2Arr[1]) {
    return {
      status: 0,
      msg: '暂无更新'
    }
  }
  if (v1Arr[1] < v2Arr[1] && v1Arr[2] > v2Arr[2]) {
    return {
      status: 0,
      msg: '暂无更新'
    }
  }
  if (v1Arr[1] === v2Arr[1]) {
    return {
      status: 1,
      msg: '有新版，请稍候'
    }
  }
  return {
    status: 2,
    msg: '有新版，请稍候'
  }
}

function getResource(fileUrl,name,callback) {
  let filename = name
  let fetchUrl = `${fileUrl}/${name}`;
  var requests = request.get(fetchUrl);
  requests.on('error', (err) => { })
  // 移动方案
  // requests.on('response', function(response) {
  //   let tempPath = path.join(__dirname,'upgrade_'); 
  //   let dir = fs.mkdtempSync(tempPath);
  //   let paths = path.join(dir,filename);
  //   process.noAsar = true;
  //   requests.pipe(fs.createWriteStream(paths)).on('close',()=>{
  //     var newPath = path.join(__dirname,filename)
  //     // 移动方案
  //     fs.rename(paths, newPath,(err)=>{
  //       console.log(err);
  //       fs.rmdir(dir,(err )=>{
  //         if(err){
  //           console.log(err);
  //           return
  //         }
  //         callback()
  //       });
  //     });

  //   })
  // })

  // 复制方案
  requests.on('response', function(response) {
    // let paths = path.join(__dirname,filename);
    let paths = path.join(__dirname,'latest.asar');
    process.noAsar = true;
    requests.pipe(fs.createWriteStream(paths)).on('close',(err)=>{
      if(err){
        return sendUpdateMessage({
          msg:error,
          duration:0,
        })
      }
      var newPath = path.join(__dirname, filename);
      process.noAsar = false;
      // setTimeout(()=>{
        var workerProcessPath = path.join(__dirname,'update.bat');
        let workerProcess = child_process.spawn(workerProcessPath);
        // 打印正常的后台可执行程序输出
        workerProcess.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
        
        workerProcess.stderr.on('data', (data) => {
          console.log(data);
          console.log(`stderr: ${data}`);
        });
  
        workerProcess.on('close', (code) => {
          console.log(`子进程退出，使用退出码 ${code}`);
        });
  
        workerProcess.on('error', (err) => {
          console.log('启动子进程失败', err);
        });
      // },5000)
      // app.quit();

      // fs.rename(paths, newPath, (err) => {
      //   if(err){
      //     return sendUpdateMessage({
      //       msg:error,
      //       duration:0,
      //     })
      //   }
      //   if (process.platform === 'darwin') {
      //     app.relaunch()
      //     app.quit()
      //   } else {
      //     app.quit()
      //   }
      // });
      
    })
  })

  // 读取流文件成功后重启
  // .on('close',()=>{     
    // app.relaunch();   
    // var newPath =  path.join(__dirname,filename);
    // console.log(newPath);
    // fs.rename(paths,newPath ,function(){
    //   fs.rmdir(dir,(err )=>{
    //     if(err){
    //       return
    //     }
    //   });
    // });
  // })




}


function updateHandle() {
  let message = {
    error: {
      status: -1,
      msg: '检查更新出错'
    },
    checking: {
      status: -0,
      msg: '正在检查更新……'
    },
    updateAva: {
      status: 1,
      msg: '检测到新版本，正在下载……'
    },
    updateNotAva: {
      status: 2,
      msg: '现在使用的就是最新版本，不用更新'
    },
    updateFinish: {
      status: 3,
      msg: '下载成功'
    }
  };
  const os = require('os');
  let uploadUrl = 'http://172.20.200.84:888/client';
  autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.on('error', function (error) {
    sendUpdateMessage(message.error)
  });
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(message.checking)
  });
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(message.updateAva)
  });
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(message.updateNotAva)
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    win.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

    ipcMain.on('isUpdateNow', (e, arg) => {
      console.log("开始更新");
      //some code here to handle event
      autoUpdater.quitAndInstall();
    });
    win.webContents.send('isUpdateNow')
  });

  ipcMain.on("checkForUpdate", () => {
    //执行自动更新检查
    autoUpdater.checkForUpdates();
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  win.webContents.send('message', text)
}

// 顶部menu
function createMenu() {
  // darwin表示macOS，针对macOS的设置
  if (process.platform === 'darwin') {
    const template = [{
      label: '',
      submenu: [{
          role: 'about'
        },
        {
          role: 'quit'
        }
      ]
    }]
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } else {
    const template = [{
      label: '操作',
      submenu: [{
        label: '重新加载',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            // on reload, start fresh and close any old
            // open secondary windows
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(function (win) {
                if (win.id > 1) {
                  win.close()
                }
              })
            }
            focusedWindow.reload()
          }
        }
      }]
    }]
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu);
    // Menu.setApplicationMenu(null);
    // 上下文菜单

  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {

    try {
      await installVueDevtools()
      // await BrowserWindow.addDevToolsExtension('/Users/WIN10/AppData/Local/Google/Chrome/User Data/Profile 1/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.1.1_0')
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  // 在开发环境和生产环境均可通过快捷键打开devTools
  globalShortcut.register('CommandOrControl+Shift+i', function () {
    win.webContents.openDevTools()
  })
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}