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
import Layout from '@/layout'
import i18n from '@/lang' //国际化
export default [{
  path: '/order',
  component: Layout,
  redirect: '/order/car',
  name: 'order',
  meta: {
    title: i18n.t('route.financialManagement'),
    icon: 'financial'
  },
  children: [{
      path: 'car',
      name: 'order/car',
      component: () => import('@/views/order/car'),
      meta: {
        title: i18n.t('route.WashingOrder'),
        // icon: 'table'
      }
    },
    {
      path: 'sell',
      name: 'order/sell',
      component: () => import('@/views/order/sell'),
      meta: {
        title: i18n.t('route.SalesBookkeepingOrder'),
        // icon: 'tree'
      }
    },
    {
      path: 'expenditure',
      name: 'order/expenditure',
      component: () => import('@/views/order/expenditure'),
      meta: {
        title: i18n.t('route.chargeOrder'),
        // icon: 'tree'
      }
    },
    {
      path: 'recharge',
      name: 'order/recharge',
      component: () => import('@/views/order/recharge'),
      meta: {
        title: i18n.t('route.rechargeOrder'),
        // icon: 'tree'
      }
    },
    {
      path: 'allOrder',
      name: 'order/allOrder',
      component: () => import('@/views/order/allOrder'),
      meta: {
        title: i18n.t('route.allOrder'),
        // icon: 'tree'
      }
    },
    {
      path: 'water',
      name: 'order/water',
      component: () => import('@/views/order/water'),
      meta: {
        title: i18n.t('route.financialFlow'),
        // icon: 'tree'
      }
    },
    {
      path: 'printView',
      name: 'order/printView',
      component: () => import('@/views/order/view'),
      meta: {
        title: i18n.t('route.printView'),
        // icon: 'tree'
      }
    },
  ]
}]
