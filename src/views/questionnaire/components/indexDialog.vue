<!-- goodsDialog -->
<template>
  <div id="indexDialog">
    <!-- 创建讯息Dialog -->
    <el-dialog :visible.sync="form.dialogFormVisible" @close="cancel">
      <div slot="title" class="dialog-title flexBetween">
        <p>{{dialogMsg.title}}</p>
        <el-button
          type="primary"
          class="mg-r-30"
          @click="addProblem"
        >{{$t('webQuestionnaire.addTitle')}}</el-button>
      </div>
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item prop="title">
          <el-input
            v-model="form.title"
            autocomplete="off"
            :placeholder="$t('webQuestionnaire.title')"
          ></el-input>
        </el-form-item>
        <el-form-item v-for="(item,idx) in form.question" prop="question">
          <div>
            <span>{{idx+1}}.{{item.title}}</span>
            <span
              style="color: #FF0000"
            >({{item.type=='radio'?$t('webQuestionnaire.radio'):$t('webQuestionnaire.checkbox')}})</span>
            <em class="fr">
              <span class="handleBtns mr10" @click="editItem(item,idx)">{{$t('webBaseBtn.edit')}}</span>
              <span class="handleBtns" @click="deleItem(item,idx)">{{$t('webBaseBtn.dele')}}</span>
            </em>
          </div>
          <div class="flexBetween">
            <span v-for="(obj,jdx) in item.forAnswers">{{transform(jdx)}}.{{obj.answers}}</span>
          </div>
        </el-form-item>
        <div class="block el-form-item">
          <el-date-picker
            style="width: 100%;"
            class="wd-100"
            v-model="form.date"
            type="datetime"
            value-format="timestamp"
            :placeholder="$t('webQuestionnaire.Deadline')"
          ></el-date-picker>
        </div>
        <el-form-item prop="money">
          <el-input
            v-model="form.money"
            autocomplete="off"
            :placeholder="$t('webQuestionnaire.reward')"
          >
            <template slot="prepend">{{$t('webQuestionnaire.reward')}}:￥</template>
          </el-input>
        </el-form-item>
        <div>
          <el-select
            v-model="form.group"
            multiple
            style="width: 100%;"
            :placeholder="$t('webQuestionnaire.change')"
          >
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
        <el-button type="primary" @click="submitForm">{{$t('webBaseBtn.confirm')}}</el-button>
      </div>
      <!-- 嵌套的内dialog -->
      <el-dialog
        width="45%"
        :title="innerMsg.title"
        :visible.sync="form.innerVisible"
        append-to-body
        @close="cancel2"
      >
        <el-form :model="innerForm" :rules="innerRules" ref="innerRuleForm">
          <el-form-item prop="title">
            <el-input
              v-model="innerForm.title"
              autocomplete="off"
              :placeholder="$t('webQuestionnaire.question_title')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('webQuestionnaire.question_answers')+':'" prop="resource">
            <el-radio-group v-model="innerForm.resource" @change="answers">
              <el-radio border="" label="3"></el-radio>
              <el-radio border="" label="4"></el-radio>
              <el-radio border="" label="5"></el-radio>
              <el-radio border="" label="6"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('webQuestionnaire.question_type')+':'" prop="type">
            <el-radio-group v-model="innerForm.type">
              <el-radio label="radio">{{$t('webQuestionnaire.radio')}}</el-radio>
              <el-radio label="checkbox">{{$t('webQuestionnaire.checkbox')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="answers" v-for="(item,idx) in innerForm.forAnswers">
            <el-input
              v-model="innerForm.forAnswers[idx].answers"
              autocomplete="off"
              :placeholder="$t('webQuestionnaire.question_content')+transform(idx)"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel2">{{$t('webBaseBtn.cancel')}}</el-button>
          <el-button type="primary" @click="createQ()">{{$t('webBaseBtn.confirm')}}</el-button>
        </div>
      </el-dialog>
      <!-- 嵌套的内dialog -->
    </el-dialog>
  </div>
</template>
<script>
import { questionDetail, questionAdd, questionItemDele, questionItemDetail, questionItemEdit, questionEdit } from "@/api/questionnaire";
import { getList } from "@/api/members/user";
export default {
  name: 'staffDialog',
  data() {
    return {
      dialogMsg: { title: this.$t('webQuestionnaire.add') },
      innerMsg: { title: this.$t('webQuestionnaire.add_question_tit') },
      form: {
        id: '',
        dialogFormVisible: false,
        title: '',
        money: '',
        date: '',
        group: '',
        innerVisible: false,
        question: [],
      },
      innerForm: {
        title: '',
        resource: '',
        type: '',
        forAnswers: []
      },
      rules: {
        title: [
          { required: true, message: this.$t('webQuestionnaire.input_question_tit'), trigger: 'blur' },
        ],
        money: [
          { required: true, message: this.$t('webQuestionnaire.input_question_price'), trigger: 'blur' },
        ],
        question: []
      },
      innerRules: {
        title: [
          { required: true, message: this.$t('webQuestionnaire.input_question_title'), trigger: 'blur' },
        ],
        resource: [
          { required: true, message: this.$t('webQuestionnaire.input_question_answers'), trigger: 'change' }
        ],
        type: [
          { required: true, message: this.$t('webQuestionnaire.input_question_type'), trigger: 'change' }
        ],
      },
      options: [],
      questionItemId: '',
      questionItemIdx: '',
      questionItemEdit: false
    };
  },
  computed: {},
  watch: {
    'form.dialogFormVisible'(val) {
      if (!val) return;
      this.init();
    },
    'form.group'(val) {
      console.log(val)
    }
  },
  created() {

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
    async init() {//获取用户组
      const result = await getList();
      this.options = result;
      if (!this.form.id) {//新增

      } else {
        const id = this.form.id
        const res = await questionDetail({ id });
        console.log(res);
        this.form.title = res.title;
        this.form.money = res.money;
        this.form.date = res.endtime * 1000;
        const group_ids = [];
        res.group_ids.split(',').forEach(item => {
          group_ids.push(item * 1);
        })
        this.form.group = group_ids;
        this.form.question = [];
        res.detail_list.forEach(item => {
          const forAnswers = new Array();
          item.answer_item.split('|').forEach(itemName => {
            forAnswers.push({ answers: itemName });
          });
          console.log(forAnswers)
          this.form.question.push({
            title: item.question,
            resource: item.answer_item.split('|').length.toString(),
            type: item.input_type,
            forAnswers,
            id: item.id
          })
          console.log(this.form)
        })
      }
    },
    createQ() {
      let that = this;
      this.$refs.innerRuleForm.validate(async (valid) => {
        if (valid) {
          if (!this.form.id) {
            if (!this.questionItemEdit) {
              that.form.question.push({
                title: that.innerForm.title,
                resource: that.innerForm.resource,
                type: that.innerForm.type,
                forAnswers: that.innerForm.forAnswers
              })
            } else {
              that.form.question[this.questionItemIdx].title = that.innerForm.title;
              that.form.question[this.questionItemIdx].resource = that.innerForm.resource;
              that.form.question[this.questionItemIdx].type = that.innerForm.type;
              that.form.question[this.questionItemIdx].forAnswers = that.innerForm.forAnswers;
            }
            this.$message({
              type: 'success',
              message: this.$t('webQuestionnaire.AddedSuccessfully')
            });
          } else {
            if (!this.questionItemEdit) {
              that.form.question.push({
                title: that.innerForm.title,
                resource: that.innerForm.resource,
                type: that.innerForm.type,
                forAnswers: that.innerForm.forAnswers
              })
            } else {
              let answer_item = new Array();
              this.innerForm.forAnswers.forEach(itemName => {
                answer_item.push(itemName.answers)
              })
              const form = {
                id: this.questionItemId,
                question: this.innerForm.title,
                input_type: this.innerForm.type,
                answer_item: answer_item.join('|')
              }
              await questionItemEdit(form);
              this.$message({
                type: 'success',
                message: this.$t('webQuestionnaire.EditorialSuccess')
              });
              this.init();
            }
          }
          that.form.innerVisible = false;
        }
      });
    },
    addProblem() {
      this.form.innerVisible = true;
      this.questionItemEdit = false;
    },
    answers(e) {
      this.innerForm.forAnswers = []
      for (let i = 0; i < e; i++) {
        this.innerForm.forAnswers.push({ answers: '' })
      }
    },
    transform(idx) {
      switch (idx) {
        case 1:
          return 'B';
          break;
        case 2:
          return "C";
          break;
        case 3:
          return "D";
          break;
        case 4:
          return "E";
          break;
        case 5:
          return "F";
          break;
        case 6:
          return "G";
          break;
        default:
          return "A";
      }
    },
    editItem(item, idx) {//编辑选项
      console.log(item)
      this.innerMsg.title = this.$t('webQuestionnaire.editTit');
      this.form.innerVisible = true;
      this.innerForm = {
        title: item.title,
        resource: item.resource,
        type: item.type,
        forAnswers: item.forAnswers
      };
      this.questionItemId = item.id;
      this.questionItemEdit = true;
      this.questionItemIdx = idx;
    },
    deleItem(item, idx) {//删除选项
      console.log(item)
      this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
        confirmButtonText: this.$t('webBaseBtn.confirm'),
        cancelButtonText: this.$t('webBaseBtn.cancel'),
        type: 'warning'
      }).then(async () => {
        if (!this.form.id) {
          this.form.question.splice(idx, 1);
        } else {
          await questionItemDele({ id: item.id });
          this.form.question.splice(idx, 1);
        }
        this.$message({
          type: 'success',
          message: this.$t('webBaseTips.deleSuccess')
        });
      })
    },
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.form.question.length <= 0) {
            this.$message({
              type: 'warning',
              message: this.$t('webQuestionnaire.addTit')
            });
            return;
          };
          console.log(this.form);
          const form = {
            title: this.form.title,
            endtime: this.form.date / 1000,
            money: this.form.money,
            group_ids: this.form.group.join(','),
          };
          let data = new Array();
          this.form.question.forEach(item => {
            let answer_item = new Array();
            item.forAnswers.forEach(itemName => {
              answer_item.push(itemName.answers)
            })
            data.push({
              question_id: this.form.id ? item.id : '',
              question: item.title,
              input_type: item.type,
              answer_item: answer_item.join('|')
            })
          });
          form.data = JSON.stringify(data);
          console.log(form);
          if (!this.form.id) {
            await questionAdd(form);
          } else {
            form.id = this.form.id;
            await questionEdit(form);
          }
          this.$message({
            type: 'success',
            message: !this.form.id ? this.$t('webQuestionnaire.AddedSuccessfully') : this.$t('webQuestionnaire.EditorialSuccess')
          });
          this.form.dialogFormVisible = false;
          this.$parent.init();
        }
      });
    },
    cancel() {
      this.$refs['ruleForm'].resetFields();
      this.form.dialogFormVisible = false;
    },
    cancel2() {
      this.$refs['innerRuleForm'].resetFields();
      this.form.innerVisible = false;
      this.questionItemEdit = false;
      this.questionItemIdx = '';
    },
  },
};
</script>
<style scoped lang='scss'>
.handleBtns {
  color: #66ccff;
  text-decoration: underline;
  cursor: pointer;
}
</style>
