<!-- userList -->
<template>
    <div id="userList">
        <div class="mg-t-5 bfff pd-10">
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="addNew"
            >{{$t('webRechargeMeal.titleAdd')}}</el-button>
            <el-form :model="searchForm" class="mg-t-5">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webRechargeMeal.searchName')"
                            v-model="searchForm.name"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-select
                            v-model="searchForm.status"
                            :placeholder="$t('webRechargeMeal.searchStatus')"
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
                <template slot="status" slot-scope="slot">
                    <div
                        class="color1"
                        v-if="slot.data.status==1"
                    >{{$t('webWashCarMeal.statusOpen')}}</div>
                    <div
                        class="color3"
                        v-if="slot.data.status==0"
                    >{{$t('webWashCarMeal.statusStop')}}</div>
                </template>
            </o-table>
            <!-- 创建角色Dialog -->
            <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="cancel">
                <el-form :model="rechargeForm" :rules="rules" ref="rechargeForm">
                    <el-form-item label="" prop="title">
                        <el-input
                            class="wd-50"
                            v-model="rechargeForm.title"
                            :placeholder="$t('webRechargeMeal.dialogTitle')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="money">
                        <el-input
                            class="wd-50"
                            v-model.number="rechargeForm.money"
                            :placeholder="$t('webRechargeMeal.dialogMoney')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="money_gift">
                        <el-input
                            class="wd-80"
                            v-model.number="rechargeForm.money_gift"
                            :placeholder=" $t('webRechargeMeal.dialogMoney_gift')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('webRechargeMeal.dialogStatus')" prop="status">
                        <el-radio
                            v-model="rechargeForm.status"
                            label="1"
                        >{{$t('webWashCarMeal.statusOpen')}}</el-radio>
                        <el-radio
                            v-model="rechargeForm.status"
                            label="0"
                        >{{$t('webWashCarMeal.statusStop')}}</el-radio>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
                    <el-button
                        type="primary"
                        @click="editConfirm"
                        v-if="edit"
                    >{{$t('webBaseBtn.confirm')}}</el-button>
                    <el-button
                        type="primary"
                        @click="ruleConfirm"
                        v-else
                    >{{$t('webBaseBtn.confirm')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { moneyIndex, moneyDetail, moneyDel, moneyAdd } from "@/api/setMeal";
import { parseTime } from "@/utils";
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
            rechargeForm: {
                money: '',
                title: '',
                money_gift: '',
                status: '1',
                id: ''
            },
            rules: {
                title: [
                    { required: true, message: this.$t('webRechargeMeal.rulesTitle'), trigger: 'blur' }
                ],
                money: [
                    { required: true, message: this.$t('webRechargeMeal.rulesMoney'), trigger: 'blur' },
                    { type: 'number', message: this.$t('webRechargeMeal.rulesNumber'), trigger: 'blur' }
                ],
                money_gift: [
                    { required: true, message: this.$t('webRechargeMeal.rulesMoney_gift'), trigger: 'blur' },
                    { type: 'number', message: this.$t('webRechargeMeal.rulesNumber'), trigger: 'blur' }
                ],
                status: []
            },
            dialogFormVisible: false,
            dialogTitle: this.$t('webRechargeMeal.titleAdd'),
            tableTitle: [
                { prop: "id", label: this.$t('webRechargeMeal.id'), width: "80" },
                { prop: "title", label: this.$t('webRechargeMeal.title'), width: "auto" },
                { prop: "money", label: this.$t('webRechargeMeal.money'), width: "auto" },
                { prop: "money_gift", label: this.$t('webRechargeMeal.money_gift'), width: "auto" },
                { prop: "status", label: this.$t('webRechargeMeal.status'), width: "auto", custom: true },
                { prop: "ctime", label: this.$t('webRechargeMeal.ctime'), width: "100" },
            ],
            //   表头信息，prop对应
            tableSlot: [
                {
                    title: this.$t('webBaseMessage.operation'),
                    slotType: "btn",
                    buttontype: "info", // text为文字按钮，默认不传为正常按钮
                    width: 350,
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
            edit: false,
        };
    },
    components: {},
    computed: {},
    created() {
        this.init()
    },
    methods: {
        async init() {
            let form = {
                pageNo: this.pageMsg.page,
                pageSize: this.pageMsg.size,
                title: this.searchForm.name,
                normal_status: this.searchForm.status,
            }
            let res = await moneyIndex(form);
            res.records.forEach(item => {
                item.ctime = parseTime(item.ctime);
            });
            this.tableData = res.records
            this.pageMsg.total = res.total
        },
        async btnFunc(index, type) {
            console.log(index, type);
            const ids = this.tableData[index].id;
            if (type == 'dele') {
                this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                    confirmButtonText: this.$t('webBaseBtn.confirm'),
                    cancelButtonText: this.$t('webBaseBtn.cancel'),
                    type: 'warning'
                }).then(async () => {
                    await moneyDel({ id: ids });
                    this.loading = true
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.deleSuccess')
                    });
                    this.init()
                })
            } else if (type == 'edit') {
                this.dialogTitle = this.$t('webRechargeMeal.titleEdit');
                this.dialogFormVisible = true;
                let res = await moneyDetail({ id: ids });
                const { title, money, money_gift, status, id } = res.find;
                this.rechargeForm = { title, money: money * 1, money_gift: money_gift * 1, status: status.toString(), id };
                this.edit = true;
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
        async ruleConfirm() {
            this.$refs['rechargeForm'].validate(async valid => {
                if (valid) {
                    await moneyAdd(this.rechargeForm)
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.editConfirm')
                    });
                    this.dialogFormVisible = false;
                    this.init()
                }
            });
        },
        async editConfirm() {
            this.$refs['rechargeForm'].validate(async valid => {
                if (valid) {
                    await moneyAdd(this.rechargeForm)
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.editConfirm')
                    });
                    this.dialogFormVisible = false;
                    this.init()
                }
            });
        },
        //新增套餐
        addNew() {
            this.dialogTitle = this.$t('webRechargeMeal.titleAdd');
            this.dialogFormVisible = true;
            this.edit = false;
        },
        cancel() {
            this.$refs["rechargeForm"].resetFields();
            this.dialogFormVisible = false;
        },
    }
};
</script>
<style scoped lang='less'>
</style>
