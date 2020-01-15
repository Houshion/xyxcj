<template>
  <div class="pd-10 bfff">
    <div class="topList flexAround">
      <template v-for="(item,index) in records">
        <div class="item font13 flex tac" v-if="userInfo.type==1" :key="index">
          <div class="wd-100 overfont">{{item.title}}</div>
          <div class="wd-100 font12 overfont mt10">{{index>4?$t('webWashCar.today'):''}}{{item.val}}</div>
          <div
            class="wd-100 font12 overfont mt10"
            v-if="index>4"
          >{{$t('webWashCar.months')}}{{item.val1}}</div>
        </div>
        <div class="item font13 flex tac" v-else :key="index">
          <div class="wd-100 overfont">{{item.title}}</div>
          <div class="wd-100 font12 overfont mt10">{{$t('webWashCar.today')}}{{item.val}}</div>
          <div class="wd-100 font12 overfont mt10">{{$t('webWashCar.months')}}{{item.val1}}</div>
        </div>
      </template>
    </div>
    <div class="table mg-t-20">
      <indextable></indextable>
    </div>
    <charts></charts>
  </div>
</template>

<script>
import { indextable, charts } from "./script";
import { mapGetters } from 'vuex'
import { home } from '@/api/index';
export default {
  // name: 'indextable',
  components: {
    indextable,
    charts
  },
  computed: {
    ...mapGetters([
      'name',
      'userInfo'
    ])
  },
  data() {
    return {
      records: [
        // {title:this.$t('webHome.user_count'),val:'0'+this.$t('webHome.individual')},
        // {title:this.$t('webHome.income_order_count'),val:'0'+this.$t('webHome.bill')},
        // {title:this.$t('webHome.income_moeny'),val:'0'+this.$t('webHome.CNY')},
        // {title:this.$t('webHome.expenses_order_count'),val:'0'+this.$t('webHome.bill')},
        // {title:this.$t('webHome.expenses_order_money'),val:'0'+this.$t('webHome.CNY')},
        // {title:this.$t('webHome.web_moeny'),val:'0'+this.$t('webHome.CNY')},
        // {title:this.$t('webHome.shop_count'),val:'0'+this.$t('webHome.individual')},
        // {title:this.$t('webHome.deveci_count'),val:'0'+this.$t('webHome.platform')},
        { title: this.$t('webHome.user_all_count'), val: '' },
        { title: this.$t('webHome.user_auth_count'), val: '' },
        { title: this.$t('webHome.user_unauth_count'), val: '' },
        { title: this.$t('webHome.shop_count'), val: '' },
        { title: this.$t('webHome.deveci_count'), val: '' },
        { title: this.$t('webHome.income_order_count'), val: '' },
        { title: this.$t('webHome.income_moeny'), val: '' },
        { title: this.$t('webHome.earnings'), val: '' },
        { title: this.$t('webHome.wash_order_num'), val: '' },
        { title: this.$t('webHome.wash_order_count'), val: '' },
      ]
    }
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const res = await home({});
      console.log(this.userInfo.type)
      const records = res.records;
      if (this.userInfo.type == 1) {
        this.records[0].val = records.user_count + this.$t('webHome.individual');
        this.records[1].val = records.user_auth_count + this.$t('webHome.individual');
        this.records[2].val = records.user_noauth_count + this.$t('webHome.individual');
        this.records[3].val = records.shop_count + this.$t('webHome.individual');
        this.records[4].val = (records.device_online + records.device_offline) + this.$t('webHome.platform');
        this.records[5].val = records.today_income_order_count + this.$t('webHome.bill');
        this.records[6].val = records.today_income_moeny + this.$t('webHome.CNY');
        this.records[7].val = records.today_web_moeny + this.$t('webHome.CNY');
        this.records[8].val = records.today_wash_order_count + this.$t('webHome.bill');
        this.records[9].val = records.today_wash_moeny + this.$t('webHome.CNY');
        this.records[5].val1 = records.month_income_order_count + this.$t('webHome.bill');
        this.records[6].val1 = records.month_income_moeny + this.$t('webHome.CNY');
        this.records[7].val1 = records.month_web_moeny + this.$t('webHome.CNY');
        this.records[8].val1 = records.month_wash_order_count + this.$t('webHome.bill');
        this.records[9].val1 = records.month_wash_moeny + this.$t('webHome.CNY');
      } else {
        this.records = [
          { title: this.$t('webHome.income_order_count'), val: '' },
          { title: this.$t('webHome.income_moeny'), val: '' },
          { title: this.$t('webHome.wash_order_num'), val: '' },
          { title: this.$t('webHome.wash_order_count'), val: '' },
        ]

        this.records[0].val = records.today_income_order_count + this.$t('webHome.bill');
        this.records[1].val = records.today_income_moeny + this.$t('webHome.CNY');
        this.records[2].val = records.today_wash_order_count + this.$t('webHome.bill');
        this.records[3].val = records.today_wash_moeny + this.$t('webHome.CNY');
        this.records[0].val1 = records.month_income_order_count + this.$t('webHome.bill');
        this.records[1].val1 = records.month_income_moeny + this.$t('webHome.CNY');
        this.records[2].val1 = records.month_wash_order_count + this.$t('webHome.bill');
        this.records[3].val1 = records.month_wash_moeny + this.$t('webHome.CNY');

      }
    },
  }
}
</script>

<style lang="scss" scoped>
.item {
  width: calc((100% - 1rem) / 5);
  margin-bottom: 0.2rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0.2rem;
  height: 1.6rem;
  border-radius: 10px;
  color: #ffffff;
  &:nth-child(1),
  &:nth-child(9) {
    background: rgba(251, 98, 96, 1);
  }
  &:nth-child(2),
  &:nth-child(4) {
    background: rgba(255, 102, 153, 1);
  }
  &:nth-child(3),
  &:nth-child(5) {
    background: rgba(88, 163, 247, 1);
  }
  &:nth-child(6),
  &:nth-child(10) {
    background: rgba(255, 153, 51, 1);
  }
  &:nth-child(7) {
    background: rgba(79, 193, 176, 1);
  }
  &:nth-child(8) {
    background: rgba(101, 113, 128, 1);
  }
}
</style>
