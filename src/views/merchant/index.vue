<!-- gooodsList -->
<template>
    <div id="gooodsList">
        <div class="mg-t-5 bfff pd-10">
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="openDialog('add')"
            >{{$t('webMerchant.titleAdd')}}</el-button>
            <el-form :model="recordForm">
                <el-row :gutter="10" class="mg-t-5">
                    <el-col :span="4">
                        <el-form-item>
                            <el-input
                                :placeholder="$t('webMerchant.search_shop_name')"
                                v-model="recordForm.shop_name"
                            >
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input
                                :placeholder="$t('webMerchant.search_nickname')"
                                v-model="recordForm.nickname"
                            >
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input
                                :placeholder="$t('webMerchant.search_mobile')"
                                v-model="recordForm.mobile"
                            >
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="6" class="tar">
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
                    >{{$t('webMerchant.shopStatusOpen')}}</span>
                    <span
                        v-if="slot.data.status==2"
                        class="color3"
                    >{{$t('webMerchant.shopStatusStop')}}</span>
                </template>
            </o-table>
            <oDialog ref="shopDialog" :title="dialogMsg.title"></oDialog>
        </div>
    </div>
</template>
<script>
import { operateIndex, operateDel } from "@/api/merchant";
import oDialog from "./components/indexDialog";
export default {
    data() {
        return {
            dialogMsg: {
                title: this.$t('webMerchant.titleAdd'),
            },
            recordForm: {
                shop_name: '',
                manager: '',
                nickname: '',
                mobile: '',
            },
            tableTitle: [
                { prop: "shop_id", label: this.$t('webMerchant.shop_id'), width: "70" },
                { prop: "shop_name", label: this.$t('webMerchant.shop_name'), width: "auto" },
                { prop: "address", label: this.$t('webMerchant.address'), width: "auto" },
                { prop: "device_count", label: this.$t('webMerchant.device_count'), width: "auto" },
                { prop: "nickname", label: this.$t('webMerchant.nickname'), width: "auto" },
                { prop: "mobile", label: this.$t('webMerchant.mobile'), width: "auto" },
                { prop: "status", label: this.$t('webMerchant.status'), width: "auto", custom: true },
                { prop: "ctime", label: this.$t('webMerchant.ctime'), width: "auto" },
            ],
            //   表头信息，prop对应
            tableSlot: [
                {
                    title: this.$t('webBaseMessage.operation'),
                    slotType: "btn",
                    width: 150,
                    buttontype: "info", // text为文字按钮，默认不传为正常按钮
                    slot: [
                        { label: this.$t('webBaseBtn.edit'), type: "edit" },
                        { label: this.$t('webBaseBtn.dele'), type: "dele" },
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
            let res = await operateIndex(form);
            this.tableData = res.records
            this.pageMsg.total = res.total
            this.loading = false
        },
        btnFunc(index, type) {
            console.log(index, type);
            const id = this.tableData[index].shop_id;
            this.openDialog(type, id)
        },
        openDialog(type, id) {
            switch (type) {
                case 'add':
                    this.$refs.shopDialog.show = true;
                    this.$refs.shopDialog.id = '';
                    this.dialogMsg.title = this.$t('webMerchant.titleAdd');
                    this.$refs.shopDialog.upload = !this.$refs.shopDialog.upload;
                    break;
                case 'edit':
                    this.$refs.shopDialog.show = true
                    this.$refs.shopDialog.id = id;
                    this.dialogMsg.title = this.$t('webMerchant.titleEdit');
                    this.$refs.shopDialog.upload = !this.$refs.shopDialog.upload;
                    break;
                case "dele":
                    this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                        confirmButtonText: this.$t('webBaseBtn.confirm'),
                        cancelButtonText: this.$t('webBaseBtn.cancel'),
                        type: 'warning'
                    }).then(async () => {
                        await operateDel({ shop_id: id });
                        this.loading = true
                        this.$message({
                            type: 'success',
                            message: this.$t('webBaseTips.deleSuccess')
                        });
                        this.init()
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
                manager: '',
                nickname: ''
            };
            this.init();
        },
    }
};
</script>
<style scoped lang='less'>
</style>
