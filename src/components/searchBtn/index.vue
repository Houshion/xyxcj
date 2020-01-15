<!-- searchBtns -->
<template>
    <div id="searchBtns">
        <el-button
            icon="el-icon-search"
            type="primary"
            @click="$emit('search')"
        >{{$t('webBaseBtn.search')}}</el-button>
        <el-button icon="el-icon-refresh-left" @click="$emit('reset')">{{$t('webBaseBtn.reset')}}</el-button>
    </div>
</template>
<script>
export default {
    name: 'searchBtns',
    data() {
        return {};
    },
    components: {},
    computed: {},
    created() {
        const _this = this
    },
    mounted() {
        const _this = this;
        document.onkeydown = function (e) { // 回车提交表单
            // 兼容FF和IE和Opera
            var theEvent = window.event || e;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                // _this.$emit('search')
            }
        }
    },
    methods: {
    }
};
</script>
<style scoped lang='less'>
</style>