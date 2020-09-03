const path = require('path')

// 根据client设置选择资源
const client = require('./build/client')
client.setStart()

module.exports = {
  productionSourceMap: false,
  publicPath: '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "~@/assets/styles/mixin.scss";
        `
      }
    }
  }
}
