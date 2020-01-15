<!-- about -->
<template>
    <div id="about" class="pd-10">
        <el-form :model="formData" ref="form" label-width="120px" class="wd-100">
            <div class="box1 wd-70 mb20">
                <div>{{$t('webVersionSettings.apkConfig')}}</div>
                <div class="title mtb20">{{$t('webVersionSettings.platformName')}}:</div>
                <el-input :placeholder="$t('webVersionSettings.pleaseEnter')+'...'" class="wd-50" v-model="formData.title"></el-input>
                <div class="logo">
                    <div class="title mb20">logo:</div>
                    <omg @goUpload="upload" type="single" :singleImg="singleImg"></omg>
                </div>
            </div>
            <el-form-item :label="$t('webVersionSettings.version_num')+':'">
                <el-input v-model="formData.version_num"></el-input>
            </el-form-item>
            <el-form-item :label="$t('webVersionSettings.version_size')+':'">
                <el-input v-model="formData.version_size"></el-input>
            </el-form-item>
            <el-form-item :label="$t('webVersionSettings.downloadAddr')+':'">
                <el-upload
                    class="upload-demo"
                    :action="baseUrl+'/api/Public/upload'"
                    :before-upload="uploadApk"
                >
                    <el-button size="small" type="primary">{{$t('webVersionSettings.uploadApk')}}</el-button>
                </el-upload>
                <el-input v-model="formData.version_link"></el-input>
            </el-form-item>
            <el-form-item :label="$t('webVersionSettings.forceUpdate')+':'">
                <el-radio v-model="formData.update_status" label="1">{{$t('webVersionSettings.force')}}</el-radio>
                <el-radio v-model="formData.update_status" label="0">{{$t('webVersionSettings.noForce')}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('webVersionSettings.updateConent')+':'">
                <editor v-model="formData.centents"></editor>
            </el-form-item>
            <el-form-item :label="$t('webVersionSettings.status')+':'">
                <el-radio v-model="formData.status" label="0">{{$t('webVersionSettings.normal')}}</el-radio>
                <el-radio v-model="formData.status" label="1">{{$t('webVersionSettings.hide')}}</el-radio>
            </el-form-item>
            <div class="mg-t-20 tar wd-100">
                <el-button type="primary" @click="save(0)">{{$t('webBaseBtn.confirm')}}</el-button>
                <el-button type="primary" @click="reset(0)">{{$t('webBaseBtn.reset')}}</el-button>
            </div>
            <div class="box1 wd-70 mb20">
                <div>{{$t('webVersionSettings.memberApkConfig')}}</div>
            </div>
            <el-form-item :label="$t('webVersionSettings.version_num')+':'">
                <el-input v-model="formData.members.version_num"></el-input>
            </el-form-item>
            <el-form-item :label="$t('webVersionSettings.version_size')+':'">
                <el-input v-model="formData.members.version_size"></el-input>
            </el-form-item>
            <el-form-item :label="$t('webVersionSettings.downloadAddr')+':'">
                <el-upload
                    class="upload-demo"
                    :action="baseUrl+'/api/Public/upload'"
                    :before-upload="uploadApp"
                >
                    <el-button size="small" type="primary">{{$t('webVersionSettings.uploadApp')}}</el-button>
                </el-upload>
                <el-input v-model="formData.members.version_link"></el-input>
            </el-form-item>
            <el-form-item :label="$t('webVersionSettings.forceUpdate')+':'">
                  <el-radio v-model="formData.update_status" label="1">{{$t('webVersionSettings.force')}}</el-radio>
                <el-radio v-model="formData.update_status" label="0">{{$t('webVersionSettings.noForce')}}</el-radio>
            </el-form-item>
           <el-form-item :label="$t('webVersionSettings.updateConent')+':'">
                <editor v-model="formData.members.centents"></editor>
            </el-form-item>
            <el-form-item :label="$t('webVersionSettings.status')+':'">
                <el-radio v-model="formData.status" label="0">{{$t('webVersionSettings.normal')}}</el-radio>
                <el-radio v-model="formData.status" label="1">{{$t('webVersionSettings.hide')}}</el-radio>
            </el-form-item>
            <div class="mg-t-20 tar wd-100">
                <el-button type="primary" @click="save(1)">{{$t('webBaseBtn.confirm')}}</el-button>
                <el-button type="primary" @click="reset(1)">{{$t('webBaseBtn.reset')}}</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
import omg from "@/components/uploadImg";
import { versionDetail, versionEdit } from "@/api/setUp";
import { upload } from "@/api/imgFile";
import tools from '@/utils/tools';
export default {
    name: 'about',
    data() {
        return {
            baseUrl: process.env.VUE_APP_BASE_API,
            uploadParam: "",
            singleImg: "",
            dialogImageUrl: '',
            dialogVisible: false,
            formData: {
                id: '',
                centents: '',
                title: '',
                photos: '',
                version_num: '',
                version_size: '',
                version_link: '',
                update_status: '0',
                status: '0',
                members: {
                    id: '',
                    centents: '',
                    version_num: '',
                    version_size: '',
                    version_link: '',
                    update_status: '0',
                    status: '0',
                }
            },
        };
    },
    components: { omg },
    computed: {},
    created() {
        const _this = this
        this.init();
    },
    methods: {
        async init() {
            let res = await versionDetail({ type: '0' });
            console.log(res);
            this.singleImg = res.logo;
            let resApp = await versionDetail({ type: '1' })
            console.log(resApp);
            this.formData = {
                centents: res.content,
                title: res.name,
                photos: res.logo,
                version_num: res.newversion,
                version_size: res.packagesize,
                version_link: res.downloadurl,
                update_status: res.enforce.toString(),
                status: res.status.toString(),
                id: res.id,
                members: {
                    id: resApp.id,
                    centents: resApp.content,
                    version_num: resApp.newversion,
                    version_size: resApp.packagesize,
                    version_link: resApp.downloadurl,
                    update_status: resApp.enforce.toString(),
                    status: resApp.status.toString(),
                }
            }
        },
        // 保存修改
        async save(type) {
            console.log(this.formData)
            if (type == 0) {//apk
                this.setApk();
            } else {//app
                this.setApp();
            }
        },

        async reset(type) {
            this.$confirm(this.$t('webBaseTips.dialog'), this.$t('webBaseTips.confirm'), {
                confirmButtonText: this.$t('webBaseTips.confirmButtonText'),
                cancelButtonText: this.$t('webBaseTips.cancelButtonText'),
                type: 'warning'
            }).then(async () => {
                if (type == 0) {
                    this.setApk(true);
                } else {
                    this.setApp(true);
                }
            })
        },
        async upload(file) {
            const _this = this;
            // 上传单图头像
            _this.uploadParam = new FormData();
            _this.uploadParam.append("img", file, file.name);
            _this.uploadParam.append("type", '3');

            let res = await upload(_this.uploadParam);
            _this.singleImg = tools.globalData.url + res.savepath;
            _this.formData.photos = tools.globalData.url + res.savepath;
        },
        async setApk(reset = false) {
            const data = this.formData;
            let formData;
            if (reset) {
                formData = {
                    type: '0',
                    name: '',
                    logo: '',
                    id: data.id,
                    newversion: '',
                    packagesize: '',
                    content: '',
                    downloadurl: '',
                    enforce: '0',
                    status: '0',
                };
            } else {
                formData = {
                    type: '0',
                    name: data.title,
                    logo: data.photos,
                    id: data.id,
                    newversion: data.version_num,
                    packagesize: data.version_size,
                    content: data.centents,
                    downloadurl: data.version_link,
                    enforce: data.update_status,
                    status: data.status,
                };
            }
            let res = await versionEdit(formData);
            this.singleImg = res.logo;
            this.$message({
                message: reset ? this.$t('webVersionSettings.reset') : this.$t('webVersionSettings.save'),
                type: 'success',
                showClose: true,
            });
            this.init()
        },
        async setApp(reset = false) {
            const data = this.formData.members;
            let formData;
            if (reset) {
                formData = {
                    type: '1',
                    id: data.id,
                    newversion: '',
                    packagesize: '',
                    content: '',
                    downloadurl: '',
                    enforce: '0',
                    status: '0',
                };
            } else {
                formData = {
                    type: '1',
                    id: data.id,
                    newversion: data.version_num,
                    packagesize: data.version_size,
                    content: data.centents,
                    downloadurl: data.version_link,
                    enforce: data.update_status,
                    status: data.status,
                };
            }
            let res = await versionEdit(formData);
            this.$message({
                message: reset ? this.$t('webVersionSettings.reset') : this.$t('webVersionSettings.save'),
                type: 'success',
                showClose: true,
            });
            this.init()
        },
        async uploadApk(file) {
            let apkParam;
            apkParam = new FormData();
            apkParam.append("img", file, file.name);
            apkParam.append("type", '3');

            let res = await upload(apkParam);
            this.formData.version_link = this.baseUrl + res.savepath
        },
        async uploadApp(file) {
            let apkParam;
            apkParam = new FormData();
            apkParam.append("img", file, file.name);
            apkParam.append("type", '3');

            let res = await upload(apkParam);
            this.formData.members.version_link = this.baseUrl + res.savepath
        }
    }
};
</script>
<style scoped lang='less'>
.title {
  font-size: 16px;
  margin-top: 7px;
}
.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    font-size: 28px;
    color: #1abc9c;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    &:hover {
      border-color: #1abc9c;
    }
  }
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.box1 {
}
</style>
