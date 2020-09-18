import 'element-ui/lib/theme-chalk/index.css'
import '@/style/mxgraph.css'
import '@/style/style.scss'

import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import * as R from 'ramda'
import ElementUI from 'element-ui'
import routes from './router/index.js';

Vue.use(ElementUI)
Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history'
})

Vue.prototype.R = R

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
