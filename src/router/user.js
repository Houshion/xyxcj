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
  path: '/user',
  component: Layout,
  redirect: '/user/index',
  name: 'user',
  alwaysShow: true,
  meta: {
    title: i18n.t('route.memberManagement'),
    icon: 'user'
  },
  children: [{
      path: 'index',
      name: 'user/index',
      component: () => import('@/views/user/index'),
      meta: {
        title: i18n.t('route.memberList'),
        // icon: 'table'
      }
    },
    {
      path: 'certification',
      name: 'user/certification',
      hidden: true,
      component: () => import('@/views/user/certification'),
      meta: {
        title: i18n.t('route.memberCertification'),
        // icon: 'table'
      }
    },
    {
      path: 'detail',
      name: 'user/detail',
      hidden: true,
      component: () => import('@/views/user/detail'),
      meta: {
        title: i18n.t('route.memberDetails'),
        // icon: 'table'
      }
    },
    {
      path: 'membersCard',
      name: 'user/membersCard',
      component: () => import('@/views/user/membersCard'),
      meta: {
        title: i18n.t('route.membershipCardList'),
        // icon: 'table'
      }
    },
    {
      path: 'deposit',
      name: 'user/deposit',
      component: () => import('@/views/user/deposit'),
      meta: {
        title: i18n.t('route.depositList'),
        // icon: 'table'
      }
    },
    {
      path: 'userGroups',
      name: 'user/userGroups',
      component: () => import('@/views/user/userGroups'),
      meta: {
        title: i18n.t('route.userGroupList'),
        // icon: 'table'
      }
    },
    {
      path: 'invitation',
      name: 'user/invitation',
      component: () => import('@/views/user/invitation'),
      meta: {
        title: i18n.t('route.invitationList'),
        // icon: 'table'
      }
    },
    {
      path: 'car',
      name: 'user/car',
      component: () => import('@/views/user/car'),
      meta: {
        title: i18n.t('route.carList'),
        // icon: 'table'
      }
    },
  ]
}]
