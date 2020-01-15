<!-- chargeOrder -->
<template>
    <div id="chargeOrder" class="mg-t-5 bfff pd-10">
        <el-form :model="chargeForm">
            <el-row :gutter="5" class="mg-t-5">
                <el-col :span="4">
                    <el-form-item>
                        <el-input
                            :placeholder="$t('webOrderRecharge.searchNumber')"
                            v-model="chargeForm.number"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-input
                            :placeholder="$t('webOrderRecharge.searchMobile')"
                            v-model="chargeForm.mobile"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-select
                            class="wd-100"
                            v-model="chargeForm.payment_typeid"
                            :placeholder="$t('webOrderRecharge.searchPayment')"
                        >
                            <el-option
                                v-for="item in payWayArr"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="tar">
                    <search-btn @search="search" @reset="reset"></search-btn>
                </el-col>
            </el-row>
            <el-row :gutter="5">
                <el-col :span="4">
                    <el-form-item>
                        <el-input
                            :placeholder="$t('webOrderRecharge.searchShop_name')"
                            v-model="chargeForm.shop_name"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <!-- <el-input
                            :placeholder="$t('webOrderWater.search_cuid')"
                            v-model="chargeForm.cadmin"
                        ></el-input>-->
                        <el-select
                            filterable
                            allow-create
                            class="wd-100"
                            v-model="chargeForm.cadmin"
                            :placeholder="$t('webOrderWater.search_cuid')"
                        >
                            <el-option
                                v-for="item in cadminList"
                                :key="item.mid"
                                :label="item.nickname"
                                :value="item.nickname"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
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
        <el-row class="col9" style="font-size: 16px">
            <el-col :span="6">{{$t('webOrderRecharge.orderCount')}}:{{stats.count}}</el-col>
            <el-col :span="6">{{$t('webOrderRecharge.orderFee')}}:{{stats.fee}}</el-col>
            <el-col :span="12">{{$t('webOrderRecharge.orderTotal')}}:{{stats.total}}</el-col>
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
            <template slot="fee_percent" slot-scope="slot">{{Number(slot.data.fee_percent)}}%</template>
            <template slot="handle" slot-scope="slot">
                <el-button
                    type="info"
                    size="small"
                    @click="btnFunc(slot.data.id,'print')"
                >{{$t('webOrderAll.printOrder')}}</el-button>
            </template>
        </o-table>
    </div>
</template>
<script>
import { memberList } from "@/api/member";
import { rechargeIndex } from "@/api/order";
import { parseTime } from "@/utils";
import { paymentIndex } from "@/api/payWay";
export default {
    name: 'chargeOrder',
    data() {
        return {
            timeDate: '',
            chargeForm: {
                number: '',
                mobile: '',
                shop_name: '',
                payment_typeid: '',
                ctime: '',
                cadmin: '',
            },
            payWayArr: [],
            tableTitle: [
                { prop: "id", label: this.$t('webOrderRecharge.id'), width: "auto" },
                { prop: "number", label: this.$t('webOrderRecharge.number'), width: "auto" },
                { prop: "mobile", label: this.$t('webOrderRecharge.mobile'), width: "auto" },
                { prop: "invoice_money", label: this.$t('webOrderRecharge.invoice_money'), width: "auto" },
                { prop: "money_gift", label: this.$t('webOrderRecharge.money_gift'), width: "auto" },
                { prop: "payment_title", label: this.$t('webOrderRecharge.payment_title'), width: "auto" },
                { prop: "payment_money", label: this.$t('webOrderRecharge.payment_money'), width: "auto" },
                { prop: "fee_percent", label: this.$t('webOrderRecharge.fee_percent'), width: "auto", custom: true },
                { prop: "payment_fee", label: this.$t('webOrderRecharge.payment_fee'), width: "auto" },
                { prop: "shop_name", label: this.$t('webOrderRecharge.shop_name'), width: "auto" },
                { prop: "payment_number", label: this.$t('webOrderRecharge.payment_number'), width: "auto" },
                { prop: "ctime", label: this.$t('webOrderRecharge.ctime'), width: "100" },
                { prop: "cadmin", label: this.$t('webOrderWater.cadmin'), width: "auto" },
                { prop: "handle", label: this.$t('webOrderExpend.handle'), width: "100", custom: true },
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
                total: 0,
                fee: 0
            },
            cadminList: [],
        };
    },
    components: {},
    computed: {},
    created() {
        this.List();
        this.init();
    },
    methods: {
        async init() {
            this.loading = true
            this.loading = true
            let form = {
                pageNo: this.pageMsg.page,
                pageSize: this.pageMsg.size
            }
            this.chargeForm.ctime = this.timeDate ? this.timeDate.join('/') : '';
            Object.assign(form, this.chargeForm);
            let res = await rechargeIndex(form);
            console.log(res)
            if (this.pageMsg.page == 1) {
                this.stats = {
                    count: res.stats.count,
                    total: res.stats.total,
                    fee: res.stats.fee
                }
            }
            res.records.forEach(item => {
                item.ctime = parseTime(item.ctime);
            })
            this.tableData = res.records
            this.pageMsg.total = res.total
            this.loading = false
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
                mobile: '',
                shop_name: '',
                payment_typeid: '',
                ctime: '',
            };
            this.init();
        },
        btnFunc(id, type) {
            if (type == "print") {
                let routeUrl = this.$router.resolve({
                    name: 'order/printView',
                    query: {
                        id: id
                    }
                });
                window.open(routeUrl.href, '_blank');
            }
        },
        List() {
            const form = {
                pageNo: 1,
                pageSize: 999,
            }
            paymentIndex().then(res => {//支付方式
                this.payWayArr = res.records;
            });
            memberList(form).then(res => {//充值訂單管理員列表
                this.cadminList = res.records;
            })
        }
    }
};
</script>
<style scoped lang='less'>
</style>
