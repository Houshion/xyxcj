<!-- goodsClassify -->
<template>
    <div id="goodsClassify">
        <div class="mg-t-5 bfff pd-10">
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="openDialog('add')"
            >{{$t('webGoodsClassify.titleAdd')}}</el-button>
            <el-form :model="form">
                <el-row :gutter="10" class="mg-t-5">
                    <el-col :span="4">
                        <el-form-item>
                            <el-input
                                :placeholder="$t('webGoodsClassify.searchTitle')"
                                v-model="form.title"
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
            <oDialog ref="goodsDialog" :title="dialogMsg.title" @uploadEvent="uploadEvent"></oDialog>
        </div>
    </div>
</template>
<script>
import { goodsTypeIndex, goodsTypeDel, goodsIndex } from "@/api/goods";
import { parseTime } from "@/utils";
import oDialog from "./components/classifyDialog";
export default {
    name: 'goodsClassify',
    data() {
        return {
            timeDate: '',
            dialogMsg: {
                title: this.$t('webGoodClassify.titleAdd'),
            },
            form: {
                title: '',
            },
            tableTitle: [
                { prop: "type_id", label: this.$t('webGoodsClassify.type_id'), width: "100" },
                { prop: "type_name", label: this.$t('webGoodsClassify.type_name'), width: "auto" },
                { prop: "create_time", label: this.$t('webGoodsClassify.create_time'), width: "auto" },
            ],
            //   表头信息，prop对应
            tableSlot: [
                {
                    title: this.$t('webBaseMessage.operation'),
                    slotType: "btn",
                    width: 180,
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
                pageSize: this.pageMsg.size
            }
            this.form.play_time = this.timeDate ? this.timeDate[0] + ' - ' + this.timeDate[1] : '';
            Object.assign(form, this.form);
            let res = await goodsTypeIndex(form);
            res.records.forEach(item => {
                item.create_time = parseTime(item.create_time);
            })
            this.tableData = res.records
            this.pageMsg.total = res.total
            this.loading = false
        },
        btnFunc(index, type) {
            const _this = this;
            console.log(index, type);
            const id = this.tableData[index].type_id;
            this.openDialog(type, id)
        },
        openDialog(type, id) {
            switch (type) {
                case 'add':
                    this.$refs.goodsDialog.show = true;
                    this.$refs.goodsDialog.id = '';
                    this.dialogMsg.title = this.$t('webGoodsClassify.titleAdd');
                    break;
                case 'edit':
                    this.$refs.goodsDialog.show = true;
                    this.$refs.goodsDialog.id = id;
                    this.dialogMsg.title = this.$t('webGoodsClassify.titleEdit');
                    this.$refs.goodsDialog.upload = !this.$refs.goodsDialog.upload;
                    break;
                case "dele":
                    this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                        confirmButtonText: this.$t('webBaseBtn.confirm'),
                        cancelButtonText: this.$t('webBaseBtn.cancel'),
                        type: 'warning'
                    }).then(async () => {
                        await goodsTypeDel({ type_id: id });
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
            this.form = {
                title: '',
                play_time: '',
            };
            this.init();
        },
        uploadEvent() {
            this.init();
        }
    }
};
</script>
<style scoped lang='less'>
</style>
