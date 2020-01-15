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
  path: '/count',
  component: Layout,
  redirect: '/count/washCar',
  name: 'count',
  meta: {
    title: i18n.t('route.statisticalManagement'),
    icon: 'chart'
  },
  children: [
    {
      path: 'washCar',
      name: 'count/washCar',
      component: () => import('@/views/count/washCar'),
      meta: {
        title: i18n.t('route.washCarBill'),
        // icon: 'table'
      }
    },
    {
      path: 'recharge',
      name: 'count/recharge',
      component: () => import('@/views/count/recharge'),
      meta: {
        title: i18n.t('route.rechargeBill'),
        // icon: 'table'
      }
    },
    {
      path: 'settlement',
      name: 'count/settlement',
      component: () => import('@/views/count/settlement'),
      meta: {
        title: i18n.t('route.settledSalesBill'),
        // icon: 'table'
      }
    },
    {
      path: 'noSettlement',
      name: 'count/noSettlement',
      component: () => import('@/views/count/noSettlement'),
      meta: {
        title: i18n.t('route.noSettledSalesBill'),
        // icon: 'table'
      }
    },
    {
      path: 'gathering',
      name: 'count/gathering',
      component: () => import('@/views/count/gathering'),
      meta: {
        title: i18n.t('route.collectionRecord'),
        // icon: 'table'
      }
    },
    {
      path: 'spending',
      name: 'count/spending',
      component: () => import('@/views/count/spending'),
      meta: {
        title: i18n.t('route.expenditureBill'),
        // icon: 'table'
      }
    },
    {
      path: 'incomeExpenses',
      name: 'count/incomeExpenses',
      component: () => import('@/views/count/incomeExpenses'),
      meta: {
        title: i18n.t('route.incomeExpenditureStatistics'),
        // icon: 'table'
      }
    },
    {
      path: 'members',
      name: 'count/members',
      component: () => import('@/views/count/members'),
      meta: {
        title: i18n.t('route.certifiedMembersStatistics'),
        // icon: 'table'
      }
    },
  ]
}]
