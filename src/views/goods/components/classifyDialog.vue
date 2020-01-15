<!-- classifyDialog -->
<template>
    <div id="classifyDialog">
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item :label="$t('webGoodsClassify.dia_name')" prop="type_name">
                    <el-input
                        class="wd-50"
                        v-model="form.type_name"
                        :placeholder="$t('webGoodsClassify.rules_name')"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
                <el-button type="primary" @click="submitForm">{{$t('webBaseBtn.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { goodsTypeAdd, goodsTypeInfo } from "@/api/goods";
export default {
    props: {
        title: String,
    },
    name: 'classifyDialog',
    data() {
        return {
            show: false,
            id: '',
            upload: false,
            form: {
                type_name: '',
            },
            rules: {
                type_name: [
                    { required: true, message: this.$t('webGoodsClassify.rules_name'), trigger: 'blur' }
                ],

            }
        };
    },
    computed: {},
    watch: {
        upload(val) {
            if (this.id) {
                this.init();
            }
        }
    },
    created() {

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
        async init() {
            const res = await goodsTypeInfo({ type_id: this.id });
            this.form.type_name = res.find.type_name;
        },
        submitForm() {
            this.$refs["ruleForm"].validate(async (valid) => {
                if (valid) {
                    const form = {
                        type_id: this.id,
                        type_name: this.form.type_name
                    }
                    await goodsTypeAdd(form);
                    if (this.id) {
                        this.$message({
                            type: 'success',
                            message: this.$t('webBaseTips.editConfirm')
                        });
                    } else {
                        this.$message({
                            type: 'success',
                            message: this.$t('webBaseTips.editConfirm')
                        });
                    }
                    this.show = false;
                    this.$emit("uploadEvent", '1');
                }
            });
        },
        cancel() {//取消
            this.$refs["ruleForm"].resetFields();
            this.show = false;
        },
    },
};
</script>
<style scoped lang='less'>
</style>
