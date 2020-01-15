<template>
    <div id="userBuyRecord">
        <div class="mtb20">{{title}}</div>
        <div v-if="listData.length>0">
            <el-row :gutter="10" class="col9 cardBox" v-for="(item,index) in listData" :key="index">
                <el-row :gutter="10">
                    <el-col :span="4">{{$t('webMemberDetail.buyNumber')}}：{{item.number}}</el-col>
                    <el-col :span="20">{{item.contents}}</el-col>
                    <!-- <el-col :span="6">使用套餐:xxx套餐（30分钟/100$）</el-col>
                    <el-col :span="4">结束时间：2019-05-26 34:18</el-col>
                    <el-col :span="6">使用时长：28分钟</el-col>-->
                </el-row>
                <el-row :gutter="10" style="padding:0 8px;" class="mt10">
                    <el-col :span="4" class="col6">
                        {{$t('webMemberDetail.buyPaymentMoney')}}:
                        <span style="color: red">${{item.payment_money}}</span>
                    </el-col>
                </el-row>
            </el-row>
            <div class="ptb20">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageMsg.page"
                    :page-sizes="pageMsg.sizes"
                    :page-size="pageMsg.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageMsg.total"
                ></el-pagination>
            </div>
        </div>
        <div v-else>
            <el-row class="col9 cardBox">
                <el-col :span="24">{{$t('webBaseMessage.noData')}}</el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        listData: Array
    },
    name: 'buyRecord',
    data() {
        return {
            pageMsg: {
                page: 1,
                size: 10,
                sizes: [10, 20, 50, 100],
                total: 0
            },
        }
    },
    created() {
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
    }
}
</script>

<style scoped>
</style>
