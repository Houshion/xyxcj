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
export default [{
  path: '/salerShop',
  component: Layout,
  redirect: '/salerShop/index',
  name: 'salerShop',
  meta: {
    title: '批发商城管理',
    icon: 'shop'
  },
  children: [{
      path: 'index',
      name: 'salerShop/index',
      component: () => import('@/views/salerShop/index'),
      meta: {
        title: '商城商品',
        // icon: 'table'
      }
    },
    {
      path: 'column',
      name: 'salerShop/column',
      component: () => import('@/views/salerShop/column'),
      meta: {
        title: '商城栏目',
        // icon: 'tree'
      }
    }
  ]
}]
