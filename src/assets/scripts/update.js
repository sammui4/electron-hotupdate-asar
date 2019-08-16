/*
 * @Author: w
 * @Date: 2019-08-13 17:49:51
 * @LastEditors: w
 * @LastEditTime: 2019-08-13 17:56:25
 */
const { app } = require('electron'), fs = require('fs-extra'),  // 用于扩展内置 fs 方法    
  request = require('request'),  // 用于发起下载请求    
  tar = require('tar');  // 用于执行 tar 解压缩 //... // 下载热更新包代码

new Promise((resolve, reject) => {
  request({
    url: onlineVersion.upgrade.url, 
    encoding: null  // encoding 为 null 使 body 生成为一个 Buffer  
  }, (error, res, body) => {
    try {
      if (error || res.statusCode !== 200) { throw '请求失败'; }      // 保存到临时目录，temp 为 Electron 用户可写目录      
      let tempPath = app.getPath('temp'); 
      let dir = fs.mkdtempSync(`${tempPath}/upgrade_`);      // 创建 Buffer 流并解压      
      let stream = new require('stream').Readable(); 
      stream.push(body); 
      stream.push(null); 
      stream.pipe(tar.extract({ sync: true, cwd: dir })).on('close', () => {        // 解压完毕，复制更新文件        
        fs.copySync(dir, __dirname);  // 解压至指定的目录，这里用 __dirname 为例        
        fs.removeSync(dir);  // 删除临时目录        // 返回 true 表示需要重启        
        resolve(true);
      });
    } catch (e) { reject('更新文件下载失败，请联系管理员'); }
  }}).then(result => {
    if (result) {
      app.relaunch({ args: process.argv.slice(1) });  // 重启    
      app.exit(0);
    }
  }).catch(e => {  // e 错误
  });

