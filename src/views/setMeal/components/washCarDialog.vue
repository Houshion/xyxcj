<template>
    <div id="washCarDialog">
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="rechargeForm" :rules="rules" ref="rechargeForm">
                <el-form-item label="" prop="name">
                    <el-input
                        class="wd-50"
                        v-model="rechargeForm.name"
                        :placeholder="$t('webWashCarMeal.rulesName')"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    :label="$t('webWashCarMeal.rulesChooseFuncton')"
                    prop="choose_functon"
                >
                    <el-checkbox-group v-model="rechargeForm.choose_functon">
                        <el-checkbox
                            v-for="item in check_options"
                            :key="item.id"
                            :label="item.id"
                            :value="item.id"
                        >{{item.title}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="" prop="price">
                    <el-input
                        class="wd-50"
                        v-model="rechargeForm.price"
                        :placeholder="$t('webWashCarMeal.rulesPrice')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="times">
                    <el-input
                        class="wd-50"
                        v-model="rechargeForm.times"
                        :placeholder="$t('webWashCarMeal.rulesTimes')"
                    >
                        <template slot="append">{{$t('webWashCarMeal.minute')}}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="time_price">
                    <el-input
                        class="wd-50"
                        v-model="rechargeForm.time_price"
                        :placeholder="$t('webWashCarMeal.rulesTimePrice')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="userTeam">
                    <el-select
                        class="wd-50"
                        v-model="rechargeForm.userTeam"
                        multiple
                        :placeholder="$t('webWashCarMeal.rulesUserTeam')"
                    >
                        <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('webWashCarMeal.rulesChoose_tc_status')">
                    <el-radio
                        v-model="rechargeForm.choose_tc_status"
                        :label="1"
                    >{{$t('webWashCarMeal.statusOpen')}}</el-radio>
                    <el-radio
                        v-model="rechargeForm.choose_tc_status"
                        :label="0"
                    >{{$t('webWashCarMeal.statusStop')}}</el-radio>
                </el-form-item>
                <el-form-item :label="$t('webWashCarMeal.rulesSense_status')">
                    <el-radio
                        v-model="rechargeForm.sense_status"
                        :label="1"
                    >{{$t('webWashCarMeal.statusOpen')}}</el-radio>
                    <el-radio
                        v-model="rechargeForm.sense_status"
                        :label="0"
                    >{{$t('webWashCarMeal.statusStop')}}</el-radio>
                </el-form-item>
                <el-form-item :label="$t('webWashCarMeal.rulesTC_status')">
                    <el-radio
                        v-model="rechargeForm.tc_status"
                        :label="1"
                    >{{$t('webWashCarMeal.statusOpen')}}</el-radio>
                    <el-radio
                        v-model="rechargeForm.tc_status"
                        :label="0"
                    >{{$t('webWashCarMeal.statusStop')}}</el-radio>
                </el-form-item>
                <el-form-item label="">
                    <el-checkbox
                        v-model="rechargeForm.netWorkChecked"
                        @change="allShopChange"
                    >{{$t('webWashCarMeal.rulesNetWorkChecked')}}</el-checkbox>
                    <el-select
                        class="wd-50"
                        v-model="rechargeForm.netWork"
                        multiple
                        :placeholder="$t('webWashCarMeal.rulesNetWork')"
                        v-if="!rechargeForm.netWorkChecked"
                    >
                        <el-option
                            v-for="item in netWokOptions"
                            :key="item.shop_id"
                            :label="item.shop_name"
                            :value="item.shop_id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="min_price">
                    <el-input
                        class="wd-80"
                        v-model="rechargeForm.min_price"
                        :placeholder="$t('webWashCarMeal.rulesMin_price')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="checkedCities">
                    <el-checkbox
                        :indeterminate="rechargeForm.isIndeterminate"
                        v-model="rechargeForm.checkAll"
                        @change="handleCheckAllChange"
                    >{{$t('webWashCarMeal.rulesCheckAll')}}</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group
                        v-model="rechargeForm.checkedCities"
                        @change="handleCheckedCitiesChange"
                    >
                        <el-checkbox
                            class="wd-70"
                            v-for="(city,idx) in cities"
                            :label="city"
                            :key="idx"
                        >
                            <span class="mr20">{{city.title}}</span>
                            <el-time-picker
                                is-range
                                v-model="city.value"
                                range-separator="-"
                                :start-placeholder="$t('webBaseMessage.time_start')"
                                :end-placeholder="$t('webBaseMessage.time_end')"
                                :placeholder="$t('webWashCarMeal.rulesValue')"
                                format="HH:mm"
                            ></el-time-picker>
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
                <el-button type="primary" @click="ruleConfirm">{{$t('webBaseBtn.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { carDetail, carAdd } from "@/api/setMeal";
export default {
    name: 'washCarDialog',
    data() {
        return {
            show: false,
            id: '',
            rechargeForm: {
                price: '0',
                name: '',
                times: '',
                time_price: '0',
                choose_functon: [],
                sense_status: 1,
                choose_tc_status: 1,
                tc_status: 1,
                min_price: '0',
                checkAll: false,
                checkedCities: [],
                isIndeterminate: true,
                netWorkChecked: true,
                netWork: [],
                userTeam: [],
            },
            cities: [
                { title: this.$t('webBaseMessage.monday'), id: 1, value: [new Date(1970, 1, 1, 0, 0), new Date(1970, 1, 1, 23, 59)] },
                { title: this.$t('webBaseMessage.tuesday'), id: 2, value: [new Date(1970, 1, 1, 0, 0), new Date(1970, 1, 1, 23, 59)] },
                { title: this.$t('webBaseMessage.wednesday'), id: 3, value: [new Date(1970, 1, 1, 0, 0), new Date(1970, 1, 1, 23, 59)] },
                { title: this.$t('webBaseMessage.thursday'), id: 4, value: [new Date(1970, 1, 1, 0, 0), new Date(1970, 1, 1, 23, 59)] },
                { title: this.$t('webBaseMessage.friday'), id: 5, value: [new Date(1970, 1, 1, 0, 0), new Date(1970, 1, 1, 23, 59)] },
                { title: this.$t('webBaseMessage.saturday'), id: 6, value: [new Date(1970, 1, 1, 0, 0), new Date(1970, 1, 1, 23, 59)] },
                { title: this.$t('webBaseMessage.sunday'), id: 7, value: [new Date(1970, 1, 1, 0, 0), new Date(1970, 1, 1, 23, 59)] },
            ],

            rules: {
                name: [
                    { required: true, message: this.$t('webWashCarMeal.rulesName'), trigger: 'blur' }
                ],
                price: [
                    { required: true, message: this.$t('webWashCarMeal.rulesPrice'), trigger: 'blur' }
                ],
                times: [
                    { required: true, message: this.$t('webWashCarMeal.rulesTimes'), trigger: 'blur' }
                ],
                time_price: [
                    { required: true, message: this.$t('webWashCarMeal.rulesTimePrice'), trigger: 'blur' }
                ],
                min_price: [
                    { required: true, message: this.$t('webWashCarMeal.rulesMin_price'), trigger: 'blur' }
                ],
                choose_functon: [
                    { required: true, message: this.$t('webWashCarMeal.rulesChooseFuncton'), trigger: 'change' }
                ],
                userTeam: [
                    { required: true, message: this.$t('webWashCarMeal.rulesUserTeam'), trigger: 'change' }
                ],
                checkedCities: [
                    { required: true, message: this.$t('webWashCarMeal.rulesValue'), trigger: 'change' }
                ],

            },
            check_options: [],
            netWokOptions: [],
            options: [],
            upload: false
        }
    },
    props: {
        title: String
    },
    watch: {
        upload(val) {
            this.init();
        }
    },
    created() {
        const _this = this
        this.init();
        document.onkeydown = function (e) { // 回车提交表单
            // 兼容FF和IE和Opera
            var theEvent = window.event || e;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                _this.ruleConfirm()
            }
        }
    },
    mounted() {
    },
    methods: {
        async init() {
            //if (!this.id) return false
            const res = await carDetail({ id: this.id });
            console.log(res);
            this.check_options = res.chargingtype;
            this.options = res.member_group;
            this.netWokOptions = res.shop;
            this.rechargeForm.netWork = [];
            this.netWokOptions.forEach(item => {
                this.rechargeForm.netWork.push(item.shop_id);
            })
            if (this.id) {//编辑
                const data = res.find;
                const choose_functon = [], userTeam = [], netWork = [];
                if (data.chargingtype) data.chargingtype.split(',').forEach(item => choose_functon.push(item * 1));
                if (data.group_ids) data.group_ids.split(',').forEach(item => userTeam.push(item * 1));
                if (data.shop_ids) data.shop_ids.split(',').forEach(item => netWork.push(item * 1));
                let allow_time = [];
                if (data.allow_time) {
                    let obj = JSON.parse(data.allow_time)
                    for (let key of Object.keys(obj)) {
                        for (let i in this.cities) {
                            if (key == this.cities[i].id) {
                                this.cities[i].value = [
                                    new Date(1970, 1, 1, obj[key].starttime.split(':')[0] * 1, obj[key].starttime.split(':')[1] * 1),
                                    new Date(1970, 1, 1, obj[key].endtime.split(':')[0] * 1, obj[key].endtime.split(':')[1] * 1)
                                ]
                                console.log(obj[key].starttime.split(':')[0])
                                allow_time.push(this.cities[i]);
                            }
                        }
                    }
                }
                this.rechargeForm = {
                    name: data.title,
                    choose_functon,
                    price: data.normal_price,
                    time_price: data.over_price,
                    times: data.keep_minutes,
                    userTeam,
                    sense_status: data.sense_status,
                    choose_tc_status: data.over_status,
                    tc_status: data.normal_status,
                    netWorkChecked: data.is_allshop ? true : false,
                    checkAll: data.is_alltime ? true : false,
                    netWork,
                    min_price: data.min_price,
                    checkedCities: allow_time
                }
                console.log(this.rechargeForm)
            }
        },
        async ruleConfirm() {
            console.log(this.rechargeForm)
            let obj = {};
            this.rechargeForm.checkedCities.forEach(item => {
                const key = item.id.toString();
                let times = {
                    starttime: this.handleTime(item.value[0]),
                    endtime: this.handleTime(item.value[1])
                }
                Object.assign(obj, { [key]: times })
            })
            console.log(obj)
            this.$refs['rechargeForm'].validate(async valid => {
                if (valid) {
                    const data = this.rechargeForm;
                    const form = {
                        id: this.id ? this.id : '',
                        title: data.name,
                        chargingtype: data.choose_functon,
                        normal_price: data.price,
                        over_price: data.time_price,
                        keep_minutes: data.times,
                        group_ids: data.userTeam,
                        over_status: data.choose_tc_status,
                        sense_status: data.sense_status,
                        normal_status: data.tc_status,
                        is_allshop: data.netWorkChecked ? 1 : 0,
                        shop_ids: data.netWork,
                        is_alltime: data.checkAll ? 1 : 0,
                        min_price: data.min_price,
                        allow_time: data.checkAll ? JSON.stringify(obj) : ''
                    }
                    console.log(form)
                    const res = await carAdd(form);
                    this.$message({
                        type: 'success',
                        // message: this.id ? '修改成功!' : '添加成功!'
                        message: this.$t('webBaseTips.editConfirm')
                    });
                    this.$emit("uploadEvent", '1');
                    this.show = false;
                }
            });
        },
        handleCheckAllChange(val) {
            this.rechargeForm.checkedCities = val ? this.cities : [];
            this.rechargeForm.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.rechargeForm.checkAll = checkedCount === this.cities.length;
            this.rechargeForm.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        cancel() {
            this.$refs["rechargeForm"].resetFields();
            this.show = false;
        },
        allShopChange(e) {//监听全部网点状态
            if (e) {
                this.rechargeForm.netWork = [];
                this.netWokOptions.forEach(item => {
                    this.rechargeForm.netWork.push(item.shop_id);
                })
            } else {
                this.rechargeForm.netWork = [];
            }
        },
        handleTime(val) {
            const start = val.getHours() < 9 ? '0' + val.getHours() : val.getHours();
            const end = val.getMinutes() < 9 ? '0' + val.getMinutes() : val.getMinutes();
            return start + ':' + end;
        }
    }
}
</script>

<style scoped>
</style>
