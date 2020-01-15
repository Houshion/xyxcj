<!-- userList -->
<template>
    <div id="userList">
        <div class="mg-t-5 bfff pd-10">
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="addNew"
            >{{$t('webAreaCodeSettings.addNew')}}</el-button>
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
                <template
                    slot="car_type"
                    slot-scope="slot"
                >{{slot.data.car_type==1?$t('webAreaCodeSettings.bus'):slot.data.car_type==2?$t('webAreaCodeSettings.privateCar'):$t('webAreaCodeSettings.taxi')}}</template>
                <template slot="pic" slot-scope="slot">
                    <img :src="slot.data.pic" alt="">
                </template>
                <template slot="ctime" slot-scope="slot">{{slot.data.ctime|timeStr}}</template>
            </o-table>
            <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="cancel">
                <el-form :model="codeForm" :rules="rules" ref="codeForm">
                    <el-form-item :label="$t('webAreaCodeSettings.number')" prop="number">
                        <el-input
                            class="wd-50"
                            v-model="codeForm.number"
                            :placeholder="$t('webAreaCodeSettings.enterNumber')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('webAreaCodeSettings.remark')" prop="remark">
                        <el-input
                            class="wd-50"
                            v-model="codeForm.remark"
                            :placeholder="$t('webAreaCodeSettings.enterRemark')"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
                    <el-button type="primary" @click="ruleConfirm">{{$t('webBaseBtn.confirm')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import * as code from "@/api/code";
export default {
    name: 'userList',
    data() {
        return {
            tableTitle: [
                { prop: "id", label: "ID", width: "80" },
                { prop: "number", label: this.$t('webAreaCodeSettings.number'), width: "auto" },
                { prop: "remark", label: this.$t('webAreaCodeSettings.remark'), width: "auto" },
                { prop: "ctime", label: this.$t('webAreaCodeSettings.ctime'), width: "180", custom: true },
            ],
            tableData: [],
            //   表头信息，prop对应
            tableSlot: [
                {
                    title: this.$t('webBaseMessage.operation'),
                    slotType: "btn",
                    buttontype: "info", // text为文字按钮，默认不传为正常按钮
                    width: 140,
                    slot: [
                        { label: this.$t('webBaseBtn.edit'), type: "edit" },
                        { label: this.$t('webBaseBtn.dele'), type: "dele" },
                    ]
                }
            ],
            dialogTitle: this.$t('webAreaCodeSettings.addNew'),
            pageMsg: {
                page: 1,
                status: true,
                size: 10,
                sizes: [10, 20, 50, 100],
            },
            dialogFormVisible: false,
            codeForm: {
                number: null,
                remark: null,
            },
            rules: {
                remark: [
                    { required: true, message: this.$t('webAreaCodeSettings.enterRemark'), trigger: 'blur' }
                ],
                number: [
                    { required: true, message: this.$t('webAreaCodeSettings.enterNumber'), trigger: 'blur' }
                ],
            },
        };
    },
    components: {},
    computed: {},
    created() {
        const _this = this;
        this.init()
    },
    mounted() {
        const _this = this
        document.onkeydown = function (e) { // 回车提交表单
            // 兼容FF和IE和Opera
            var theEvent = window.event || e;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                _this.ruleConfirm()
            }
        }
    },
    methods: {
        async init() {
            let param = {
                pageNo: this.pageMsg.page,
                pageSize: this.pageMsg.size,
            }
            let res = await code.getList(param);
            this.tableData = res.records
            this.pageMsg.total = res.total
        },
        addNew() {
            this.dialogTitle = this.$t('webAreaCodeSettings.addNew');
            this.codeForm = {
                number: null,
                remark: null,
            }
            this.dialogFormVisible = true;
        },
        pageChange(val) {
            this.pageMsg.page = val
            this.init()
        },
        sizeChange(val) {
            this.pageMsg.size = val
            this.init()
        },
        async btnFunc(index, type) {
            const id = this.tableData[index].id
            switch (type) {
                case 'edit':
                    let res = await code.detail({ id })
                    this.dialogTitle = this.$t('webAreaCodeSettings.editNew');
                    this.codeForm = res
                    this.dialogFormVisible = true;
                    break;
                case 'dele':
                    this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                        confirmButtonText: this.$t('webBaseBtn.confirm'),
                        cancelButtonText: this.$t('webBaseBtn.cancel'),
                        type: 'warning'
                    }).then(() => {
                        this.deleCode(id)
                        this.$message({
                            type: 'success',
                            message: this.$t('webBaseTips.deleSuccess')
                        });
                    })

                    break;
            }
        },
        cancel() {
            this.$refs['codeForm'].resetFields()
            this.dialogFormVisible = false;
        },
        ruleConfirm() {
            this.$refs['codeForm'].validate(async valid => {
                if (valid) {
                    if (this.codeForm.id) { // 编辑
                        await code.save(this.codeForm)
                    } else { // 新增
                        await code.add(this.codeForm)
                    }
                    this.$message({
                        message: this.$t('webBaseTips.editConfirm'),
                        type: 'success',
                        showClose: true,
                    });
                    this.init();
                    this.cancel()
                }
            })
        },
        async deleCode(id) {
            await code.dele({ id })
            this.$message({
                message: this.$t('webBaseTips.deleSuccess'),
                type: 'success',
                showClose: true,
            });
            this.init();
            this.cancel();
        }
    }
};
</script>
<style scoped lang='less'>
</style>
