<template>
    <div id="manageBtnDialog">
        <!-- 创建角色Dialog -->
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="form" ref="ruleForm" :rules="rules" label-position="top">
                <el-form-item :label="$t('webModuleManagement.button_key')" prop="key">
                    <el-input
                        class="wd-50"
                        v-model="form.key"
                        autocomplete="off"
                        :placeholder="$t('webModuleManagement.button_key_format')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webModuleManagement.btnName_zh')" prop="name">
                    <el-input
                        class="wd-50"
                        v-model="form.name"
                        autocomplete="off"
                        :placeholder="$t('webModuleManagement.input_zh')"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
                <el-button type="primary" @click="ruleFormConfirm">{{$t('webBaseBtn.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            form: {
                name: '',
                value: '',
            },
            rules: {
                key: [
                    { required: true, message: this.$t('webModuleManagement.button_key_format'), trigger: 'blur' }
                ],
                name: [
                    { required: true, message: this.$t('webModuleManagement.input_zh'), trigger: 'blur' }
                ],
            },
        }
    },
    props: {
        title: String,
    },
    components: {},
    created() {

    },
    mounted() {
        const _this = this
        document.onkeydown = function (e) { // 回车提交表单
            // 兼容FF和IE和Opera
            var theEvent = window.event || e;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                _this.ruleFormConfirm()
            }
        }
    },
    methods: {
        async ruleFormConfirm() {
            this.$refs['ruleForm'].validate(async valid => {
                if (valid) {
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.addConfirm')
                    });
                    this.show = false;
                }
            })
        },
        cancel() {
            this.$refs["ruleForm"].resetFields();
            this.show = false
        }
    }
}
</script>

<style scoped>
</style>
