<template>
    <div id="btnManageDialog">
        <!-- 创建角色Dialog -->
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="form" ref="ruleForm" :rules="rules">
                <el-form-item :label="$t('webModuleManagement.button_key')">
                    <el-input
                        class="wd-50"
                        v-model="form.button_key"
                        autocomplete="off"
                        readonly
                        :placeholder="$t('webModuleManagement.button_key')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webModuleManagement.country')" prop="country_id">
                    <el-select
                        class="wd-50"
                        v-model="form.country_id"
                        :placeholder="$t('webModuleManagement.selectModule')"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('webModuleManagement.btnName')" prop="name">
                    <el-input
                        class="wd-50"
                        v-model="form.name"
                        readonly
                        autocomplete="off"
                        :placeholder="$t('webModuleManagement.btnName')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webModuleManagement.languagValue')" prop="button_value">
                    <el-input
                        class="wd-50"
                        v-model="form.button_value"
                        autocomplete="off"
                        :placeholder="$t('webModuleManagement.languagValue')"
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
                country_id: '',
                button_key: '',
                button_value: '',
                module_key: ''
            },
            rules: {
                name: [
                    { required: true, message: this.$t('webModuleManagement.rules_btnName'), trigger: 'blur' }
                ],
                country_id: [
                    { required: true, message: this.$t('webModuleManagement.selectLang'), trigger: 'change' }
                ],
                button_value: [
                    { required: true, message: this.$t('webModuleManagement.languagValue'), trigger: 'blur' }
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
