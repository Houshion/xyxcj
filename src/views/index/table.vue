<!-- indextable -->
<template>
  <div id="indextable" class="wd-100">
    <!-- <o-table :title="title"></o-table> -->
    <div class="flexStart">
      <el-date-picker
              class="mg-r-10"
              v-model="dateTime"
              type="daterange"
              :range-separator="$t('webBaseMessage.date_separator')"
              :start-placeholder="$t('webBaseMessage.date_start')"
              :end-placeholder="$t('webBaseMessage.date_end')"
              value-format="timestamp"
              @change="change"
      ></el-date-picker>
      <el-button type="info" @click="reset">{{$t('webBaseBtn.reset')}}</el-button>
    </div>
    <otable
      :tableData="tableData"
      :tableTitle="tableTitle"
      @btnFunc="btnFunc"
      @selecChange="selecChange"
      @switchChange="switchChange"
      @inputChange="inputChange"
      :pageMsg="pageMsg"
      class="wd-100"
    ></otable>
    <div class="flexEnd">
      <el-button-group class="mg-tb-5  tar">
        <el-button icon="el-icon-arrow-left" @click="previousPage" :disabled="prevDisabled">{{$t('webHome.previousPage')}}</el-button>
        <el-button @click="nextPage" :disabled="nextDisabled">
          {{$t('webHome.nextPage')}}
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>
<script>
import oTable from "@/components/table";
import otable from "@/components/table/table";
import { home } from '@/api/index';
export default {
  name: 'indextable',
  data() {
    return {
      search: "", // 模糊搜索当前页面数据
      loading: false, // 是否加载表格
      tableTitle: [
        { prop: "cday_var", label: this.$t('webHome.cday_var'), width: "auto" },
        { prop: "income_num", label: this.$t('webHome.new_income_num'), width: "auto" },
        { prop: "expenses_num", label: this.$t('webHome.new_xpenses_num'), width: "auto" },
        { prop: "user_num", label:  this.$t('webHome.new_user_num'), width: "auto" },
        { prop: "income_money", label: this.$t('webHome.new_income_money'), width: "auto" },
        { prop: "expenses_money", label: this.$t('webHome.new_expenses_money'), width: "auto" },
        { prop: "profit_money", label: this.$t('webHome.new_profit_money'), width: "auto" },
      ],
      tableData: [],
      pageMsg: {
        status: false,
        pageNo:0,
        pageSize:10
      },
      dateTime:[],
      start_time:'',
      end_time:'',
      prevDisabled:false,
      nextDisabled:false,
    };
  },
  components: {
    oTable,
    otable
  },
  computed: {},
  created() {
    const that = this;
    this.pageMsg.pageNo++;
    this.getTable();
  },
  methods: {
    async getTable(){
      const that = this;
      let data={
        pageNo:this.pageMsg.pageNo,
        pageSize:this.pageMsg.pageSize,
        start_time:this.dateTime.length>0?(this.dateTime[0]/1000) + (24 * 60 * 60 - 1):'',
        end_time:this.dateTime.length>0?(this.dateTime[1]/1000) + (24 * 60 * 60 - 1):''
      };
      const res = await home(data);
      this.tableData = this.tableData.concat(res.records.statistics_list);
      this.prevDisabled=this.pageMsg.pageNo==1?true:false;
      this.nextDisabled=this.pageMsg.pageNo>=res.total?true:false;
    },
    //下一页
    nextPage(){
      this.pageMsg.pageNo++;
      this.getTable();
    },
    //上一页
    previousPage(){
      this.pageMsg.pageNo--;
      this.getTable();
    },
    btnFunc(index, type) {
      const _this = this;
      console.log(index, type);
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
    //选择时间
    change(e){
      this.dateTime=e?e:'';
      this.tableData=[];
      this.getTable();
    },
    reset(){//重置
      this.dateTime='';
      this.pageMsg.pageNo=1;
      this.tableData=[];
      this.getTable();
    }
  }
};
</script>
<style scoped lang='less'>
</style>
