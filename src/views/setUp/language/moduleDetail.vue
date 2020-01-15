<!-- question  -->
<template>
    <div id="moduleManage">
        <div class="mg-t-5 pd-10 bfff">
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
            <moduleDetailDialog ref="moduleDetailDialog" :title="dialogMsg.title"></moduleDetailDialog>
        </div>
    </div>
</template>
<script>
import moduleDetailDialog from "../components/moduleDetailDialog";
import { btnList, btnDel } from "@/api/languageManage/btnManage";
export default {
    data() {
        return {
            searchForm: {
                search_modulekey: this.$route.query.key,
                pageNo: 1,
                pageSize: 10,
            },
            tableTitle: [
                { prop: "button_id", label: "ID", width: "100" },
                { prop: "No", label: this.$t('webModuleManagement.number'), width: "100" },
                { prop: "button_key", label: this.$t('webModuleManagement.button_key'), width: "auto" },
                { prop: "explain", label: this.$t('webModuleManagement.describe'), width: "auto" },
            ],
            // 表头信息，prop对应
            tableSlot: [
                {
                    title: this.$t('webBaseMessage.operation'),
                    slotType: "btn",
                    buttontype: "info", // text为文字按钮，默认不传为正常按钮
                    width: 'auto',
                    slot: [
                        { label: this.$t('webBaseBtn.edit'), type: "edit" },
                        { label: this.$t('webBaseBtn.dele'), type: "dele" },
                        { label: this.$t('webBaseBtn.detail'), type: "detail" },
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
            },
            dialogMsg: {
                title: this.$t('webBaseBtn.modify')
            },
        };
    },
    components: { moduleDetailDialog },
    computed: {},
    created() {
        const _this = this
        this.searchForm.pageSize = this.pageMsg.size
        this.init();
    },
    methods: {
        async init() {
            console.log(this.$route.query.id);
            let res = await btnList(this.searchForm);
            this.tableData = res.records
            this.pageMsg.total = res.total
        },
        async btnFunc(index, type) {
            const id = this.tableData[index].button_id
            switch (type) {
                case 'edit':
                    
                    this.$refs.moduleDetailDialog.show = true;
                    break;
                case 'dele': this.dele();
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
            this.deleQuestion(id.join(','))
        },
        async dele(id) {
                    this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                        confirmButtonText: this.$t('webBaseBtn.confirm'),
                        cancelButtonText: this.$t('webBaseBtn.cancel'),
                        type: 'warning'
            }).then(async () => {
                this.$message({
                    type: 'success',
                            message: this.$t('webBaseTips.deleSuccess')
                });
                this.init()
            })
        },
    }
};
</script>
<style scoped  lang='scss'>
</style>
