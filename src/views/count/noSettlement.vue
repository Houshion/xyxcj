<template>
    <div id="washCarList">
        <div class="mg-t-5 bfff pd-10">
            <cSearch ref="countSearch" :type="cSearch.type" @getValue="getValue"></cSearch>
            <div class="mg-t-5 pd-10 col3">{{$t('webNoSettlement.title')}}</div>
            <div class="orderBox colw">
                <ul>
                    <li v-for="(item,index) in orderList" :key="index">
                        <p class="font16">{{item.data}}</p>
                        <p class="font12">{{item.name}}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import cSearch from "./components/countSearch";
export default {
    data() {
        return {
            cSearch: {
                type: '7'
            },
            orderList: [
                { name: this.$t('webNoSettlement.orderNumber'), data: '0' },
                { name: this.$t('webNoSettlement.priceCount'), data: '0' },
            ]
        }
    },
    components: {
        cSearch
    },
    created() {

    },
    methods: {
        getValue(val) {
            this.orderList[0].data = val.order_count * 1;
            this.orderList[1].data = val.order_moeny * 1;
        },
    }
}
</script>

<style scoped lang="scss">
#washCarList {
  .orderBox {
    padding: 40px;
    li {
      display: inline-block;
      width: 193px;
      height: 146px;
      background-color: rgba(25, 158, 216, 1);
      border-radius: 11px;
      text-align: center;
      padding-top: 20px;
      margin-right: 80px;
      p:last-child {
        margin-top: 30px;
      }
    }
  }
}
</style>
