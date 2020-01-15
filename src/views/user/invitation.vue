<!-- userList -->
<template>
    <div id="userList">
        <div class="mg-t-5 bfff pd-10">
            <el-form :model="invitationForm">
                <el-row :gutter="10">
                    <el-col :span="3">
                        <el-input
                            :placeholder="$t('webInvitation.searchMain_mobile')"
                            v-model="invitationForm.main_mobile"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input
                            :placeholder="$t('webInvitation.searchNew_mobile')"
                            v-model="invitationForm.new_mobile"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-select
                            v-model="invitationForm.new_status"
                            :placeholder="$t('webInvitation.searchNew_status')"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-date-picker
                            class="mg-r-10"
                            v-model="invitationForm.dateTime"
                            type="daterange"
                            :range-separator="$t('webBaseMessage.date_separator')"
                            :start-placeholder="$t('webBaseMessage.date_start')"
                            :end-placeholder="$t('webBaseMessage.date_end')"
                        ></el-date-picker>
                    </el-col>
                    <el-col :span="12" class="tar">
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
                <template
                    slot="new_status"
                    slot-scope="slot"
                >{{slot.data.new_status==0?$t('webAuthType.unverified'):slot.data.new_status==-1?$t('webAuthType.stop'):slot.data.new_status==-2?$t('webAuthType.cancel'):$t('webAuthType.certified')}}</template>
                <template slot="ctime" slot-scope="slot">{{slot.data.ctime|timeStr}}</template>
            </o-table>
        </div>
    </div>
</template>
<script>
import { getList } from "@/api/members/invite";
import { timeStr } from "@/utils";
export default {
    name: 'userList',
    data() {
        return {
            invitationForm: {
                main_mobile: '',
                new_mobile: '',
                new_status: '',
                dateTime: '',
                ctime: '',
                pageNo: 1,
                pageSize: 10
            },
            options: [
                {
                    value: 1,
                    label: this.$t('webAuthType.certified')
                },
                {
                    value: 0,
                    label: this.$t('webAuthType.unverified')
                },
                {
                    value: -1,
                    label: this.$t('webAuthType.stop')
                },
                {
                    value: -2,
                    label: this.$t('webAuthType.cancel')
                },
            ],
            tableTitle: [
                { prop: "main_nickname", label: this.$t('webInvitation.main_nickname'), width: "150" },
                { prop: "main_mobile", label: this.$t('webInvitation.main_mobile'), width: "150" },
                { prop: "new_nickname", label: this.$t('webInvitation.new_nickname'), width: "150" },
                { prop: "new_mobile", label: this.$t('webInvitation.new_mobile'), width: "150" },
                { prop: "new_status", label: this.$t('webInvitation.new_status'), width: "150", custom: true },
                { prop: "ctime", label: this.$t('webInvitation.ctime'), width: "auto", custom: true },
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
        this.invitationForm.pageSize = this.pageMsg.size
        this.init()
    },
    methods: {
        async init() {
            let res = await getList(this.invitationForm);
            this.tableData = res.records
            this.pageMsg.total = res.total
        },
        search() {
            this.invitationForm.pageNo = 1;
            if (this.invitationForm.dateTime) {
                let stime = timeStr(this.invitationForm.dateTime[0], "Y-m-d")
                let etime = timeStr(this.invitationForm.dateTime[1], "Y-m-d")
                this.invitationForm.ctime = stime + "/" + etime
            }
            this.init()
        },
        reset() {
            this.invitationForm = {
                main_mobile: '',
                new_mobile: '',
                new_status: '',
                ctime: '',
            }
        },
        pageChange(val) {
            this.invitationForm.pageNo = val
            this.init()
        },
        sizeChange(val) {
            this.invitationForm.pageSize = val
            this.init()
        },

    }
};
</script>
<style scoped lang='less'>
</style>
