<template>
  <div id="certification" class="pd-10">
    <el-form
      :model="formData"
      ref="form"
      label-position="top"
      :rules="rules"
      label-width="120px"
      class="wd-100 ptb20"
    >
      <el-form-item :label="hide?$t('webMemberDetail.depositBtnRecharge'):$t('webMemberDetail.rz')">
        <p class="col3">{{$t('webMemberList.Deposit_collection')}}${{deposit}}</p>
      </el-form-item>
      <el-form-item label="" prop="pay_way">
        <el-select
          class="wd-50"
          v-model="formData.payment_typeid"
          :placeholder="$t('webMemberDetail.rechargeLablePaymentTypeid')"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('webMemberDetail.rechargeLablePaymentNumber')" prop="deposit_code">
        <el-input
          class="wd-50"
          v-model="formData.deposit_code"
          :placeholder="$t('webMemberDetail.rechargeRulesPaymentNumber')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('webMemberCardList.cardNumber')" :style="hide?'display:none':''">
        <el-input
          class="wd-50"
          v-model="formData.number"
          :placeholder="$t('webMemberCardList.cardRulesNumber')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('webMemberCardList.cardMemo')" :style="hide?'display:none':''">
        <el-input
          class="wd-50"
          v-model="formData.memo"
          :placeholder="$t('webMemberCardList.cardRulesMemo')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('webMemberCardList.cardFaceNumber')" :style="hide?'display:none':''">
        <el-input
          class="wd-50"
          v-model="formData.face_number"
          :placeholder="$t('webMemberCardList.cardRulesFaceNumber')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('webMemberList.selectGroup')"
        prop="group_id"
        :style="hide?'display:none':''"
      >
        <el-select
          class="wd-50"
          v-model="formData.group_id"
          multiple
          :placeholder="$t('webMemberDetail.userTeam')"
        >
          <el-option
            v-for="item in userGroup"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button
          type="primary"
          @click="save"
        >{{hide?$t('webMemberDetail.rechargeTitle'):$t('webMemberList.slotBtnCert')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getParms } from "@/api/setUp";
import { getList } from "@/api/members/user";
import { memberAuth, againUpDeposit } from "@/api/members";
import { paymentIndex } from "@/api/payWay";
export default {
  name: 'certification',
  data() {
    return {
      hide: this.$route.query.hide,
      deposit: 0,
      options: [],
      userGroup: [],
      formData: {
        mid: this.$route.query.mid,
        face_number: '',
        memo: '',
        number: '',
        group_id: '',
        deposit_code: '',
        payment_typeid: ''
      },
      rules: {
        payment_typeid: [
          { required: true, message: this.$t('webMemberList.payment'), trigger: "change" }
        ],
        deposit_code: [
          { required: true, message: this.$t('webMemberList.ruleNumber'), trigger: "blur" }
        ],
        group_id: [
          { required: true, message: this.$t('webMemberDetail.userTeam'), trigger: "change" }
        ],
      },

    }
  },
  created() {
    console.log(this.hide)
    if (this.hide) this.rules.group_id = [];
    getParms().then(res => {
      this.deposit = res.yajin_money
    })
    getList().then(res => {
      res.forEach(item => {
        this.userGroup.push({
          label: item.name,
          value: item.id,
        })
      });

    })
    paymentIndex(this.searchForm).then(res => {
      res.records.forEach(item => {
        if (item.id != 1 && item.id != 3) {
          this.options.push({
            label: item.title,
            value: item.id,
          });
        }
      })
    });


  },
  mounted() {
    const _this = this
    document.onkeydown = function (e) { // 回车提交表单
      // 兼容FF和IE和Opera
      var theEvent = window.event || e;
      var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      if (code == 13) {
        _this.save()
      }
    }
  },
  methods: {
    async save() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          if (this.hide) {
            this.$confirm(this.$t('webMemberList.dialog_deposit'), this.$t('webMemberList.tip'), {
              confirmButtonText: this.$t('webAdvert.confirm'),
              cancelButtonText: this.$t('webAdvert.cancel'),
              type: 'warning'
            }).then(() => {
              this.formData.group_id = this.formData.group_id.join(",")
              againUpDeposit(this.formData).then(res => {
                this.$message({
                  type: 'success',
                  message: '充值成功!'
                });
                setTimeout(() => {
                  this.$router.go(-1)
                }, 1500);
              })
            })
          } else {
            this.$confirm(this.$t('webMemberList.dialog_user'), this.$t('webMemberList.tip'), {
              confirmButtonText: this.$t('webAdvert.confirm'),
              cancelButtonText: this.$t('webAdvert.cancel'),
              type: 'warning'
            }).then(() => {
              this.formData.group_id = this.formData.group_id.join(",")
              memberAuth(this.formData).then(res => {
                this.$message({
                  type: 'success',
                  message: this.$t('webMemberList.successful')
                });
                setTimeout(() => {
                  this.$router.go(-1)
                }, 1500);
              })
            })
          }

        }
      });
    }
  }
}
</script>

<style scoped>
</style>
