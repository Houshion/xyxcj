<!-- authority/list  -->
<template>
  <div id="authorityList">
    <div class="pd-10 bfff">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="openDialog(1)"
      >{{$t('webAdministratorList.createAdministrator')}}</el-button>
      <o-table
        :tableData="tableData"
        :tableTitle="tableTitle"
        :tableSlot="tableSlot"
        :pageMsg="pageMsg"
        select
        multy
        @btnFunc="btnFunc"
        @selecChange="selecChange"
        @batchSubmit="batchSubmit"
      ></o-table>
      <!-- 创建管理员Dialog -->
      <el-dialog
        :title="form.model==1?$t('webAdministratorList.addAdministrator'):form.model==2?$t('webAdministratorList.editAdministrator'):$t('webAdministratorList.changePass')"
        :visible.sync="form.dialogFormVisible"
        @close="cancel"
      >
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item
            :label="$t('webAdministratorList.userAccount')"
            label-width="1rem"
            prop="username"
            v-if="form.model!=3"
          >
            <el-input
              clearable
              v-model="form.username"
              autocomplete="off"
              :disabled="form.model==2?true:false"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('webAdministratorList.userPassword')"
            label-width="1rem"
            prop="password"
            v-if="form.model!=2"
          >
            <el-input clearable type="password" v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('webAdministratorList.confirmPassword')"
            label-width="1rem"
            prop="password2"
            v-if="form.model!=2"
          >
            <el-input clearable type="password" v-model="form.password2" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('webAdministratorList.role')"
            label-width="1rem"
            prop="role_ids"
            v-if="form.model!=3"
          >
            <el-select
              class="wd-100"
              v-model="form.role_ids"
              :placeholder="$t('webAdministratorList.pleaseSelectRole')"
            >
              <el-option
                v-for="(item,index) in adminRoleList"
                :key="index"
                :label="item.role_name"
                :value="item.role_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
          <el-button type="primary" @click="submitForm">{{$t('webBaseBtn.confirm')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as member from "@/api/member";
import { roleList } from "@/api/adminRole";
import { parseTime } from "@/utils";
export default {
  data() {
    const password2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('webAdministratorList.pleaseEnterPasswordAgain')));
      } else if (value !== this.form.password) {
        callback(new Error(this.$t('webAdministratorList.notMatchTwoPasswords')));
      } else {
        callback();
      }
    };
    return {
      tableTitle: [
        { prop: "username", label: this.$t('webAdministratorList.username'), width: "auto" },
        { prop: "role", label: this.$t('webAdministratorList.role'), width: "auto" },
        { prop: "create_time", label: this.$t('webAdministratorList.create_time'), width: "auto" },
      ],
      // 表头信息，prop对应
      tableSlot: [
        {
          title: this.$t('webBaseMessage.operation'),
          slotType: "btn",
          buttontype: "info", // text为文字按钮，默认不传为正常按钮
          width: 250,
          slot: [
            { label: this.$t('webBaseBtn.edit'), type: "edit" },
            { label: this.$t('webBaseBtn.dele'), type: "dele" },
            { label: this.$t('webBaseBtn.modifyPw'), type: "changePass" },
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
      form: {
        dialogFormVisible: false,
        model: 1, //1创建，2编辑，3修改密码
        username: '',
        password: '',
        password2: '',
        role_ids: '',
      },
      adminRoleList: [],
      rules: {
        username: [
          { required: true, message: this.$t('webAdministratorList.pleaseEnterUserAccount'), trigger: 'blur' },
          { min: 4, max: 11, message: this.$t('webAdministratorList.threeToFiveLength'), trigger: 'blur' }
        ],
        role_ids: [
          { required: true, message: this.$t('webAdministratorList.pleaseSelectRole'), trigger: 'change' }
        ],
        password: [
          { required: true, message: this.$t('webAdministratorList.pleaseEnterUserPassword'), trigger: 'blur' }
        ],
        password2: [
          { required: true, message: this.$t('webAdministratorList.pleaseEnterUserPasswordAgain'), trigger: 'blur' },
          { validator: password2, trigger: 'blur' }
        ],
      },
    };
  },
  components: {},
  computed: {},
  created() {
    this.init()
  },
  mounted() {
    const _this = this
    document.onkeydown = function (e) { // 回车提交表单
      // 兼容FF和IE和Opera
      var theEvent = window.event || e;
      var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      if (code == 13) {
        _this.submitForm()
      }
    }
  },
  methods: {
    async init() {
      let form = {
        pageNo: this.pageMsg.page,
        pageSize: this.pageMsg.size
      }
      let res = await member.memberList(form)
      res.records.forEach(item => {
        let roleName = new Array();
        item.role.forEach(role => {
          roleName.push(role.role_name)
        });
        item.role = roleName.join(",")
        item.create_time = parseTime(item.create_time)
      });
      this.tableData = res.records
    },
    async btnFunc(index, type) {
      const _this = this;
      if (type == "edit") {
        this.openDialog(2)
        let res = await member.memberDetail({ mid: this.tableData[index].mid })
        this.form.username = res.username
        let arr = new Array()
        res.role.forEach(item => {
          arr.push(item.role_id)
        });
        console.log(arr)
        this.form.mid = res.mid
        this.form.role_ids = arr
      } else if (type == "dele") {
        this.deleteMember(this.tableData[index].mid)
      } else if (type == "changePass") {
        this.openDialog(3)
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
    batchSubmit(val, data) {
      let arr = new Array()
      data.forEach(item => {
        arr.push(item.mid)
      });
      if (val == 1 && data.length > 0) {
        this.deleteMember(arr.join(","))
      }
    },
    submitForm() {
      const _this = this;
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          let form, msg = this.$t('webBaseTips.editConfirm');
          switch (this.form.model) {
            case 1:
              // 添加管理员
              form = {
                username: _this.form.username,
                password: _this.form.password,
                role_ids: _this.form.role_ids
              }
              let res = await member.memberAdd(form)
              msg = this.$t('webBaseTips.addConfirm')
              break;
            case 2:
              let { mid, role_ids } = _this.form
              form = {
                mid,
                role_ids: role_ids.join(",")
              }
              await member.memberEdit(form)
              break;
            case 3:
              form = {
                mid: _this.form.mid,
                password: _this.form.password,
              }
              await member.memberEdit(form)
              break;
          }
          this.$message({
            type: 'success',
            message: msg
          });
          this.form.dialogFormVisible = false
          this.init()
        } else {
          console.log('error!!');
          return false;
        }
      });
    },
    async openDialog(type) {
      this.form.model = type
      console.log(type)
      if (type != 3 && this.adminRoleList.length == 0) {
        let res = await roleList({
          pageNo: 1,
          pageSize: 999
        })
        res.records.forEach(item => {
          if (item.is_super == 0) {
            this.adminRoleList.push(item)
          }
        })
        //this.adminRoleList = res.records;     TODO:过滤炒鸡管理员
        console.log(this.adminRoleList)
      }
      this.form.dialogFormVisible = true
    },
    cancel() {
      this.$refs["ruleForm"].resetFields();
      this.form.dialogFormVisible = false
    },
    async deleteMember(mid) {
      this.$confirm(this.$t('webAdministratorList.del_tip'), this.$t('webBaseTips.confirm'), {
        confirmButtonText: this.$t('webBaseTips.confirmButtonText'),
        cancelButtonText: this.$t('webBaseTips.cancelButtonText'),
        type: 'warning'
      }).then(async () => {
        const res = await member.memberDel({ mid: mid })
        this.$message({
          type: 'success',
          message: this.$t('webBaseTips.deleSuccess')
        });
        this.init()
      })
    }
  }
};
</script>
<style scoped lang='less'>
</style>
