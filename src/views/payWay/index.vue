<!-- userList -->
<template>
    <div id="userList">
        <div class="mg-t-5 bfff pd-10">
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="addNew"
            >{{$t('webPayWay.addNewBtn')}}</el-button>
            <el-form :model="searchForm" class="mg-t-5">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webPayWay.searchTitle')"
                            v-model="searchForm.title"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker
                            class="mg-r-10"
                            v-model="timeDate"
                            type="daterange"
                            :range-separator="$t('webBaseMessage.date_separator')"
                            :start-placeholder="$t('webBaseMessage.date_start')"
                            :end-placeholder="$t('webBaseMessage.date_end')"
                            value-format="yyyy-MM-dd"
                        ></el-date-picker>
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
                @pageChange="pageChange"
                @sizeChange="sizeChange"
                @btnFunc="btnFunc"
            >
                <template slot="type" slot-scope="slot">
                    <div>{{slot.data.type?$t('webPayWay.offline'):$t('webPayWay.online')}}</div>
                </template>
                <template slot="fee" slot-scope="slot">
                    <div>{{slot.data.fee+'%'}}</div>
                </template>
            </o-table>
            <!-- 创建角色Dialog -->
            <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="cancel">
                <el-form :model="payForm" :rules="rules" ref="payForm">
                    <el-form-item label="" prop="name">
                        <el-input
                            class="wd-50"
                            v-model="payForm.name"
                            :placeholder="$t('webPayWay.dialogName')"
                            :disabled="disabled"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="" style="display:none">
                        <el-select
                            class="wd-50"
                            v-model="payForm.pay_way"
                            :placeholder="$t('webPayWay.dialogPayway')"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="" prop="rate">
                        <el-input
                            class="wd-50"
                            v-model="payForm.rate"
                            :placeholder="$t('webPayWay.dialogRate')"
                        >
                            <template slot="append">%</template>
                        </el-input>
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
import { paymentIndex, paymentEdit, paymentAdd, paymentDele, paymentDetail } from "@/api/payWay";
import { parseTime } from "@/utils";
export default {
    name: 'userList',
    data() {
        return {
            timeDate: '',
            searchForm: {
                pageNo: 1,
                pageSize: 10,
                title: '',
                time: '',
            },
            payForm: {
                name: '',
                pay_way: 1,
                rate: '',
                id: ''
            },
            options: [
                {
                    value: 0,
                    label: this.$t('webPayWay.online')
                }, {
                    value: 1,
                    label: this.$t('webPayWay.offline')
                },
            ],
            rules: {
                name: [
                    { required: true, message: this.$t('webPayWay.dialogName'), trigger: 'blur' }
                ],
                pay_way: [
                    { required: true, message: this.$t('webPayWay.dialogPayway'), trigger: 'change' }
                ],
                rate: [
                    { required: true, message: this.$t('webPayWay.dialogRate'), trigger: 'blur' }
                ],
            },
            dialogFormVisible: false,
            dialogTitle: this.$t('webPayWay.dialogTitleAdd'),
            tableTitle: [
                { prop: "id", label: this.$t('webPayWay.id'), width: "100" },
                { prop: "title", label: this.$t('webPayWay.title'), width: "170" },
                { prop: "type", label: this.$t('webPayWay.type'), width: "170", custom: true },
                { prop: "fee", label: this.$t('webPayWay.fee'), width: "170", custom: true },
                { prop: "ctime", label: this.$t('webPayWay.ctime'), width: "auto" },
            ],
            //   表头信息，prop对应
            tableSlot: [
                {
                    title: this.$t('webBaseMessage.operation'),
                    slotType: "btn",
                    buttontype: "info", // text为文字按钮，默认不传为正常按钮
                    width: 350,
                    slot: [
                        { label: this.$t('webPayWay.edit'), type: "edit" },
                        { label: this.$t('webPayWay.dele'), type: "dele" },
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
            edit: false,
            disabled: false
        };
    },
    components: {},
    computed: {},
    created() {
        this.init()
    },
    methods: {
        async init() {
            let res = await paymentIndex(this.searchForm);
            res.records.forEach(item => {
                item.ctime = parseTime(item.ctime);
                if (item.lock == 1) {
                    item.hideBtn = ['dele']
                }
            });
            this.tableData = res.records;
            this.pageMsg.total = res.total;
        },
        async btnFunc(index, type) {
            const _this = this;
            const { id } = this.tableData[index];
            console.log(index, type);
            if (type == 'dele') {
                this.deleWay(id);
            } else if (type == 'edit') {
                this.dialogTitle = this.$t('webPayWay.dialogTitleEdit');
                this.dialogFormVisible = true;
                let res = await paymentDetail({ id });
                console.log(res)
                this.disabled = res.lock ? true : false;
                const { title: name, type: pay_way, fee: rate } = res;
                this.payForm = { name, pay_way, rate, id };
                this.edit = true;
            }
        },
        pageChange(val) {//分页页数改变
            this.searchForm.pageNo = val;
            this.init();
        },
        sizeChange(val) {//分页条数改变
            this.searchForm.pageSize = val;
            this.init();
        },
        search() {
            this.searchForm.time = this.timeDate ? this.timeDate.join('/') : '';
            this.init();
        },
        reset() {
            this.timeDate = '';
            this.searchForm = {
                pageNo: 1,
                pageSize: 10,
                title: '',
                time: '',
            };
            this.init();
        },
        async ruleConfirm() {
            console.log(this.rechargeForm)
            this.$refs['payForm'].validate(async valid => {
                if (valid) {
                    const { name: title, pay_way: type, rate: fee } = this.payForm;
                    const form = { title, type, fee };
                    await paymentAdd(form)
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
            console.log(this.payForm)
            this.$refs['payForm'].validate(async valid => {
                if (valid) {
                    const { name: title, pay_way: type, rate: fee, id } = this.payForm;
                    const form = { title, type, fee, id };
                    await paymentEdit(form)
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.editConfirm')
                    });
                    this.dialogFormVisible = false;
                    this.init()
                }
            });
        },
        //新增会员卡绑定
        addNew() {
            this.dialogTitle = this.$t('webPayWay.dialogTitleAdd');
            this.dialogFormVisible = true;
            this.edit = false;
            this.disabled = false;
        },
        async deleWay(id) {
            this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                confirmButtonText: this.$t('webBaseBtn.confirm'),
                cancelButtonText: this.$t('webBaseBtn.cancel'),
                type: 'warning'
            }).then(async () => {
                await paymentDele({ id })
                this.$message({
                    type: 'success',
                    message: this.$t('webBaseTips.deleSuccess')
                });
                this.dialogFormVisible = false;
                this.init()
            })
        },
        cancel() {
            this.$refs["payForm"].resetFields();
            this.dialogFormVisible = false
        }
    }
};
</script>
<style scoped lang='less'>
</style>
