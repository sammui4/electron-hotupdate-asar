/*
 * @Author: w
 * @Date: 2019-08-13 09:55:50
 * @LastEditors: w
 * @LastEditTime: 2019-08-14 10:26:24
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import fetch from '@/assets/scripts/fetch.js'

Vue.config.productionTip = false
Vue.prototype.$http = fetch;
new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
