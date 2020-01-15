<template>
    <div id="rechargeRecordDialog">
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="payForm" :rules="payRules" ref="payForm">
                <el-form-item label="">
                    <p>
                        <el-col
                            :span="14"
                        >{{$t('webOrderRechargeDia.rulesUserInfo_payment_now')}}:{{userInfo.payment_now}}</el-col>
                        <el-col
                            :span="10"
                        >{{$t('webOrderRechargeDia.rulesUserInfo_number')}}:{{userInfo.number}}</el-col>
                    </p>
                    <p>
                        <el-col
                            :span="14"
                        >{{$t('webOrderRechargeDia.rulesUserInfo_payment_money')}}:{{userInfo.payment_money}}</el-col>
                        <el-col
                            :span="10"
                        >{{$t('webOrderRechargeDia.rulesUserInfo_mobile')}}:{{userInfo.mobile}}</el-col>
                    </p>
                </el-form-item>
                <el-form-item label="">
                    <el-radio
                        v-model="payForm.pay_part"
                        label="1"
                    >{{$t('webOrderSell.dia_fullPay')}}</el-radio>
                    <el-radio v-model="payForm.pay_part" label="0">{{$t('webOrderSell.dia_unPay')}}</el-radio>
                    <el-radio
                        v-model="payForm.pay_part"
                        label="2"
                    >{{$t('webOrderSell.dia_payLittle')}}</el-radio>
                </el-form-item>
                <el-form-item label="" prop="payment_money" v-if="payForm.pay_part==2">
                    <el-input
                        class="wd-50"
                        v-model="payForm.payment_money"
                        :placeholder="$t('webOrderSell.dia_payment_money')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webOrderSell.dia_payment_typeid')" prop="payment_typeid">
                    <el-select
                        class="wd-50"
                        v-model="payForm.payment_typeid"
                        :placeholder="$t('webOrderSell.dia_payment_typeid')"
                        @change="payWayChange"
                    >
                        <el-option
                            v-for="item in payWayArr"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('webOrderSell.dia_payment_number')" prop="payment_number">
                    <el-input
                        class="wd-50"
                        v-model="payForm.payment_number"
                        :placeholder="$t('webOrderSell.dia_payment_number')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webOrderSell.dia_memo')" prop="memo">
                    <el-input
                        class="wd-50"
                        v-model="payForm.memo"
                        :placeholder="$t('webOrderSell.dia_memo')"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
                <el-button type="primary" @click="payRuleConfirm">{{$t('webBaseBtn.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { paymentIndex } from "@/api/payWay";
import { paymentAdd, paymentAddShow } from "@/api/order";
export default {
    name: 'rechargeRecordDialog',
    data() {
        return {
            show: false,
            upload: false,
            id: '',
            userInfo: {
                number: '',
                mobile: '',
                payment_money: '',
                payment_now: '',
            },
            payForm: {
                memo: '',
                payment_typeid: '',
                payment_number: '',
                pay_part: '1',
                payment_money: '',
            },
            payRules: {
                payment_typeid: [
                    { required: true, message: this.$t('webORderRechargeDia.rules_payment_typeid'), trigger: 'change' }
                ],
                payment_number: [
                    { required: true, message: this.$t('webORderRechargeDia.rules_payment_number'), trigger: 'blur' }
                ],
                payment_money: [
                    { required: true, message: this.$t('webORderRechargeDia.rules_payment_money'), trigger: 'blur' }
                ],
                memo: [
                    { required: true, message: this.$t('webORderRechargeDia.rules_memo'), trigger: 'blur' }
                ],
            },
            payWayArr: [],
        }
    },
    props: {
        title: String,
    },
    watch: {
        upload(val) {
            console.log(val)
            this.List();
            this.init();
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
                _this.payRuleConfirm()
            }
        }
    },
    methods: {
        async init() {
            const res = await paymentAddShow({ oid: this.id });
            this.userInfo = {
                number: res.number,
                mobile: res.mobile,
                payment_money: res.payment_money,
                payment_now: res.payment_now,
            }
        },
        //新增付款记录提交
        async payRuleConfirm() {
            console.log(this.payForm)
            if (this.payForm.pay_part != 2) {//不是部分支付
                this.payRules.payment_money = [];
            } else {
                this.payRules.payment_money = [{ required: true, message: this.$t('webORderRechargeDia.rules_payment_money'), trigger: 'blur' }];
            }
            this.$refs['payForm'].validate(async valid => {
                if (valid) {
                    await paymentAdd(Object.assign(this.payForm, { oid: this.id }))
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.editConfirm')
                    });
                    this.show = false;
                    this.$emit("uploadEvent", '1');
                }
            });
        },
        payWayChange(id) {
            // if (id == 1 || id == 2 || id == 3) {
            this.payForm.payment_number = this.$t('webBaseMessage.none');
            this.payForm.memo = this.$t('webBaseMessage.none');
            // } else {
            //     this.payForm.payment_number = '';
            //     this.payForm.memo = '';
            // }
        },
        List() {
            const form = {
                pageNo: 1,
                pageSize: 999,
            }
            paymentIndex(form).then(res => { //支付方式
                this.payWayArr = res.records;
            });
        },
        cancel() {//取消
            this.$refs["payForm"].resetFields();
            this.show = false;
        },
    }
}
</script>

<style scoped>
</style>
