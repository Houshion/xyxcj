<!-- chargeOrder -->
<template>
    <div id="chargeOrder" class="mg-t-5 bfff pd-10">
        <el-form :model="chargeForm">
            <el-row :gutter="5" class="mg-t-5">
                <el-col :span="4">
                    <el-form-item>
                        <el-input
                            :placeholder="$t('webOrderWater.search_number')"
                            v-model="chargeForm.number"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-input
                            :placeholder="$t('webOrderWater.search_mobile')"
                            v-model="chargeForm.mobile"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-input
                            :placeholder="$t('webOrderWater.search_invoice_number')"
                            v-model="chargeForm.invoice_number"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-input
                            :placeholder="$t('webOrderWater.search_cuid')"
                            v-model="chargeForm.cadmin"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" class="tar">
                    <search-btn @search="search" @reset="reset"></search-btn>
                </el-col>
            </el-row>
            <el-row :gutter="5" class="mg-t-5">
                <el-col :span="4">
                    <el-form-item>
                        <el-select
                            v-model="chargeForm.payment_typeid"
                            multiple
                            :placeholder="$t('webWashCar.payWayLabel')"
                        >
                            <el-option
                                v-for="item in options.payWay"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4" v-if="userInfo.type == 1">
                    <el-form-item>
                        <el-select
                            v-model="chargeForm.shop_id"
                            multiple
                            :placeholder="$t('webOrderAll.shop_name')"
                        >
                            <el-option
                                v-for="item in options.shops"
                                :key="item.shop_id"
                                :label="item.shop_name"
                                :value="item.shop_id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-select
                            v-model="chargeForm.income_type"
                            :placeholder="$t('webOrderWater.income_type')"
                        >
                            <el-option
                                v-for="item in options.types"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item>
                        <div class="block">
                            <el-date-picker
                                class="mg-r-10"
                                v-model="timeDate"
                                type="daterange"
                                :range-separator="$t('webBaseMessage.date_separator')"
                                :start-placeholder="$t('webBaseMessage.date_start')"
                                :end-placeholder="$t('webBaseMessage.date_end')"
                                value-format="yyyy-MM-dd"
                            ></el-date-picker>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row class="col9 mtb20" style="font-size: 16px">
            <el-col :span="6">{{$t('webOrderSell.orderCount')}}:{{stats.count}}</el-col>
            <el-col :span="6">{{$t('webOrderSell.orderTotal')}}:{{stats.total}}</el-col>
        </el-row>
        <o-table
            class="mg-t-5"
            :tableData="tableData"
            :tableTitle="tableTitle"
            :tableSlot="tableSlot"
            :pageMsg="pageMsg"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
        >
            <template slot="income_type" slot-scope="slot">
                <span
                    class="color1"
                    v-if="slot.data.income_type==0"
                >{{$t('webOrderAll.orderType_car')}}</span>
                <span
                    class="color1"
                    v-if="slot.data.income_type==1"
                >{{$t('webOrderAll.orderType_sell')}}</span>
                <span
                    class="color1"
                    v-if="slot.data.income_type==2"
                >{{$t('webOrderAll.orderType_expend')}}</span>
                <span
                    class="color1"
                    v-if="slot.data.income_type==3"
                >{{$t('webOrderAll.orderType_rechargeList')}}</span>
                <span
                    class="color1"
                    v-if="slot.data.income_type==4"
                >{{$t('webOrderAll.orderType_recharge')}}</span>
            </template>
            <template slot="fee_percent" slot-scope="slot">
                <span style="color: red">{{Number(slot.data.fee_percent)}}%</span>
            </template>
            <template slot="payment_fee" slot-scope="slot">
                <span style="color: red">{{slot.data.payment_fee}}</span>
            </template>
        </o-table>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getshop } from "@/api/merchant";
import { paymentIndex } from "@/api/payWay";
import { orderPaymentIndex } from "@/api/order";
import { parseTime } from "@/utils";
export default {
    name: 'chargeOrder',
    data() {
        return {
            timeDate: '',
            chargeForm: {
                number: '',
                invoice_number: '',
                mobile: '',
                cuid: '',
                payment_number: '',
                cadmin: '',
                shop_id: '',
                payment_typeid: [],
                income_type: '',
            },
            tableTitle: [
                { prop: "id", label: this.$t('webOrderWater.id'), width: "100" },
                { prop: "number", label: this.$t('webOrderWater.number'), width: "auto" },
                { prop: "mobile", label: this.$t('webOrderWater.mobile'), width: "auto" },
                { prop: "invoice_number", label: this.$t('webOrderWater.invoice_number'), width: "auto" },
                { prop: "income_type", label: this.$t('webOrderWater.income_type'), width: "auto", custom: true },
                { prop: "payment_title", label: this.$t('webOrderWater.payment_title'), width: "auto" },
                { prop: "payment_money", label: this.$t('webOrderWater.invoice_money'), width: "auto" },

                { prop: "fee_percent", label: this.$t('webOrderWater.Rates'), width: "auto", custom: true },
                { prop: "payment_fee", label: this.$t('webOrderWater.Charges'), width: "auto", custom: true },

                { prop: "ctime", label: this.$t('webOrderWater.ctime'), width: "100" },
                // { prop: "payment_number", label: this.$t('webOrderWater.payment_number'), width: "auto" },
                { prop: "cadmin", label: this.$t('webOrderWater.cadmin'), width: "auto" },
                { prop: "memo", label: this.$t('webOrderWater.memo'), width: "auto" },

            ],
            //   表头信息，prop对应
            tableSlot: [],
            tableData: [],
            pageMsg: {
                page: 1,
                status: true,
                size: 10,
                sizes: [10, 20, 50, 100],
                total: 0
            },
            loading: false,
            stats: {
                count: 0,
                total: 0
            },
            options: {
                payWay: [],
                shops: [],
                types: [
                    { label: this.$t('webOrderAll.orderType_car'), value: 0 },
                    { label: this.$t('webOrderAll.orderType_sell'), value: 1 },
                    { label: this.$t('webOrderAll.orderType_expend'), value: 2 },
                    { label: this.$t('webOrderAll.orderType_rechargeList'), value: 3 },
                    { label: this.$t('webOrderAll.orderType_recharge'), value: 4 },
                ],
            }
        };
    },
    components: {},
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    created() {
        this.init();
        if (this.$route.query.payway != 0) {
            this.chargeForm.payment_typeid.push(this.$route.query.payway)
        }
        console.log(this.chargeForm.payment_typeid)
    },
    methods: {
        async init() {
            this.loading = true
            let form = {
                pageNo: this.pageMsg.page,
                pageSize: this.pageMsg.size
            }
            this.chargeForm.ctime = this.timeDate ? this.timeDate.join('/') : '';
            Object.assign(form, this.chargeForm);
            let res = await orderPaymentIndex(form);
            res.records.forEach(item => {
                item.ctime = parseTime(item.ctime);
            })
            this.tableData = res.records
            this.pageMsg.total = res.total
            this.loading = false
            if (this.pageMsg.page == 1) {
                this.stats = {
                    count: res.stats.count,
                    total: res.stats.total
                }
            }
            if (this.userInfo.type == 1) {
                let shops = await getshop();
                this.options.shops = shops.records
            }
            let payWayRecords = await paymentIndex();
            let payWay = new Array();
            payWayRecords.records.forEach(item => {
                if (item.id != 1 && item.id != 3) {
                    payWay.push(item)
                }
            });
            this.options.payWay = payWay
        },
        pageChange(val) {//分页页数改变
            this.pageMsg.page = val;
            this.init();
        },
        sizeChange(val) {//分页条数改变
            this.pageMsg.size = val;
            this.init();
        },
        search() {
            this.pageMsg.page = 1;
            this.init();
        },
        reset() {
            this.timeDate = '';
            this.pageMsg = {
                page: 1,
                status: true,
                size: 10,
                sizes: [10, 20, 50, 100],
                total: 0
            };
            this.chargeForm = {
                number: '',
                invoice_number: '',
                mobile: '',
                cuid: '',
                payment_number: '',
                ctime: '',
            };
            this.init();
        },
    }
};
</script>
<style scoped lang='less'>
</style>
