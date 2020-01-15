<template>
    <div id="userRechargeRecord">
        <div class="mtb20">{{title}}</div>
        <div v-if="listData.length>0">
            <el-row :gutter="10" class="col9 cardBox" v-for="(item,index) in listData" :key="index">
                <el-row :gutter="10">
                    <el-col :span="6">{{$t('webMemberDetail.rechargeNumber')}}:{{item.number}}</el-col>
                    <el-col :span="6">{{$t('webMemberDetail.rechargeCtime')}}:{{item.ctime|timeStr}}</el-col>
                    <el-col
                        :span="6"
                    >{{$t('webMemberDetail.rechargeTaocanInfo')}}:{{item.taocan_info}}</el-col>
                    <el-col
                        :span="6"
                    >{{$t('webMemberDetail.rechargePaymentType')}}:{{item.payment_type}}</el-col>
                </el-row>
                <el-row :gutter="10" style="padding:0 8px;" class="mt10">
                    <el-col :span="4" class="col6">
                        {{$t('webMemberDetail.rechargePaymentMoney')}}:
                        <span
                            style="color: red"
                        >${{item.payment_money?item.payment_money:0}}</span>
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
                    :total="listData.length"
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
        console.log("list", this.listData)
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
