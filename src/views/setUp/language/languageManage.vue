<!-- question  -->
<template>
    <div id="languageIndex">
        <div class="pd-10 bfff">
            <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addNew()">新增</el-button> -->
            <!-- <o-table
                :tableData="tableData"
                :tableTitle="tableTitle"
                :tableSlot="tableSlot"
                :pageMsg="pageMsg"
                select
                multy
                :tips="false"
                @btnFunc="btnFunc"
                @batchSubmit="batchSubmit"
            >-->
            <o-table
                :tableData="tableData"
                :tableTitle="tableTitle"
                :tableSlot="tableSlot"
                :pageMsg="pageMsg"
                :tips="false"
                @btnFunc="btnFunc"
            >
                <template slot="img_url" slot-scope="slot">
                    <img :src="slot.data.img_url" alt="" class="imgBox">
                </template>
            </o-table>
            <!-- 创建角色Dialog -->
            <indexDialog ref="languageIndexDialog" :title="dialogMsg.title"></indexDialog>
        </div>
    </div>
</template>
<script>
import { langList, langDel } from "@/api/languageManage/language";
import indexDialog from "../components/languageIndexDialog";
export default {
    data() {
        return {
            form: {
                pageNo: 1,
                pageSize: 10
            },
            tableTitle: [
                { prop: "id", label: "ID", width: "70" },
                { prop: "name", label: this.$t('webLanguageManagement.language'), width: "auto" },
                { prop: "img_url", label: this.$t('webLanguageManagement.img_url'), width: "auto", custom: true },
                { prop: "version", label: this.$t('webLanguageManagement.version'), width: "auto" },
                { prop: "createTime", label: this.$t('webLanguageManagement.createTime'), width: "160" },
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
                        // { label: "删除", type: "dele" },
                    ]
                }
            ],
            tableData: [],
            dialogMsg: {
                title: this.$t('webBaseMessage.add')
            },
            pageMsg: {
                status: false,
            },
        };
    },
    components: { indexDialog },
    computed: {},
    created() {
        const _this = this
        this.init();
    },
    methods: {
        async init() {
            let res = await langList(this.form);
            console.log(res)
            this.tableData = res.records
        },
        async btnFunc(index, type) {
            const _this = this;
            let id = this.tableData[index].id
            if (type == "edit") {
                this.dialogMsg.title = this.$t('webBaseBtn.edit')
                this.$refs.languageIndexDialog.getInfo(id)
            } else if (type == "dele") {
                this.dele(id)
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
            this.dele(id.join(','))
        },
        dele(id) {
                    this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                        confirmButtonText: this.$t('webBaseBtn.confirm'),
                        cancelButtonText: this.$t('webBaseBtn.cancel'),
                        type: 'warning'
            }).then(async () => {
                await langDel({ id })
                this.$message({
                    type: 'success',
                            message: this.$t('webBaseTips.deleSuccess')
                });
                this.init();
            })
        },
        addNew() {
            this.dialogMsg.title = this.$t('webBaseMessage.add')
            this.$refs.languageIndexDialog.show = true;
        }
    }
};
</script>
<style  lang='scss'>
#languageIndex {
  .imgBox {
    width: 70px;
    height: 70px;
  }
  .avatar-uploader {
    width: 100px;
    height: 100px;
  }
  .avatar-uploader:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
}
</style>
