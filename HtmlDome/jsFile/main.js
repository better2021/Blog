import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import config from './config'
import { loadJs } from './utils'

import './assets/styles/index.scss'

Vue.config.productionTip = false
Vue.prototype.$config = config
Vue.prototype.$isMobile = Vue.observable({ value: document.body.clientWidth < 750 }) // 一些初始化工作

// 一些初始化工作
;(() => {
  // 设置网站标题
  document.title = config.title || '游戏官网'

  // 初始化open、share
  const openJs = '//res.cdn.openinstall.io/openinstall.js'
  const shareJs = '//www.shareinstall.com.cn/js/page/jshareinstall.min.js'
  const openList = config.download.filter(o => o.type === 'open')
  const shareList = config.download.filter(o => o.type === 'share')
  window.downloadList = {} // 保存下载实例
  if (openList.length > 0) {
    loadJs(openJs, () => {
      console.log('open===========')
      openList.forEach(o => {
        new OpenInstall(
          {
            appKey: o.appKey,
            preferWakeup: true,
            onready: function() {
              window.downloadList[o.appKey] = this
            }
          },
          {}
        )
      })
    })
  }
  if (shareList.length > 0) {
    loadJs(shareJs, () => {
      console.log('share===========')
      shareList.forEach(o => {
        new ShareInstall(
          {
            appKey: o.appKey,
            preferWakeup: true,
            onready: function() {
              window.downloadList[o.appKey] = this
            }
          },
          { share: 1 }
        )
      })
    })
  }
})()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
