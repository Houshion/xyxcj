<!-- userList -->
<template>
    <div id="userList">
        <div class="mg-t-5 bfff pd-10">
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="addNew"
            >{{title}}</el-button>
            <el-form :model="searchForm" class="mt20">
                <el-row :gutter="10" class="mb20">
                    <el-col :span="3">
                        <el-input
                            :placeholder="$t('webOrderCar.searchNumber')"
                            v-model="searchForm.number"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input
                            :placeholder="$t('webOrderCar.searchNickname')"
                            v-model="searchForm.nickname"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input
                            :placeholder="$t('webOrderCar.searchMobile')"
                            v-model="searchForm.mobile"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input
                            :placeholder="$t('webOrderCar.searchShopName')"
                            v-model="searchForm.shop_name"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="12" class="tar">
                        <search-btn @search="search" @reset="reset"></search-btn>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webOrderSell.searchGoodsInfo')"
                            v-model="searchForm.goods_info"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-select
                            v-model="searchForm.is_pay"
                            :placeholder="$t('webOrderSell.searchIsPay')"
                        >
                            <el-option :label="$t('webOrderSell.pay')" value="1"></el-option>
                            <el-option :label="$t('webOrderSell.unpay')" value="0"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input
                                :placeholder="$t('webOrderWater.search_cuid')"
                                v-model="searchForm.cadmin"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-date-picker
                            class="wd-100"
                            v-model="timeDate"
                            type="daterange"
                            :range-separator="$t('webBaseMessage.date_separator')"
                            :start-placeholder="$t('webBaseMessage.date_start')"
                            :end-placeholder="$t('webBaseMessage.date_end')"
                            value-format="yyyy-MM-dd"
                        ></el-date-picker>
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
                @btnFunc="btnFunc"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
            >
                <template slot="status" slot-scope="slot">
                    <span class="color3" v-if="slot.data.status==0">{{$t('webOrderType.unpay')}}</span>
                    <span class="color3" v-if="slot.data.status==122">{{$t('webOrderType.cancel')}}</span>
                    <span class="color3" v-if="slot.data.status==131">{{$t('webOrderType.using')}}</span>
                    <span class="color1" v-if="slot.data.status==666">{{$t('webOrderType.finish')}}</span>
                </template>
                <template slot="payStatus" slot-scope="slot">
                    <span class="color1" v-if="slot.data.payStatus==666">{{$t('webOrderSell.pay')}}</span>
                    <span class="color3" v-else>{{$t('webOrderSell.unpay')}}</span>
                </template>
                <template slot="handle" slot-scope="slot">
                    <el-button
                        type="info"
                        size="small"
                        @click="btnFunc(slot.data.id,'print')"
                    >{{$t('webOrderAll.printOrder')}}</el-button>
                    <el-button
                        type="info"
                        size="small"
                        @click="btnFunc(slot.data.id,'addNew')"
                        v-if="slot.data.status==0 || slot.data.status==131"
                    >{{$t('webOrderSell.newRecord')}}</el-button>
                    <el-button
                        v-if="userInfo.type!=3"
                        type="info"
                        size="small"
                        @click="btnFunc(slot.data.id,'edit')"
                    >{{$t('webOrderSell.edit')}}</el-button>
                    <el-button
                        v-if="userInfo.type!=3"
                        type="danger"
                        size="small"
                        @click="btnFunc(slot.data.id,'dele')"
                    >{{$t('webOrderSell.dele')}}</el-button>
                    <el-dropdown @command="btnType" v-if="userInfo.type !=3 ">
                        <el-button size="small">...</el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                :command="{id:slot.data.id}"
                            >{{$t('webOrderSell.cancel')}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </o-table>
            <!-- 新增入账订单 -->
            <addSellDialog ref="addSellDialog" :title="addSellMsg.title" @uploadEvent="orderUpload"></addSellDialog>
            <!--新增付款记录-->
            <rechargeRecordDialog
                ref="rechargeRecordDialog"
                :title="rechargeRecordMsg.title"
                @uploadEvent="uploadEvent"
            ></rechargeRecordDialog>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { incomeIndex, incomeDel, incomeCancel } from "@/api/order";
import { parseTime } from "@/utils";
import addSellDialog from "./components/addSellDialog";
import rechargeRecordDialog from "./components/rechargeRecordDialog";
export default {
    name: 'userList',
    data() {
        return {
            timeDate: '',
            searchForm: {
                number: '',
                nickname: '',
                mobile: '',
                shop_name: '',
                goods_info: '',
                is_pay: '',
                ctime: '',
                cadmin: '',
            },
            tableTitle: [
                { prop: "number", label: this.$t('webOrderSell.number'), width: "auto" },
                { prop: "nickname", label: this.$t('webOrderSell.nickname'), width: "auto" },
                { prop: "mobile", label: this.$t('webOrderSell.mobile'), width: "auto" },
                { prop: "shop_name", label: this.$t('webOrderSell.shop_name'), width: "auto" },
                { prop: "goods_info", label: this.$t('webOrderSell.goods_info'), width: "auto" },
                // { prop: "invoice_money", label: "订单金额", width: "auto" },
                { prop: "payment_money", label: this.$t('webOrderSell.payment_money'), width: "auto" },
                { prop: "discount_money", label: this.$t('webOrderSell.discount_money'), width: "auto" },
                { prop: "payment_title", label: this.$t('webOrderSell.payment_title'), width: "auto" },
                { prop: "payment_number", label: this.$t('webOrderSell.payment_number'), width: "auto" },
                { prop: "payStatus", label: this.$t('webOrderSell.payStatus'), width: "auto", custom: true },
                { prop: "ctime", label: this.$t('webOrderSell.ctime'), width: "100" },
                { prop: "status", label: this.$t('webOrderSell.status'), width: "auto", custom: true },
                { prop: "cadmin", label: this.$t('webOrderWater.cadmin'), width: "auto" },
                { prop: "handle", label: this.$t('webOrderSell.handle'), width: "450", custom: true },
            ],
            //   表头信息，prop对应
            tableSlot: [
                // {
                //     title: "操作",
                //     slotType: "btnMore",
                //     buttontype: "info", // text为文字按钮，默认不传为正常按钮
                //     width: 350,
                //     slot: [
                //         { label: "新增付款记录", type: "addNew" },
                //         { label: "编辑", type: "edit" },
                //         { label: "删除", type: "dele" },
                //     ],
                //     more:[
                //         {  title: '取消订单',type: "close"},
                //     ]
                // }
            ],
            tableData: [],
            pageMsg: {
                page: 1,
                status: true,
                size: 10,
                sizes: [10, 20, 50, 100],
                total: 0
            },
            title: this.$t('webOrderSell.newAdd'),
            loading: false,
            addSellMsg: {
                title: this.$t('webOrderSell.newAdd')
            },
            rechargeRecordMsg: {
                title: this.$t('webOrderSell.addRecord')
            },
            stats: {
                count: 0,
                total: 0
            },
        };
    },
    components: { addSellDialog, rechargeRecordDialog },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    created() {
        const _this = this;
        this.init()
    },
    methods: {
        async init() {
            let form = {
                pageNo: this.pageMsg.page,
                pageSize: this.pageMsg.size
            }
            this.searchForm.ctime = this.timeDate ? this.timeDate.join('/') : '';
            Object.assign(form, this.searchForm);
            let res = await incomeIndex(form);
            res.records.handle = '';
            if (this.pageMsg.page == 1) {
                this.stats = {
                    count: res.stats.count,
                    total: res.stats.total
                }
            }
            res.records.forEach(item => {
                item.payStatus = item.status;
                item.ctime = parseTime(item.ctime);
                let payment_title = [], payment_number = [], goods_info = [];
                item.payment.forEach(itemName => {
                    payment_title.push(itemName.payment_title);
                    payment_number.push(itemName.payment_number);
                })
                item.invoice_goods.forEach(itemName => {
                    goods_info.push(itemName.goods_info.goods_name);
                })
                item.payment_title = payment_title.join(',');
                item.payment_number = payment_number.join(',');
                item.goods_info = goods_info.join(',');
            });
            this.tableData = res.records
            this.pageMsg.total = res.total
        },
        btnFunc(id, type) {
            if (type == 'addNew') {//新增付款记录
                this.$refs.rechargeRecordDialog.id = id;
                this.$refs.rechargeRecordDialog.upload = !this.$refs.rechargeRecordDialog.upload;
                this.$refs.rechargeRecordDialog.show = true;
            }
            if (type == 'edit') {
                this.addSellMsg.title = this.$t('webOrderSell.newEdit');
                this.$refs.addSellDialog.disabled = true;
                this.$refs.addSellDialog.show = true;
                this.$refs.addSellDialog.id = id;
                this.$refs.addSellDialog.upload = !this.$refs.addSellDialog.upload;
            }
            if (type == 'dele') {
                this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                    confirmButtonText: this.$t('webBaseBtn.confirm'),
                    cancelButtonText: this.$t('webBaseBtn.cancel'),
                    type: 'warning'
                }).then(async () => {
                    await incomeDel({ oid: id });
                    this.loading = true
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.deleSuccess')
                    });
                    this.init()
                })
            }
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
        btnType(param) {
            this.$confirm(this.$t('webOrderSell.cancelOrder'), this.$t('webBaseTips.confirm'), {
                confirmButtonText: this.$t('webBaseBtn.confirm'),
                cancelButtonText: this.$t('webBaseBtn.cancel'),
                type: 'warning'
            }).then(async () => {
                await incomeCancel({ oid: param.id });
                this.loading = true
                this.$message({
                    type: 'success',
                    message: this.$t('webOrderSell.cancelSuccess')
                });
                this.init()
            })
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
            }
            this.searchForm = {
                number: '',
                nickname: '',
                mobile: '',
                shop_name: '',
                goods_info: '',
                status: '',
                ctime: '',
                is_pay: '',
            };
            this.init();
        },
        //新增入账订单
        addNew() {
            this.addSellMsg.title = this.$t('webOrderSell.newAdd');
            this.$refs.addSellDialog.show = true;
            this.$refs.addSellDialog.disabled = false;
            this.$refs.addSellDialog.upload = !this.$refs.addSellDialog.upload;
            this.$refs.addSellDialog.id = '';
        },
        uploadEvent() {
            this.init();
        },
        orderUpload() {
            this.init();
        }
    }
};
</script>
<style scoped lang='less'>
</style>
