<!-- about -->
<template>
    <div id="about" class="pd-10">
        <div class="title mb10">{{$t('webVersionSettings.platformName')}}:</div>
        <el-input :placeholder="$t('webVersionSettings.pleaseEnter')" class="wd-50" v-model="formData.title"></el-input>
        <div class="logo">
            <div class="title mb10">logo:</div>
            <omg @goUpload="upload" type="single" :singleImg="singleImg"></omg>
            <!-- <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
            >
                <img v-if="imageUrl" :src="formData.photos" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>-->
        </div>
        <div class="title mtb20">{{$t('webRichTextSettings.userAgreement')}}:</div>
        <!-- <editor v-model="formData.content"></editor> -->
        <tinymce ref="editor" v-model="formData.content" :height="300"/>
        <div class="mg-t-20 tar wd-100">
            <el-button type="primary" @click="save">{{$t('webMemberMoneySettings.save')}}</el-button>
        </div>
    </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import omg from "@/components/uploadImg";
import { getMsg, setup } from "@/api/setUp";
import { upload } from "@/api/imgFile";
import tools from '@/utils/tools';
export default {
    name: 'about',
    data() {
        return {
            uploadParam: "",
            singleImg: "",
            dialogImageUrl: '',
            dialogVisible: false,
            formData: {
                content: '',
                title: '',
                pic: '',
                id: ''
            }
        };
    },
    components: { omg, Tinymce },
    computed: {},
    created() {
        const _this = this
        this.init()
    },
    methods: {
        async init() {
            let form = { keyname: 'about' };
            let res = await getMsg(form);
            this.singleImg = res.pic;
            this.formData = res;
        },
        // 保存修改
        async save() {
            console.log(this.formData)
            let res = await setup(this.formData)
            this.singleImg = res.pic
            this.$message({
                message: this.$t('webVersionSettings.save'),
                type: 'success',
                showClose: true,
            });
            this.init();
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error(this.$t('webRichTextSettings.imgTypeTip'));
            }
            if (!isLt2M) {
                this.$message.error(this.$t('webRichTextSettings.imgSizeTip'));
            }
            return isJPG && isLt2M;
        },
        async upload(file) {
            const _this = this;
            // 上传单图头像
            _this.uploadParam = new FormData();
            _this.uploadParam.append("img", file, file.name);
            _this.uploadParam.append("type", '3');

            let res = await upload(_this.uploadParam)
            console.log(res)
            _this.singleImg = tools.globalData.url + res.savepath;
            _this.formData.pic = tools.globalData.url + res.savepath;
        },
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
</style>
