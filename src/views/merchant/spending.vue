<<<<<<< .mine
<!-- goodsClassify -->
<template>
    <div id="goodsClassify">
        <div class="mg-t-5 bfff pd-10">
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="openDialog('add')"
            >{{$t('webMerchantSpending.titleAdd')}}</el-button>
            <el-form :model="searchForm">
                <el-row :gutter="10" class="mg-t-5">
                    <el-col :span="4">
                        <el-form-item>
                            <el-input
                                :placeholder="$t('webMerchantSpending.searchTitle')"
                                v-model="searchForm.title"
                            >
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-date-picker
                                class="mg-r-10"
                                v-model="timeDate"
                                type="daterange"
                                :range-separator="$t('webBaseMessage.date_separator')"
                                :start-placeholder="$t('webBaseMessage.date_start')"
                                :end-placeholder="$t('webBaseMessage.date_end')"
                                value-format="yyyy-MM-dd"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16" class="tar">
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
            ></o-table>
            <oDialog ref="spendingDialog" :title="dialogMsg.title" @uploadEvent="uploadEvent"></oDialog>
        </div>
    </div>
</template>
<script>
import { expensesTypeList, expensesTypeDel } from "@/api/merchant";
import oDialog from "./components/spendingDialog";
export default {
    name: 'goodsClassify',
    data() {
        return {
            timeDate: '',
            dialogMsg: {
                title: this.$t('webMerchantSpending.titleAdd'),
            },
            searchForm: {
                title: '',
            },
            tableTitle: [
                { prop: "id", label: this.$t('webMerchantSpending.id'), width: "100" },
                { prop: "title", label: this.$t('webMerchantSpending.title'), width: "auto" },
                { prop: "ctime", label: this.$t('webMerchantSpending.ctime'), width: "auto" },
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
                start_time: this.timeDate ? this.timeDate[0] : '',
                end_time: this.timeDate ? this.timeDate[1] : '',
            }
            let res = await expensesTypeList(form);
            res.records.forEach(item => {
                if (item.lock == 1) {
                item.hideBtn = ['edit','dele']
                }
            })
            this.tableData = res.records
            this.pageMsg.total = res.total
            this.loading = false
        },
        btnFunc(index, type) {
            console.log(index, type);
            this.openDialog(type, index)
        },
        openDialog(type, index) {
            switch (type) {
                case 'add':
                    this.$refs.spendingDialog.show = true;
                    this.$refs.spendingDialog.id = '';
                    this.$refs.spendingDialog.form.title = '';
                    this.dialogMsg.title = this.$t('webMerchantSpending.titleAdd');
                    break;
                case 'edit':
                    const id = this.tableData[index].id;
                    this.$refs.spendingDialog.show = true;
                    this.$refs.spendingDialog.id = id;
                    this.$refs.spendingDialog.form.title = this.tableData[index].title;
                    this.dialogMsg.title = this.$t('webMerchantSpending.titleEdit');
                    break;
                case "dele":
                    const ids = this.tableData[index].id;
                    this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                        confirmButtonText: this.$t('webBaseBtn.confirm'),
                        cancelButtonText: this.$t('webBaseBtn.cancel'),
                        type: 'warning'
                    }).then(async () => {
                        await expensesTypeDel({ id: ids });
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
            this.timeDate = '';
            this.pageMsg = {
                page: 1,
                status: true,
                size: 10,
                sizes: [10, 20, 50, 100],
                total: 0
            };
            this.searchForm = { title: '', };
            this.init();
        },
        uploadEvent() {
            this.init();
        }
    }
};
</script>
<style scoped lang='scss'>
</style>
