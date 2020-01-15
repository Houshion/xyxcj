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
  path: '/setUp',
  component: Layout,
  redirect: '/setUp/editor',
  name: 'setUp',
  meta: {
    title: i18n.t('route.systemSettings'),
    icon: 'setting'
  },
  children: [{
      path: 'editor',
      name: 'setUp/editor',
      component: () => import('@/views/setUp/editor/index'),
      meta: {
        title: i18n.t('route.richTextSettings'),
        // icon: 'setting'
      }
    },
    {
      path: 'rate',
      name: 'setUp/rate',
      component: () => import('@/views/setUp/rate'),
      meta: {
        title: i18n.t('route.memberMoneySettings'),
        // icon: 'setting'
      }
    },
    {
      path: 'question',
      name: 'setUp/question',
      component: () => import('@/views/setUp/question'),
      meta: {
        title: i18n.t('route.commonProblem'),
        // icon: 'setting'
      }
    },
    {
      path: 'language',
      name: 'setUp/language',
      hidden: true,
      redirect: '/setUp/language/languageManage',
      component: () => import('@/views/setUp/language/index'),
      meta: {
        title: i18n.t('route.languageManagement'),
        // icon: 'setting'
      },
      children: [{
          path: 'languageManage',
          name: 'setUp/language/languageManage',
          component: () => import('@/views/setUp/language/languageManage'),
          meta: {
            title: i18n.t('route.languageManagement'),
            // icon: 'setting'
          },
        },
        {
          path: 'moduleManage',
          name: 'setUp/language/moduleManage',
          component: () => import('@/views/setUp/language/moduleManage'),
          meta: {
            title: i18n.t('route.moduleManagement'),
            // icon: 'setting'
          },
        },
        {
          path: 'moduleDetail',
          name: 'setUp/language/moduleDetail',
          hidden: true,
          component: () => import('@/views/setUp/language/moduleDetail'),
          meta: {
            title: i18n.t('route.detail'),
            // icon: 'setting'
          },
        },
        {
          path: 'btnManage',
          name: 'setUp/language/btnManage',
          hidden: true,
          component: () => import('@/views/setUp/language/btnManage'),
          meta: {
            title: i18n.t('route.btnManage'),
            // icon: 'setting'
          },
        },
        {
          path: 'btnManageDetail',
          name: 'setUp/language/btnManageDetail',
          hidden: true,
          component: () => import('@/views/setUp/language/btnManageDetail'),
          meta: {
            title: i18n.t('route.detail'),
            // icon: 'setting'
          },
        },
      ]
    },
    {
      path: 'version',
      name: 'setUp/version',
      component: () => import('@/views/setUp/version'),
      meta: {
        title: i18n.t('route.versionSettings'),
        // icon: 'setting'
      }
    },
    {
      path: 'account',
      name: 'setUp/account',
      component: () => import('@/views/setUp/account'),
      meta: {
        title: i18n.t('route.accountSettings'),
        // icon: 'setting'
      }
    },
    {
      path: 'code',
      name: 'setUp/code',
      component: () => import('@/views/setUp/code'),
      meta: {
        title: i18n.t('route.areaCodeSettings'),
        // icon: 'setting'
      }
    },
  ]
}]
