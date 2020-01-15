<template>
    <div id="account" class="pd-10 bfff">
        <el-form :model="form" ref="form" :rules="rules" label-width="120px" class="wd-50">
            <div class="headerImgBox flex_aj flex_column mt40">
                <omg @goUpload="upload" type="single" :singleImg="singleImg" class="img_logo"></omg>
                <p class="color1 mt10">{{$t('webAccountSettings.uploadPhoto')}}</p>
            </div>
            <el-form-item :label="$t('webAccountSettings.name')+':'">
                <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('webAccountSettings.role')+':'">
                <el-input v-model="form.type" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('webAccountSettings.account')+':'">
                <el-input v-model="form.account" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('webAccountSettings.phone')+':'">
                <el-input v-model="form.phone" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('webAccountSettings.oldPw')+':'" prop="oldPw">
                <el-input v-model="form.oldPw" show-password></el-input>
            </el-form-item>
            <el-form-item :label="$t('webAccountSettings.newPw')+':'" prop="newPw">
                <el-input v-model="form.newPw" show-password></el-input>
            </el-form-item>
            <el-form-item :label="$t('webAccountSettings.confirmPw')+':'" prop="confirmPw">
                <el-input v-model="form.confirmPw" show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">{{$t('webAccountSettings.submit')}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { accountDetail, setAccount } from "@/api/setUp";
import { upload } from "@/api/imgFile";
import omg from "@/components/uploadImg";
import tools from '@/utils/tools';
export default {
    name: 'account',
    data() {
        const pw = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('webAdministratorList.pleaseEnterPasswordAgain')));
            } else if (value !== this.form.newPw) {
                callback(new Error(this.$t('webAdministratorList.notMatchTwoPasswords')));
            } else {
                callback();
            }
        };
        return {
            form: {
                name: '',
                type: '',
                account: '',
                phone: '',
                oldPw: '',
                newPw: '',
                confirmPw: '',
            },
            rules: {
                oldPw: [
                    { required: true, message: this.$t('webAccountSettings.input_oldPw'), trigger: 'blur' },
                    { min: 6, max: 10, message: this.$t('webAccountSettings.input_oldPw'), trigger: 'blur' }
                ],
                newPw: [
                    { required: true, message: this.$t('webAccountSettings.input_newPw'), trigger: 'blur' },
                    { min: 6, max: 10, message: this.$t('webAccountSettings.input_newPw_tip'), trigger: 'blur' }
                ],
                confirmPw: [
                    { required: true, message: this.$t('webAccountSettings.input_confirmPw'), trigger: 'blur' },
                    { min: 6, max: 10, message: this.$t('webAccountSettings.input_confirmPw_tip'), trigger: 'blur' },
                    { validator: pw, trigger: 'blur' }
                ],
            },
            uploadParam: "",
            singleImg: "",

        }
    },
    components: { omg },
    created() {
        this.init();
    },
    mounted() {
        const _this = this
        document.onkeydown = function (e) { // 回车提交表单
            // 兼容FF和IE和Opera
            var theEvent = window.event || e;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                _this.onSubmit()
            }
        }
    },
    methods: {
        async init() {
            let res = await accountDetail({});
            this.form = {
                mid: res.mid,
                name: res.nickname,
                type: res.type == 1 ? this.$t('webAccountSettings.admin') : res.type == 2 ? this.$t('webAccountSettings.manager') : this.$t('webAccountSettings.staff'),
                account: res.username,
                phone: res.mobile,
                oldPw: '',
                newPw: '',
                confirmPw: '',
            }
            this.singleImg = res.avatar;
        },
        async upload(file) {
            const _this = this;
            // 上传单图头像
            _this.uploadParam = new FormData();
            _this.uploadParam.append("img", file, file.name);
            _this.uploadParam.append("type", '3');

            let res = await upload(_this.uploadParam);
            _this.singleImg = tools.globalData.url + res.savepath;
            _this.form.avatar = tools.globalData.url + res.savepath;
        },
        onSubmit() {
            this.$refs["form"].validate(async (valid) => {
                if (valid) {
                    const form = {
                        mid: this.form.mid,
                        avatar: this.singleImg,
                        oldpassword: this.form.oldPw,
                        password: this.form.newPw,
                    };
                    let res = await setAccount(form);
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.submitSuccess')
                    });
                }
            });
        }
    }
}
</script>

<style lang="scss">
#account {
  .avatar-uploader {
    width: 100px;
    height: 100px;
  }
  .avatar-uploader:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
}
.headerImgBox {
  margin-bottom: 20px;
  margin-left: 120px;
}
</style>
