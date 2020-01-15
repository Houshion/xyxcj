<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse"/>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        unique-opened
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routeList"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenu } from '@/api/user'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  data() {
    return {
      routeList: '',
      list: ''
    }
  },
  components: { SidebarItem, Logo },
  created() {
    console.log('个人信息')
    console.log(this.userInfo)
    // return this.routeList = this.routes;
    getMenu().then(res => {
      let routeList = new Array()
      if (this.userInfo.type == 1) {
        routeList.push(this.routes[0])
      }
      console.log(123)
      this.routes.forEach(route => {
        res.records.forEach(list => {
          if (route.meta && (list.menu_name == route.meta.title || list.menu_hk == route.meta.title || list.menu_en == route.meta.title)) {
            route.children = this.author(route.children, list.childlist)
            routeList.push(route)
          }
        });
      });
      this.routeList = routeList
      // this.list = res.records
    })
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    // newList() {
    //   const _this = this;
    //   console.log(this.list)
    //   console.log(this.routeList)
    //   let routeList = new Array()
    //   _this.list.forEach(list => {
    //     _this.routeList.forEach(route => {
    //       if (_this.routeList.meta.children.length == _this.list.childlist.length) {

    //       }
    //       console.log("新的菜单", routeList)
    //     });
    //   });
    // }
  },
  methods: {
    author(routeChild, listChild) {
      const _this = this;
      let authors = [];
      // return console.log(routeChild, listChild)
      let routeListArr = new Array()
      routeChild.forEach(route => {
        listChild.forEach(list => {
          if (route.meta.title == list.menu_name || route.meta.title == list.menu_hk || route.meta.title == list.menu_en) {
            authors.push(route)
          }
        });
      });
      return authors;
    }
  }
}
</script>
