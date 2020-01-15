<!-- question  -->
<template>
    <div id="moduleManage">
        <div class="mg-t-5 pd-10 bfff">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addNew()">{{$t('webModuleManagement.addModule')}}</el-button>
            <el-form :model="searchForm" class="mg-t-5">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input :placeholder="$t('webModuleManagement.pleaseEnterName')" v-model="searchForm.search_name">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input :placeholder="$t('webModuleManagement.pleaseEnterKey')" v-model="searchForm.search_key">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="12" class="tar">
                        <search-btn @search="search" @reset="reset"></search-btn>
                    </el-col>
                </el-row>
            </el-form>
            <o-table
                :tableData="tableData"
                :tableTitle="tableTitle"
                :tableSlot="tableSlot"
                :pageMsg="pageMsg"
                select
                multy
                :tips="false"
                @btnFunc="btnFunc"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
                @batchSubmit="batchSubmit"
            ></o-table>
            <!-- 创建角色Dialog -->
            <langManageAddDialog ref="langManageAddDialog" :title="dialogMsg.title"></langManageAddDialog>
            <manageBtnDialog ref="manageBtnDialog" :title="manageBtnMsg.title"></manageBtnDialog>
        </div>
    </div>
</template>
<script>
import langManageAddDialog from "../components/langManageDialog";
import manageBtnDialog from "../components/manageBtnDialog";
import { moduleList, moduleDel } from "@/api/languageManage/module";
export default {
    data() {
        return {
            searchForm: {
                search_name: '',
                search_key: '',
                pageNo: 1,
                pageSize: 10
            },
            tableTitle: [
                { prop: "name", label: this.$t('webModuleManagement.name'), width: "auto" },
                { prop: "module_key", label: this.$t('webModuleManagement.module_key'), width: "auto" },
            ],
            // 表头信息，prop对应
            tableSlot: [
                {
                    title: this.$t('webBaseMessage.operation'),
                    slotType: "btn",
                    buttontype: "info", // text为文字按钮，默认不传为正常按钮
                    width: '235',
                    slot: [
                        { label: this.$t('webBaseBtn.edit'), type: "edit" },
                        { label: this.$t('webBaseBtn.dele'), type: "dele" },
                        { label: this.$t('webBaseBtn.detail'), type: 'detail' }
                    ],
                    // more: [
                    //     { title: '添加按钮', type: 'add' },
                    //     { title: '详情', type: 'detail' }
                    // ]
                }
            ],
            tableData: [],
            dialogMsg: {
                title: this.$t('webModuleManagement.editModule')
            },
            manageBtnMsg: {
                title: this.$t('webModuleManagement.editBtn')
            },
            pageMsg: {
                status: true,
                page: 1,
                size: 10,
                sizes: [10, 20, 50, 100],
                total: 0
            }
        };
    },
    components: { langManageAddDialog, manageBtnDialog },
    computed: {},
    created() {
        const _this = this
        this.searchForm.pageSize = this.pageMsg.size
        this.init();
    },
    methods: {
        async init() {
            let res = await moduleList(this.searchForm);
            this.tableData = res.records
            this.pageMsg.total = res.total
        },
        async btnFunc(index, type) {
            const _this = this;
            const id = this.tableData[index].id
            switch (type) {
                case 'edit':
                    this.dialogMsg.title = this.$t('webModuleManagement.editModule')
                    this.$refs.langManageAddDialog.form.id = id;
                    this.$refs.langManageAddDialog.show = true;
                    break;
                case 'dele':
                    this.dele(id);
                    break;
                case 'add':
                    this.manageBtnMsg.title = this.$t('webModuleManagement.addBtn')
                    this.$refs.manageBtnDialog.show = true;
                    break;
                case 'detail':
                    this.$router.push({
                        path: '/setUp/language/btnManage',
                        query: {
                            key: this.tableData[index].module_key
                        }
                    });
                    break;
            }
        },
        selecChange(val) {
            const _this = this;
            let data = [];
            val.forEach(item => {
                data.push(item.date);
            });
            console.log(data);
        },
        switchChange(row, index) {
            console.log("switchChange", row, languageManage);
        },
        inputChange(val) {
            console.log(val);
        },
        batchSubmit(key, val) {
            console.log(key, val);
            let id = new Array();
            val.forEach(item => {
                id.push(item.id)
            })
            if (key == 1) {
                this.dele(id.join(','))
            }
        },
        async dele(id) {
            this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                confirmButtonText: this.$t('webBaseBtn.confirm'),
                cancelButtonText: this.$t('webBaseBtn.cancel'),
                type: 'warning'
            }).then(async () => {
                await moduleDel({ id })
                this.$message({
                    type: 'success',
                    message: this.$t('webBaseTips.deleSuccess')
                });
                this.init()
            })
        },
        addNew() {
            this.dialogMsg.title = this.$t('webModuleManagement.addModule')
            delete this.$refs.langManageAddDialog.form.id;
            this.$refs.langManageAddDialog.show = true;
        },
        search() {
            this.searchForm.pageNo = 1
            this.init()
        },
        reset() {
            this.searchForm = {
                search_name: '',
                search_key: '',
            }
        },
        pageChange(val) {
            this.searchForm.pageNo = val
            this.init()
        },
        sizeChange(val) {
            console.log(val)
            this.searchForm.pageSize = val
            this.init()
        },
    }
};
</script>
<style scoped lang='scss'>
</style>
