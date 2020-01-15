<!-- userList -->
<template>
    <div id="userList">
        <div class="mg-t-5 bfff pd-10">
            <el-button
                v-if="userInfo.type==1"
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="addNew"
            >{{$t('webMemberCardList.addNewBtn')}}</el-button>
            <el-form :model="searchForm" class="mg-t-5">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webMemberCardList.searchNumber')"
                            v-model="searchForm.number"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input
                            :placeholder="$t('webMemberCardList.searchMobile')"
                            v-model="searchForm.mobile"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
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
                @switchChange="switchChange"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
            >
                <template slot="ctime" slot-scope="slot">{{slot.data.ctime|timeStr}}</template>
            </o-table>
            <!-- 创建角色Dialog -->
            <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="cancel">
                <el-form
                    :model="rechargeForm"
                    :rules="rules"
                    ref="rechargeForm"
                    label-position="top"
                >
                    <el-form-item :label="$t('webMemberCardList.cardNumber')" prop="number">
                        <el-input
                            class="wd-50"
                            v-model="rechargeForm.number"
                            :placeholder="$t('webMemberCardList.cardRulesNumber')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('webMemberCardList.cardMemo')" prop="memo">
                        <el-input
                            class="wd-50"
                            v-model="rechargeForm.memo"
                            :placeholder="$t('webMemberCardList.cardRulesMemo')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        :label="$t('webMemberCardList.cardFaceNumber')"
                        prop="face_number"
                    >
                        <el-input
                            class="wd-50"
                            v-model="rechargeForm.face_number"
                            :placeholder="$t('webMemberCardList.cardRulesFaceNumber')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('webMemberCardList.cardUser')" prop="mobile">
                        <el-input
                            @blur="getName"
                            class="wd-50"
                            v-model="rechargeForm.mobile"
                            :placeholder="$t('webMemberCardList.cardMobile')"
                        ></el-input>
                        <el-input
                            class="wd-50"
                            readonly
                            v-model="rechargeForm.nickname"
                            :placeholder="$t('webMemberCardList.cardNickname')"
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
import * as card from "@/api/members/card";
import { mapGetters } from 'vuex'
export default {
    name: 'userList',
    data() {
        return {
            searchForm: {
                pageNo: 1,
                pageSize: 10,
                mobile: '',
                number: '',
                mid: this.$route.query.mid ? this.$route.query.mid : ''
            },
            rechargeForm: {
                id: 0,
                number: '',
                memo: '',
                face_number: '',
                mid: '',
                mobild: '',
                nickname: '',
            },
            rules: {
                memo: [
                    { required: true, message: this.$t('webMemberCardList.cardRulesMemo'), trigger: 'blur' }
                ],
                number: [
                    { required: true, message: this.$t('webMemberCardList.cardRulesNumber'), trigger: 'blur' }
                ],
                face_number: [
                    { required: true, message: this.$t('webMemberCardList.cardRulesFaceNumber'), trigger: 'blur' }
                ],
                mid: [
                    { required: true, message: this.$t('webMemberCardList.cardRulesMID'), trigger: 'blur' }
                ],
            },
            dialogFormVisible: false,
            dialogTitle: this.$t('webMemberCardList.cardDialogTitle'),
            tableTitle: [
                { prop: "id", label: this.$t('webMemberCardList.id'), width: "100" },
                { prop: "number", label: this.$t('webMemberCardList.number'), width: "auto" },
                { prop: "memo", label: this.$t('webMemberCardList.memo'), width: "auto" },
                { prop: "face_number", label: this.$t('webMemberCardList.face_number'), width: "95" },
                { prop: "nickname", label: this.$t('webMemberCardList.nickname'), width: "150" },
                { prop: "mobile", label: this.$t('webMemberCardList.mobile'), width: "120" },
                { prop: "money", label: this.$t('webMemberCardList.money'), width: "95" },
                { prop: "money_gift", label: this.$t('webMemberCardList.money_gift'), width: "95" },
                { prop: "ctime", label: this.$t('webMemberCardList.ctime'), width: "100", custom: true },
            ],
            //   表头信息，prop对应
            tableSlot: [
                {
                    title: this.$t('webBaseMessage.status'),
                    slotType: "switch",
                    width: 80,
                    active: this.$t('webBaseMessage.active'),
                    inactive: this.$t('webBaseMessage.inactive'),
                    align: 'left'
                },
                {
                    title: this.$t('webBaseMessage.operation'),
                    slotType: "btn",
                    buttontype: "info", // text为文字按钮，默认不传为正常按钮
                    width: 140,
                    slot: [
                        { label: this.$t('webMemberCardList.slotBtnEdit'), type: "edit" },
                        { label: this.$t('webMemberCardList.slotBtnOpen'), type: "open" },
                        { label: this.$t('webBaseBtn.dele'), type: "dele" },
                        // { label: "暂停/恢复", type: "stop" },
                    ]
                }
            ],
            tableData: [],
            pageMsg: {
                page: 1,
                status: true,
                size: 10,
                sizes: [10, 20, 50, 100],
            },
            loading: false
        };
    },
    components: {},
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    created() {
        if (this.$route.query.type == 'add_new') {//新增会员卡绑定
            this.addNew();
        }
        const _this = this;
        this.searchForm.pageSize = this.pageMsg.size
        this.init()
    },
    mounted() {
        document.onkeydown = function (e) { // 回车提交表单
            // 兼容FF和IE和Opera
            var theEvent = window.event || e;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                this.ruleConfirm()
            }
        }
    },
    methods: {
        async init() {
            let res = await card.getList(this.searchForm);
            res.records.forEach(item => {
                if (!item.nickname) {
                    item.hideBtn = ['open']
                } else {
                    item.hideBtn = ['dele']
                }
                if (this.userInfo.type != 1) {
                    item.hideBtn = ['edit', 'dele', 'open']
                }
                item.switch = item.status == 0 ? false : true
            })
            this.tableData = res.records
            this.pageMsg.total = res.total
        },
        btnFunc(index, type) {
            const _this = this;
            console.log(index, type);
            const id = this.tableData[index].id
            if (type == 'open') {
                this.$confirm(this.$t('webMemberCardList.alertConfirm'), this.$t('webBaseTips.confirm'), {
                    confirmButtonText: this.$t('webBaseBtn.confirm'),
                    cancelButtonText: this.$t('webBaseBtn.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.editCardStatus(
                        this.tableData[index].id,
                        this.tableData[index].mid,
                        100,
                    )
                })
            } else if (type == 'edit') {
                card.getInfo({ id }).then(res => {
                    this.rechargeForm = res;
                    this.dialogFormVisible = true;
                })
            } else if (type == 'dele') {
                this.$confirm(this.$t('webBaseTips.deleConfirm'), this.$t('webBaseTips.confirm'), {
                    confirmButtonText: this.$t('webBaseBtn.confirm'),
                    cancelButtonText: this.$t('webBaseBtn.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.editCardStatus(
                        this.tableData[index].id,
                        this.tableData[index].mid,
                        300,
                    )
                })
            }
        },
        switchChange(row, index) {
            this.editCardStatus(
                this.tableData[index].id,
                this.tableData[index].mid,
                this.tableData[index].switch ? 1 : 0,
            )
        },
        async editCardStatus(id, mid, status) {
            const form = {
                id,
                msg: '',
                status,
                mid
            }
            await card.changeStatus(form)
            this.$message({
                message: this.$t('webBaseTips.editConfirm'),
                type: 'success',
                showClose: true,
            });
            this.init()
        },
        search() {
            this.searchForm.pageNo = 1;
            this.init()
        },
        reset() {
            this.searchForm = {
                pageNo: 1,
                pageSize: this.pageMsg.size,
                mobile: '',
                number: '',
            }
        },
        async ruleConfirm() {
            console.log(this.rechargeForm)
            this.$refs['rechargeForm'].validate(async valid => {
                if (valid) {
                    if (!this.rechargeForm.mid) {
                        this.$message({
                            message: 'message',
                            type: 'error',
                            showClose: true,
                        });
                        return false
                    }
                    await card.editCard(this.rechargeForm)
                    this.$message({
                        message: this.$t('webBaseTips.editConfirm'),
                        type: 'success',
                        showClose: true,
                    });
                    this.init()
                    this.cancel()
                }
            });
        },
        //新增会员卡绑定
        addNew() {
            this.dialogFormVisible = true;
            this.rechargeForm = {
                id: 0,
                number: '',
                memo: '',
                face_number: '',
                mid: '',
                mobild: '',
                nickname: '',
            }
        },
        cancel() {
            this.$refs['rechargeForm'].resetFields()
            this.dialogFormVisible = false;
        },
        async getName() {
            console.log(this.rechargeForm.mobile)
            // if (this.rechargeForm.mobile.length != 11) return false;
            const res = await card.getMobileToName({ mobile: this.rechargeForm.mobile })
            this.rechargeForm.mid = res.mid
            this.rechargeForm.nickname = res.nickname
        },
        pageChange(val) {
            this.searchForm.pageNo = val;
            this.init()
        },
        sizeChange(val) {
            this.searchForm.pageSize = val;
            this.init()
        },
    }
};
</script>
<style scoped lang='less'>
</style>
