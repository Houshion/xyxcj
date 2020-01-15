<!-- userList -->
<template>
    <div id="userList">
        <div class="mg-t-5 bfff pd-10">
            <el-form :model="carForm">
                <el-row>
                    <el-col>
                        <search-btn @search="search" @reset="reset"></search-btn>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="mg-t-5">
                    <el-col :span="3">
                        <el-input
                            :placeholder="$t('webCarList.searchNickname')"
                            v-model="carForm.nickname"
                        ></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input
                            :placeholder="$t('webCarList.searchMobile')"
                            v-model="carForm.mobile"
                        ></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-select
                            v-model="carForm.cartype"
                            :placeholder="$t('webCarList.searchCartype')"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-input
                            :placeholder="$t('webCarList.searchBrand')"
                            v-model="carForm.brand"
                        ></el-input>
                        <!-- <el-select v-model="carForm.brand" placeholder="车辆品牌">
                            <el-option
                                v-for="item in options2"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>-->
                    </el-col>
                    <el-col :span="3">
                        <el-date-picker
                            class="mg-r-10"
                            v-model="carForm.dateTime"
                            type="daterange"
                            :range-separator="$t('webBaseMessage.date_separator')"
                            :start-placeholder="$t('webBaseMessage.date_start')"
                            :end-placeholder="$t('webBaseMessage.date_end')"
                        ></el-date-picker>
                    </el-col>
                </el-row>
            </el-form>
            <o-table
                class="mg-t-5"
                :tableData="tableData"
                :tableTitle="tableTitle"
                :tableSlot="tableSlot"
                :pageMsg="pageMsg"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
            >
                <template
                    slot="car_type"
                    slot-scope="slot"
                >{{slot.data.car_type==1?$t('webCarType.bus'):slot.data.car_type==2?$t('webCarType.car'):$t('webCarType.taxi')}}</template>
                <template slot="pic" slot-scope="slot">
                    <!-- <img :src="slot.data.pic" alt=""> -->
                    <el-popover placement="right" width="400" trigger="click">
                        <div class="imgBox">
                            <img
                                :src="goods_img"
                                style="width: 375px;height: 250px;"
                                v-for="(goods_img,index) in slot.data.pic"
                                :key="index"
                            >
                        </div>
                        <el-link slot="reference">
                            {{$t('webBaseBtn.check')}}
                            <i class="el-icon-view el-icon--right"></i>
                        </el-link>
                    </el-popover>
                </template>
                <template slot="ctime" slot-scope="slot">{{slot.data.ctime|timeStr}}</template>
            </o-table>
        </div>
    </div>
</template>
<script>
import { getList } from "@/api/members/car";
export default {
    name: 'userList',
    data() {
        return {
            carForm: {
                pageNo: 1,
                pageSize: 10,
                nickname: this.$route.query.nickname ? this.$route.query.nickname : '',
                mobile: '',
                cartype: '',
                brand: '',
                dateTime: '',
                stime: '',
                etime: '',
            },
            options: [{
                value: 0,
                label: this.$t('webCarType.bus')
            }, {
                value: 2,
                label: this.$t('webCarType.car')
            }, {
                value: 3,
                label: this.$t('webCarType.taxi')
            }],
            tableTitle: [
                { prop: "id", label: this.$t('webCarList.id'), width: "80" },
                { prop: "nickname", label: this.$t('webCarList.nickname'), width: "auto" },
                { prop: "mobile", label: this.$t('webCarList.mobile'), width: "120" },
                { prop: "car_type", label: this.$t('webCarList.car_type'), width: "120", custom: true },
                { prop: "brand", label: this.$t('webCarList.brand'), width: "120" },
                { prop: "product", label: this.$t('webCarList.product'), width: "120" },
                { prop: "seat", label: this.$t('webCarList.seat'), width: "100" },
                { prop: "car_number", label: this.$t('webCarList.car_number'), width: "120" },
                { prop: "pic", label: this.$t('webCarList.pic'), width: "120", custom: true },
                { prop: "ctime", label: this.$t('webCarList.ctime'), width: "100", custom: true },
            ],
            //   表头信息，prop对应
            tableSlot: [],
            tableData: [],
            pageMsg: {
                page: 1,
                status: true,
                size: 10,
                sizes: [10, 20, 50, 100],
            },
            loading: false
        };
    },
    components: {},
    computed: {},
    created() {
        const _this = this;
        this.init()
    },
    methods: {
        async init() {
            let res = await getList(this.carForm);
            res.records.forEach(item => {
                let pics = item.pic.split(",")
                let images = []
                pics.forEach(itemPic => {
                    images.push(itemPic);
                })
                item.pic = images
            });
            this.tableData = res.records
            this.pageMsg.total = res.total
        },
        search() {
            this.carForm.pageNo = 1;
            if (this.carForm.dateTime) {
                this.carForm.stime = this.carForm.dateTime[0].valueOf()
                this.carForm.etime = this.carForm.dateTime[1].valueOf()
            }
            this.init()
        },
        reset() {
            this.carForm = {
                nickname: '',
                mobile: '',
                cartype: '',
                brand: '',
                dateTime: '',
                stime: '',
                etime: '',
                pageSize: this.pageMsg.size
            }
        },
        pageChange(val) {
            this.invitationForm.pageNo = val
            this.init()
        },
        sizeChange(val) {
            this.invitationForm.pageSize = val
            this.init()
        },
    }
};
</script>
<style scoped lang='less'>
</style>
