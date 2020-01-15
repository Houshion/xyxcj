<!-- gooodsList -->
<template>
    <div id="gooodsList">
        <div class="mg-t-5 bfff pd-10">
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="openDialog('add')"
            >{{$t('webMerchantStaff.titleAdd')}}</el-button>
            <el-form :model="recordForm">
                <el-row :gutter="10" class="mg-t-5">
                    <el-col :span="4">
                        <el-form-item>
                            <el-input
                                :placeholder="$t('webMerchantStaff.search_shop_name')"
                                v-model="recordForm.shop_name"
                            >
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input
                                :placeholder="$t('webMerchantStaff.search_nickname')"
                                v-model="recordForm.nickname"
                            >
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input
                                :placeholder="$t('webMerchantStaff.search_mobile')"
                                v-model="recordForm.mobile"
                            >
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-select
                                v-model="recordForm.status"
                                :placeholder="$t('webMerchantStaff.search_status')"
                            >
                                <el-option
                                    :label="$t('webMerchantManager.managerStatus_on')"
                                    value="1"
                                ></el-option>
                                <el-option
                                    :label="$t('webMerchantManager.managerStatus_off')"
                                    value="2"
                                ></el-option>
                            </el-select>
                        </el-form-item>
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
                @btnFunc="btnFunc"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
            >
                <template slot="status" slot-scope="slot">
                    <span
                        v-if="slot.data.status==1"
                        class="color1"
                    >{{$t('webMerchantManager.managerStatus_on')}}</span>
                    <span
                        v-if="slot.data.status==0"
                        class="color3"
                    >{{$t('webMerchantManager.managerStatus_off')}}</span>
                </template>
            </o-table>
            <oDialog ref="staffDialog" :title="dialogMsg.title"></oDialog>
        </div>
    </div>
</template>
<script>
import { clerkList, clerkDelete, untyingIccard } from "@/api/merchant";
import oDialog from "./components/staffDialog";
export default {
    name: 'gooodsList',
    data() {
        return {
            dialogMsg: {
                title: '新增店员',
            },
            recordForm: {
                shop_name: '',
                nickname: '',
                mobile: '',
                status: ''
            },
            tableTitle: [
                { prop: "mid", label: this.$t('webMerchantStaff.mid'), width: "70" },
                { prop: "nickname", label: this.$t('webMerchantStaff.nickname'), width: "auto" },
                { prop: "iccard", label: this.$t('webMerchantStaff.iccard'), width: "auto" },
                { prop: "mobile", label: this.$t('webMerchantStaff.mobile'), width: "auto" },
                { prop: "shop_name", label: this.$t('webMerchantStaff.shop_name'), width: "auto" },
                { prop: "status", label: this.$t('webMerchantStaff.status'), width: "auto", custom: true },
                { prop: "create_time", label: this.$t('webMerchantStaff.create_time'), width: "auto" },
            ],
            //   表头信息，prop对应
            tableSlot: [
                // {
                //     title: "上下架",
                //     slotType: "switch",
                //     width: 150,
                //     active: "上架",
                //     inactive: "下架",
                // },
                {
                    title: this.$t('webBaseMessage.operation'),
                    slotType: "btnMore",
                    width: "200",
                    buttontype: "info", // text为文字按钮，默认不传为正常按钮
                    slot: [
                        { label: this.$t('webBaseBtn.edit'), type: "edit" },
                        { label: this.$t('webBaseBtn.dele'), type: "dele" },
                    ],
                    more: [
                        { title: this.$t('webMerchantManager.removeCard'), type: "clear" },
                    ]
                }
            ],
            tableData: [],
            pageMsg: {
                page: 1,
                status: true,
                size: 10,
                sizes: [10, 20, 50, 100],
                total: 0
            },
            loading: false
        };
    },
    components: {
        oDialog
    },
    computed: {},
    created() {
        this.init();
    },
    methods: {
        async init() {
            this.loading = true
            let form = {
                pageNo: this.pageMsg.page,
                pageSize: this.pageMsg.size,
            }
            Object.assign(form, this.recordForm);
            let res = await clerkList(form);
            this.tableData = res.records
            this.pageMsg.total = res.total
            this.loading = false
        },
        btnFunc(index, type) {
            const _this = this;
            console.log(index, type);
            const id = this.tableData[index].mid;
            this.openDialog(type, id)
        },
        openDialog(type, id) {
            switch (type) {
                case 'add':
                    this.dialogMsg.title = this.$t('webMerchantStaff.titleAdd');
                    this.$refs.staffDialog.form.mid = '';
                    this.$refs.staffDialog.show = true
                    break;
                case 'edit':
                    this.dialogMsg.title = this.$t('webMerchantStaff.titleEdit');
                    this.$refs.staffDialog.form.mid = id;
                    this.$refs.staffDialog.show = true;
                    break;
                case "dele":
                    this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                        confirmButtonText: this.$t('webBaseBtn.confirm'),
                        cancelButtonText: this.$t('webBaseBtn.cancel'),
                        type: 'warning'
                    }).then(async () => {
                        await clerkDelete({ mid: id });
                        this.$message({
                            type: 'success',
                            message: this.$t('webBaseTips.deleSuccess')
                        });
                        this.init();
                    })
                    break;
                case 'clear':
                    this.$confirm(this.$t('webMerchantManager.removeConfirm'), this.$t('webBaseTips.confirm'), {
                        confirmButtonText: this.$t('webBaseBtn.confirm'),
                        cancelButtonText: this.$t('webBaseBtn.cancel'),
                        type: 'warning'
                    }).then(async () => {
                        await untyingIccard({ mid: id });
                        this.$message({
                            type: 'success',
                            message: this.$t('webMerchantManger.removeSuccess'),
                        });
                        this.init();
                    })
                    break;
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
            this.pageMsg = {
                page: 1,
                status: true,
                size: 10,
                sizes: [10, 20, 50, 100],
                total: 0
            };
            this.recordForm = {
                shop_name: '',
                nickname: '',
                mobile: '',
                status: ''
            };
            this.init();
        },
    }
};
</script>
<style scoped lang='less'>
</style>
