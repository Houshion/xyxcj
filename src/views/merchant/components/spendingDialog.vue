<!-- classifyDialog -->
<template>
    <div id="spendingDialog">
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item :label="$t('webMerchantSpending.dia_title')" prop="title">
                    <el-input
                        class="wd-50"
                        v-model="form.title"
                        :placeholder="$t('webMerchantSpending.rules_title')"
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
import { expensesTypeAdd } from "@/api/merchant";
export default {
    props: {
        title: String,
    },
    name: 'spendingDialog',
    data() {
        return {
            show: false,
            id: '',
            upload: false,
            form: {
                title: '',
            },
            rules: {
                title: [
                    { required: true, message: this.$t('webMerchantSpending.rules_title'), trigger: 'change' }
                ],

            }
        };
    },
    computed: {},
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
        submitForm() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    const form = {
                        id: this.id,
                        title: this.form.title
                    }
                    await expensesTypeAdd(form);
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
        cancel() {
            this.$refs.ruleForm.resetFields();
            this.show = false
        }
    },
};
</script>
<style scoped lang='less'>
</style>
