/*
 * @Author: w
 * @Date: 2019-08-05 16:11:20
 * @LastEditors: w
 * @LastEditTime: 2019-08-16 16:11:11
 */
const path = require('path');

function resolve (dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  productionSourceMap:false,
  publicPath: './',
  devServer: {
    // can be overwritten by process.env.HOST
    host: '0.0.0.0',  
    port: 8080
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('src', resolve('src'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'));
  },
  pluginOptions:{
    electronBuilder: {
      builderOptions: {
        productName:'新供应商协作系统',
        win: {
          target: ["nsis","zip"],
          icon: './public/app.ico',
          artifactName: "${productName}_setup_${version}.${ext}"      //一定要设置，不然会出问题
        },
       
        mac: {
          target: ["dmg","zip"],
          icon: './public/app.png',
          artifactName: "${productName}_setup_${version}.${ext}"      //一定要设置，不然会出现打包的文件名和latest.yml不一样的问题
        },
        asar:true,         // 打包成asar文件，默认为true
        extraResources:[      //额外打包文件，打包bat，用于自动更新用
          {
            from:'src/update.bat',
            to:'./update.bat'
          }
        ],
        publish: {
          // provider: 'github',
          // repo: 'xxxx', // git仓库
          // owner: 'xxxx', // 拥有者
          // token: 'xxxxxxxxxxxxxxx', // gitToken
          // releaseType: 'release',
          // publishAutoUpdate: true, // 发布自动更新（需要配置GH_TOKEN）。 默认true
          provider: "generic",
          url: "http://localhost:888/client"
        },
        nsis: {
          oneClick: false, // 是否一键安装
          perMachine: true,         // 是否为辅助安装程序显示安装模式安装程序页面（每台计算机或每用户选择）。或者是否始终按所有用户（每台机器）安装
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          // installerIcon: "./build/icons/aaa.ico",// 安装图标
          // uninstallerIcon: "./build/icons/bbb.ico",//卸载图标
          // installerHeaderIcon: "./build/icons/aaa.ico", // 安装时头部图标
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true,// 创建开始菜单图标
          // shortcutName: "xxxx", // 图标名称
          // include: "build/script/installer.nsh", // 包含的自定义nsis脚本
          runAfterFinish: true,     // 完成后是否运行已安装的应用程序
        },
      }
    }
  }
};