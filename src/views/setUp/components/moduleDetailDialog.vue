<template>
    <div id="btnManageDialog">
        <!-- 创建角色Dialog -->
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="form" ref="ruleForm" :rules="rules">
                <el-form-item :label="$t('webModuleManagement.module_key')">
                    <el-input
                        class="wd-50"
                        v-model="form.module_key"
                        autocomplete="off"
                        readonly
                        :placeholder="$t('webModuleManagement.module_key')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webModuleManagement.button_key')" prop="button_key">
                    <el-input
                        class="wd-50"
                        v-model="form.button_key"
                        autocomplete="off"
                        :placeholder="$t('webModuleManagement.button_key')"
                        :readonly="add?false:true"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webModuleManagement.btn_name')" prop="name">
                    <el-input
                        class="wd-50"
                        v-model="form.name"
                        autocomplete="off"
                        :placeholder="$t('webModuleManagement.btn_name')"
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
import { langList } from "@/api/languageManage/language";
import { btnAdd, btnEdit, btnInfo } from "@/api/languageManage/btnManage";
export default {
    data() {
        return {
            show: false,
            form: {
                name: '',
                button_key: '',
                module_key: '',
            },
            rules: {
                name: [
                    { required: true, message: this.$t('webModuleManagement.rules_btnName'), trigger: 'blur' }
                ],
                button_key: [
                    { required: true, message: this.$t('webModuleManagement.selectLang'), trigger: 'blur' }
                ],
            },
            options: [],
            add: true,
        }
    },
    props: {
        title: String,
    },
    components: {},
    created() {
        this.init()
    },
    watch: {
        async show(val) {
            if (!val) return false
            console.log(this.form.id)
            if (!this.form.id) {
                this.add = true
            } else {
                this.add = false
                this.form = await btnInfo({ id: this.form.id })
            }
        }
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
        async init() {
            const res = await langList({
                pageNo: 1,
                pageSize: 999
            });
            let arr = new Array();
            res.records.forEach(item => {
                arr.push({
                    value: item.id,
                    label: item.language
                })
            });
            this.options = arr
        },
        ruleFormConfirm() {
            this.$refs['ruleForm'].validate(async valid => {
                if (valid) {
                    let msg = this.$t('webBaseTips.editConfirm')
                    if (this.add) {
                        msg = this.$t('webBaseTips.addConfirm')
                        await btnAdd(this.form)
                    } else {
                        await btnEdit(this.form)
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
