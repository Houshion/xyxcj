<!-- negotiation -->
<template>
    <div id="negotiation" class="pd-10">
        <div class="title mb10">{{$t('webRichTextSettings.userInfo')}}:</div>
        <el-input placeholder="请输入..." class="wd-50" v-model="formData.content"></el-input>
        <div class="mg-t-20 tar wd-100">
            <el-button type="primary" @click="save">{{$t('webRichTextSettings.save')}}</el-button>
        </div>
    </div>
</template>
<script>
import { getlist, setup } from "@/api/setUp";
export default {
    name: 'negotiation',
    data() {
        return {
            formData: {
                id:'',
                content: '',
            }
        };
    },
    computed: {},
    created() {
        this.init()
    },
    methods: {
        async init() {
            let form = { keyname: 'tips' }
            let res = await getlist(form);
            this.formData = res;
        },
        // 保存修改
        async save() {
            await setup(this.formData)
            this.$message({
                message: $('webVersionSettings.save'),
                type: 'success',
            });
            this.init()
        },
    }
};
</script>
<style scoped lang='less'>
.title {
  font-size: 16px;
  margin-top: 7px;
}
</style>
