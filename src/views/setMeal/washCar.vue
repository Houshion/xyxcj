<!-- userList -->
<template>
    <div id="userList">
        <div class="mg-t-5 bfff pd-10">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addNew">{{title}}</el-button>
            <el-form :model="searchForm" class="mg-t-5">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webWashCarMeal.searchName')"
                            v-model="searchForm.name"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-select
                            v-model="searchForm.status"
                            :placeholder="$t('webWashCarMeal.searchStatus')"
                        >
                            <el-option
                                v-for="item in tc_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
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
            >
                <template slot="over_status" slot-scope="slot">
                    <div
                        class="color1"
                        v-if="slot.data.over_status==1"
                    >{{$t('webWashCarMeal.statusOpen')}}</div>
                    <div
                        class="color3"
                        v-if="slot.data.over_status==0"
                    >{{$t('webWashCarMeal.statusStop')}}</div>
                </template>
                <template slot="normal_status" slot-scope="slot">
                    <div
                        class="color1"
                        v-if="slot.data.normal_status==1"
                    >{{$t('webWashCarMeal.statusOpen')}}</div>
                    <div
                        class="color3"
                        v-if="slot.data.normal_status==0"
                    >{{$t('webWashCarMeal.statusStop')}}</div>
                </template>
            </o-table>
            <washCarDialog ref="washCarDialog" :title="dialogMsg.title" @uploadEvent="uploadEvent"></washCarDialog>
        </div>
    </div>
</template>
<script>
import { carIndex, carDel } from "@/api/setMeal";
import { parseTime } from "@/utils";
import washCarDialog from "./components/washCarDialog";
export default {
    name: 'userList',
    data() {
        return {
            searchForm: {
                name: '',
                status: '',
            },
            tc_options: [
                {
                    value: '1',
                    label: this.$t('webWashCarMeal.statusOpen')
                },
                {
                    value: '0',
                    label: this.$t('webWashCarMeal.statusStop')
                }
            ],
            title: this.$t('webWashCarMeal.titleAdd'),
            dialogMsg: {
                title: this.$t('webWashCarMeal.titleAdd'),
            },
            tableTitle: [
                { prop: "id", label: this.$t('webWashCarMeal.id'), width: "80" },
                { prop: "title", label: this.$t('webWashCarMeal.title'), width: "auto" },
                { prop: "chargingtype", label: this.$t('webWashCarMeal.chargingtype'), width: "auto" },
                { prop: "normal_price", label: this.$t('webWashCarMeal.normal_price'), width: "auto" },
                { prop: "keep_minutes", label: this.$t('webWashCarMeal.keep_minutes'), width: "auto" },
                { prop: "min_price", label: this.$t('webWashCarMeal.min_price'), width: "auto" },
                { prop: "over_price", label: this.$t('webWashCarMeal.over_price'), width: "auto" },
                { prop: "group_ids_name", label: this.$t('webWashCarMeal.group_ids_name'), width: "auto" },
                { prop: "over_status", label: this.$t('webWashCarMeal.over_status'), width: "auto", custom: true },
                { prop: "normal_status", label: this.$t('webWashCarMeal.normal_status'), width: "auto", custom: true },
                { prop: "ctime", label: this.$t('webWashCarMeal.ctime'), width: "100" },
            ],
            //   表头信息，prop对应
            tableSlot: [
                {
                    title: this.$t('webBaseMessage.operation'),
                    slotType: "btn",
                    buttontype: "info", // text为文字按钮，默认不传为正常按钮
                    width: 350,
                    slot: [
                        { label: this.$t('webWashCarMeal.slotBtnEdit'), type: "edit" },
                        { label: this.$t('webWashCarMeal.slotBtnDele'), type: "dele" },
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
    components: { washCarDialog },
    computed: {},
    created() {
        const _this = this;
        this.init()
    },
    methods: {
        async init() {
            let form = {
                pageNo: this.pageMsg.page,
                pageSize: this.pageMsg.size,
                title: this.searchForm.name,
                normal_status: this.searchForm.status,
            };
            let res = await carIndex(form);
            res.records.forEach(item => {
                item.ctime = parseTime(item.ctime);
                item.keep_minutes = item.keep_minutes + this.$t('webWashCarMeal.minute');
            });
            this.tableData = res.records;
            this.pageMsg.total = res.total
        },
        async btnFunc(index, type) {
            const _this = this;
            console.log(index, type);
            const { id } = this.tableData[index];
            if (type == 'dele') {
                this.$confirm(this.$t('webBaseTips.deleConfirm'), this.$t('webBaseTips.confirm'), {
                    confirmButtonText: this.$t('webBaseBtn.confirm'),
                    cancelButtonText: this.$t('webBaseBtn.cancel'),
                    type: 'warning'
                }).then(async () => {
                    await carDel({ id });
                    this.loading = true
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.deleSuccess')
                    });
                    this.init()
                })
            } else if (type == 'edit') {
                this.dialogMsg.title = this.$t('webWashCarMeal.titleEdit');
                this.$refs.washCarDialog.show = true;
                this.$refs.washCarDialog.id = id;
                this.$refs.washCarDialog.upload = !this.$refs.washCarDialog.upload;
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
            }
            this.searchForm = {
                name: '',
                status: '',
            };
            this.init();
        },
        //新增套餐
        addNew() {
            this.dialogMsg.title = this.$t('webWashCarMeal.titleAdd');
            this.$refs.washCarDialog.id = '';
            this.$refs.washCarDialog.show = true;
            this.$refs.washCarDialog.upload = !this.$refs.washCarDialog.upload;
        },
        uploadEvent() {
            this.init();
        }
    }
};
</script>
<style scoped lang='less'>
</style>
