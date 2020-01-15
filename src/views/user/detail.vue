<template>
    <div id="userDetail">
        <div class="mg-t-5 bfff pd-10">
            <!-- <div class="mtb20">基础信息</div> -->
            <div class="mtb20">{{$t('HomeMainPage.message')}}</div>
            <div>
                <el-row>
                    <el-col :span="3">
                        <div class="col9 tac box1">
                            <p>{{$t('webMemberDetail.detailTitle')}}</p>
                            <p class="imgBox">
                                <!--<img :src="user.circleUrl" alt="">-->
                                <omg @goUpload="upload" type="single" :singleImg="user.singleImg"></omg>
                            </p>
                            <p>{{user.info.nickname}}</p>
                        </div>
                        <div class="tac" style="margin-top: 210px">
                            <el-button type="primary" @click="saveMsg">{{$t('webBaseBtn.save')}}</el-button>
                        </div>
                    </el-col>
                    <el-col :span="9" class="col9 box2">
                        <el-row
                            :gutter="10"
                            class="group_box"
                            v-for="(item,index) in user.info"
                            :key="index"
                        >
                            <el-col :span="8" class="title" style="padding: 12px 18px">{{item.name}}</el-col>
                            <el-col :span="16" class="content">
                                <div v-if="item.content">{{item.content|getNull}}</div>
                                <div v-if="item.userTeam" class="userGroups">
                                    <el-select
                                        v-model="user.userTeam"
                                        multiple
                                        :placeholder="$t('webMemberDetail.userTeam')"
                                    >
                                        <el-option
                                            v-for="item in user.options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12" class="col9 box2">
                        <el-row
                            :gutter="10"
                            class="group_box"
                            v-for="(item,index) in user.info1"
                            :key="index"
                        >
                            <el-col :span="8" class="title">{{item.name}}</el-col>
                            <el-col :span="16" class="content">
                                <div v-if="item.content">{{item.content|getNull}}</div>
                                <div v-if="item.area" class="userGroups">
                                    <el-cascader
                                        v-model="user.areaValue"
                                        :options="user.areaOptions"
                                        :props="{ expandTrigger: 'hover' }"
                                        @change="handleChange"
                                    ></el-cascader>
                                </div>
                                <div v-if="item.status" class="userGroups">
                                    <el-select
                                        v-model="user.rzStatus"
                                        :placeholder="$t('webMemberDetail.rzStatus')"
                                    >
                                        <el-option
                                            v-for="item in user.rzOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </div>
                                <div v-if="item.deposit" class="flexBetween">
                                    <div>${{item.deposit}}</div>
                                    <div v-if="userInfo.type<3 && user.rzStatus==1">
                                        <el-button
                                            type="info"
                                            @click="changeDeposit"
                                            size="mini"
                                        >{{deposit.BtnName}}</el-button>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="col9 recordBox" v-show="false">
                    <el-col :span="4">会员卡暂停激活记录：</el-col>
                    <el-col :span="20">
                        <p v-for="item in 2" :key="item">
                            <span>2019-05-18 16:18</span>
                            <span>暂停会员卡</span>
                            <span>备注：因为xxxxxxxxxxxxxxxxxxx</span>
                        </p>
                    </el-col>
                </el-row>
            </div>
            <div class="mtb20">{{$t('webMemberDetail.labelOpration')}}</div>
            <div style="padding: 10px">
                <el-row :gutter="10">
                    <el-button
                        round
                        type="primary"
                        v-for="item in btnType"
                        :key="item.type"
                        class="handleBox"
                        @click="handleRecordBtn(item)"
                        v-show="!item.hidden"
                    >{{item.name}}</el-button>
                </el-row>
            </div>
            <div class="mtb20">{{$t('webMemberDetail.labelCard')}}</div>
            <div v-if="cardListData.length>0">
                <el-row
                    :gutter="10"
                    class="col9 cardBox"
                    v-for="(item,index) in cardListData"
                    :key="index"
                >
                    <el-col :span="6">{{$t('webMemberDetail.cardNumber')}}:{{item.number}}</el-col>
                    <el-col :span="6">{{$t('webMemberDetail.cardFaceNumber')}}:{{item.face_number}}</el-col>
                    <el-col :span="12">{{$t('webMemberDetail.cardMemo')}}:{{item.memo}}</el-col>
                </el-row>
            </div>
            <div v-else>
                <el-row class="col9 cardBox">
                    <el-col :span="24">{{$t('webBaseMessage.noData')}}</el-col>
                </el-row>
            </div>
            <div class="mtb20">{{$t('webMemberDetail.labelCar')}}</div>
            <div v-if="carListData.length>0">
                <el-row
                    :gutter="10"
                    class="col9 cardBox"
                    v-for="(item,index) in carListData"
                    :key="index"
                >
                    <el-row :gutter="10">
                        <el-col
                            :span="4"
                        >{{$t('webCarType.title')}}:{{item.car_type==1?$t('webCarType.bus'):item.car_type==2?$t('webCarType.car'):$t('webCarType.taxi')}}</el-col>
                        <el-col :span="4">{{$t('webMemberDetail.carBrand')}}{{item.brand}}</el-col>
                        <el-col :span="4">{{$t('webMemberDetail.carProduct')}}{{item.product}}</el-col>
                        <el-col :span="4">{{$t('webMemberDetail.carSeat')}}{{item.seat}}</el-col>
                        <el-col :span="8">{{$t('webMemberDetail.carNumber')}}{{item.car_number}}</el-col>
                    </el-row>
                    <el-row :gutter="10" style="padding:0 8px;" class="flex_a mt10">
                        {{$t('webMemberDetail.carPhoto')}}
                        <p class="carImgBox">
                            <img :src="item.pic" alt="">
                        </p>
                    </el-row>
                </el-row>
            </div>
            <div v-else>
                <el-row class="col9 cardBox">
                    <el-col :span="24">{{$t('webBaseMessage.noData')}}</el-col>
                </el-row>
            </div>
            <buyRecord :title="buyRecordMsg.title" :listData="orderListData"></buyRecord>
            <rechargeRecord :title="rechargeRecordMsg.title" :listData="rechargeListData"></rechargeRecord>
        </div>
        <!-- 创建角色Dialog -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="handleFormClose">
            <el-form :model="handleForm" :rules="handleFormRules" ref="handleForm">
                <el-form-item label="会员卡" prop="id">
                    <el-select class="wd-50" v-model="handleForm.id" placeholder="请选择会员卡">
                        <el-option
                            v-for="item in card_options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="会员卡状态" prop="status">
                    <el-radio v-model="handleForm.status" label="1">{{$t('webBaseMessage.active')}}</el-radio>
                    <el-radio
                        v-model="handleForm.status"
                        label="0"
                    >{{$t('webBaseMessage.inactive')}}</el-radio>
                </el-form-item>
                <el-form-item label="原因" prop="msg">
                    <el-input
                        class="wd-50"
                        type="textarea"
                        v-model="handleForm.msg"
                        placeholder="原因"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleFormClose">{{$t('webBaseBtn.cancel')}}</el-button>
                <el-button type="primary" @click="ruleConfirm">{{$t('webBaseBtn.confirm')}}</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :title="$t('webMemberDetail.rechargeTitle')"
            :visible.sync="rechargeDialog"
            @close="rechargeCancel"
        >
            <el-form :model="rechargeForm" :rules="rules" ref="rechargeForm">
                <el-row :gutter="10" class="mg-t-5 mb20">
                    <el-col
                        :span="6"
                    >{{$t('webMemberDetail.rechargeNickname')}}{{rechargeData.nickname}}</el-col>
                    <el-col
                        :span="8"
                    >{{$t('webMemberDetail.rechargeMobile')}}{{rechargeData.mobile}}</el-col>
                    <el-col :span="5">{{$t('webMemberDetail.rechargeMoney')}}{{rechargeData.money}}</el-col>
                    <el-col
                        :span="5"
                    >{{$t('webMemberDetail.rechargeMoneyGift')}}{{rechargeData.money_gift}}</el-col>
                </el-row>
                <el-form-item :label="$t('webMemberDetail.rechargeLableTaocanid')" prop="taocanid">
                    <el-select
                        class="wd-50"
                        v-model="rechargeForm.taocanid"
                        :placeholder="$t('webMemberDetail.rechargeRulesTaocanid')"
                    >
                        <el-option
                            v-for="item in rechargeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('webMemberDetail.rechargeLablePaymentTypeid')"
                    prop="payment_typeid"
                >
                    <el-select
                        class="wd-50"
                        v-model="rechargeForm.payment_typeid"
                        :placeholder="$t('webMemberDetail.rechargeRulesPaymentTypeid')"
                    >
                        <el-option
                            v-for="item in payWayArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('webMemberDetail.rechargeLablePaymentNumber')"
                    prop="payment_number"
                >
                    <el-input
                        class="wd-50"
                        v-model="rechargeForm.payment_number"
                        :placeholder="$t('webMemberDetail.rechargeRulesPaymentNumber')"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="rechargeCancel">{{$t('webBaseBtn.cancel')}}</el-button>
                <el-button type="primary" @click="rechargeConfirm">{{$t('webBaseBtn.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { memberInfo, orderList, rechargeList, cardList, carList, getArea, recharge, editMemberStatus, editCardStatus } from "@/api/members";
import { moneyIndex } from "@/api/setMeal";
import { paymentIndex } from "@/api/payWay";
import { getList } from "@/api/members/user";
import { changeStatus, getList as getCardList } from "@/api/members/card";
import { reDeposit } from "@/api/members/deposit";
import omg from "@/components/uploadImg";
import rechargeRecord from './components/rechargeRecord';
import buyRecord from './components/buyRecord';
export default {
    name: 'detail',
    data() {
        return {
            user: {
                uploadParam: "",
                singleImg: "",
                info: [],
                info1: [],
                userTeam: [],
                options: [],
                rzStatus: null,
                rzOptions: [
                    {
                        value: 0,
                        label: this.$t('webAuthType.unverified')
                    },
                    {
                        value: 1,
                        label: this.$t('webAuthType.certified')
                    },
                    {
                        value: -1,
                        label: this.$t('webAuthType.stop')
                    },
                    {
                        value: -2,
                        label: this.$t('webAuthType.cancel')
                    }],
                areaValue: [],
                areaOptions: []
            },
            btnType: [
                { type: 'rz', name: this.$t('webMemberDetail.rz') },
                { type: 'recharge', name: this.$t('webMemberDetail.recharge') },
                { type: 'add_new', name: this.$t('webMemberDetail.add_new') },
                { type: 'stop', name: this.$t('webMemberDetail.stop') },
                { type: 'car', name: this.$t('webMemberDetail.car') },
                { type: 'buy', name: this.$t('webMemberDetail.buy') },
                { type: 'recharge_record', name: this.$t('webMemberDetail.recharge_record') },
            ],
            dialogTitle: this.$t('webMemberDetail.cardStatusTitle'),
            dialogFormVisible: false,
            rechargeData: {
                nickname: null,
                mobile: null,
                money: null,
                money_gift: null,
            },
            rechargeDialog: false,
            rechargeForm: {
                mid: this.$route.query.mid,
                taocanid: '',
                payment_typeid: '',
                payment_number: ''
            },
            rechargeOptions: [],
            payWayArr: [],
            rules: {
                taocanid: [
                    { required: true, message: this.$t('webMemberDetail.rechargeRulesTaocanid'), trigger: 'change' }
                ],
                payment_typeid: [
                    { required: true, message: this.$t('webMemberDetail.rechargeRulesPaymentTypeid'), trigger: 'change' }
                ],
                payment_number: [
                    { required: true, message: this.$t('webMemberDetail.rechargeRulesPaymentNumber'), trigger: 'blur' }
                ]
            },
            handleFormRules: {
                id: [
                    { required: true, message: this.$t('webMemberDetail.cardRulesId'), trigger: 'change' }
                ],
                msg: [
                    { required: true, message: this.$t('webMemberDetail.cardRulesMsg'), trigger: 'change' }
                ],
                status: []
            },
            handleForm: {
                id: '',
                msg: '',
                status: '1',
                mid: this.$route.query.mid
            },
            rechargeRecordMsg: {
                title: this.$t('webMemberDetail.labelRecharge')
            },
            buyRecordMsg: {
                title: this.$t('webMemberDetail.labelBuy')
            },
            carListData: [],
            cardListData: [],
            orderListData: [],
            rechargeListData: [],
            deposit: {
                BtnName: this.$t('webMemberDetail.depositBtnBack'),
                deposit: 0
            },
            card_options: []
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ])
    },
    filters: {
        getNull(val) {
            if (!val) return "/"
            return val
        }
    },
    components: { omg, rechargeRecord, buyRecord },
    created() {
        const mid = this.$route.query.mid
        getList().then(res => {
            res.forEach(item => {
                this.user.options.push(
                    { value: item.id, label: item.name }
                )
            });
        })
        getCardList({ mid, number: '', mobile: '', pageNo: 1, pageSize: 999 }).then(res => {
            console.log('123', res)
            res.records.forEach(item => {
                this.card_options.push(
                    { value: item.id, label: item.number }
                )
            });
        })
        getArea().then(res => {
            res.forEach(item => {
                let children = new Array();
                item.area.forEach(ia => {
                    children.push(
                        { value: ia.id, label: ia.name }
                    )
                });
                this.user.areaOptions.push(
                    { label: item.name, value: item.id, children: children }
                )
            })
            console.log("area", this.user.areaOptions)
        })
        memberInfo({ mid }).then(res => {
            const data = res[0]
            this.rechargeData = {
                nickname: data.nickname,
                mobile: data.mobile,
                money: data.money,
                money_gift: data.money_gift,
            }
            this.user.info = [
                { name: this.$t('webMemberDetail.mid'), content: data.mid },
                { name: this.$t('webMemberDetail.mobile'), content: data.mobile },
                { name: this.$t('webMemberDetail.nickname'), content: data.nickname },
                { name: this.$t('webMemberDetail.money'), content: this.$t('webMemberDetail.money') + '：' + data.money + '，' + this.$t('webMemberDetail.money_gift') + '：' + data.money_gift },
                { name: this.$t('webMemberDetail.number'), content: data.number },
                { name: this.$t('webMemberDetail.username'), content: data.username },
                { name: this.$t('webMemberDetail.en_name'), content: data.en_name },
                { name: this.$t('webMemberDetail.userGroup'), content: '', userTeam: true },
                { name: this.$t('webMemberDetail.inviter_mobile'), content: data.inviter_mobile },
            ]
            this.user.info1 = [
                { name: this.$t('webMemberDetail.idcard'), content: data.idcard },
                { name: this.$t('webMemberDetail.birth'), content: data.birth },
                { name: this.$t('webMemberDetail.email'), content: data.email },
                { name: this.$t('webMemberDetail.address'), content: '', area: true },
                { name: this.$t('webMemberDetail.facebook'), content: data.facebook },
                { name: this.$t('webMemberDetail.wx_account'), content: data.wx_account },
                { name: this.$t('webMemberDetail.status'), content: '', status: true },
                { name: this.$t('webMemberDetail.deposit'), content: "", deposit: data.deposit },
            ]
            this.user.singleImg = data.avatar;
            this.user.rzStatus = data.status;
            this.user.areaValue = [data.city, data.area];
            data.member_groupid.split(",").forEach(item => {
                item = Number(item)
                this.user.userTeam.push(item)
            })
            if (data.status == 1) {
                this.btnType[0].hidden = true
            }
            this.deposit.deposit = data.deposit * 1
            if (this.deposit.deposit == 0) {
                this.deposit.BtnName = this.$t('webMemberDetail.depositBtnRecharge')
            }
        })
        carList({ mid }).then(res => {
            this.carListData = res
        })
        cardList({ mid }).then(res => {
            this.cardListData = res
        })
        rechargeList({ mid }).then(res => {
            this.rechargeListData = res
        })
        orderList({ mid }).then(res => {
            this.orderListData = res
        })
    },
    mounted() {
        const _this = this
        paymentIndex({ pageSize: 999 }).then(res => {
            res.records.forEach(item => {
                if (item.id != 1) {
                    this.payWayArr.push(
                        { label: item.title, value: item.id }
                    )
                }
            });
        })
        moneyIndex({ pageSize: 999 }).then(res => {
            res.records.forEach(item => {
                if (item.status) {
                    this.rechargeOptions.push(
                        { label: item.title, value: item.id }
                    )
                }

            });
        })
        document.onkeydown = function (e) { // 回车提交表单
            // 兼容FF和IE和Opera
            var theEvent = window.event || e;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                _this.ruleConfirm()
            }
        }
    },
    methods: {
        async upload(file) {
            const _this = this;
            // 上传单图头像
            _this.uploadParam = new FormData();
            _this.uploadParam.append("file", file, file.name);

            // let res = await upload(_this.uploadParam)
            // console.log(res)
            // _this.singleImg = res.savepath;
            // _this.formData.photos = res.savepath;

            // _this.axios.postImg("dlc/public/upload", _this.uploadParam).then(res => {
            //     _this.singleImg = res.data.data.savepath;
            // });
        },
        //居住地区选择
        handleChange(value) {
            console.log(value);
        },
        //操作记录--相关操作
        handleRecordBtn(item) {
            switch (item.type) {
                case 'rz':
                    this.$router.push({ path: '/user/certification', query: { mid: this.$route.query.mid } });
                    break;
                case 'recharge':
                    this.rechargeDialog = true;
                    break;
                case 'add_new':
                    this.$router.push({ path: '/user/membersCard', query: { type: 'add_new', mid: this.$route.query.mid } });
                    break;
                case 'stop':
                    this.dialogFormVisible = true;
                    this.handleForm.msg = "";
                    break;
                case 'car':
                    this.$router.push({ path: '/order/car', query: { nickname: item.nickname } });
                    break;
                case 'buy':
                    this.$router.push({ path: '/order/sell', query: {} });
                    break;
                case 'recharge_record':
                    this.$router.push({ path: '/order/recharge', query: {} });
                    break;
            }
        },
        ruleConfirm() {
            console.log(this.handleForm)
            this.$refs['handleForm'].validate(async valid => {
                if (valid) {
                    const form = {
                        id: this.handleForm.id.id,
                        mid: this.handleForm.id.mid,
                        msg: this.handleForm.msg,
                        status: this.handleForm.status
                    }
                    const res = await editCardStatus(form)
                    this.$message({
                        message: this.$t('webBaseTips.submitSuccess'),
                        type: 'success',
                        showClose: true,
                    });
                    this.handleFormClose()
                }
            });
        },
        handleFormClose() {
            this.$refs['handleForm'].resetFields()
            this.dialogFormVisible = false
        },
        rechargeConfirm() {
            this.$refs['rechargeForm'].validate(async valid => {
                if (valid) {
                    const res = await recharge(this.rechargeForm)
                    this.$message({
                        message: this.$t('webBaseTips.rechargeSuccess'),
                        type: 'success',
                        showClose: true,
                    });
                    this.$router.replace()
                }
            });
        },
        rechargeCancel() {
            this.$refs['rechargeForm'].resetFields()
            this.rechargeDialog = false;
        },
        async changeDeposit() {
            if (this.deposit.deposit == 0) {
                this.$router.push({ path: '/user/certification', query: { mid: this.$route.query.mid, hide: true } });
                return false;
            }
            this.$confirm(this.$t('webMemberCardList.alertConfirm'), this.$t('webBaseTips.confirm'), {
                confirmButtonText: this.$t('webBaseBtn.confirm'),
                cancelButtonText: this.$t('webBaseBtn.cancel'),
                type: 'warning'
            }).then(async () => {
                await reDeposit({ mid: this.$route.query.mid })
                this.$message({
                    message: this.$t('webBaseTips.editConfirm'),
                    type: 'success',
                    showClose: true,
                });
            })

        },
        async saveMsg() {
            const form = {
                mid: this.$route.query.mid,
                group_id: (this.user.userTeam).join(","),
                city: this.user.areaValue[0],
                area: this.user.areaValue[1],
                status: this.user.rzStatus
            }
            await editMemberStatus(form)
            this.$message({
                message: this.$t('webBaseTips.editConfirm'),
                type: 'success',
                showClose: true,
            });
            this.$router.replace()
        }
    }
}
</script>

<style lang="scss">
#userDetail {
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .avatar-uploader {
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }
  .avatar-uploader:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .imgBox {
    margin: 10px auto;
  }
  .box1 {
    font-size: 15px;
    border: 1px solid #e5e5e5;
    padding: 5px 0;
  }
  .group_box {
    font-size: 15px;
    border: 1px solid #e5e5e5;
    & + .group_box {
      border-top: 0;
    }
    .title {
      border-right: 1px solid #e5e5e5;
      text-align: right;
      padding: 12px;
      background: #f2f2f2;
      color: #333;
    }
    .content {
      > div {
        padding: 8px;
      }
      .userGroups {
        max-height: 43px;
        overflow-y: scroll;
        padding-top: 3px;
        padding-bottom: 0;
      }
    }
  }
  .recordBox {
    padding: 15px 0;
    font-size: 16px;
    p {
      span {
        margin-right: 20px;
      }
      + p {
        margin-top: 5px;
      }
    }
  }
  .handleBox {
    margin-right: 30px;
  }
  .cardBox {
    font-size: 16px;
    border: 1px solid #e5e5e5;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 10px;
    padding: 10px 30px;
    + .cardBox {
      margin-top: 10px;
    }
  }
  .carImgBox {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
