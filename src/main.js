import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import './styles/element-variables.scss'
// import './theme/style.css'
// import 'element-ui/lib/theme-chalk/style.css'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import i18n from './lang' //国际化

import '@/styles/index.scss' // global css
import '@/styles/o_index.less' // ocean's global css
import '@/styles/Theme-less/marginPadding.less' // ocean's global css
import '@/styles/o_color.less' // ocean's color css

import '@/styles/y_index.scss';
import '@/styles/y_color.scss';

import ECharts from 'vue-echarts' // echarts
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
Vue.component('v-chart', ECharts)

import components from "@/components"
Vue.use(components)

import * as filters from './utils/filters' // global filters
Object.keys(filters).forEach(key => { //返回filters对象中属性名组成的数组
  Vue.filter(key, filters[key])
})

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  // mockXHR()
}


router.beforeEach(async (to, from, next) => {
  if (to.path === '/redirect' && !to.query.from) {
    next({
      path: '/redirect',
      query: {
        from: from.path
      }
    });
  } else {
    next();
  }
})

// set ElementUI lang to EN
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

// Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

const Bus = new Vue()

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  data: {
    Bus
  },
  render: h => h(App)
})
