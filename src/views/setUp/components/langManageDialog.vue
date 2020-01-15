<template>
    <div id="langManageAddDialog">
        <!-- 创建角色Dialog -->
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="form" ref="ruleForm" :rules="rules">
                <el-form-item :label="$t('webModuleManagement.module_key')" prop="module_key">
                    <el-input
                        class="wd-50"
                        v-model="form.module_key"
                        autocomplete="off"
                        :placeholder="$t('webModuleManagement.module_key')"
                        :readonly="add?false:true"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webModuleManagement.name')" prop="name">
                    <el-input
                        class="wd-50"
                        v-model="form.name"
                        autocomplete="off"
                        :placeholder="$t('webModuleManagement.name')"
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
import { moduleAdd, moduleEdit, moduleInfo } from "@/api/languageManage/module";
export default {
    data() {
        return {
            show: false,
            form: {
                name: '',
                module_key: '',
            },
            rules: {
                module_key: [
                    { required: true, message: this.$t('webModuleManagement.pleaseEnterKey'), trigger: 'blur' }
                ],
                name: [
                    { required: true, message: this.$t('webModuleManagement.pleaseEnterName'), trigger: 'blur' }
                ],
            },
            add: true,
            detail: null
        }
    },
    props: {
        title: String,
    },
    components: {},
    created() { },
    watch: {
        async show(val) {
            if (!val) return false;
            if (this.form.id) {
                this.add = false
                this.form = await moduleInfo({ id: this.form.id })
            } else {
                this.add = true
                console.log('新增')
            }
        },
        // form: {
        //     handler(newVal, oldVal) {
        //         console.log(newVal)
        //         // if (this.form.id) {
        //         //     console.log("编辑")
        //         // } else {
        //         //     console.log('新增')
        //         // }
        //     },
        //     immediate: true,
        //     deep: true
        // }
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
                    delete this.form.createTime
                    let msg = this.$t('webBaseTips.addConfirm')
                    if (this.add) {
                        await moduleAdd(this.form)
                    } else {
                        msg = this.$t('webBaseTips.editConfirm')
                        await moduleEdit(this.form)
                    }
                    this.$message({
                        type: 'success',
                        message: msg
                    });
                    this.show = false;
                    this.$parent.init()
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
