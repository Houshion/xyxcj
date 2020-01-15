<!-- navBasicBtn -->
<template>
    <div id="navBasicBtn">
        <el-button type="mini" @click="refresh" icon="el-icon-refresh">{{$t('webBaseBtn.refresh')}}</el-button>
        <el-button type="mini" @click="goback" icon="el-icon-arrow-left">{{$t('webBaseBtn.back')}}</el-button>
    </div>
</template>
<script>
export default {
    name: 'navBasicBtn',
    data() {
        return {};
    },
    components: {},
    computed: {},
    created() {
        const _this = this
    },
    methods: {
        refresh() {
            // const { fullPath } = this.$route
            // this.$router.replace({path:  '/redirect'})
            this.$root.Bus.$emit("reFresh", this.$route.path + new Date())
        },
        goback() {
            this.$router.go(-1)
        },
    }
};
</script>
<style scoped lang='less'>
</style>
