<!-- userAbnormal -->
<template>
  <div id="userAbnormal">
    <div class="mg-t-5 bfff pd-10">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input :placeholder="$t('webAbnormal.search_number')" v-model="searchForm.number"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input :placeholder="$t('webAbnormal.search_username')" v-model="searchForm.username"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input :placeholder="$t('webAbnormal.search_mobile')" v-model="searchForm.mobile"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="searchForm.is_reply" :placeholder="$t('webAbnormal.search_is_reply')">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input :placeholder="$t('webLog.operator')" v-model="searchForm.action_name"></el-input>
        </el-col>
        <el-col :span="4" class="tar">
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="search"
          >{{$t('webBaseBtn.search')}}</el-button>
          <el-button icon="el-icon-refresh-left" @click="reset">{{$t('webBaseBtn.reset')}}</el-button>
        </el-col>
      </el-row>
      <el-table
        class="border mg-t-5"
        ref="otable"
        :data="tableData"
        style="width: 100%"
        @selection-change="selecChange"
        tooltip-effect="dark"
        :show-overflow-tooltip="true"
        :header-row-style="{background:'#999'}"
        border=""
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="(item,index) in tableTitle"
          :key="item.date"
          :fixed="index==0?true:false"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="item.custom">
              <el-popover placement="right" width="400" trigger="click">
                <div class="imgBox">
                  <img
                    :src="goods_img"
                    style="width: 375px;height: 250px;"
                    v-for="goods_img in scope.row.pic"
                    alt=""
                  >
                </div>
                <el-link slot="reference">
                  {{$t('webBaseBtn.check')}}
                  <i class="el-icon-view el-icon--right"></i>
                </el-link>
              </el-popover>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('webBaseMessage.operation')"
          show-overflow-tooltip
          width="auto"
        >
          <template slot-scope="scope">
            <div class="typeButton">
              <el-button
                v-if="scope.row.is_reply==2"
                @click="handleResult(scope.row.id)"
                type="primary"
                size="small"
              >{{$t('webAbnormal.Reply')}}</el-button>
              <el-button
                v-else
                @click="handleResult(scope.row.id,'edit')"
                type="info"
                size="small"
              >{{$t('webBaseBtn.edit')}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="ml10 mt20 batch">
        <el-select
          size="mini"
          class="ml10 mr10"
          style="width:120px;"
          v-model="batchValue"
          :placeholder="$t('webBaseMessage.batch')"
        >
          <el-option
            :label="item.name"
            :value="item.key"
            v-for="item in batchList"
            :key="item.name"
          ></el-option>
        </el-select>
        <el-button type="info" size="mini" @click="batchSubmit">{{$t('webAbnormal.confirm')}}</el-button>
      </div>
      <el-pagination
        class="mg-t-10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageMsg.page"
        :page-sizes="pageMsg.sizes"
        :page-size="pageMsg.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageMsg.total"
      ></el-pagination>
    </div>
    <!-- 创建角色Dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="cancel">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="" prop="reply">
          <el-input
            class="wd-50"
            v-model="form.reply"
            type="textarea"
            :placeholder="$t('webAbnormal.input_replyContent')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
        <el-button type="primary" @click="ruleConfirm">{{$t('webBaseBtn.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { feedbackIndex, feedbackDel, feedbackSave, feedbackReply, feedbackGetReply } from "@/api/user";
import { parseTime } from "@/utils";
import tools from '@/utils/tools';
export default {
  name: 'userAbnormal',
  data() {
    return {
      url: tools.globalData.url,
      searchForm: {
        number: '',
        username: '',
        mobile: '',
        is_reply: '',
        action_name: ''
      },
      dialogFormVisible: false,
      dialogTitle: '回复',
      tableTitle: [
        { prop: "id", label: "ID", width: "55" },
        { prop: "number", label: this.$t('webAbnormal.feedbackNO'), width: "130" },
        { prop: "username", label: this.$t('webAbnormal.username'), width: "auto" },
        { prop: "mobile", label: this.$t('webAbnormal.mobile'), width: "auto" },
        { prop: "content", label: this.$t('webAbnormal.feedbackContent'), width: "auto" },
        { prop: "photo", label: this.$t('webAbnormal.images'), width: "auto", custom: true },
        { prop: "ctime", label: this.$t('webAbnormal.feedbackTime'), width: "auto" },
        { prop: "reply", label: this.$t('webAbnormal.replyContent'), width: "auto" },
        { prop: "reply_time", label: this.$t('webAbnormal.reply_time'), width: "auto" },
        { prop: "action_name", label: this.$t('webLog.operator'), width: "auto" },
      ],
      tableData: [],
      pageMsg: {
        page: 1,
        status: true,
        size: 10,
        sizes: [10, 20, 50, 100],
        total: 0
      },
      checkArrList: [],
      batchValue: '',
      batchList: [{ name: this.$t('webAbnormal.del'), key: '1', }],
      loading: false,
      form: {
        id: '',
        reply: '',
      },
      rules: {
        reply: [
          { required: true, message: this.$t('webAbnormal.input_replyContent'), trigger: 'blur' }
        ],
      },
      edit: false,
    };
  },
  components: {},
  computed: {

  },
  created() {
    this.init();
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
        pageSize: this.pageMsg.size,
      }
      Object.assign(form, this.searchForm);
      let res = await feedbackIndex(form);
      res.records.forEach(item => {
        item.ctime = parseTime(item.ctime);
        if (item.reply_time) item.reply_time = parseTime(item.reply_time);
        item.pic.forEach(itemName => {
          item = this.url + item;
        })
      });
      this.tableData = res.records
      this.pageMsg.total = res.total
      this.loading = false
    },
    selecChange(val) {
      this.checkArrList = val;
    },
    async batchSubmit() {
      if (this.batchValue == 1 && this.checkArrList.length > 0) {
        const id = [];
        this.checkArrList.forEach(item => {
          id.push(item.id);
        });
        const res = await feedbackDel({ id: id.join(',') });
        this.$message({
          type: 'success',
          message: this.$t('webBaseTips.deleSuccess')
        });
        this.init();
      }
    },
    handleSizeChange(val) {
      this.pageMsg.size = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.pageMsg.page = val;
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
      };
      this.searchForm = {
        number: '',
        username: '',
        mobile: '',
        is_reply: ''
      };
      this.init();
    },
    cancel() {
      this.$refs["form"].resetFields();
      this.form.id = '';
      this.dialogFormVisible = false;
    },
    async handleResult(id, y) {//回复
      this.form.id = id;
      this.dialogFormVisible = true;
      if (y) {
        const res = await feedbackGetReply({ id })
        this.form = {
          id: res.id,
          reply: res.reply,
        };
        this.edit = true
      } else {
        this.edit = false
      }
    },
    ruleConfirm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          if (!this.edit) {
            await feedbackSave(this.form);
          } else {
            await feedbackReply(this.form);
          }
          this.$message({
            type: 'success',
            message: this.$t('webAbnormal.Successful')
          });
          this.dialogFormVisible = false;
          this.init();
        }
      });
    }
  }
};
</script>
<style lang='scss'>
</style>
