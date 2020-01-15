<template>
    <div id="countSearch">
        <el-form :model="searchForm">
            <el-row :gutter="10" class="mg-t-5">
                <el-row :gutter="10">
                    <el-col :span="8" v-if="type!='8'">
                        <el-form-item :label="$t('webWashCar.timeCount')">
                            <template v-for="(item,index) in shortcuts">
                                <el-button
                                    v-if="index==o_index"
                                    type="primary"
                                    @click="chooseDate(item,index)"
                                >{{item.text}}</el-button>
                                <el-button v-else @click="chooseDate(item,index)">{{item.text}}</el-button>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-date-picker
                            class="mg-r-10"
                            v-model="searchForm.dateTime"
                            type="daterange"
                            :range-separator="$t('webBaseMessage.date_separator')"
                            :start-placeholder="$t('webBaseMessage.date_start')"
                            :end-placeholder="$t('webBaseMessage.date_end')"
                            value-format="timestamp"
                            @change="change"
                            style="width: 90%"
                        ></el-date-picker>
                    </el-col>
                    <el-col :span="4" v-if="type == 3">
                        <el-form-item>
                            <el-select
                                v-model="searchForm.goods_type"
                                :placeholder="$t('webGoodsList.search_goods_type')"
                            >
                                <el-option
                                    v-for="item in goods_options"
                                    :key="item.type_id"
                                    :label="item.type_name"
                                    :value="item.type_id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="type == 3 ? 4 : 8" class="tar">
                        <search-btn @search="search" @reset="reset"></search-btn>
                    </el-col>
                </el-row>
                <el-row :gutter="10" v-if="userInfo.type==1">
                    <el-col :span="6">
                        <el-form-item :label="$t('webWashCar.shopChecked')">
                            <el-checkbox
                                v-model="searchForm.shopChecked"
                                :disabled="disabled"
                                @change="shopCheckedChange"
                            >{{$t('webWashCar.shopCheckedItem')}}</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="type!='8'">
                        <el-select
                            class="w100"
                            v-model="searchForm.shop_id"
                            multiple
                            :placeholder="$t('webWashCar.shop_id')"
                            @change="shopChoseChange"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.shop_id"
                                :label="item.shop_name"
                                :value="item.shop_id"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row :gutter="10" v-if="type!='8'">
                    <el-col :span="5" v-if="type=='1'" v-show="false">
                        <el-form-item :label="$t('webWashCar.payWayLabel')">
                            <el-checkbox
                                v-model="searchForm.payWay"
                                disabled
                            >{{$t('webWashCar.payWay')}}</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <div v-else-if="type !='6' && type!=7">
                        <el-col :span="6">
                            <el-form-item :label="$t('webWashCar.payWayLabel')">
                                <el-checkbox
                                    v-model="searchForm.payChecked"
                                    @change="payCheckedChange"
                                >{{$t('webWashCar.payChecked')}}</el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-select
                                class="w100"
                                v-model="searchForm.payArr"
                                multiple
                                :placeholder="$t('webWashCar.payCheckedItem')"
                                @change="payChoseChange"
                            >
                                <el-option
                                    v-for="item in payOptions"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </div>
                </el-row>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getshop } from "@/api/merchant";
import { paymentIndex } from "@/api/payWay";
import { carwash, unliquidated, userstatistics } from "@/api/count";
import { goodsTypeIndex } from "@/api/goods";
export default {
    name: 'countSearch',
    props: {
        type: String,
    },
    data() {
        return {
            disabled: false,
            searchForm: {
                date_type: '1',
                dateTime: '',
                shopChecked: false,
                payWay: true,
                shop_id: [],
                start_time: '',
                end_time: '',
                payArr: [],
                payChecked: true,
                goods_type: ''
            },
            shortcuts: [
                {
                    text: this.$t('webWashCar.today'),
                    type: '1',
                }, {
                    text: this.$t('webWashCar.weeks'),
                    type: '2',
                }, {
                    text: this.$t('webWashCar.months'),
                    type: '3',
                },
                {
                    text: this.$t('webWashCar.years'),
                    type: '4',
                }
            ],
            options: [],
            goods_options: [],
            payOptions: [],
            o_index: 0
        }
    },
    created() {
        this.init();
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    methods: {
        async init() {
            console.log(this.type)
            const form = {
                pageNo: 1,
                pageSize: 999,
            };
            if (this.userInfo.type == 1) {
                let result = await getshop({});
                this.options = result.records;
            }
            let res = await paymentIndex(form);
            if (this.type == '2' || this.type == '5') {
                let newArr = new Array();
                res.records.forEach((item, index) => {
                    if (item.id != 1 && item.id != 3) {
                        newArr.push(item)
                    }
                })
                this.payOptions = newArr
            } else {
                this.payOptions = res.records;
            }
            if (this.type == '3') {
                goodsTypeIndex(form).then(res => {
                    this.goods_options = res.records;
                })
            }
            this.getList();

            this.payOptions.forEach(item => {
                this.searchForm.payArr.push(item.id);
            })
        },
        async getList() {
            this.loading = true;
            let formList = {};
            let resList;
            if (this.type == '7') {//未结算的销售订单
                formList = {
                    date_type: this.searchForm.date_type,
                }
                resList = await unliquidated(formList);
                console.log('7=', resList)
            } else if (this.type == '8') {
                this.searchForm.shop_id = [];
                this.options.forEach(item => {
                    this.searchForm.shop_id.push(item.shop_id);
                })
                formList = {
                    shop_id: this.searchForm.shop_id,
                }
                resList = await userstatistics(formList);
                console.log('8=', resList)
            } else {
                formList = {
                    date_type: this.searchForm.date_type,
                    goods_type: this.searchForm.goods_type
                }
                formList.type = this.type;
                resList = await carwash(formList);
                console.log(resList)
            }
            this.$emit("getValue", resList);
            this.loading = false;
        },
        chooseDate(item, index) {
            console.log(item)
            if (index == this.o_index) return;
            this.o_index = index;
            this.searchForm.date_type = item.type;
        },
        change(e) {
            if (e) {
                this.searchForm.date_type = '5';
                this.searchForm.start_time = e[0];
                this.searchForm.end_time = e[1];
                this.o_index = -1;
            } else {
                this.o_index = 0;
                this.searchForm.start_time = '';
                this.searchForm.end_time = '';
                this.searchForm.date_type = this.shortcuts[this.o_index].type;
            }
        },
        shopCheckedChange(e) {//全选所有网点
            if (e) {
                this.searchForm.shop_id = [];
                this.options.forEach(item => {
                    this.searchForm.shop_id.push(item.shop_id);
                })
            } else {
                this.searchForm.shop_id = [];
            }
        },
        shopChoseChange(e) {
            if (e.length == this.options.length) {
                this.searchForm.shopChecked = true;
            } else {
                this.searchForm.shopChecked = false;
            }
        },
        payCheckedChange(e) {//所有支付方式
            console.log(e)
            if (e) {
                this.searchForm.payArr = [];
                this.payOptions.forEach(item => {
                    this.searchForm.payArr.push(item.id);
                })
            } else {
                this.searchForm.payArr = [];
            }
        },
        payChoseChange(e) {//选择支付方式
            console.log(e)
            if (e.length == this.payOptions.length) {
                this.searchForm.payChecked = true;
            } else {
                this.searchForm.payChecked = false;
            }
        },
        async search() {
            const form = {
                type: this.type,
                date_type: this.searchForm.date_type,
                shop_id: this.searchForm.shop_id.join(','),
                keyname: this.searchForm.payArr.join(','),
                start_time: this.searchForm.start_time ? (this.searchForm.start_time / 1000) + (24 * 60 * 60 - 1) : '',
                end_time: this.searchForm.end_time ? (this.searchForm.end_time / 1000) + (24 * 60 * 60 - 1) : '',
                goods_type: this.searchForm.goods_type
            };
            console.log(form)
            let res = await carwash(form);
            this.$emit("getValue", res);
            console.log(res)
        },
        async reset() {
            this.o_index = 0;
            this.searchForm = {
                date_type: '1',
                dateTime: '',
                shopChecked: false,
                payWay: true,
                shop_id: [],
                start_time: '',
                end_time: '',
                payArr: [],
                payChecked: false
            }
            let res = await this.getList();
            this.$emit("getValue", res);
        }
    }
}
</script>

<style scoped>
</style>
