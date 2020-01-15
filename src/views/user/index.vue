<!-- userList -->
<template>
  <div id="userList">
    <div class="mg-t-5 bfff pd-10">
      <el-form :model="searchForm">
        <el-row :gutter="10" class="mg-b-5">
          <el-col :span="12">
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="memberEditDia(1)"
            >{{$t("webBaseBtn.create")}}</el-button>
          </el-col>
          <el-col :span="12" class="tar">
            <search-btn @search="search" @reset="reset"></search-btn>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input :placeholder="$t('webMemberList.enterMID')" v-model="searchForm.mid">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input
              :placeholder="$t('webMemberList.enterUserName')"
              v-model="searchForm.nickname"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input :placeholder="$t('webMemberList.enterMobile')" v-model="searchForm.mobile">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input :placeholder="$t('webMemberList.enterVIPCard')" v-model="searchForm.number">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-col :span="4">
            <!-- <el-input placeholder="请输入用户组" v-model="searchForm.group_id">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>-->
            <el-select v-model="searchForm.group_id" :placeholder="$t('webMemberList.selectGroup')">
              <el-option
                v-for="item in userGroup"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="searchForm.status" :placeholder="$t('webMemberList.selectStatus')">
              <el-option :label="$t('webAuthType.certified')" :value="1"></el-option>
              <el-option :label="$t('webAuthType.unverified')" :value="0"></el-option>
              <el-option :label="$t('webAuthType.stop')" :value="-1"></el-option>
              <el-option :label="$t('webAuthType.cancel')" :value="-2"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form>
      <o-table
        class="mg-t-5"
        :tableData="tableData"
        :tableTitle="tableTitle"
        :tableSlot="tableSlot"
        :pageMsg="pageMsg"
        @btnFunc="btnFunc"
        @selecChange="selecChange"
        @pageChange="pageChange"
      >
        <template slot="avatar" slot-scope="slot">
          <img :src="slot.data.avatar" alt="">
        </template>
        <template slot="status" slot-scope="slot">
          {{
          slot.data.status==0?$t('webAuthType.unverified'):
          slot.data.status==-1?$t('webAuthType.stop'):
          slot.data.status==-2?$t('webAuthType.cancel'):
          $t('webAuthType.certified')
          }}
        </template>
        <template slot="create_time" slot-scope="slot">{{slot.data.create_time|timeStr}}</template>
      </o-table>
      <!-- 充值Dialog -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="cancel">
        <el-form :model="rechargeForm" :rules="rules" ref="rechargeForm">
          <el-row :gutter="10" class="mg-t-5 mb20">
            <el-col :span="6">{{$t('webMemberList.dialogNickname')}}:{{rechargeData.nickname}}</el-col>
            <el-col :span="8">{{$t('webMemberList.dialogMobile')}}:{{rechargeData.mobile}}</el-col>
            <el-col :span="5">{{$t('webMemberList.dialogMoney')}}:{{rechargeData.money}}</el-col>
            <el-col :span="5">{{$t('webMemberList.dialogMoney_gift')}}:{{rechargeData.money_gift}}</el-col>
          </el-row>
          <el-form-item :label="$t('webMemberList.taocanid')" prop="taocanid">
            <el-select
              class="wd-50"
              v-model="rechargeForm.taocanid"
              :placeholder="$t('webMemberList.ruleTaocanid')"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('webMemberList.payment_typeid')" prop="payment_typeid">
            <el-select
              class="wd-50"
              @change="changePay"
              v-model="rechargeForm.payment_typeid"
              :placeholder="$t('webMemberList.rulePayment')"
            >
              <el-option
                v-for="item in payWayArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('webMemberList.payment_number')" prop="payment_number">
            <el-input
              class="wd-50"
              v-model="rechargeForm.payment_number"
              :placeholder="$t('webMemberList.ruleNumber')"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
          <el-button type="primary" @click="ruleConfirm">{{$t('webBaseBtn.confirm')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="$t('webMemberList.cardDialogTitle')"
        :visible.sync="connectCard"
        @close="cancelConnect"
      >
        <el-form :model="cardForm" :rules="cardRules" ref="cardForm" label-position="top">
          <el-form-item :label="$t('webMemberList.cardNumber')" prop="number">
            <el-input
              class="wd-50"
              v-model="cardForm.number"
              :placeholder="$t('webMemberList.cardRulesNumber')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('webMemberList.cardMemo')" prop="memo">
            <el-input
              class="wd-50"
              v-model="cardForm.memo"
              :placeholder="$t('webMemberList.cardRulesMemo')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('webMemberList.cardFaceNumber')" prop="face_number">
            <el-input
              class="wd-50"
              v-model="cardForm.face_number"
              :placeholder="$t('webMemberList.cardRulesFaceNumber')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('webMemberList.cardUser')" prop="mobile">
            <el-input
              @change="getName"
              class="wd-50"
              v-model="cardForm.mobile"
              :placeholder="$t('webMemberList.cardMobile')"
            ></el-input>
            <el-input
              class="wd-50"
              readonly
              v-model="cardForm.nickname"
              :placeholder="$t('webMemberList.cardNickname')"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelConnect">{{$t('webBaseBtn.cancel')}}</el-button>
          <el-button type="primary" @click="cardConfirm">{{$t('webBaseMessage.confirm')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="titleMember" :visible.sync="memberShow" width="300" @close="cancelMember">
        <el-form
          :model="memberForm"
          :rules="MemberRules"
          ref="memberForm"
          label-position="top"
          label-width="100px"
        >
          <template v-if="memberDiaStatus==1">
            <el-form-item :label="$t('webMemberList.username')" prop="mobile">
              <div class="flex flexBetween">
                <el-input
                  class="wd-20"
                  v-model="memberForm.mobile_code"
                  :placeholder="$t('webAreaCodeSettings.number')"
                ></el-input>
                <el-input
                  class="wd-75"
                  v-model="memberForm.mobile"
                  :placeholder="$t('webMemberList.usernamePlaceholder')"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item :label="$t('webMemberList.password')" prop="password1">
              <el-input
                type="password"
                v-model="memberForm.password1"
                :placeholder="$t('webMemberList.passwordPlaceholder')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('webMemberList.passwordAgain')" prop="password2">
              <el-input
                type="password"
                v-model="memberForm.password2"
                :placeholder="$t('webMemberList.pleaseEnterPasswordAgain')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('webMemberList.phone')">
              <el-input
                v-model="memberForm.tj_mobile"
                :placeholder="$t('webMemberList.phonePlaceholder')"
              ></el-input>
            </el-form-item>
          </template>
          <template v-else-if="memberDiaStatus==2">
            <el-form-item :label="$t('webMemberList.password')">
              <el-input
                type="password"
                v-model="changeMember.password"
                :placeholder="$t('webMemberList.passwordPlaceholder')"
              ></el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item :label="$t('webBaseMessage.status')">
              <el-select
                v-model="changeMember.status"
                :placeholder="$t('webMemberDetail.rzStatus')"
              >
                <el-option
                  v-for="item in rzOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
        <span slot="footer">
          <el-button @click="cancelMember">{{$t('webBaseBtn.cancel')}}</el-button>
          <el-button type="primary" @click="memberEditFunc">{{$t('webBaseBtn.confirm')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { moneyIndex } from "@/api/setMeal";
import { paymentIndex } from "@/api/payWay";
import * as card from "@/api/members/card";
import * as member from "@/api/members";
import { getList } from "@/api/members/user";
import { memberAdd, memberEdit } from "@/api/user";
export default {
  name: 'userList',
  data() {
    return {
      rechargeData: {
        nickname: null,
        mobile: null,
        money: null,
        money_gift: null,
      },
      searchForm: {
        mid: '',
        nickname: '',
        mobile: '',
        number: '',
        group_id: '',
        status: '',
        pageNo: 1,
        pageSize: 10
      },
      rechargeForm: {
        mid: '',
        taocanid: '',
        payment_typeid: '',
        payment_number: ''
      },
      titleMember: this.$t("webBaseBtn.create"),
      memberShow: false,
      memberDiaStatus: 1,
      memberForm: {
        mobile: '',
        mobile_code: '',
        password1: '',
        password2: '',
        tj_mobile: ''
      },
      changeMember: {
        mid: '',
        password: '',
        status: ''
      },
      rzOptions: [{
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
      MemberRules: {
        mobile: [
          { required: true, message: this.$t('webMemberList.username'), trigger: 'blur' }
        ],
        mobile_code: [
          { required: true, message: this.$t('webAreaCodeSettings.number'), trigger: 'blur' }
        ],
        password1: [
          { required: true, message: this.$t('webMemberList.password'), trigger: 'blur' }
        ],
        password2: [
          { required: true, message: this.$t('webMemberList.passwordAgain'), trigger: 'blur' }
        ],
      },
      rules: {
        taocanid: [
          { required: true, message: this.$t('webMemberList.ruleTaocanid'), trigger: 'change' }
        ],
        payment_typeid: [
          { required: true, message: this.$t('webMemberList.rulePayment'), trigger: 'change' }
        ],
        payment_number: [
          { required: true, message: this.$t('webMemberList.ruleNumber'), trigger: 'blur' }
        ]
      },
      connectCard: false,
      cardForm: {
        id: 0,
        number: '',
        memo: '',
        face_number: '',
        mid: '',
        mobild: '',
        nickname: '',
      },
      cardRules: {
        memo: [
          { required: true, message: this.$t('webMemberList.cardRulesMemo'), trigger: 'blur' }
        ],
        number: [
          { required: true, message: this.$t('webMemberList.cardRulesNumber'), trigger: 'blur' }
        ],
        face_number: [
          { required: true, message: this.$t('webMemberList.cardRulesFaceNumber'), trigger: 'blur' }
        ],
        mid: [
          { required: true, message: this.$t('webMemberList.cardRulesMID'), trigger: 'blur' }
        ],
      },
      options: [],
      payWayArr: [],
      userGroup: [],
      dialogFormVisible: false,
      dialogTitle: this.$t('webMemberList.dialogTitle'),
      tableTitle: [
        { prop: "mid", label: this.$t('webMemberList.mid'), width: "auto" },
        { prop: "nickname", label: this.$t('webMemberList.nickname'), width: "auto" },
        { prop: "avatar", label: this.$t('webMemberList.avatar'), width: "100", custom: true },
        { prop: "mobile", label: this.$t('webMemberList.mobile'), width: "120" },
        { prop: "money", label: this.$t('webMemberList.money'), width: "95" },
        { prop: "money_gift", label: this.$t('webMemberList.money_gift'), width: "95" },
        { prop: "groupname", label: this.$t('webMemberList.groupname'), width: "auto" },
        { prop: "status", label: this.$t('webMemberList.status'), width: "95", custom: true },
        { prop: "create_time", label: this.$t('webMemberList.create_time'), width: "100", custom: true },
      ],
      //   表头信息，prop对应
      tableSlot: [
        {
          title: this.$t('webBaseMessage.operation'),
          slotType: "btnMore",
          buttontype: "info", // text为文字按钮，默认不传为正常按钮
          width: 350,
          slot: [
            { label: this.$t('webMemberList.slotBtnCert'), type: "cert" },
            { label: this.$t('webMemberList.slotBtnCard'), type: "card" },
            { label: this.$t('webMemberList.slotBtnLinkCard'), type: "linkCard" },
          ],
          more: [
            { title: this.$t('webMemberList.slotBtnRecharge'), type: "recharge" },
            { title: this.$t('webMemberList.slotBtnCar'), type: "car" },
            { title: this.$t('webMemberList.slotBtnDetail'), type: "detail" },
            { title: this.$t('webBaseBtn.modifyPw'), type: "editPass" },
            { title: this.$t('webBaseBtn.modifyStatus'), type: "editStatus" }
          ]
        }
      ],
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
    this.searchForm.pageSize = this.pageMsg.size
    this.init()
    paymentIndex({ pageSize: 999 }).then(res => {
      res.records.forEach(item => {
        if (item.id != 1 && item.id != 3) {
          this.payWayArr.push(
            { label: item.title, value: item.id }
          )
        }
      });
    })
    moneyIndex({ pageSize: 999 }).then(res => {
      res.records.forEach(item => {
        if (item.status) {
          this.options.push(
            { label: item.title, value: item.id }
          )
        }
      });
    })
    getList().then(res => {
      res.forEach(item => {
        this.userGroup.push(
          { label: item.name, value: item.id }
        )
      });
    })
  },
  mounted() {
    const _this = this
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
    // 初始化数据
    async init() {
      let res = await member.getList(this.searchForm);
      res.records.forEach(item => {
        if (item.status == 1) {
          item.hideBtn = ['cert']
        }
        // else if (item.status != 0) {
        //   item.hideSlot = true
        // }
      });
      this.tableData = res.records
      this.pageMsg.total = res.total
    },
    btnFunc(index, type) {
      const _this = this;
      const mid = this.tableData[index].mid;
      if (type == 'cert') {//认证
        this.$router.push({ path: '/user/certification', query: { mid } });
      }
      if (type == 'recharge') {
        this.dialogFormVisible = true;
        this.rechargeData = this.tableData[index]
        this.rechargeForm = {
          mid,
          taocanid: '',
          payment_typeid: '',
          payment_number: ''
        }
      }
      if (type == 'card') {
        this.$router.push({ path: '/user/membersCard', query: { mid } });
      }
      if (type == 'detail') {
        this.$router.push({ path: '/user/detail', query: { mid } });
      }
      if (type == 'car') {
        this.$router.push({
          path: '/user/car',
          query: {
            nickname: this.tableData[index].nickname
          }
        });
      }
      if (type == 'linkCard') {
        this.connectCard = true;
        this.cardForm.mid = mid
        this.cardForm.mobile = this.tableData[index].mobile
        this.cardForm.nickname = this.tableData[index].nickname
      }
      if (type == "editPass") {
        this.memberEditDia(2, index)
      }
      if (type == "editStatus") {
        this.memberEditDia(3, index)
      }
    },
    selecChange(val) {
      const _this = this;
      let data = [];
      val.forEach(item => {
        data.push(item.date);
      });
      console.log(data);
    },
    switchChange(row, index) {
      console.log("switchChange", row, index);
    },
    inputChange(val) {
      console.log(val);
    },
    search() {
      this.searchForm.pageNo = 1;
      this.init()
    },
    reset() {
      this.searchForm = {
        mid: '',
        nickname: '',
        mobile: '',
        number: '',
        group_id: '',
        status: '',
        pageNo: 1,
        pageSize: 10
      }
    },
    async ruleConfirm() {
      console.log(this.rechargeForm)
      this.$refs['rechargeForm'].validate(async valid => {
        if (valid) {
          const res = await member.recharge(this.rechargeForm)
          this.$message({
            message: this.$t('webMemberList.messageConfirm'),
            type: 'success',
            showClose: true,
          });
          this.cancel()
          this.init()
        }
      });
    },
    cancel() {
      this.$refs['rechargeForm'].resetFields()
      this.dialogFormVisible = false;
    },
    cancelMember() {
      this.$refs.memberForm.resetFields()
      this.memberShow = false;
      this.memberForm = {
        mobile: '',
        mobile_code: '',
        password1: '',
        password2: '',
        tj_mobile: ''
      };
      this.changeMember = {
        mid: '',
        password: '',
        status: ''
      };
    },
    // 分页处理
    pageChange(page) {
      console.log(page)
      this.searchForm.pageNo = page
      this.init()
    },
    cancelConnect() {
      this.$refs['cardForm'].resetFields()
      this.connectCard = false;
    },
    // 选择支付方式后动作
    changePay(e) {
      if (e == 2) {//id==2时为现金支付
        this.rechargeForm.payment_number = this.$t('webBaseMessage.none')
      }
    },
    async getName() {
      console.log(this.cardForm.mobile)
      if (this.cardForm.mobile.length != 11) return false;
      const res = await card.getMobileToName({ mobile: this.cardForm.mobile })
      this.cardForm.mid = res.mid
      this.cardForm.nickname = res.nickname
    },
    async cardConfirm() {
      console.log(this.cardForm)
      this.$refs['cardForm'].validate(async valid => {
        if (valid) {
          if (!this.cardForm.mid) {
            this.$message({
              message: this.$t('webMemberList.messageCardConfirm'),
              type: 'error',
              showClose: true,
            });
            return false
          }
          await card.editCard(this.cardForm)
          this.$message({
            message: this.$t('webMemberList.messageEditConfirm'),
            type: 'success',
            showClose: true,
          });
          this.init()
          this.cancelConnect()
        }
      });
    },
    memberEditDia(type, index) {
      this.memberShow = true;
      this.memberDiaStatus = type
      switch (type) {
        case 1:
          this.titleMember = this.$t("webBaseBtn.create");
          break;
        case 2:
          this.changeMember.mid = this.tableData[index].mid
          delete this.changeMember.status
          this.titleMember = this.$t("webBaseBtn.edit");
          break;
        case 3:
          this.changeMember.status = this.tableData[index].status
          this.changeMember.mid = this.tableData[index].mid
          delete this.changeMember.password
          this.titleMember = this.$t("webBaseBtn.edit");
          break;
      }
    },
    memberEditFunc() {
      this.$refs['memberForm'].validate(async valid => {
        if (valid) {
          if (this.memberDiaStatus == 1) {
            await memberAdd(this.memberForm)
          } else {
            await memberEdit(this.changeMember)
          }
          this.$message({
            message: this.$t('webMemberList.messageEditConfirm'),
            type: 'success',
            showClose: true,
          });
          this.cancelMember()
        }
      })
    }
  }
};
</script>
<style scoped lang='less'>
</style>
