<template>
    <div id="languageIndexDialog">
        <!-- 创建角色Dialog -->
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="form" ref="ruleForm" :rules="rules" label-width="85px">
                <el-form-item :label="$t('webLanguageManagement.name')" prop="name">
                    <el-input
                        class="wd-50"
                        v-model="form.name"
                        autocomplete="off"
                        :placeholder="$t('webLanguageManagement.pleaseEnterName')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="keyname" prop="keyname">
                    <el-input
                        class="wd-50"
                        v-model="form.keyname"
                        autocomplete="off"
                        :placeholder="$t('webLanguageManagement.input_keyname')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webLanguageManagement.language')" prop="language">
                    <el-input
                        class="wd-50"
                        v-model="form.language"
                        autocomplete="off"
                        :placeholder="$t('webLanguageManagement.pleaseEnterLanguage')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webLanguageManagement.img_url')" prop="img_url">
                    <omg @goUpload="upload" type="single" :singleImg="form.img_url"></omg>
                </el-form-item>
                <el-form-item :label="$t('webLanguageManagement.version')" prop="version">
                    <el-input
                        class="wd-50"
                        v-model="form.version"
                        autocomplete="off"
                        :placeholder="$t('webLanguageManagement.pleaseEnterVersion')"
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
import omg from "@/components/uploadImg";
import { upload } from "@/api/imgFile";
import { langAdd, langEdit, langInfo } from "@/api/languageManage/language";
import tools from '@/utils/tools';
export default {
    name: 'languageIndexDialog',
    data() {
        return {
            id: '',
            show: false,
            form: {
                name: '',
                language: '',
                img_url: '',
                version: '',
            },
            langMsg: '',
            rules: {
                name: [
                    { required: true, message: this.$t('webLanguageManagement.pleaseEnterLanguageName'), trigger: 'blur' }
                ],
                keyname: [
                    { required: true, message: this.$t('webLanguageManagement.pleaseEnterLanguage'), trigger: 'blur' }
                ],
                language: [
                    { required: true, message: this.$t('webLanguageManagement.pleaseEnterLanguage'), trigger: 'blur' }
                ],
                img_url: [
                    { required: true, message: this.$t('webLanguageManagement.chooseImg'), trigger: 'change' }
                ],
                version: [
                    { required: true, message: this.$t('webLanguageManagement.pleaseEnterVersion'), trigger: 'blur' }
                ],
            },
            uploadParam: "",
        }
    },
    props: {
        title: String,
    },
    components: { omg },
    created() {

    },
    watch: {
        langMsg() {
            this.form = this.langMsg
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
        async getInfo(id) {
            const res = await langInfo({ id })
            this.form = res
            this.show = true
            console.log(this.form)
        },
        async upload(file) {
            const _this = this;
            // 上传单图头像
            _this.uploadParam = new FormData();
            _this.uploadParam.append("img", file, file.name);
            _this.uploadParam.append("type", '3');

            let res = await upload(_this.uploadParam);
            _this.form.img_url = tools.globalData.url + res.savepath;
        },
        ruleFormConfirm() {
            this.$refs['ruleForm'].validate(async valid => {
                if (valid) {
                    let msg = this.$t('webBaseTips.editConfirm')
                    if (this.title == this.$t('webLanguageManagement.add')) {
                        msg = this.$t('webBaseTips.addConfirm')
                        await langAdd(this.form)
                    } else {
                        await langEdit(this.form)
                    }
                    this.$message({
                        type: 'success',
                        message: msg
                    });
                    this.$refs["ruleForm"].resetFields();
                    this.show = false;
                    this.$parent.init()
                }
            })
        },
        cancel() {
            this.$refs["ruleForm"].resetFields();
            this.form = {
                name: '',
                language: '',
                img_url: '',
                version: '',
            };
            this.show = false
            console.log(this.$parent.tableData)
        }
    }
}
</script>

<style scoped>
</style>
