<!-- question  -->
<template>
    <div id="question">
        <div class="pd-10 bfff">
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="addNew"
            >{{$t('webCommonProblem.createProblem')}}</el-button>
            <o-table
                :tableData="tableData"
                :tableTitle="tableTitle"
                :tableSlot="tableSlot"
                select
                multy
                :tips="false"
                :pageMsg="pageMsg"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
                @btnFunc="btnFunc"
                @batchSubmit="batchSubmit"
            ></o-table>
            <!-- 创建角色Dialog -->
            <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="cancel">
                <el-form
                    :model="form.questionForm"
                    ref="ruleForm"
                    :rules="rules"
                    label-position="top"
                >
                    <el-form-item :label="$t('webCommonProblem.title')" label-width="1rem" prop="title">
                        <el-input
                            v-model="form.questionForm.title"
                            autocomplete="off"
                            :placeholder="$t('webCommonProblem.pleaseEnterProblem')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('webCommonProblem.answerProblem')" label-width="1rem" prop="content">
                        <el-input
                            type="textarea"
                            :rows="4"
                            :placeholder="$t('webCommonProblem.pleaseEnterContent')"
                            v-model="form.questionForm.content"
                            show-word-limit
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
                    <el-button type="primary" @click="editQuestion" v-if="edit">{{$t('webBaseBtn.confirm')}}</el-button>
                    <el-button type="primary" @click="addQuestion" v-else>{{$t('webBaseBtn.confirm')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { getlist, infoDelete, infoEdit, infoAdd, infoShow } from "@/api/setUp";
import { parseTime } from "@/utils";
export default {
    data() {
        return {
            tableTitle: [
                { prop: "id", label: "ID", width: "70" },
                { prop: "title", label: this.$t('webCommonProblem.problem'), width: "200" },
                { prop: "content", label:  this.$t('webCommonProblem.content'), width: "auto" },
                { prop: "ctime", label:  this.$t('webCommonProblem.ctime'), width: "160" },
            ],
            // 表头信息，prop对应
            tableSlot: [
                {
                    title: this.$t('webBaseMessage.operation'),
                    slotType: "btn",
                    buttontype: "info", // text为文字按钮，默认不传为正常按钮
                    width: 150,
                    slot: [
                        { label: this.$t('webBaseBtn.edit'), type: "edit" },
                        { label: this.$t('webBaseBtn.dele'), type: "dele" },
                    ]
                }
            ],
            tableData: [],
            dialogFormVisible: false,
            dialogTitle:this.$t('webCommonProblem.addProblem'),
            form: {
                questionForm: {
                    title: '',
                    content: '',
                    id:''
                },
                list: {
                    keyname: 'question',
                    pageNo: 1,
                    pageSize: 10,
                }
            },
            pageMsg:{
                status: true,
                page: 1,
                size: 10,
                sizes: [10, 20, 50, 100],
                total: 0
            },
            rules: {
                title: [
                    { required: true, message: this.$t('webCommonProblem.pleaseEnterProblem'), trigger: 'blur' }
                ],
                content: [
                    { required: true, message: this.$t('webCommonProblem.pleaseEnterContent'), trigger: 'blur' }
                ],
            },
            edit: false
        };
    },
    components: {},
    computed: {},
    created() {
        const _this = this
        this.init();
    },
    methods: {
        async init() {
            let res = await getlist(this.form.list);
            res.records.forEach(item => {
                item.ctime = parseTime(item.ctime);
            });
            this.tableData = res.records;
            this.pageMsg.total=res.total;
        },
        async btnFunc(index, type) {
            const _this = this;
            const id = this.tableData[index].id;
            if (type == "edit") {
                this.dialogTitle = this.$t('webCommonProblem.editProblem');
                this.dialogFormVisible = true;
                console.log(index)
                let res = await infoShow({id});
                this.form.questionForm = res;
                this.edit = true;
            } else if (type == "dele") {
                this.deleQuestion(id)
            }
        },
        addNew(){
            this.dialogTitle = this.$t('webCommonProblem.addProblem');
            this.dialogFormVisible = true;
            this.edit = false;
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
            console.log("switchChange", row, index);
        },
        inputChange(val) {
            console.log(val);
        },
        pageChange(val) {
            this.form.list.pageNo=val;
            this.init();
        },
        sizeChange(val){
            this.form.list.pageSize=val;
            this.init();
        },
        batchSubmit(key, val) {
            if(key==1 && val.length>0){
                let id = new Array();
                val.forEach(item => {
                    id.push(item.id)
                })
                this.deleQuestion(id.join(','))
            }
        },
        async addQuestion() {
            this.$refs['ruleForm'].validate(async valid => {
                if (valid) {
                    await infoAdd(this.form.questionForm)
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.editConfirm')
                    });
                    this.dialogFormVisible = false;
                    this.init()
                }
            })
        },
        async editQuestion() {
            this.$refs['ruleForm'].validate(async valid => {
                if (valid) {
                    await infoEdit(this.form.questionForm)
                    this.$message({
                        type: 'success',
                        message: this.$t('webBaseTips.editConfirm')
                    });
                    this.dialogFormVisible = false;
                    this.init()
                }
            })
        },
        async deleQuestion(id) {
            this.$confirm(this.$t('webCommonProblem.dialog'), this.$t('webBaseTips.confirm'), {
                confirmButtonText: this.$t('webMessage.confirm'),
                cancelButtonText: this.$t('webMessage.cancel'),
                type: 'warning'
            }).then(async () => {
                await infoDelete({id})
                this.$message({
                    type: 'success',
                    message: this.$t('webBaseTips.deleSuccess')
                });
                this.dialogFormVisible = false;
                this.init()
            })
        },
        cancel() {
            this.$refs["ruleForm"].resetFields();
            delete this.form.questionForm.id
            this.dialogFormVisible = false
        }
    }
};
</script>
<style scoped lang='less'>
</style>
