<!-- question  -->
<template>
    <div id="btnManage">
        <div class="mg-t-5 pd-10 bfff">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addNew()">{{$t('webModuleManagement.addBtn')}}</el-button>
            <!-- <el-form :model="searchForm" class="mg-t-5">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input placeholder="请输入模块KEY" v-model="searchForm.module_key">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="18" class="tar">
                        <search-btn @search="search" @reset="reset"></search-btn>
                    </el-col>
                </el-row>
            </el-form>-->
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
            <moduleDetailDialog ref="btnManage" :title="dialogMsg.title"></moduleDetailDialog>
        </div>
    </div>
</template>
<script>
import moduleDetailDialog from "../components/moduleDetailDialog";
import { btnList, btnDel, } from "@/api/languageManage/btnManage";
export default {
    data() {
        return {
            dialogMsg: {
                title: this.$t('webModuleManagement.addBtn')
            },
            searchForm: {
                module_key: this.$route.query.key,
                pageNo: 1,
                pageSize: 10,
            },
            tableTitle: [
                { prop: "module_name", label: this.$t('webModuleManagement.name'), width: "auto" },
                { prop: "button_key", label: this.$t('webModuleManagement.button_key'), width: "auto" },
                { prop: "name", label: this.$t('webModuleManagement.btnName'), width: "auto" },
            ],
            // 表头信息，prop对应
            tableSlot: [
                {
                    title:  this.$t('webBaseMessage.operation'),
                    slotType: "btn",
                    buttontype: "info", // text为文字按钮，默认不传为正常按钮
                    width: '235',
                    slot: [
                        { label: this.$t('webBaseBtn.detail'), type: "detail" },
                        { label: this.$t('webBaseBtn.edit'), type: "edit" },
                        { label: this.$t('webBaseBtn.dele'), type: "dele" },
                    ]
                }
            ],
            tableData: [],
            pageMsg: {
                status: true,
                page: 1,
                size: 10,
                sizes: [10, 20, 50, 100],
                total: 0
            }
        };
    },
    components: {
        moduleDetailDialog
    },
    computed: {},
    created() {
        const _this = this
        this.searchForm.pageSize = this.pageMsg.size
        this.init();
    },
    mounted() {
        this.$refs.btnManage.form.module_key = this.$route.query.key
        console.log(this.$refs.btnManage.form)
    },
    methods: {
        async init() {
            let res = await btnList(this.searchForm);
            this.tableData = res.records
            this.pageMsg.total = res.total
        },
        async btnFunc(index, type) {
            const _this = this;
            const id = this.tableData[index].id
            switch (type) {
                case 'edit':
                    this.dialogMsg.title = this.$t('webModuleManagement.edit');
                    this.$refs.btnManage.form.id = id;
                    console.log(id)
                    this.$refs.btnManage.show = true;
                    break;
                case 'dele':
                    this.dele(id);
                    break;
                case 'detail':
                    console.log(id)
                    this.$router.push({
                        path: '/setUp/language/btnManageDetail',
                        query: {
                            module_key: this.$route.query.key,
                            button_key: this.tableData[index].button_key,
                            name: this.tableData[index].name
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
                await btnDel({ id })
                this.$message({
                    type: 'success',
                            message: this.$t('webBaseTips.deleSuccess')
                });
                this.init()
            })
        },
        search() {
            this.searchForm.pageNo = 1
            this.init()
        },
        reset() {
            this.searchForm = {
                search_name: '',
                search_modulekey: '',
                search_modulename: '',
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
        addNew() {
            delete this.$refs.btnManage.form.id;
            this.dialogMsg.title = this.$t('webModuleManagement.add');
            this.$refs.btnManage.show = true;
        },
    }
};
</script>
<style scoped lang='scss'>
</style>
