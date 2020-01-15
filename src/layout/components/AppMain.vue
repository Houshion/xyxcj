<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
        <el-tab-pane
          class="mg-b-0 bfff"
          v-for="(item, index) in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <router-view :key="key"/>
        </el-tab-pane>
      </el-tabs>-->
      <router-view :key="key"/>
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.path
    // },
    ...mapGetters([
      'nav',
    ])
  },
  watch: {
    '$route.path': function (newVal, oldVal) {
      this.key = this.$route.path
    }
  },
  mounted() {
    this.$root.Bus.$on("reFresh", res => {
      console.log(res)
      this.key = res
    })
  },
  data() {
    return {
      key: this.$route.path,
      editableTabsValue: '1',
      editableTabs: [{
        title: 'Tab 1',
        name: '1',
      }, {
        title: 'Tab 2',
        name: ' 2',
      }],
      tabIndex: 1
    }
  },
  methods: {
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 100px);
  width: 100%;
  position: relative;
  overflow: hidden;
  top: 50px;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
.el-tabs__header {
  margin: 0;
  background: #ffffff;
}
</style>
