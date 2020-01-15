<!-- authority/index  -->
<template>
  <div id="authorityIndex">
    <div class="pd-10 bfff">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="addNew"
      >{{$t('webRoleManagement.createCharacter')}}</el-button>
      <o-table
        :tableData="tableData"
        :tableTitle="tableTitle"
        :tableSlot="tableSlot"
        :pageMsg="pageMsg"
        select
        multy
        @btnFunc="btnFunc"
        @selecChange="selecChange"
        @switchChange="switchChange"
        @inputChange="inputChange"
        @batchSubmit="batchSubmit"
        @pageChange="pageChange"
      ></o-table>
      <!-- 创建角色Dialog -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="cancel">
        <el-form :model="form" :rules="rules" ref="formName">
          <el-form-item
            :label="$t('webRoleManagement.role_name')"
            label-width="1rem"
            prop="role_name"
          >
            <el-input
              v-model="form.role_name"
              autocomplete="off"
              :placeholder="$t('webRoleManagement.pleaseEnterName')"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('webRoleManagement.role_desc')"
            label-width="1rem"
            prop="role_desc"
          >
            <el-input
              type="textarea"
              :placeholder="$t('webRoleManagement.pleaseEnterContent')"
              v-model="form.role_desc"
              maxlength="30"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('webRoleManagement.role_privileges')" label-width="1rem">
            <el-tree
              ref="roleTree"
              class="ele-border"
              :data="tree"
              show-checkbox
              node-key="id"
              :default-checked-keys="treeIndex"
              :props="defaultProps"
              @check="treeChange"
            ></el-tree>
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
import * as role from "@/api/adminRole";
import { menuList } from "@/api/menu";
export default {
  data() {
    return {
      tableTitle: [
        { prop: "role_name", label: this.$t('webRoleManagement.role_name'), width: "auto" },
        { prop: "role_desc", label: this.$t('webRoleManagement.role_desc'), width: "auto" },
      ],
      // 表头信息，prop对应
      tableSlot: [
        {
          title: this.$t('webBaseMessage.operation'),
          slotType: "btn",
          buttontype: "info", // text为文字按钮，默认不传为正常按钮
          slot: [
            { label: this.$t('webBaseBtn.edit'), type: "edit" },
            { label: this.$t('webBaseBtn.dele'), type: "dele" },
          ]
        }
      ],
      tableData: [
        // {
        //   create_time: 1557040778,
        //   is_super: 0,
        //   role_desc: "4444",
        //   role_id: 34,
        //   role_name: "44444",
        // }
      ],
      loading: false,
      pageMsg: {
        page: 1,
        status: true,
        size: 10,
        sizes: [10, 20, 50, 100],
        total: 0,
      },
      dialogFormVisible: false,
      dialogTitle: this.$t('webRoleManagement.addCharacter'),
      form: {
        role_name: '',
        role_desc: '',
        menu_ids: ''
      },
      tree: [],
      treeIndex: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        role_name: [
          {
            required: true,
            message: this.$t('webRoleManagement.pleaseEnterName'),
            trigger: "blur"
          }
        ],
        role_desc: [
          {
            required: true,
            message: this.$t('webRoleManagement.pleaseEnterContent'),
            trigger: "blur"
          }
        ],
        menu_ids: [
          {
            required: true,
            message: this.$t('webRoleManagement.pleaseSelectRolePrivileges'),
            trigger: "change"
          }
        ],
      }
    };
  },
  components: {},
  computed: {},
  created() {
    const _this = this;
    this.init();
    this.getMenu();
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
      this.loading = true
      let form = {
        pageNo: this.pageMsg.page,
        pageSize: this.pageMsg.size
      }
      let res = await role.roleList(form);
      res.records.forEach(item => {
        if (item.is_super == 1) {
          item.hideBtn = ['dele']
        }
      })
      this.tableData = res.records
      this.pageMsg.total = res.total
      this.loading = false
      // console.log('role------>', res.records)
    },
    async getMenu() {
      menuList({ menu_type: '0,1' }).then(res => {
        let treeData = new Array()
        res.records.forEach(item => {
          let a = { id: item.menu_id, label: item.menu_name, children: [] }
          item.childlist.forEach(i => {
            a.children.push({ id: i.menu_id, label: i.menu_name, children: [] })
          });
          treeData.push(a)
        })
        // treeData.push(a)
        this.tree = treeData
        console.log("菜单权限----->", treeData)
      })
    },
    // 操作按钮功能
    async btnFunc(index, type) {
      const _this = this;
      let form = {
        role_id: this.tableData[index].role_id
      }
      if (type == "edit") {
        this.dialogTitle = this.$t('webRoleManagement.edit_role')
        this.treeIndex = []
        this.dialogFormVisible = true
        await role.roleDetail(form).then(res => {
          this.$refs['roleTree'].setCheckedKeys([])
          let menuIds = new Set(res.menu_ids);
          this.tree.forEach(item => {
            if (menuIds.has(item.id)) {
              menuIds.delete(item.id)
            }
          });
          this.treeIndex = [...menuIds]
          console.log(this.treeIndex)
          this.form = {
            role_name: res.role_name,
            role_desc: res.role_desc,
            role_id: res.role_id,
            menu_ids: this.treeIndex
          }
        })
      } else if (type == "dele") {
        this.$confirm(this.$t('webRoleManagement.del_rol_tip'), this.$t('webBaseTips.confirm'), {
          confirmButtonText: this.$t('webBaseTips.confirmButtonText'),
          cancelButtonText: this.$t('webBaseTips.cancelButtonText'),
          type: 'warning'
        }).then(() => {
          role.roleDel(form).then(res => {
            this.loading = true
            this.$message({
              type: 'success',
              message: this.$t('webBaseTips.deleSuccess')
            });
            this.init()
          })
        }).catch(() => {

        });
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
      // console.log("switchChange", row, index);
    },
    inputChange(val) {
      // console.log(val);
    },
    batchSubmit(key, val) {
      console.log(key);
      console.log(val);
      const _this = this;
      const role_id = [];
      val.forEach(item => {
        role_id.push(item.role_id);
      })
      let form = {
        role_id: role_id.join(',')
      }
      if (key == 1 && val.length > 0) {
        this.$confirm(this.$t('webRoleManagement.del_allRol_tip'), this.$t('webBaseTips.confirm'), {
          confirmButtonText: this.$t('webBaseTips.confirmButtonText'),
          cancelButtonText: this.$t('webBaseTips.cancelButtonText'),
          type: 'warning'
        }).then(() => {
          role.roleDel(form).then(res => {
            this.loading = true
            this.$message({
              type: 'success',
              message: this.$t('webBaseTips.deleSuccess')
            });
            this.init()
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
      }
    },
    pageChange(val) {
      // console.log("现在是第", val, "页")
      this.pageMsg.page = val;
      this.init()
    },
    // 权限菜单树状态改变方法
    treeChange(data, key) {
      // this.form.menu_ids = [1,2];
      this.form.menu_ids = [...key.checkedKeys, ...key.halfCheckedKeys]
      console.log(this.form.menu_ids)
      // var keys = new Set(key.checkedKeys)
      // key.checkedNodes.forEach(item => {
      //   if (item.children.length > 0) {
      //     keys.delete(item.id)
      //   }
      // });
      // this.form.menu_ids = [...keys].join(",")
    },
    async ruleConfirm() {
      this.$refs['formName'].validate(async (valid) => {
        if (valid) {
          if (this.form.menu_ids == '') {
            return this.$message({
              type: 'error',
              message: this.$t('webRoleManagement.pleaseSelectRolePrivileges')
            });
          }
          if (this.dialogTitle == this.$t('webRoleManagement.add_role')) {
            let res = await role.roleAdd(this.form);
            this.$message({
              type: 'success',
              message: this.$t('webBaseTips.addConfirm')
            });
          } else {
            let res = await role.roleEdit(this.form);
            this.$message({
              type: 'success',
              message: this.$t('webBaseTips.editConfirm')
            });
          }
          this.treeIndex = []
          this.init();
          this.dialogFormVisible = false;
        }
      });

    },
    // 添加新角色权限
    addNew() {
      this.dialogFormVisible = true;
      this.treeIndex = []
      this.form = {
        role_name: '',
        role_desc: '',
        menu_ids: ''
      }
    },
    cancel() {
      this.$refs['roleTree'].setCheckedKeys([])
      this.dialogFormVisible = false
    }
  }
};
</script>
<style scoped lang='less'>
</style>
