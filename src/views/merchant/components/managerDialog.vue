<!-- goodsDialog -->
<template>
    <div id="managerDialog">
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item :label="$t('webMerchantManager.dia_nickname')" prop="nickname">
                    <el-input
                        class="wd-50"
                        v-model="form.nickname"
                        autocomplete="off"
                        :placeholder="$t('webMerchantManager.rules_nickname')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webMerchantManager.dia_mobile')" prop="mobile">
                    <el-input
                        class="wd-50"
                        v-model="form.mobile"
                        autocomplete="off"
                        :placeholder="$t('webMerchantManager.rules_mobile')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webMerchantManager.dia_username')" prop="username">
                    <el-input
                        class="wd-50"
                        v-model="form.username"
                        autocomplete="off"
                        :placeholder="$t('webMerchantManager.rules_username')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webMerchantManager.dia_password')" prop="password">
                    <el-input
                        type="password"
                        class="wd-50"
                        v-model="form.password"
                        autocomplete="off"
                        :placeholder="$t('webMerchantManager.rules_password')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webMerchantManager.dia_iccard')" prop="iccard">
                    <el-input
                        class="wd-50"
                        v-model="form.iccard"
                        autocomplete="off"
                        :placeholder="$t('webMerchantManager.rules_iccard')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webMerchantManager.dia_shop_id')" prop="shop_id">
                    <el-select
                        class="wd-50"
                        v-model="form.shop_id"
                        :placeholder="$t('webMerchantManager.rules_shop_id')"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.shop_id"
                            :label="item.shop_name"
                            :value="item.shop_id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('webMerchantManager.dia_status')" prop="status">
                    <el-radio
                        v-model="form.status"
                        :label="1"
                    >{{$t('webMerchantManager.managerStatus_on')}}</el-radio>
                    <el-radio
                        v-model="form.status"
                        :label="2"
                    >{{$t('webMerchantManager.managerStatus_off')}}</el-radio>
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
import { shopownerAdd, shopInfo, shopList } from "@/api/merchant";
export default {
    props: {
        title: String,
    },
    name: 'managerDialog',
    data() {
        return {
            show: false,
            form: {
                mid: '',
                mobile: '',
                username: '',
                nickname: '',
                password: '',
                iccard: '',
                shop_id: '',
                status: 1,
            },
            options: [],
            rules: {
                nickname: [
                    { required: true, message: this.$t('webMerchantManager.rules_nickname'), trigger: 'blur' },
                ],
                mobile: [
                    { required: true, message: this.$t('webMerchantManager.rules_mobile'), trigger: 'blur' },
                ],
                username: [
                    { required: true, message: this.$t('webMerchantManager.rules_username'), trigger: 'blur' }
                ],
                password: [
                    { required: true, message: this.$t('webMerchantManager.rules_password'), trigger: 'blur' },
                ],
                shop_id: [
                    { required: true, message: this.$t('webMerchantManager.rules_shop_id'), trigger: 'change' }
                ],
                status: [],
                iccard: [],
            }
        };
    },
    computed: {},
    watch: {
        show(val) {
            if (!val) return;
            this.getShopList();
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
        async getShopList() {//获取分店列表
            const res = await shopList({ mid: this.form.mid });
            this.options = res.records;
            if (!this.form.mid) {//新增
                this.rules.password = [{ required: true, message: this.$t('webMerchantManager.rules_password'), trigger: 'blur' }];
            } else {
                this.rules.password = [];
                this.init();
            }
        },
        async init() {
            const mid = this.form.mid
            const res = await shopInfo({ mid });
            console.log(res);
            this.form = {
                mid,
                mobile: res.mobile,
                username: res.username,
                nickname: res.nickname,
                password: res.password,
                iccard: res.iccard,
                shop_id: res.shop_id,
                status: res.status,
            };
        },
        submitForm() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    await shopownerAdd(this.form);
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.editConfirm')
                        // message: !this.form.mid ? '添加成功!' : '修改成功!'
                    });
                    this.show = false;
                    this.$parent.init();
                }
            });
        },
        cancel() {
            this.$refs.ruleForm.resetFields();
            this.show = false;
        }
    },
};
</script>
<style scoped lang='less'>
</style>
