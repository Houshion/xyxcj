<!-- gooodsList -->
<template>
    <div id="gooodsList">
        <div class="mg-t-5 bfff pd-10">
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="openDialog('add')"
            >{{$t('webGoodsList.titleAdd')}}</el-button>
            <el-form :model="form">
                <el-row :gutter="10" class="mg-t-5">
                    <el-col :span="4">
                        <el-form-item>
                            <el-input
                                :placeholder="$t('webGoodsList.search_goods_name')"
                                v-model="form.goods_name"
                            >
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-select
                                v-model="form.goods_type"
                                :placeholder="$t('webGoodsList.search_goods_type')"
                            >
                                <el-option
                                    v-for="item in options"
                                    :key="item.type_id"
                                    :label="item.type_name"
                                    :value="item.type_id"
                                ></el-option>
                            </el-select>
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
                        class="color1"
                        v-if="slot.data.status==1"
                    >{{$t('webGoodsList.goodsStatus_up')}}</span>
                    <span
                        class="color3"
                        v-if="slot.data.status==0"
                    >{{$t('webGoodsList.goodsStatus_down')}}</span>
                    <span
                        class="color3"
                        v-if="slot.data.status==2"
                    >{{$t('webGoodsList.goodsStatus_apply')}}</span>
                </template>
            </o-table>
            <oDialog ref="goodsDialog" :title="dialogMsg.title" @uploadEvent="uploadEvent"></oDialog>
        </div>
    </div>
</template>
<script>
import { goodsTypeIndex, goodsIndex, goodsDel } from "@/api/goods";
import { parseTime } from "@/utils";
import oDialog from "./components/indexDialog";
export default {
    name: 'gooodsList',
    data() {
        return {
            dialogMsg: {
                title: this.$t('webGoodsList.titleAdd'),
            },
            timeDate: '',
            form: {
                goods_name: '',
                goods_type: '',
            },
            tableTitle: [
                { prop: "goods_id", label: this.$t('webGoodsList.goods_id'), width: "100" },
                { prop: "goods_name", label: this.$t('webGoodsList.goods_name'), width: "auto" },
                { prop: "barcode", label: this.$t('webGoodsList.barcode'), width: "auto" },
                { prop: "retail_price", label: this.$t('webGoodsList.retail_price'), width: "auto" },
                { prop: "goods_type", label: this.$t('webGoodsList.goods_type'), width: "auto" },
                { prop: "detail", label: this.$t('webGoodsList.detail'), width: "auto" },
                { prop: "status", label: this.$t('webGoodsList.status'), width: "auto", custom: true },
                { prop: "create_time", label: this.$t('webGoodsList.create_time'), width: "auto" },
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
            loading: false,
            options: []
        }
    },
    components: {
        oDialog
    },
    computed: {},
    created() {
        this.List();
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
            let res = await goodsIndex(form);
            console.log(res)
            res.records.forEach(item => {
                item.create_time = parseTime(item.create_time);
                this.options.forEach(op => {
                    if (item.goods_type == op.type_id) {
                        item.goods_type = op.type_name
                    }
                })
            })
            this.tableData = res.records
            this.pageMsg.total = res.total
            this.loading = false
        },
        btnFunc(index, type) {
            console.log(index, type);
            const id = this.tableData[index].goods_id;
            this.openDialog(type, id)
        },
        openDialog(type, id) {
            switch (type) {
                case 'add':
                    this.$refs.goodsDialog.show = true;
                    this.$refs.goodsDialog.id = '';
                    this.dialogMsg.title = this.$t('webGoodsList.titleAdd');
                    break;
                case 'edit':
                    this.$refs.goodsDialog.show = true;
                    this.$refs.goodsDialog.id = id;
                    this.dialogMsg.title = this.$t('webGoodsList.titleEdit');
                    this.$refs.goodsDialog.upload = !this.$refs.goodsDialog.upload;
                    break;
                case "dele":
                    this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                        confirmButtonText: this.$t('webBaseBtn.confirm'),
                        cancelButtonText: this.$t('webBaseBtn.cancel'),
                        type: 'warning'
                    }).then(async () => {
                        await goodsDel({ goods_id: id });
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
        List() {
            const form = {
                pageNo: 1,
                pageSize: 999
            };
            goodsTypeIndex(form).then(res => {
                this.options = res.records;
                this.init();
            });
        },
        uploadEvent() {
            this.init();
        }
    }
};
</script>
<style scoped lang='less'>
</style>
