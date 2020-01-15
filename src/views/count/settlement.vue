<template>
    <div>
        <div class="mg-t-5 bfff pd-10">
            <cSearch ref="countSearch" :type="cSearch.type" @getValue="getValue"></cSearch>
            <div class="mg-t-5 pd-10 col3">{{$t('webSettlement.title')}}</div>
            <div class="orderBox colw">
                <ul>
                    <li v-for="(item,index) in orderList" :key="index">
                        <p class="font16">{{value[item.prop]*1}}</p>
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
                type: '3'
            },
            orderList: [
                { name: this.$t('webSettlement.orderNumber'), prop: 'order_count' },
                { name: this.$t('webSettlement.priceCount'), prop: 'order_moeny' },
                { name: this.$t('webHome.web_moeny'), prop: 'income_money' },
            ],
            value: {}
        }
    },
    components: {
        cSearch
    },
    created() {

    },
    methods: {
        getValue(val) {
          this.value = val ;
        },
    }
}
</script>

<style scoped lang="scss">
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
</style>
