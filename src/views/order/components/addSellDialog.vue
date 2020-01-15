<template>
    <div id="addSellDialog">
        <!-- 创建角色Dialog -->
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="rechargeForm" :rules="rules" ref="rechargeForm">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="" prop="is_member">
                            <el-radio-group v-model="rechargeForm.is_member" @change="getRadio">
                                <el-radio
                                    label="1"
                                    :disabled="disabled"
                                >{{$t('webOrderSell.dia_ismember')}}</el-radio>
                                <el-radio
                                    label="0"
                                    :disabled="disabled"
                                >{{$t('webOrderSell.dia_unmember')}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="" prop="nickname">
                            <el-input
                                v-model="rechargeForm.nickname"
                                :disabled="disabled"
                                :placeholder="$t('webOrderSell.dia_nickname')"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <template v-for="(item,index) in rechargeForm.goods">
                    <el-form-item :key="index" label="">
                        <el-input
                            class="wd-50"
                            v-model="item.searchVaule"
                            :placeholder="$t('webOrderSell.pl_searchVaule')"
                            @change="searchGoods(item.searchVaule,index)"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        :key="index"
                        label=""
                        :prop="index==0?'goods.'+index+'.goodsType':''"
                        :rules="index==0?{
                              required: true, message: $t('webOrderSell.dia_goodsType'), trigger: 'change'
                            }:{}"
                    >
                        <el-select
                            filterable
                            clearable
                            v-model="item.goodsType"
                            :placeholder="$t('webOrderSell.dia_goodsType')"
                            @change="changeGoodsType(item.goodsType,index)"
                        >
                            <el-option
                                v-for="item in item.options"
                                :key="item.type_id"
                                :label="item.type_name"
                                :value="item.type_id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item
                                :key="index"
                                label=""
                                :prop="'goods.'+index+'.name'"
                                :rules="{
                                    required: true, message: $t('webOrderSell.dia_goodsName'), trigger: 'change'
                                }"
                            >
                                <el-select
                                    :filterable="item.filterable"
                                    :allow-create="item.allow"
                                    default-first-option
                                    clearable
                                    v-model="item.name"
                                    :placeholder="$t('webOrderSell.dia_goodsName')"
                                    @change="goodsNameChange(item.name, index)"
                                >
                                    <el-option
                                        v-for="item in item.goodsOptions"
                                        :key="item.goods_id"
                                        :label="item.goods_name"
                                        :value="item.goods_id"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-input-number v-model="item.num" :min="1"></el-input-number>
                        </el-col>
                    </el-row>
                    <el-form-item
                        :key="index"
                        label=""
                        :prop="'goods.'+index+'.money'"
                        :rules="{
                            required: true, message: $t('webOrderSell.dia_goodsPrice'), trigger: 'change'
                        }"
                    >
                        <el-input
                            class="wd-50"
                            v-model="item.money"
                            :placeholder="$t('webOrderSell.dia_goodsPrice')"
                        ></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="">
                    <el-button
                        type="primary"
                        round
                        @click="addNewGoods"
                    >{{$t('webOrderSell.dia_addNewGoods')}}</el-button>
                </el-form-item>
                <el-row :gutter="10">
                    <el-col :span="14">
                        <el-form-item
                            :label="$t('webOrderSell.dia_discount_money')"
                            prop="discount_money"
                        >
                            <el-input class="wd-50" v-model="rechargeForm.discount_money"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="">{{$t('webOrderSell.dia_needPay')}}：{{need_money}}</el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="" prop="pay_part">
                    <el-radio
                        v-model="rechargeForm.pay_part"
                        :label="1"
                    >{{$t('webOrderSell.dia_fullPay')}}</el-radio>
                    <el-radio
                        v-model="rechargeForm.pay_part"
                        :label="0"
                    >{{$t('webOrderSell.dia_unPay')}}</el-radio>
                    <el-radio
                        v-model="rechargeForm.pay_part"
                        :label="2"
                    >{{$t('webOrderSell.dia_payLittle')}}</el-radio>
                </el-form-item>
                <el-form-item label="" prop="someMoney" v-if="rechargeForm.pay_part==2">
                    <el-input
                        class="wd-50"
                        v-model="rechargeForm.payment_money"
                        :placeholder="$t('webOrderSell.dia_payment_money')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webOrderSell.dia_payment_typeid')" prop="payment_typeid">
                    <el-select
                        class="wd-50"
                        v-model="rechargeForm.payment_typeid"
                        :placeholder="$t('webOrderSell.dia_payment_typeid')"
                        @change="payWayChange"
                    >
                        <el-option
                            v-for="item in payWayArr"
                            :key="item.title"
                            :label="item.title"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('webOrderSell.dia_payment_number')" prop="payment_number">
                    <el-input
                        class="wd-50"
                        v-model="rechargeForm.payment_number"
                        :placeholder="$t('webOrderSell.dia_payment_number')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webOrderSell.dia_memo')" prop="memo">
                    <el-input
                        class="wd-50"
                        v-model="rechargeForm.memo"
                        :placeholder="$t('webOrderSell.dia_memo')"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
                <el-button type="primary" @click="ruleConfirm">{{$t('webBaseBtn.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { paymentIndex } from "@/api/payWay";
import { goodsTypeIndex, goodsIndex } from "@/api/goods";
import { incomeShow, incomeAdd, incomeEdit } from "@/api/order";
export default {
    name: 'addSellDialog',
    data() {
        return {
            show: false,
            id: '',
            upload: false,
            // need_money:'',//需支付金额
            disabled: false,
            rechargeForm: {
                nickname: '',
                memo: '',
                payment_typeid: '',
                payment_number: '',
                is_member: '',
                discount_money: 0,
                pay_part: '',
                payment_money: '',
                goods: [
                    { searchVaule: '', goodsType: '', name: '', num: '1', money: '', goodsName: '', options: [], goodsOptions: [], filterable: false, allow: false }
                ]
            },
            options: [],
            payWayArr: [],
            goodsOptions: [],
            rules: {
                nickname: [
                    { required: true, message: this.$t('webOrderSell.rules_nickname'), trigger: 'change' }
                ],
                payment_typeid: [
                    { required: true, message: this.$t('webOrderSell.rules_payment_typeid'), trigger: 'change' }
                ],
                payment_number: [
                    { required: true, message: this.$t('webOrderSell.rules_payment_number'), trigger: 'blur' }
                ],
                discount_money: [
                    { required: true, message: this.$t('webOrderSell.rules_discount_money'), trigger: 'blur' }
                ],
                payment_money: [
                    { required: true, message: this.$t('webOrderSell.rules_payment_money'), trigger: 'blur' }
                ],
                memo: [
                    { required: true, message: this.$t('webOrderSell.rules_memo'), trigger: 'blur' }
                ],
                is_member: [],
                pay_part: [],
                visibleStatus: false
            },
        }
    },
    computed: {
        need_money() {
            let val = 0;
            this.rechargeForm.goods.forEach(item => {
                val += item.num * item.money;
            })
            val = val ? this.rechargeForm.discount_money > val ? 0 : val - this.rechargeForm.discount_money : 0;
            return val;
        },
        ...mapGetters([
            'userInfo'
        ])
    },
    props: {
        title: String,
    },
    watch: {
        upload(val) {
            this.List();
            if (this.id) {
                this.init();
            }
        }
    },
    created() {
        console.log(this.userInfo.type)
    },
    mounted() {
        const _this = this
        document.onkeydown = function (e) { // 回车提交表单
            // 兼容FF和IE和Opera
            var theEvent = window.event || e;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                _this.ruleConfirm()
            }
        }
    },
    methods: {
        async init() {
            const res = await incomeShow({ oid: this.id });
            console.log(res);
            // this.need_money = res.invoice_money - res.discount_money - res.payment_money;
            const form = {
                pageNo: 1,
                pageSize: 999,
            };
            const goods = [];
            const result = await goodsIndex(form)
            res.invoice_goods.forEach((item, index) => {
                goods.push({
                    goodsType: item.goods_info.goods_type_id,
                    name: item.goods_info.goods_id ? item.goods_info.goods_id : item.goods_info.goods_name,
                    num: item.goods_info.goods_num,
                    money: item.goods_info.goods_price,
                    goodsName: item.goods_info.goods_name,
                    options: this.rechargeForm.goods[0].options,
                    goodsOptions: [],
                    filterable: item.goods_info.goods_id ? false : true,
                    allow: item.goods_info.goods_id ? false : true,
                    searchVaule: ''
                })
            })
            // this.disabled = true;
            let pay_part = '';
            pay_part = res.status == '666' ? 1 : res.payment_money * 1 == 0 ? 0 : 2;
            this.rechargeForm = {
                nickname: res.nickname,
                memo: res.memo,
                payment_typeid: res.payment.length > 0 ? res.payment[0].payment_typeid : '',
                payment_number: res.payment.length > 0 ? res.payment[0].payment_number : '',
                is_member: '',
                discount_money: res.discount_money,
                pay_part,
                payment_money: res.payment_money * 1,
                goods
            };
            res.invoice_goods.forEach((item, index) => {
                this.getEditTypeList(item.goods_info.goods_type_id, index);
            })

        },
        //新增记账订单
        addNewGoods() {
            this.rechargeForm.goods.push({ searchVaule: '', goodsType: '', name: '', num: '1', money: '', goodsName: '', options: this.rechargeForm.goods[0].options, goodsOptions: [], filterable: false, allow: false });
        },
        // 新增入账订单确认
        async ruleConfirm() {
            console.log(this.rechargeForm)
            if (this.rechargeForm.payStatus != 2) {//不是部分支付
                this.rules.someMoney = [];
            } else {
                this.rules.someMoney = [{ required: true, message: this.$t('webOrderSell.rules_payment_money'), trigger: 'blur' }];
            }
            this.$refs['rechargeForm'].validate(async valid => {
                if (valid) {
                    const data = this.rechargeForm;
                    const goods = [];
                    this.rechargeForm.goods.forEach(item => {
                        goods.push({
                            goods_type_id: item.goodsType,
                            goods_id: item.goodsType == 0 ? 0 : item.name,
                            goods_name: item.goodsName,
                            goods_price: item.money,
                            goods_num: item.num,
                        })
                    })
                    const form = {
                        oid: this.id,
                        is_member: data.is_member,
                        nickname: data.nickname,
                        discount_money: data.discount_money,
                        pay_part: data.pay_part,
                        payment_money: data.pay_part == 2 ? data.payment_money : '',
                        payment_typeid: data.payment_typeid,
                        payment_number: data.payment_number,
                        memo: data.memo,
                        goods: JSON.stringify(goods)
                    };
                    console.log(form)
                    //return
                    if (this.id) {
                        await incomeEdit(form)
                        this.$message({
                            type: 'success',
                            message: this.$t('webBaseTips.editConfirm')
                        });
                    } else {
                        await incomeAdd(form)
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
        List() {
            const form = {
                pageNo: 1,
                pageSize: 999,
            }
            paymentIndex(form).then(res => {//支付方式
                this.payWayArr = res.records;
            });
            goodsTypeIndex(form).then(res => {//商品类型
                // this.options=res.records
                res.records.push({
                    type_id: 0,
                    type_name: this.$t('webOrderSell.other')
                })
                this.rechargeForm.goods[0].options = res.records;
            });

        },
        payWayChange(id) {
            //   if(id == 1 || id == 2 || id == 3){
            this.rechargeForm.payment_number = this.$t('webBaseMessage.none');
            this.rechargeForm.memo = this.$t('webBaseMessage.none');
            //   }else {
            //     this.rechargeForm.payment_number = '';
            //     this.rechargeForm.memo = '';
            //   }
        },
        goodsNameChange(e, index) {//商品名称改变事件
            let goods = false;
            this.rechargeForm.goods[index].money = '';
            this.rechargeForm.goods[index].goodsName = '';
            this.rechargeForm.goods[index].goodsOptions.forEach(item => {
                if (item.goods_id == e) {
                    goods = true;
                    this.rechargeForm.goods[index].money = item.retail_price;
                    this.rechargeForm.goods[index].goodsName = item.goods_name;
                }
            })
            if (!goods) {
                this.rechargeForm.goods.forEach(item => {
                    if (item.name == e) {
                        item.goodsName = e;
                    }
                })
            }
        },
        changeGoodsType(goods_type, index) {//商品类型改变事件
            const form = {
                pageNo: 1,
                pageSize: 999,
                goods_type
            };
            this.rechargeForm.goods[index].name = '';
            this.rechargeForm.goods[index].money = '';
            this.rechargeForm.goods[index].goodsOptions = [];
            this.rechargeForm.goods[index].filterable = false;
            this.rechargeForm.goods[index].allow = false;
            if (goods_type == 0) {
                this.rechargeForm.goods[index].filterable = true;
                this.rechargeForm.goods[index].allow = true;
            }
            if (goods_type) {
                goodsIndex(form).then(res => {//商品列表
                    this.rechargeForm.goods[index].goodsOptions = res.records;
                });
            }
        },
        getEditTypeList(goods_type, index) {
            const form = {
                pageNo: 1,
                pageSize: 999,
                goods_type
            };
            if (goods_type) {
                goodsIndex(form).then(res => {//商品列表
                    this.rechargeForm.goods[index].goodsOptions = res.records;
                });
            }
        },
        cancel() {//取消
            this.rechargeForm.goods.forEach(item => {
                item.searchVaule = '';
            });

            this.$refs["rechargeForm"].resetFields();
            this.show = false;
        },
        searchGoods(value, index) {
            console.log(value);
            if (value) {
                const form = {
                    pageNo: 1,
                    pageSize: 999,
                    keywords: value
                };
                goodsIndex(form).then(res => {//商品列表
                    this.rechargeForm.goods[index].goodsOptions = res.records;
                    if (res.records.length > 0) {
                        this.rechargeForm.goods[index].name = res.records[0].goods_id;
                        this.rechargeForm.goods[index].money = res.records[0].retail_price;
                        this.rechargeForm.goods[index].goodsType = res.records[0].goods_type;
                    }
                });

            } else {
                this.rechargeForm.goods[index].goodsOptions = [];
                this.rechargeForm.goods[index].name = '';
                this.rechargeForm.goods[index].money = '';
                this.rechargeForm.goods[index].goodsType = '';
            }

        },
        getRadio(e) {
            if (e == 0) {
                this.rechargeForm.nickname = this.$t('webOrderSell.novip')
            } else {
                this.rechargeForm.nickname = ''
            }
        }
    }
}
</script>

<style scoped>
</style>
