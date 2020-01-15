<!-- charts -->
<template>
  <div id="charts">
    <el-button-group class="mg-t-5 tar wd-100">
      <el-button
        type="primary"
        :plain="item.active?false:true"
        v-for="(item,index) in buttons"
        :key="index"
        @click="changeType(item,index)"
      >{{item.name}}</el-button>
    </el-button-group>
    <!--<el-radio-group v-model="chartVal" class="mg-t-5 wd-100">-->
      <!--<el-radio-button :label="item.name" v-for="(item,index) in buttons" :key="index"></el-radio-button>-->
    <!--</el-radio-group>-->
    <div class="mg-t-5 wd-100">
      {{$t('webHome.cday_var')}}：
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
    </div>
    <div class="wd-100">
      <v-chart :options="option"/>
    </div>
  </div>
</template>
<script>
    import { home } from '@/api/index';
    import i18n from '@/lang' //国际化
    const timeData=[
        {val:[i18n.t('webHome.today_income_order_count'), i18n.t('webHome.total_income_order_count')]},
        {val:[i18n.t('webHome.today_income_moeny'), i18n.t('webHome.total_income_moeny')]},
        {val:[i18n.t('webHome.today_expenses_order_count'), i18n.t('webHome.today_expenses_order_count')]},
        {val:[i18n.t('webHome.total_expenses_moeny'), i18n.t('webHome.total_expenses_moeny')]},
        {val:[i18n.t('webHome.today_user_count'), i18n.t('webHome.total_user_count')]},
        {val:[i18n.t('webHome.today_income'), i18n.t('webHome.total_income')]},
    ];
    let date=[],day_count=[],total_count=[];
export default {
  name: 'charts',
  data() {
    let data = []

    for (let i = 0; i <= 360; i++) {
      let t = i / 180 * Math.PI
      let r = Math.sin(2 * t) * Math.cos(2 * t)
      data.push([r, i])
    }
    return {
      dateTime: [],
      buttons: [
        { name: this.$t('webHome.income_order_count'), active: true, type: 1 },
        { name: this.$t('webHome.income_moeny'), active: false, type: 2 },
        { name: this.$t('webHome.expenditureOrder'), active: false, type: 3 },
        { name: this.$t('webHome.expenditureOrderMoney'), active: false, type: 4 },
        { name: this.$t('webHome.user_count'), active: false, type: 5 },
        { name: this.$t('webHome.income'), active: false, type: 6 },
      ],
      chartVal: this.$t('webHome.income_order_count'),
      option: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: timeData[0].val,
          y: "bottom",
        },
        grid: {
          left: '3%',
          right: '50px',
          bottom: '50px',
          //   containLabel: true
        },
        xAxis: {
          type: 'category',
          //   boundaryGap: false,
          data: date
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: timeData[0].val[0],
            type: 'line',
              itemStyle: {
                  normal: {
                      color: "#409EFF",//折线点的颜色
                      lineStyle: {
                          color: "#409EFF"//折线的颜色
                      }
                  }
              },
            data:day_count
          },
          {
            name: timeData[0].val[1],
            type: 'line',
              itemStyle: {
                  normal: {
                      color: "#1ABC9C",//折线点的颜色
                      lineStyle: {
                          color: "#1ABC9C"//折线的颜色
                      }
                  }
              },
            data: total_count
          },
        ]
      },
        o_index:0
    };
  },
  components: {},
  computed: {},
  created() {
    const _this = this;
    this.init();
  },
  methods: {
      async init(){
          let data={
              pageNo:1,
              pageSize:999,
              start_time1:this.dateTime.length>0?(this.dateTime[0]/1000) + (24 * 60 * 60 - 1):'',
              end_time1:this.dateTime.length>0?(this.dateTime[1]/1000) + (24 * 60 * 60 - 1):''
          };
          const res = await home(data);
          date=[];day_count=[];total_count=[];
          let valueArr=[];
          if(this.o_index==0)valueArr=res.records.income_order_statistics;
          if(this.o_index==1)valueArr=res.records.income_order_moeny_statistics;
          if(this.o_index==2)valueArr=res.records.expenses_order_statistics;
          if(this.o_index==3)valueArr=res.records.expenses_order_moeny_statistics;
          if(this.o_index==4)valueArr=res.records.user_statistics;
          if(this.o_index==5)valueArr=res.records.profit_statistics;
          valueArr.forEach(item => {
              date.push(item.date);
              day_count.push(item.day_count);
              total_count.push(item.total_count);
          })
          this.option.xAxis.data=date;
          this.option.series[0].data=day_count;
          this.option.series[1].data=total_count;
      },
    changeType(item,index) {
      if(this.o_index==index)return;
      this.o_index = index;
      this.buttons.forEach(item => {
        item.active = false
      });
      item.active = true;
      this.option.legend.data=timeData[index].val;
      this.option.series.forEach((item,idx) => {
          item.name = timeData[index].val[idx];
      });
      this.init();
    },
    //选择时间
    change(e){
        this.dateTime=e?e:'';
        this.init();
    },
  },
};
</script>
<style scoped lang='less'>
.echarts {
  width: 100%;
  height: 400px;
}
</style>
