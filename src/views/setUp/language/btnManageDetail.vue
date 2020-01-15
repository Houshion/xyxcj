<!-- question  -->
<template>
    <div id="btnManageDetail">
        <div class="mg-t-5 pd-10 bfff">
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="addNew()"
            >{{dialogMsg.title}}</el-button>
            <o-table
                :tableData="tableData"
                :tableTitle="tableTitle"
                :tableSlot="tableSlot"
                :pageMsg="pageMsg"
                select
                multy
                :tips="false"
                @btnFunc="btnFunc"
                @batchSubmit="batchSubmit"
            ></o-table>
            <!-- 创建角色Dialog -->
            <btnManageDialog ref="btnManageDialog" :title="dialogMsg.title"></btnManageDialog>
        </div>
    </div>
</template>
<script>
import btnManageDialog from "../components/btnManageDialog";
import { buttondetail, btnDel } from "@/api/languageManage/btnManage";
export default {
    data() {
        return {
            searchForm: {
                pageNo: 1,
                pageSize: 10,
                module_key: this.$route.query.module_key,
                button_key: this.$route.query.button_key
            },
            tableTitle: [
                { prop: "name", label: this.$t('webModuleManagement.btnName'), width: "auto" },
                { prop: "country_name", label: this.$t('webModuleManagement.country_name'), width: "auto" },
                { prop: "button_key", label: this.$t('webModuleManagement.button_key'), width: "auto" },
                { prop: "button_value", label: this.$t('webModuleManagement.btnValue'), width: "auto" },
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
                    ]
                }
            ],
            tableData: [],
            dialogMsg: {
                title: '新增'
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
    components: { btnManageDialog },
    computed: {},
    created() {
        const _this = this
        this.searchForm.pageSize = this.pageMsg.size
        this.init();
    },
    mounted() {
        this.$refs.btnManageDialog.form.name = this.$route.query.name
        this.$refs.btnManageDialog.form.button_key = this.$route.query.button_key
        this.$refs.btnManageDialog.form.module_key = this.$route.query.module_key
    },
    methods: {
        async init() {
            let res = await buttondetail(this.searchForm);
            res.records.forEach(item => {
                item.name = this.$route.query.name
            })
            this.tableData = res.records
            this.pageMsg.total = res.total
        },
        async btnFunc(index, type) {
            const _this = this;
            const id = this.tableData[index].id
            switch (type) {
                case 'edit':
                    this.$refs.btnManageDialog.form.id = id;
                    this.$refs.btnManageDialog.form.name = this.$route.query.name;
                    this.$refs.btnManageDialog.form.button_key = this.$route.query.button_key;
                    this.$refs.btnManageDialog.form.module_key = this.$route.query.module_key;
                    this.$refs.btnManageDialog.show = true;
                    break;
                case 'dele': this.dele(id);
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
                await btnDel({ id })
                this.$message({
                    type: 'success',
                            message: this.$t('webBaseTips.deleSuccess')
                });
                this.init()
            })
        },
        addNew() {
            delete this.$refs.btnManageDialog.form.id;
            this.$refs.btnManageDialog.form.name = this.$route.query.name;
            this.$refs.btnManageDialog.form.button_key = this.$route.query.button_key;
            this.$refs.btnManageDialog.form.module_key = this.$route.query.module_key;
            this.$refs.btnManageDialog.show = true;
        },
        search() {

        },
        reset() {

        },
    }
};
</script>
<style scoped lang='scss'>
</style>
