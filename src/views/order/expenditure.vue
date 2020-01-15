<!-- userList -->
<template>
    <div id="expenditure">
        <div class="mg-t-5 bfff pd-10">
            <el-button
                v-if="userInfo.type!=3"
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="addNew"
            >{{expenditureMsg.title}}</el-button>
            <el-form :model="searchForm" class="mt20">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webOrderExpend.searchNumber')"
                            v-model="searchForm.number"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-select
                            v-model="searchForm.expenses_type"
                            :placeholder="$t('webOrderExpend.searchType')"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webOrderExpend.searchShopName')"
                            v-model="searchForm.shop_name"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="12" class="tar">
                        <search-btn @search="search" @reset="reset"></search-btn>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="mt20">
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webOrderExpend.searchGoodsInfo')"
                            v-model="searchForm.goods_info"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
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
                <el-col :span="3">{{$t('webOrderExpend.orderCount')}}:{{stats.count}}</el-col>
                <el-col :span="3">{{$t('webOrderExpend.orderTotal')}}:{{stats.total}}</el-col>
            </el-row>
            <o-table
                class="mg-t-5"
                :tableData="tableData"
                :tableTitle="tableTitle"
                :tableSlot="tableSlot"
                @btnFunc="btnFunc"
                :pageMsg="pageMsg"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
            >
                <template slot="goods_img" slot-scope="slot" v-if="slot.data.goods_img">
                    <el-popover placement="right" width="400" trigger="click">
                        <div class="imgBox">
                            <img
                                :src="goods_img"
                                style="width: 375px;height: 250px;"
                                v-for="goods_img in slot.data.goods_img"
                                alt=""
                            >
                        </div>
                        <el-link slot="reference">
                            {{$t('webBaseBtn.check')}}
                            <i class="el-icon-view el-icon--right"></i>
                        </el-link>
                    </el-popover>
                </template>
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
                    <template v-if="slot.data.handle==1">
                        <el-button
                            v-if="userInfo.type==2"
                            type="info"
                            size="small"
                            @click="btnFunc(slot.data.id,'edit')"
                        >{{$t('webOrderSell.edit')}}</el-button>
                        <el-button
                            v-if="userInfo.type==2"
                            type="danger"
                            size="small"
                            @click="btnFunc(slot.data.id,'dele')"
                        >{{$t('webOrderSell.dele')}}</el-button>
                        <el-button
                            type="info"
                            size="small"
                            @click="btnFunc(slot.data.id,'close')"
                            v-if="userInfo.type==2"
                        >{{$t('webOrderSell.cancel')}}</el-button>
                    </template>
                </template>
            </o-table>
            <!-- 创建角色Dialog -->
            <expenditureDialog
                ref="expenditureDialog"
                :title="expenditureMsg.title"
                @uploadEvent="uploadEvent"
            ></expenditureDialog>
        </div>
    </div>
</template>
<script>
import { memberList } from "@/api/member";
import { mapGetters } from 'vuex'
import { expensesIndex, expensesDel, expensesCancel } from "@/api/order";
import { expensesTypeList } from "@/api/merchant";
import { parseTime } from "@/utils";
import omg from "@/components/uploadImg";
import expenditureDialog from "./components/expenditureDialog";
export default {
    name: 'userList',
    data() {
        return {
            timeDate: '',
            searchForm: {
                number: '',
                shop_name: '',
                goods_info: '',
                expenses_type: '',
                ctime: '',
                cadmin: '',
            },
            options: [],
            tableTitle: [
                { prop: "number", label: this.$t('webOrderExpend.number'), width: "auto" },
                { prop: "expenses_title", label: this.$t('webOrderExpend.expenses_title'), width: "auto" },
                { prop: "memo", label: this.$t('webOrderExpend.memo'), width: "auto" },
                { prop: "shop_name", label: this.$t('webOrderExpend.shop_name'), width: "auto" },
                { prop: "goods_info", label: this.$t('webOrderExpend.goods_info'), width: "auto" },
                { prop: "invoice_money", label: this.$t('webOrderExpend.invoice_money'), width: "auto" },
                { prop: "payment_title", label: this.$t('webOrderExpend.payment_title'), width: "auto" },
                { prop: "goods_img", label: this.$t('webOrderExpend.goods_img'), width: "auto", custom: true },
                { prop: "payStatus", label: this.$t('webOrderExpend.payStatus'), width: "auto", custom: true },
                { prop: "ctime", label: this.$t('webOrderExpend.ctime'), width: "100" },
                { prop: "status", label: this.$t('webOrderExpend.status'), width: "auto", custom: true },
                { prop: "cadmin", label: this.$t('webOrderWater.cadmin'), width: "auto" },
                { prop: "handle", label: this.$t('webOrderExpend.handle'), width: "350", custom: true },
            ],
            //   表头信息，prop对应
            tableSlot: [
                // {
                //     title: "操作",
                //     slotType: "btn",
                //     buttontype: "info", // text为文字按钮，默认不传为正常按钮
                //     width: 350,
                //     slot: [
                //         { label: "编辑", type: "edit" },
                //         { label: "删除", type: "dele" },
                //         { label: "取消订单", type: "close" },
                //     ],
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
            expenditureMsg: {
                title: this.$t('webOrderExpend.addNew')
            },
            stats: {
                count: 0,
                total: 0
            },
            cadminList: [],
        };
    },
    components: { omg, expenditureDialog },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    created() {
        this.list();
        this.init();
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
            let res = await expensesIndex(form);
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
                let payment_title = [], goods_info = [], expenses_title = [], goods_img = [];
                item.payment.forEach(itemName => {
                    payment_title.push(itemName.payment_title);
                })
                item.invoice_goods.forEach(itemName => {
                    goods_info.push(itemName.goods_info.goods_name);
                    goods_img.push(itemName.goods_info.goods_img);
                    expenses_title.push(itemName.expenses_title);
                })
                item.payment_title = payment_title.join(',');
                item.goods_info = goods_info.join(',');
                item.expenses_title = expenses_title.join(',');
                item.goods_img = goods_img;
            });
            this.tableData = res.records
            this.pageMsg.total = res.total
            this.loading = false
        },
        btnFunc(id, type) {
            if (type == 'edit') {
                this.$refs.expenditureDialog.show = true;
                this.$refs.expenditureDialog.id = id;
                this.$refs.expenditureDialog.upload_status = !this.$refs.expenditureDialog.upload_status;
            }
            if (type == 'dele') {
                this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                    confirmButtonText: this.$t('webBaseBtn.confirm'),
                    cancelButtonText: this.$t('webBaseBtn.cancel'),
                    type: 'warning'
                }).then(async () => {
                    await expensesDel({ oid: id });
                    this.loading = true
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.deleSuccess')
                    });
                    this.init()
                })
            }
            if (type == 'close') {
                this.$confirm(this.$t('webOrderSell.cancelOrder'), this.$t('webBaseTips.confirm'), {
                    confirmButtonText: this.$t('webBaseBtn.confirm'),
                    cancelButtonText: this.$t('webBaseBtn.cancel'),
                    type: 'warning'
                }).then(async () => {
                    await expensesCancel({ oid: id });
                    this.loading = true
                    this.$message({
                        type: 'success',
                        message: this.$t('webOrderSell.cancelSuccess')
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
                shop_name: '',
                goods_info: '',
                expenses_type: '',
                ctime: '',
            };
            this.init();
        },
        //新增支出订单
        addNew() {
            console.log(12313)
            this.$refs.expenditureDialog.show = true;
            this.$refs.expenditureDialog.id = '';
            this.$refs.expenditureDialog.upload_status = !this.$refs.expenditureDialog.upload_status;
        },
        list() {
            const form = {
                pageNo: 1,
                pageSize: 999
            }
            expensesTypeList(form).then(res => {
                console.log(res)
                this.options = res.records;
            })
            memberList(form).then(res => {//充值訂單管理員列表
                this.cadminList = res.records;
            })
        },
        uploadEvent() {
            this.init();
        }
    }
};
</script>
<style lang='scss'>
#expenditure {
  .avatar-uploader {
    width: 100px;
    height: 100px;
  }
  .avatar-uploader:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  /*.imgBox{*/
  /*img{*/
  /*width: 3rem;*/
  /*height: 3rem;*/
  /*}*/
  /*}*/
}
</style>
