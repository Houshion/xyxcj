<template>
    <div>
        <div class="mg-t-5 bfff pd-10">
            <cSearch ref="countSearch" :type="cSearch.type" @getValue="getValue"></cSearch>
            <div class="mg-t-5 pd-10 col3">{{$t('webGathering.title')}}</div>
            <div class="orderBox colw">
                <ul>
                    <li v-for="(item,index) in orderList" :key="index" @click="goOrder">
                        <p class="font16">{{item.data}}</p>
                        <p class="font12">{{item.name}}</p>
                    </li>
                </ul>
            </div>
            <template v-if="showList">
                <c-table
                    :tableTitle="tableTitle"
                    :tableData="stats_list"
                    :col="4"
                    :list="true"
                    width="100"
                >
                    <template slot="payment_typeid" slot-scope="slot">{{slot.data.name}}</template>
                    <template slot="config" slot-scope="slot">
                        <el-button type="text" @click="checkWater(slot.data.payment_typeid)">查看详情</el-button>
                    </template>
                </c-table>
            </template>
        </div>
    </div>
</template>

<script>
import { paymentIndex } from "@/api/payWay";
import cSearch from "./components/countSearch";
export default {
    data() {
        return {
            cSearch: {
                type: '5'
            },
            orderList: [
                { name: this.$t('webGathering.orderNumber'), data: '0' },
                { name: this.$t('webGathering.priceCount'), data: '0' },
            ],
            tableTitle: [
                {
                    prop: "payment_typeid", // 对应接口返回字段
                    label: "付款方式", //title名称
                    custom: true // 是否使用插槽自定义单元格内容，类型为Boolean，当为true时，需用template插入，为false时直接输出字段内容
                },
                {
                    prop: "total",
                    label: "笔数",
                },
                {
                    prop: "money",
                    label: "总数",
                },
                {
                    prop: "config", // 对应接口返回字段
                    label: "操作", //title名称
                    custom: true // 是否使用插槽自定义单元格内容，类型为Boolean，当为true时，需用template插入，为false时直接输出字段内容
                }
            ],
            stats_list: [
                { payment_typeid: 2, total: 40, money: "3013.00" },
                { payment_typeid: 19, total: 1, money: "16.00" }
            ],
            payOptions: [],
            showList: false
        }
    },
    components: {
        cSearch
    },
    created() {
        paymentIndex({
            pageNo: 1,
            pageSize: 999,
        }).then(res => {
            this.payOptions = res.records
        });
    },
    mounted() {

        console.log()
    },
    methods: {
        getValue(val) {
            this.showList = this.$refs.countSearch.searchForm.payArr.length > 0 ? true : false
            // val = {
            //     order_count: 41,
            //     order_moeny: "3029.00",
            //     stats_list: [
            //         { payment_typeid: 2, total: 40, money: "3013.00" },
            //         { payment_typeid: 19, total: 1, money: "16.00" }
            //     ]
            // }
            this.orderList[0].data = val.order_count * 1;
            this.orderList[1].data = val.order_moeny * 1;
            val.stats_list.forEach(item => {
                this.payOptions.forEach(val => {
                    if (item.payment_typeid == val.id) {
                        item.name = val.title
                    }
                });
            });
            val.stats_list.push(
                { name: '总结', payment_typeid: 0, total: val.order_count, money: val.order_moeny },
            )
            this.stats_list = val.stats_list
        },
        goOrder(val) {
            // let payway = this.$refs.countSearch.searchForm.payArr
            // this.$router.push({
            //     name: 'order/water',
            //     query: {
            //         payway: payway
            //     }
            // })
        },
        checkWater(payway) {
            console.log(payway)
            this.$router.push({
                name: 'order/water',
                query: {
                    payway: payway
                }
            })
        }
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
