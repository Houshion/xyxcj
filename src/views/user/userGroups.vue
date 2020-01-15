<!-- userList -->
<template>
    <div id="userList">
        <div class="mg-t-5 bfff pd-10">
            <el-button
                v-if="userInfo.type==1"
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="addNew"
            >{{$t("webUserGroup.addNewBtn")}}</el-button>
            <o-table
                class="mg-t-5"
                :tableData="tableData"
                :tableTitle="tableTitle"
                :tableSlot="tableSlot"
                :pageMsg="pageMsg"
                @btnFunc="btnFunc"
            >
                <template slot="createtime" slot-scope="slot">{{slot.data.createtime|timeStr}}</template>
            </o-table>
            <!-- 创建角色Dialog -->
            <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="cancel">
                <el-form :model="formData" :rules="rules" ref="formData">
                    <el-form-item label="" prop="name">
                        <el-input
                            class="wd-50"
                            v-model="formData.name"
                            :placeholder="$t('webUserGroup.rulesName')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="memo">
                        <el-input
                            class="wd-50"
                            v-model="formData.memo"
                            :placeholder="$t('webUserGroup.rulesMemo')"
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
import * as user from "@/api/members/user"
import { mapGetters } from 'vuex'
export default {
    name: 'userList',
    data() {
        return {
            formData: {
                id: 0,
                memo: '',
                name: '',
            },
            rules: {
                memo: [
                    { required: true, message: this.$t('webUserGroup.rulesMemo'), trigger: 'blur' }
                ],
                name: [
                    { required: true, message: this.$t('webUserGroup.rulesName'), trigger: 'blur' }
                ],
            },
            dialogFormVisible: false,
            dialogTitle: '',
            tableTitle: [
                { prop: "id", label: this.$t('webUserGroup.id'), width: "100" },
                { prop: "name", label: this.$t('webUserGroup.name'), width: "200" },
                { prop: "memo", label: this.$t('webUserGroup.memo'), width: "auto" },
                { prop: "createtime", label: this.$t('webUserGroup.createtime'), width: "100", custom: true },
            ],
            //   表头信息，prop对应
            tableSlot: [
                {
                    title: this.$t("webBaseMessage.operation"),
                    slotType: "btn",
                    buttontype: "info", // text为文字按钮，默认不传为正常按钮
                    width: 145,
                    slot: [
                        { label: this.$t("webUserGroup.slotBtnEdit"), type: "edit" },
                        { label: this.$t("webUserGroup.slotBtnDele"), type: "dele" },
                    ]
                }
            ],
            tableData: [],
            pageMsg: {
                page: 1,
                status: false,
                size: 10,
                sizes: [10, 20, 50, 100],
            },
            loading: false,
        };
    },
    components: {},
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
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
            let res = await user.getList();
            res.forEach(item => {
                if (this.userInfo.type != 1) {
                    item.hideBtn = ['edit', 'dele']
                }
            });
            this.tableData = res
        },
        btnFunc(index, type) {
            const _this = this;
            const id = this.tableData[index].id
            if (type == 'dele') {
                this.$confirm(this.$t("webBaseTips.deleConfirm"), this.$t("webBaseTips.confirm"), {
                    confirmButtonText: this.$t("webBaseBtn.confirm"),
                    cancelButtonText: this.$t("webBaseBtn.cancel"),
                    type: 'warning'
                }).then(() => {
                    user.delGroup({ id }).then(res => {
                        this.$message({
                            type: 'success',
                            message: this.$t('webBaseTips.deleSuccess')
                        });
                        this.init()
                    })
                })
            } else if (type == 'edit') {
                this.dialogTitle = this.$t("webUserGroup.titleEdit");
                this.formData = this.tableData[index]
                this.dialogFormVisible = true;
            }
        },
        async ruleConfirm() {
            this.$refs['formData'].validate(async valid => {
                if (valid) {
                    await user.editGroup(this.formData)
                    this.dialogFormVisible = false;
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.editConfirm')
                    });
                    this.init()
                }
            });
        },
        //新增会员组
        addNew() {
            this.dialogTitle = this.$t("webUserGroup.titleAdd");
            this.dialogFormVisible = true;
        },
        cancel() {
            this.dialogFormVisible = false;
            this.formData = {
                id: 0,
                memo: '',
                name: '',
            };
        },
    }
};
</script>
<style scoped lang='less'>
</style>
