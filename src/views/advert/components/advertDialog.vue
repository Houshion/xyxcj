<!-- classifyDialog -->
<template>
    <div id="classifyDialog">
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-row :gutter="10">
                    <el-col :span="14">
                        <el-form-item :label="$t('webAdvert.advertName')" prop="name">
                            <el-input v-model="form.name" autocomplete="off" :placeholder="$t('webAdvert.input_goodsName')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" v-if="false">
                    <el-col :span="7">
                        <el-form-item :label="$t('webAdvert.advertType')" prop="type">
                            <el-select v-model="form.type" :placeholder="$t('webAdvert.changeType')" @change="typeChange">
                                <el-option label="$t('webAdvert.img')" value="$t('webAdvert.img')"></el-option>
                                <el-option label="$t('webAdvert.video')" value="$t('webAdvert.video')"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="14">
                        <el-form-item :label="$t('webAdvert.img_video')" prop="imgList">
                            <el-upload
                                ref="upload"
                                class="upload-demo el-input"
                                :action="form.url+'/api/Public/upload'"
                                :on-success="onsuccess"
                                :on-remove="handleRemove"
                                list-type="picture"
                                :file-list="form.img"
                                :data="uploadData"
                                :before-upload="beforeuploadImg"
                                :auto-upload="true"
                            >
                                <el-button slot="trigger" size="small" type="info">{{$t('webAdvert.changeImg')}}</el-button>
                                <!-- <el-button size="small" type="primary" @click="submitFile">上传</el-button> -->
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="7">
                        <el-form-item :label="$t('webAdvert.branch')" prop="classify">
                            <el-select
                                v-model="form.classify"
                                :placeholder="$t('webAdvert.changeType')"
                                @change="classifyChange"
                            >
                                <el-option
                                    v-for="(item,idx) in classify"
                                    :key="idx"
                                    :label="item.shop_name"
                                    :value="item.shop_id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
                <el-button type="primary" @click="submitForm">{{$t('webBaseBtn.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>

import { shopId, upload, add_save, advertList } from '@/api/advert'
export default {
    props: {
        title: String,
    },
    name: 'classifyDialog',
    data() {
        return {
            show: false,
            disabled: false,
            form: {
                name: '',
                img: [],
                imgList: [],
                type: this.$t('webAdvert.img'),
                url: process.env.VUE_APP_BASE_API,
                classify: '',
                id: '',
                submit_type: 'add'
            },
            classify: [],
            rules: {
                name: [
                    { required: true, message: this.$t('webAdvert.input_goodsName'), trigger: 'blur' },
                ],
                imgList: [
                    { required: true, message: this.$t('webAdvert.upload_file'), trigger: 'change' }
                ],
                // type: [
                //     { required: true, message: '请选择商品类型', trigger: 'change' }
                // ],
                classify: [
                    { required: true, message: this.$t('webAdvert.input_type'), trigger: 'change' }
                ]
            },
            uploadData: {
                type: 1
            }
        };
    },
    computed: {},
    created() {
        const _this = this
        console.log(this.form.url)
        shopId().then(res => {
            _this.classify = res.records
            console.log(_this.classify)
        })
    },
    mounted() {
        const _this = this
        document.onkeydown = function (e) { // 回车提交表单
            // 兼容FF和IE和Opera
            var theEvent = window.event || e;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                _this.submitForm()
            }
        }
    },
    methods: {
        handleRemove(file, fileList) {
            // this.form.imgList = fileList
            // this.$message({
            //     message: this.form.type == '图片' ? '只能上传图片' : '只能上传视频',
            //     type: 'warning'
            // });
            this.beforeUpload(fileList)
        },
        onsuccess(response, file, fileList) {
            console.log(file)
            // if (this.form.type == '图片' && file.type.split('/')[0] != 'image') {
            //     console.log("不是图片")
            // } else if (file.type.split('/')[0] != 'video') {
            //     console.log("不是视频")
            // }
            this.beforeUpload(fileList)
        },
        submitForm() {
            let that = this
            console.log(this.form.imgList)
            this.$refs.ruleForm.validate((valid) => {
                console.log(valid)
                if (valid) {
                    this.show = false;
                    let param = {
                        id: this.form.id,
                        title: this.form.name,
                        shop_id: this.form.classify,
                        detail: this.form.imgList.toString(),
                        // type: this.form.type == '图片' ? 1 : 2
                    }
                    add_save(this.form.submit_type, param).then(res => {
                        console.log(res)
                        this.$message({
                            type: 'success',
                            message: this.$t('webAdvert.AddedSuccessfully')
                        });
                        this.$parent.init()
                        this.cancel()
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancel() {
            this.form = {
                name: '',
                img: [],
                imgList: [],
                type: this.$t('webAdvert.img'),
                classify: '',
                id: '',
                submit_type: 'add'
            }
            this.$refs.ruleForm.resetFields();
            this.show = false
        },
        beforeuploadImg(e) {
            if (e.size > 5242880) {
                this.$message(this.$t('webAdvert.uploadTip'))
                return false
            }
            console.log(e)
            // if (this.form.type == '图片') {
            //     if (e.type.split('/')[0] != 'image') {
            //         this.$message({
            //             message: '只能上传图片',
            //             type: 'warning'
            //         });
            //         return false;
            //     }
            // } else {
            //     if (e.type.split('/')[0] != 'video') {
            //         this.$message({
            //             message: '只能上传视频',
            //             type: 'warning'
            //         });
            //         return false;
            //     }
            // }
            this.disabled = true;
            console.log('this.form', this.form)
        },
        typeChange(e) {
            console.log(e)
            this.form.type = e
            this.uploadData.type == this.$t('webAdvert.img') ? 1 : 2
        },
        classifyChange(e) {
            console.log(e)
            this.form.classify = e
        },

        //接口
        uploadApi(img, name) {
            let that = this;
            let data = new FormData();
            data.append('type', that.form.type == this.$t('webAdvert.img') ? 1 : 2);
            data.append('img', img);
            upload(data).then(res => {
                console.log(res)
                that.form.img.push({ name: name, url: that.form.url + res.savepath, uid: Date.now(), status: "success" })
                // that.form.imgList.push(that.form.url + res.savepath)
                console.log(that.form.img)
            })
        },
        beforeUpload(fileList) {
            console.log(fileList)
            this.disabled = false
            this.form.img = []
            this.form.imgList = []
            fileList.forEach(item => {
                if (item.response) {
                    this.form.img.push({ name: item.name, url: item.response.data.savepath, uid: item.name + Date.now(), status: "success" })
                    this.form.imgList.push(item.response.data.savepath)
                } else {
                    this.form.img.push({ name: item.name, url: item.url, uid: item.name + Date.now(), status: "success" })
                    this.form.imgList.push(item.url)
                }
            });
        },
        submitFile() {
            if (this.disabled) return this.$message(this.$t('webAdvert.uploadLoading'))
            this.$refs.upload.submit();
        }
    },
};
</script>
<style scoped lang='less'>
</style>