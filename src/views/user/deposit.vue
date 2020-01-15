<!-- userList -->
<template>
    <div id="userList">
        <div class="mg-t-5 bfff pd-10">
            <el-form :model="searchForm">
                <el-row :gutter="10">
                    <el-col :span="4" v-show="false">
                        <el-input
                            :placeholder="$t('webDepositList.searchMemberId')"
                            v-model="searchForm.member_id"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webDepositList.searchMobile')"
                            v-model="searchForm.mobile"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-select
                            v-model="searchForm.pay_type"
                            :placeholder="$t('webDepositList.searchPayType')"
                        >
                            <el-option
                                v-for="item in payWayArr"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select
                            v-model="searchForm.money_type"
                            :placeholder="$t('webDepositList.searchMoneyType')"
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
                        <el-input :placeholder="$t('webLog.operator')" v-model="searchForm.cadmin">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="8" class="tar">
                        <search-btn @search="search" @reset="reset"></search-btn>
                    </el-col>
                </el-row>
            </el-form>
            <o-table
                class="mg-t-5"
                :tableData="tableData"
                :tableTitle="tableTitle"
                :tableSlot="tableSlot"
                :pageMsg="pageMsg"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
            >
                <template slot="ctime" slot-scope="slot">{{slot.data.ctime|timeStr}}</template>
                <template
                    slot="operate_type"
                    slot-scope="slot"
                >{{slot.data.operate_type==3?$t('webDepositList.depositTypeIn'):$t('webDepositList.depositTypeOut')}}</template>
            </o-table>
        </div>
    </div>
</template>
<script>
import { paymentIndex } from "@/api/payWay";
import { getList } from "@/api/members/deposit";
export default {
    name: 'userList',
    data() {
        return {
            searchForm: {
                member_id: '',
                mobile: '',
                pay_type: '',
                money_type: '',
                cadmin: '',
                pageNo: 1,
                pageSize: 10,
            },
            payWayArr: [],
            options: [{
                value: 3,
                label: this.$t('webDepositList.depositTypeIn')
            }, {
                value: 6,
                label: this.$t('webDepositList.depositTypeOut')
            }],
            tableTitle: [
                { prop: "number", label: this.$t('webDepositList.number'), width: "auto" },
                { prop: "nickname", label: this.$t('webDepositList.nickname'), width: "150" },
                { prop: "mobile", label: this.$t('webDepositList.mobile'), width: "150" },
                { prop: "money", label: this.$t('webDepositList.money'), width: "150" },
                { prop: "title", label: this.$t('webDepositList.title'), width: "150" },
                { prop: "memo", label: this.$t('webDepositList.memo'), width: "150" },
                { prop: "operate_type", label: this.$t('webDepositList.operate_type'), width: "150", custom: true },
                { prop: "cadmin", label: this.$t('webLog.operator'), width: "auto", },
                { prop: "ctime", label: this.$t('webDepositList.ctime'), width: "100", custom: true },
            ],
            //   表头信息，prop对应
            tableSlot: [],
            tableData: [],
            pageMsg: {
                page: 1,
                status: true,
                size: 10,
                sizes: [10, 20, 50, 100],
            },
            loading: false
        };
    },
    components: {},
    computed: {},
    created() {
        const _this = this;
        this.searchForm.pageSize = this.pageMsg.size
        this.init()
        paymentIndex({ pageSize: 999 }).then(res => {
            res.records.forEach(item => {
                this.payWayArr.push(
                    { label: item.title, value: item.id }
                )
            });
        })
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
            let res = await getList(this.searchForm);
            this.tableData = res.records
            this.pageMsg.total = res.total
        },
        search() {
            this.searchForm.pageNo = 1;
            this.init()
        },
        reset() {
            this.searchForm = {
                member_id: '',
                mobile: '',
                pay_type: '',
                money_type: '',
            }
        },
        async ruleConfirm() {
            console.log(this.rechargeForm)
            this.$refs['searchForm'].validate(async valid => {
                if (valid) {
                    this.dialogFormVisible = true;
                }
            });
        },
        pageChange(val) {
            this.searchForm.pageNo = val;
            this.init()
        },
        sizeChange(val) {
            this.searchForm.pageSize = val;
            this.init()
        },
    }
};
</script>
<style scoped lang='less'>
</style>
