import Vue from 'vue'
import Router from 'vue-router'
import i18n from '@/lang' //国际化


Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// 分模块引入路由
import authority from './authority'
import setUp from './setUp'
import abnormal from './abnormal'
import count from './count'
import device from './device'
import goods from './goods'
import merchant from './merchant'
import order from './order'
import user from './user'
import payWay from './payWay'
import setMeal from './setMeal'
import advert from './advert'
import log from './log'
import SystemMsg from './SystemMsg'
import message from './message'
import questionnaire from './questionnaire'

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'index',
      component: () => import('@/views/index/index'),
      meta: {
        title: i18n.t('route.home'),
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/redirect',
    component: () => import('@/views/redirect'),
    hidden: true
  },
  ...authority, //权限管理
  ...setUp, //系统设置
  ...user, //会员管理
  ...payWay, //支付方式
  ...setMeal, //套餐管理
  ...order, //财务管理
  ...goods, //商品管理
  ...merchant, //运营管理
  ...device, //设备管理
  ...count, //统计管理
  ...abnormal, //反馈管理
  ...questionnaire, //问卷管理
  ...message, //消息管理
  ...SystemMsg, //系统消息
  ...advert, //广告管理
  ...log, //操作日志
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
