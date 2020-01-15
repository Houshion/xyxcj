<template>
    <div>
        <div class="mg-t-5 bfff pd-10">
            <cSearch ref="countSearch" :type="cSearch.type" @getValue="getValue"></cSearch>
            <div class="mg-t-5 pd-10 col3">{{$t('webCountMember.title')}}</div>
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
                type: '8'
            },
            orderList: [
                { name: this.$t('webCountMember.memberNum'), data: '0' },
                { name: this.$t('webCountMember.priceCount'), data: '0' },
                { name: this.$t('webCountMember.giftPriceCount'), data: '0' },
                { name: this.$t('webCountMember.depositCount'), data: '0' },
            ]
        }
    },
    components: {
        cSearch
    },
    created() {

    },
    mounted() {
        this.$refs.countSearch.searchForm.shopChecked = true;
        this.$refs.countSearch.disabled = true;
    },
    methods: {
        getValue(val) {
            this.orderList[0].data = val[0].user_count * 1;
            this.orderList[1].data = val[0].money * 1;
            this.orderList[2].data = val[0].money_gift * 1;
            this.orderList[3].data = val[0].deposit * 1;
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
