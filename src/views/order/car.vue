<!-- chargeOrder -->
<template>
    <div id="chargeOrder" class="mg-t-5 bfff pd-10">
        <el-form :model="chargeForm">
            <el-row :gutter="5" class="mg-t-5">
                <el-col :span="4">
                    <el-form-item>
                        <el-input
                            :placeholder="$t('webOrderCar.searchNumber')"
                            v-model="chargeForm.number"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-input
                            :placeholder="$t('webOrderCar.searchNickname')"
                            v-model="chargeForm.nickname"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-input
                            :placeholder="$t('webOrderCar.searchMobile')"
                            v-model="chargeForm.mobile"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-input
                            :placeholder="$t('webOrderCar.searchShopName')"
                            v-model="chargeForm.shop_name"
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
                        <el-input
                            :placeholder="$t('webOrderCar.searchTaocanInfo')"
                            v-model="chargeForm.taocan_info"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item>
                        <el-select
                            class="wd-100"
                            v-model="chargeForm.status"
                            :placeholder="$t('webOrderCar.searchStatus')"
                        >
                            <el-option :label="$t('webOrderType.unpay')" value="0"></el-option>
                            <el-option :label="$t('webOrderType.cancel')" value="122"></el-option>
                            <el-option :label="$t('webOrderType.using')" value="131"></el-option>
                            <el-option :label="$t('webOrderType.finish')" value="666"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item>
                        <div class="block">
                            <el-date-picker
                                class="wd-100"
                                v-model="timeDate"
                                type="daterange"
                                :range-separator="$t('webBaseMessage.date_separator')"
                                :start-placeholder="$t('webBaseMessage.date_start')"
                                :end-placeholder="$t('webBaseMessage.date_end')"
                            ></el-date-picker>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row class="col9" style="font-size: 16px">
            <el-col :span="6">{{$t('webOrderCar.orderCount')}}:{{stats.count}}</el-col>
            <el-col :span="6">{{$t('webOrderCar.orderTotal')}}:{{stats.total}}</el-col>
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
            <template slot="status" slot-scope="slot">
                <span class="color3" v-if="slot.data.status==0">{{$t('webOrderType.unpay')}}</span>
                <span class="color3" v-if="slot.data.status==122">{{$t('webOrderType.cancel')}}</span>
                <span class="color3" v-if="slot.data.status==131">{{$t('webOrderType.using')}}</span>
                <span class="color1" v-if="slot.data.status==666">{{$t('webOrderType.finish')}}</span>
            </template>
            <template slot="taocan_info" slot-scope="slot">
                <span>{{slot.data.taocan_info | taocan_info}}</span>
            </template>
            <template slot="from_time" slot-scope="slot">
                <span>{{slot.data.from_time | formatTime}}</span>
            </template>
            <template slot="finishtime" slot-scope="slot">
                <span>{{slot.data.finishtime | formatTime}}</span>
            </template>
            <template slot="handle" slot-scope="slot">
                <el-button
                    type="info"
                    size="small"
                    @click="btnFunc(slot.data.id,'print')"
                >{{$t('webOrderAll.printOrder')}}</el-button>
                <el-button
                    v-if="slot.data.status==131"
                    type="info"
                    size="small"
                    @click="btnFunc(slot.data.id,'over')"
                >{{$t('webOrderCar.closeOrder')}}</el-button>
            </template>
        </o-table>
    </div>
</template>
<script>
import { washIndex, washFinish } from "@/api/order";
import { parseTime } from "@/utils";
export default {
    name: 'chargeOrder',
    data() {
        return {
            timeDate: '',
            chargeForm: {
                number: '',
                nickname: '',
                mobile: '',
                shop_name: '',
                device_macno: '',
                taocan_info: '',
                status: '',
                ctime: '',
            },
            tableTitle: [
                { prop: "number", label: this.$t('webOrderCar.number'), width: "auto" },
                { prop: "nickname", label: this.$t('webOrderCar.nickname'), width: "auto" },
                { prop: "mobile", label: this.$t('webOrderCar.mobile'), width: "auto" },
                { prop: "shop_name", label: this.$t('webOrderCar.shop_name'), width: "auto" },
                { prop: "device_title", label: this.$t('webOrderCar.device_title'), width: "auto" },
                { prop: "taocan_info", label: this.$t('webOrderCar.taocan_info'), width: "auto", custom: true },
                { prop: "invoice_money", label: this.$t('webOrderCar.invoice_money'), width: "auto" },
                { prop: "from_time", label: this.$t('webOrderCar.from_time'), width: "100", custom: true },
                { prop: "finishtime", label: this.$t('webOrderCar.finishtime'), width: "100", custom: true },
                { prop: "status", label: this.$t('webOrderCar.status'), width: "auto", custom: true },
                { prop: "handle", label: this.$t('webOrderExpend.handle'), width: "200", custom: true },
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
            stats: {
                count: 0,
                total: 0
            },
            loading: false
        };
    },
    components: {},
    computed: {},
    filters: {
        taocan_info(val) {
            return val ? JSON.parse(val).title : '';
        },
        formatTime(val) {
            return parseTime(val)
        }
    },
    created() {
        const _this = this
        this.init();
    },
    methods: {
        async init() {
            this.loading = true
            let form = {
                pageNo: this.pageMsg.page,
                pageSize: this.pageMsg.size,
            };
            this.chargeForm.ctime = this.timeDate ? this.timeDate.join('/') : '';
            Object.assign(form, this.chargeForm);
            let res = await washIndex(form);
            console.log(res)
            if (this.pageMsg.page == 1) {
                this.stats = {
                    count: res.stats.count,
                    total: res.stats.total
                }
            }
            this.tableData = res.records
            this.pageMsg.total = res.total
            this.loading = false;
        },
        search() {
            this.pageMsg.page = 1;
            this.init();
        },
        reset() {
            this.pageMsg = {
                page: 1,
                status: true,
                size: 10,
                sizes: [10, 20, 50, 100],
                total: 0
            }
            this.timeDate = '';
            this.chargeForm = {
                number: '',
                nickname: '',
                mobile: '',
                shop_name: '',
                device_macno: '',
                taocan_info: '',
                status: '',
                ctime: '',
            };
            this.init();
        },
        pageChange(val) {//分页页数改变
            this.pageMsg.page = val;
            this.init();
        },
        sizeChange(val) {//分页条数改变
            this.pageMsg.size = val;
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
            if (type == "over") {
                washFinish(id).then(res => {
                    console.log(res)
                })
            }
        },
    }
};
</script>
<style scoped lang='less'>
</style>
