<!-- goodsDialog -->
<template>
  <div id="reportDialog">
    <el-dialog :title="$t('webQuestionnaire.report')" :visible.sync="show" @close="cancel">
      <p
        style="color: #6699FF;font-size: 16px;"
      >{{$t('webQuestionnaire.SurveyUsers')}}：{{user_count}}</p>
      <p class="col3 mt10">{{$t('webQuestionnaire.title')}}：{{questionTitle}}</p>
      <div class="ptb20">
        <div class="mb20" v-for="(item,index) in list" :key="item.id">
          <p class="pb10">{{index+ 1}}.{{item.question}}</p>
          <p>
            <em v-for="(itemName,idx) in item.item">
              {{options_type[idx]}}.{{itemName.name}}
              <span
                style="color: #FF0000;margin-right: 20px;"
              >({{itemName.count}}%)</span>
            </em>
          </p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
        <el-button type="primary" @click="submitForm">{{$t('webBaseBtn.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { report } from "@/api/questionnaire";
export default {
  props: {
    title: String,
  },
  name: 'reportDialog',
  data() {
    return {
      show: false,
      id: '',
      questionTitle: '',
      user_count: '',
      list: [],
      options_type: ['A', 'B', 'C', 'D', 'F', 'G']
    };
  },
  computed: {},
  watch: {
    show(val) {
      if (!val) return;
      this.questionTitle = '';
      this.user_count = '';
      this.list = [];
      this.init();
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
    async init() {
      const res = await report({ id: this.id, pageNo: 1, pageSize: 999 });
      console.log(res);
      this.questionTitle = res.title;
      this.user_count = res.user_count;
      this.list = res.records;

    },
    submitForm() {
      this.show = false;
    },
    cancel() {
      this.show = false;
    }
  },
};
</script>
<style scoped lang='less'>
</style>
