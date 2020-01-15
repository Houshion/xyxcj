<!-- vateSetUp -->
<template>
    <div id="vateSetUp" class="pd-10 bfff">
        <el-form
            :model="form"
            ref="form"
            :rules="rules"
            label-width="120px"
            class="wd-50"
            label-position="top"
        >
            <el-form-item :label="$t('webMemberMoneySettings.give_money')" prop="money">
                <el-input v-model.number="form.money">
                    <template slot="prepend">$</template>
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('webMemberMoneySettings.extra_money')" prop="sendMoney">
                <el-input v-model.number="form.sendMoney">
                    <template slot="prepend">$</template>
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('webMemberMoneySettings.invite_money')" prop="getMoney">
                <el-input v-model.number="form.getMoney">
                    <template slot="prepend">$</template>
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('webMemberMoneySettings.moneySet')" prop="yajin_money">
                <el-input v-model.number="form.yajin_money">
                    <template slot="prepend">$</template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">{{$t('webMemberMoneySettings.save')}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getParms, setParms } from "@/api/setUp";
export default {
    name: 'vateSetUp',
    data() {
        return {
            form: {
                money: '',
                sendMoney: '',
                getMoney: '',
                yajin_money: '',
                id: ''
            },
            rules: {
                money: [
                    { required: true, message: this.$t('webMemberMoneySettings.pleaseEnterMoney'), trigger: 'blur' },
                    { type: 'number', message: this.$t('webMemberMoneySettings.moenyIsNumber'), trigger: 'blur' }
                ],
                sendMoney: [
                    { required: true, message: this.$t('webMemberMoneySettings.pleaseEnterMoney'), trigger: 'blur' },
                    { type: 'number', message: this.$t('webMemberMoneySettings.moenyIsNumber'), trigger: 'blur' }
                ],
                getMoney: [
                    { required: true, message: this.$t('webMemberMoneySettings.pleaseEnterMoney'), trigger: 'blur' },
                    { type: 'number', message: this.$t('webMemberMoneySettings.moenyIsNumber'), trigger: 'blur' }
                ],
                yajin_money: [
                    { required: true, message: this.$t('webMemberMoneySettings.pleaseEnterMoney'), trigger: 'blur' },
                    { type: 'number', message: this.$t('webMemberMoneySettings.moenyIsNumber'), trigger: 'blur' }
                ],

            }
        };
    },
    components: {},
    computed: {},
    created() {
        const _this = this
        this.init()
    },
    mounted() {
        const _this = this
        document.onkeydown = function (e) { // 回车提交表单
            // 兼容FF和IE和Opera
            var theEvent = window.event || e;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                _this.onSubmit()
            }
        }
    },
    methods: {
        async init() {
            let res = await getParms({});
            console.log(res)
            this.form = {
                money: res.give_money * 1,
                sendMoney: res.extra_money * 1,
                getMoney: res.invite_money * 1,
                yajin_money: !res.yajin_money * 1 ? '' : res.yajin_money * 1,
                id: res.id
            };
        },
        async onSubmit() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    const form = {
                        id: this.form.id,
                        give_money: this.form.money,
                        extra_money: this.form.sendMoney,
                        invite_money: this.form.getMoney,
                        yajin_money: this.form.yajin_money
                    };
                    let res = await setParms(form);
                    console.log(res)
                    this.$message({
                        message: this.$t('webBaseTips.submitSuccess'),
                        type: 'success',
                        showClose: true,
                    });
                    this.init();
                }
            });
        }
    }
};
</script>
<style scoped lang='less'>
</style>
