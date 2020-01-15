<!-- goodsDialog -->
<template>
    <div id="deviceListDialog">
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item :label="$t('webDeviceList.dia_title')" prop="title">
                    <el-input
                        class="wd-50"
                        v-model="form.title"
                        autocomplete="off"
                        :placeholder="$t('webDeviceList.rules_title')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webDeviceList.dia_macno')" prop="macno">
                    <el-input
                        class="wd-50"
                        v-model="form.macno"
                        autocomplete="off"
                        :placeholder="$t('webDeviceList.rules_macno')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webDeviceList.dia_shop_id')" prop="shop_id">
                    <el-select
                        class="wd-50"
                        v-model="form.shop_id"
                        :placeholder="$t('webDeviceList.rules_shop_id')"
                    >
                        <el-option
                            v-for="item in shops"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('webDeviceList.dia_sense_len')" prop="sense_len">
                    <el-input
                        class="wd-50"
                        v-model="form.sense_len"
                        autocomplete="off"
                        :placeholder="$t('webDeviceList.rules_sense_len')"
                    >
                        <template slot="append">cm</template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('webDeviceList.dia_type')" prop="type">
                    <el-radio v-model="form.open" :label="1">{{$t('webDeviceList.statusOpen')}}</el-radio>
                    <el-radio v-model="form.open" :label="0">{{$t('webDeviceList.statusStop')}}</el-radio>
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
import { deviceEdit, deviceInfo } from "@/api/device";
export default {
    props: {
        title: String,
        shops: Array
    },
    name: 'goodsDialog',
    data() {
        return {
            show: false,
            disabled: false,
            form: {
                id: '',
                title: '',
                macno: '',
                shop_id: '',
                sense_len: '',
                open: 1,
            },
            rules: {
                shop_id: [
                    { required: true, message: this.$t('webDeviceList.rules_title'), trigger: 'change' }
                ],
                title: [
                    { required: true, message: this.$t('webDeviceList.rules_macno'), trigger: 'blur' },
                ],
                sense_len: [
                    { required: true, message: this.$t('webDeviceList.rules_shop_id'), trigger: 'blur' }
                ],
                macno: [
                    { required: true, message: this.$t('webDeviceList.rules_sense_len') },
                ],
            },
        };
    },
    computed: {},
    created() {
        const _this = this
    },
    watch: {
        show(val) {
            if (!val) return false;
            if (this.form.id) {
                deviceInfo({ id: this.form.id }).then(res => {
                    this.form = res.find
                })
            } else {
                this.form = {
                    id: '',
                    title: '',
                    macno: '',
                    shop_id: '',
                    sense_len: '',
                    open: 1,
                }
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
                _this.submitForm()
            }
        }
    },
    methods: {
        submitForm() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    await deviceEdit(this.form)
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.editConfirm')
                    });
                    this.$parent.init()
                    this.cancel()
                }
            });
        },
        cancel() {
            this.$refs['ruleForm'].resetFields();
            this.show = false
        }
    },
};
</script>
<style scoped lang='less'>
</style>
