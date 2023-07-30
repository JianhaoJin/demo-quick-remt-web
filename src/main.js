import Vue from 'vue'

import Cookies from 'js-cookie'
import 'babel-polyfill'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import '@/assets/icons' // icon
import './errorLog' // error log
import './permission' // permission control

import * as filters from '@/utils/filters' // global filters

import { selectDictLabel } from '@/utils'

import 'font-awesome/css/font-awesome.min.css'

import formCreate from '@form-create/element-ui'
import FcDesigner from '@form-create/designer'
import {hasPermission} from "./utils/permission";
import directives from "./views/components/directives";
Vue.use(directives);
//全局的常量
Vue.prototype.hasPerm = hasPermission

Vue.use(FcDesigner)
Vue.use(formCreate)


// 全局方法挂载
Vue.prototype.selectDictLabel = selectDictLabel

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value) // 国际化
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

let vue = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
export default vue