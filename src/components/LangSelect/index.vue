<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language"/>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        :disabled="language===item.keyname"
        :command="item.keyname"
        v-for="(item,index) in langList"
        :key="index"
      >{{item.language}}</el-dropdown-item>
      <!-- <el-dropdown-item :disabled="language==='zh'" command="zh">简体中文</el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">English</el-dropdown-item> -->
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { getLang } from "@/api/changeLanguage";
export default {
  data() {
    return {
      langList: []
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  created() {
    getLang().then(res => {
      this.langList = res
    })
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('app/setLanguage', lang)
      this.$message({
        message: this.$t('webLanguageManagement.change_language'),
        type: 'success'
      })
    }
  }
}
</script>
