import Vue from 'vue'

import http from 'src/common/lib/http/index'

import main from './main.vue'

// 开启debug模式
Vue.config.debug = true

// 将axios实例绑定到$http变量上，方便使用this & 兼容之前的代码
Vue.prototype.$http = http

const app = new Vue({
  el: '#app',
  render: h => h(main)
})
