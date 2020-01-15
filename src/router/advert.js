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
  path: '/advert',
  component: Layout,
  redirect: '/advert/index',
  name: 'advert',
  alwaysShow: true,//只有一个子菜单的时候
  meta: {
    title: i18n.t('route.advertManagement'),
    icon: 'advert'
  },
  children: [{
      path: 'advert',
      name: 'advert/index',
      component: () => import('@/views/advert/index'),
      meta: {
        title: i18n.t('route.advertList'),
      }
    }
  ]
}]
