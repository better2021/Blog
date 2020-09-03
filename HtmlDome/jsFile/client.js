const fs = require('fs')
const path = require('path')
const rm = require('rimraf')
const fsExt = require('fs-extra')
const argList = require('./getArgList')()

// 本地配置参数
const allConfig = require('./client.json')
const client = argList.client || 'TYJT'
const clientConfig = allConfig[client]

console.log('client==>', client)

module.exports = {
  setStart: function() {
    this.setSelfImg()
    this.setIcon()
    this.setSetting()
  },
  setSelfImg: function() {
    // 删除images/self文件夹，用self/client替换
    rm.sync(path.resolve(__dirname, '../src/assets/images/self'))
    fsExt.copySync(path.resolve(__dirname, '../src/assets/self/' + client), path.resolve(__dirname, '../src/assets/images/self'))
  },
  setIcon: function() {
    rm.sync(path.resolve(__dirname, '../public/favicon.png'))
    fsExt.copySync(
      path.resolve(__dirname, '../src/assets/self/' + client + '/favicon.png'),
      path.resolve(__dirname, '../public/favicon.png')
    )
  },
  setSetting: function() {
    const setting = {
      clientConfig
    }
    fs.writeFileSync(path.resolve(__dirname, '../public/setting.js'), 'var setting = ' + JSON.stringify(setting))
  }
}
