<template>
    <div id="expenditureDialog">
        <!-- 创建角色Dialog -->
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="rechargeForm" :rules="rules" ref="rechargeForm">
                <template v-for="(item,index) in rechargeForm.goods">
                    <el-form-item
                        :label="$t('webOrderExpend.dia_payType')"
                        :prop="'goods.'+index+'.payType'"
                        :rules="{
                            required: true, message: $t('webOrderExpend.dia_payType'), trigger: 'change'
                        }"
                    >
                        <el-select class="wd-50" v-model="item.payType">
                            <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        :label="$t('webOrderExpend.dia_payExplain')"
                        :prop="'goods.'+index+'.payExplain'"
                        :rules="{
                            required: true, message: $t('webOrderExpend.dia_payExplain'), trigger: 'change'
                        }"
                    >
                        <el-input class="wd-50" v-model="item.payExplain"></el-input>
                    </el-form-item>
                    <el-form-item
                        :label="$t('webOrderExpend.dia_img')"
                        :prop="'goods.'+index+'.img'"
                        :rules="{
                            required: true, message: $t('webOrderExpend.dia_img'), trigger: 'change'
                        }"
                        v-if="false"
                    >
                        <omg @goUpload="uploads" :index="index" type="single" :singleImg="item.img"></omg>
                    </el-form-item>
                  <el-form-item
                    :label="$t('webOrderExpend.dia_img')"
                  >
                    <omg @goUpload="uploads" :index="index" type="single" :singleImg="item.img"></omg>
                  </el-form-item>
                </template>
                <el-form-item label="">
                    <el-button
                        type="primary"
                        round
                        @click="addNewType"
                    >{{$t('webOrderExpend.dia_addNewType')}}</el-button>
                </el-form-item>
                <el-form-item :label="$t('webOrderExpend.dia_money')" prop="money">
                    <el-input class="wd-50" v-model="rechargeForm.money"></el-input>
                </el-form-item>
                <el-form-item :label="$t('webOrderExpend.dia_payWay')">
                    <el-input class="wd-50" v-model="rechargeForm.payWay" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('webOrderExpend.dia_explain')" prop="explain">
                    <el-input
                        class="wd-50"
                        v-model="rechargeForm.explain"
                        :placeholder="$t('webOrderExpend.dia_explain')"
                    ></el-input>
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
import { upload } from "@/api/imgFile";
import omg from "@/components/uploadImg";
import { expensesTypeList } from "@/api/merchant";
import { expensesAdd, expensesEdit, expensesShow } from "@/api/order";
import tools from '@/utils/tools';
export default {
    name: 'expenditureDialog',
    data() {
        return {
            show: false,
            id: '',
            upload_status: false,
            rechargeForm: {
                explain: this.$t('webBaseMessage.none'),
                money: '',
                goods: [
                    { payType: '', payExplain: '', img: "" }
                ],
                payWay: this.$t('webOrderExpend.payWay')
            },
            options: [],
            rules: {
                money: [
                    { required: true, message: this.$t('webOrderExpend.money'), trigger: 'blur' }
                ],
                explain: [
                    { required: true, message: this.$t('webOrderExpend.explain'), trigger: 'blur' }
                ],
            },
        }
    },
    props: {
        title: String,
    },
    watch: {
        upload_status(val) {
            console.log(val)
            this.List();
            if (this.id) {
                this.init();
            }
        },
    },
    components: { omg },
    created() {

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
        async init() {
            const res = await expensesShow({ oid: this.id });
            console.log(res);
            const goods = [];
            res.invoice_goods.forEach(itemName => {
                goods.push({
                    payType: itemName.goods_info.expenses_type,
                    payExplain: itemName.goods_info.goods_name,
                    img: itemName.goods_info.goods_img,
                });
            })

            console.log(goods)
            this.rechargeForm = {
                money: res.payment_money,
                explain: res.memo,
                payWay: this.$t('webOrderExpend.payWay'),
                goods
            }
        },
        async uploads(file, index) {
            console.log(index)
            const _this = this;
            // 上传单图头像
            _this.uploadParam = new FormData();
            _this.uploadParam.append("img", file, file.name);
            _this.uploadParam.append("type", '3');

            let res = await upload(_this.uploadParam);
            _this.rechargeForm.goods[index].img = tools.globalData.url + res.savepath
        },
        //新增支出类型
        addNewType() {
            this.rechargeForm.goods.push({ payType: '', payExplain: '', img: "" });
        },
        // 新增支出订单确认
        async ruleConfirm() {
            this.$refs['rechargeForm'].validate(async valid => {
                if (valid) {
                    const data = this.rechargeForm;
                    const goods = [];
                    this.rechargeForm.goods.forEach(item => {
                        goods.push({
                            expenses_type: item.payType,
                            goods_name: item.payExplain,
                            goods_img: item.img,
                        })
                    })
                    const form = {
                        oid: this.id,
                        goods: JSON.stringify(goods),
                        payment_money: data.money,
                        memo: data.explain,
                    };
                    if (this.id) {
                        await expensesEdit(form)
                        this.$message({
                            type: 'success',
                            message: this.$t('webOrderExpend.editConfirm')
                        });
                    } else {
                        await expensesAdd(form)
                        this.$message({
                            type: 'success',
                            message: this.$t('webOrderExpend.editConfirm')
                        });
                    }
                    this.show = false;
                    this.$emit("uploadEvent", '1');
                }
            });
        },
        List() {
            const form = {
                pageNo: 1,
                pageSize: 999,
            }
            expensesTypeList(form).then(res => {//支付方式
                this.options = res.records;
            });
        },
        cancel() {//取消
            this.$refs["rechargeForm"].resetFields();
            this.show = false;
        },
    }
}
</script>

<style scoped>
</style>
