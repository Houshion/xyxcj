let Oceans = {}
Oceans.install = function (Vue, options) {
  Vue.component('oTable', () => import('./table/table'))
  Vue.component('cTable', () => import('./table/customTable'))
  Vue.component('editor', () => import('./editor'))
  Vue.component('searchBtn', () => import('./searchBtn'))
  Vue.component('basicBtn', () => import('./navBasicBtn'))
}
export default Oceans