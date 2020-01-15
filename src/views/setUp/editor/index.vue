<!-- baseMsgSet -->
<template>
    <div id="baseMsgSet" class="pd-10 bfff">
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('webRichTextSettings.userAgreement')" name="first">
                <div class="pd-10">
                    <!-- <editor class="mg-b-5" ref="editor" v-model="formData.content"></editor> -->
                    <tinymce class="mg-b-5" ref="editor" v-model="formData.content" :height="300" />
                    <div class="tar">
                        <el-button @click="clear">{{$t('webRichTextSettings.clear')}}</el-button>
                        <el-button type="primary" @click="submit">{{$t('webRichTextSettings.confirm')}}</el-button>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('webRichTextSettings.abountPlatform')" name="third">
                <about></about>
            </el-tab-pane>
          <el-tab-pane :label="$t('webRichTextSettings.userInfo')" name="second">
          <negotiation></negotiation>
          </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import negotiation from "./negotiation";
import about from "./about";
import { setup, getMsg } from "@/api/setUp";
export default {
    name: 'baseMsgSet',
    data() {
        return {
            activeName: 'first',
            formData: {
                keyname: 'agreement',
                content: '',
                id: '',
            }
        };
    },
    components: {
        negotiation, about, Tinymce
    },
    computed: {},
    created() {
        const _this = this
        this.init()
    },
    methods: {
        async init() {
            let { keyname } = this.formData
            let form = { keyname }
            let res = await getMsg(form);
            this.formData.content = res.content;
            this.formData.id = res.id;
        },
        // 清空内容
        clear() {
            this.$confirm(this.$t('webRichTextSettings.clearTip'), $('webBaseTips.confirm'), {
                confirmButtonText: $('webBaseTips.confirmButtonText'),
                cancelButtonText: $('webBaseTips.cancelButtonText'),
                type: 'warning'
            }).then(() => {
                // this.$refs.editor.clear()
                // this.$refs.editor.destroyTinymce()
                this.$message({
                    type: 'success',
                    message:$('webBaseTips.deleSuccess')
                });
            })
        },
        async submit() {
            const { content, id } = this.formData;
            const form = {
                content,
                id
            }
            let res = await setup(form);
            this.$message({
                type: 'success',
                message: $('webBaseTips.editConfirm')
            });
        }
    }
};
</script>
<style scoped lang='less'>
</style>
