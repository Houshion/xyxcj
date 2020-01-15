<!-- userList -->
<template>
    <div id="userList">
        <div class="mg-t-5 bfff pd-10">
            <el-form :model="searchForm" class="mt20">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webOrderAll.search_numbe')"
                            v-model="searchForm.number"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webOrderAll.search_nickname')"
                            v-model="searchForm.nickname"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webOrderAll.search_mobile')"
                            v-model="searchForm.mobile"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webOrderAll.search_shop_name')"
                            v-model="searchForm.shop_name"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="8" class="tar">
                        <search-btn @search="search" @reset="reset"></search-btn>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="mt20">
                    <el-col :span="4">
                        <el-select
                            v-model="searchForm.income_type"
                            :placeholder="$t('webOrderAll.search_income_type')"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select
                            v-model="searchForm.status"
                            :placeholder="$t('webOrderAll.search_status')"
                        >
                            <el-option
                                v-for="item in optionsStatus"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <!-- <el-input
                            :placeholder="$t('webOrderWater.search_cuid')"
                            v-model="searchForm.cadmin"
                            ></el-input>-->
                            <el-select
                                filterable
                                allow-create
                                class="wd-100"
                                v-model="searchForm.cadmin"
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
                    <el-col :span="8">
                        <el-date-picker
                            class="mg-r-10"
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
                <el-col :span="6">{{$t('webOrderAll.orderCount')}}:{{stats.count}}</el-col>
                <el-col :span="12">{{$t('webOrderAll.orderTotal')}}:{{stats.total}}</el-col>
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
                <template slot="status" slot-scope="slot">
                    <span class="color3" v-if="slot.data.status==0">{{$t('webOrderType.unpay')}}</span>
                    <span class="color3" v-if="slot.data.status==122">{{$t('webOrderType.cancel')}}</span>
                    <span class="color3" v-if="slot.data.status==131">{{$t('webOrderType.using')}}</span>
                    <span class="color1" v-if="slot.data.status==666">{{$t('webOrderType.finish')}}</span>
                </template>
                <template slot="handle" slot-scope="slot">
                    <el-button
                        type="info"
                        size="small"
                        @click="btnFunc(slot.data.id,'print')"
                    >{{$t('webOrderAll.printOrder')}}</el-button>
                    <template v-if="slot.data.handle==1">
                        <el-button
                            type="info"
                            size="small"
                            @click="btnFunc(slot.data.id,'addNew')"
                            v-if="slot.data.status==0 || slot.data.status==131"
                        >{{$t('webOrderAll.titleAdd')}}</el-button>
                        <el-button
                            type="info"
                            size="small"
                            @click="btnFunc(slot.data.id,'edit')"
                        >{{$t('webOrderAll.edit')}}</el-button>
                        <el-button
                            type="danger"
                            size="small"
                            @click="btnFunc(slot.data.id,'dele')"
                        >{{$t('webOrderAll.dele')}}</el-button>
                        <el-dropdown @command="btnType" v-if="userInfo.type !=3 ">
                            <el-button size="small">{{$t('webBaseBtn.more')}}</el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                    :command="{id:slot.data.id,type:'cancel'}"
                                >{{$t('webOrderAll.cancel')}}</el-dropdown-item>
                                <!-- <el-dropdown-item
                                    :command="{id:slot.data.id,type:'print'}"
                                >{{$t('webOrderAll.printOrder')}}</el-dropdown-item>-->
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </template>
            </o-table>
            <!-- 创建角色Dialog -->
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
import { memberList } from "@/api/member";
import { mapGetters } from 'vuex'
import { allOrderIndex, incomeIndex, incomeDel, incomeCancel } from "@/api/order";
import { parseTime } from "@/utils";
import addSellDialog from "./components/addSellDialog";
import rechargeRecordDialog from "./components/rechargeRecordDialog";
export default {
    name: 'userList',
    data() {
        return {
            timeDate: '',
            printShow: false,
            searchForm: {
                number: '',
                nickname: '',
                mobile: '',
                shop_name: '',
                income_type: '',
                status: '',
                ctime: '',
                cadmin: '',
            },
            options: [
                {
                    value: '0',
                    label: this.$t('webOrderAll.orderType_car')
                }, {
                    value: '1',
                    label: this.$t('webOrderAll.orderType_sell')
                }, {
                    value: '2',
                    label: this.$t('webOrderAll.orderType_expend')
                },
                {
                    value: '3',
                    label: this.$t('webOrderAll.orderType_rechargeList')
                },
                {
                    value: '4',
                    label: this.$t('webOrderAll.orderType_recharge')
                },
            ],
            optionsStatus: [
                {
                    value: '0',
                    label: this.$t('webOrderType.unpay')
                }, {
                    value: '122',
                    label: this.$t('webOrderType.cancel')
                }, {
                    value: '131',
                    label: this.$t('webOrderType.using')
                },
                {
                    value: '666',
                    label: this.$t('webOrderType.finish')
                },
            ],
            tableTitle: [
                { prop: "number", label: this.$t('webOrderAll.number'), width: "auto" },
                { prop: "nickname", label: this.$t('webOrderAll.nickname'), width: "auto" },
                { prop: "mobile", label: this.$t('webOrderAll.mobile'), width: "auto" },
                { prop: "shop_name", label: this.$t('webOrderAll.shop_name'), width: "auto" },
                { prop: "invoice_money", label: this.$t('webOrderAll.invoice_money'), width: "auto" },
                { prop: "income_type", label: this.$t('webOrderAll.income_type'), width: "auto", custom: true },
                { prop: "ctime", label: this.$t('webOrderAll.ctime'), width: "100" },
                { prop: "status", label: this.$t('webOrderAll.status'), width: "auto", custom: true },
                { prop: "cadmin", label: this.$t('webOrderWater.cadmin'), width: "auto" },
                { prop: "handle", label: this.$t('webOrderAll.handle'), width: "450", custom: true },
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
            loading: false,
            addSellMsg: {
                title: this.$t('webOrderAll.titleAdd')
            },
            rechargeRecordMsg: {
                title: this.$t('webOrderAll.titleAdd')
            },
            stats: {
                count: 0,
                total: 0
            },
            cadminList: [],
        };
    },
    components: { addSellDialog, rechargeRecordDialog },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    created() {
        this.init()
        memberList({ pageSize: 999 }).then(res => {//充值訂單管理員列表
            this.cadminList = res.records;
        })
    },
    methods: {
        async init() {
            this.loading = true
            let form = {
                pageNo: this.pageMsg.page,
                pageSize: this.pageMsg.size
            }
            this.searchForm.ctime = this.timeDate ? this.timeDate.join('/') : '';
            Object.assign(form, this.searchForm);
            let res = await allOrderIndex(form);
            console.log(res)
            res.records.handle = '';
            if (this.pageMsg.page == 1) {
                this.stats = {
                    count: res.stats.count,
                    total: res.stats.total
                }
            }
            res.records.forEach(item => {
                item.ctime = parseTime(item.ctime);
                item.handle = item.income_type;
            })
            this.tableData = res.records
            this.pageMsg.total = res.total
            this.loading = false
        },
        btnFunc(id, type) {
            console.log(id, type);
            if (type == 'addNew') {//新增付款记录
                this.addPayRecord(id);
            }
            if (type == 'edit') {
                this.addNew(id);
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
            if (param.type == "cancel") {
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
            }
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
            this.searchForm = {
                number: '',
                nickname: '',
                mobile: '',
                shop_name: '',
                income_type: '',
                status: '',
                ctime: '',
            };
            this.init();
        },
        //编辑入账订单
        addNew(id) {
            this.addSellMsg.title = this.$t('webOrderAll.titleEdit');
            this.$refs.addSellDialog.disabled = true;
            this.$refs.addSellDialog.show = true;
            this.$refs.addSellDialog.id = id;
            this.$refs.addSellDialog.upload = !this.$refs.addSellDialog.upload;
        },
        //新增付款记录
        addPayRecord(id) {
            this.$refs.rechargeRecordDialog.id = id;
            this.$refs.rechargeRecordDialog.upload = !this.$refs.rechargeRecordDialog.upload;
            this.$refs.rechargeRecordDialog.show = true;
        },
        uploadEvent() {
            this.init();
        },
        orderUpload() {
            this.init();
        },
    }
};
</script>
<style scoped lang='less'>
</style>
