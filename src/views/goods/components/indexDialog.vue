<!-- goodsDialog -->
<template>
    <div id="goodsDialog">
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item :label="$t('webGoodsList.dia_goods_name')" prop="goods_name">
                    <el-input
                        class="wd-50"
                        v-model="form.goods_name"
                        :placeholder="$t('webGoodsList.rules_goods_name')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webGoodsList.dia_retail_price')" prop="retail_price">
                    <el-input
                        class="wd-50"
                        v-model.number="form.retail_price"
                        :placeholder="$t('webGoodsList.rules_retail_price')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webGoodsList.dia_goods_type')" prop="goods_type">
                    <el-select
                        class="wd-50"
                        v-model="form.goods_type"
                        :placeholder="$t('webGoodsList.rules_goods_type')"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.type_id"
                            :label="item.type_name"
                            :value="item.type_id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('webGoodsList.dia_detail')" prop="detail">
                    <el-input
                        type="textarea"
                        :rows="3"
                        class="wd-50"
                        v-model="form.detail"
                        :placeholder="$t('webGoodsList.rules_detail')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webGoodsList.dia_barcode')" prop="barcode">
                    <el-input
                        class="wd-50"
                        v-model="form.barcode"
                        :placeholder="$t('webGoodsList.rules_barcode')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webGoodsList.dia_status')" prop="status">
                    <el-select
                        class="wd-50"
                        v-model="form.status"
                        :placeholder="$t('webGoodsList.rules_status')"
                    >
                        <el-option
                            v-for="item in shopOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { goodsTypeIndex, goodsAdd, goodsInfo } from "@/api/goods";
export default {
    props: {
        title: String,
    },
    name: 'goodsDialog',
    data() {
        return {
            show: false,
            id: '',
            upload: false,
            form: {
                goods_name: '',
                detail: '',
                goods_type: '',
                retail_price: '',
                barcode: '',
                status: 1
            },
            rules: {
                goods_type: [
                    { required: true, message: this.$t('webGoodsList.rules_goods_name'), trigger: 'change' }
                ],
                goods_name: [
                    { required: true, message: this.$t('webGoodsList.rules_retail_price'), trigger: 'blur' },
                ],
                detail: [
                    { required: true, message: this.$t('webGoodsList.rules_detail'), trigger: 'blur' }
                ],
                barcode: [],
                status: [],
                retail_price: [
                    { required: true, message: this.$t('webGoodsList.rules_retail_price') },
                    { type: 'number', message: this.$t('webGoodsList.rules_retail_price_num') }
                ],
            },
            options: [],
            shopOptions: [
                { value: 1, label: this.$t('webGoodsList.goodsStatus_up') },
                { value: 0, label: this.$t('webGoodsList.goodsStatus_down') },
                { value: 2, label: this.$t('webGoodsList.goodsStatus_apply') },
            ]
        };
    },
    computed: {},
    watch: {
        upload(val) {
            if (this.id) {
                this.init();
            }
        }
    },
    created() {
        this.List();
    },
    mounted() {
        const _this = this
        document.onkeydown = function (e) { // 回车提交表单
            // 兼容FF和IE和Opera
            var theEvent = window.event || e;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                _this.submitForm()
            }
        }
    },
    methods: {
        async init() {
            const res = await goodsInfo({ goods_id: this.id });
            this.form = {
                goods_name: res.find.goods_name,
                detail: res.find.detail,
                goods_type: res.find.goods_type,
                retail_price: res.find.retail_price * 1,
                barcode: res.find.barcode,
                status: res.find.status
            };
        },
        submitForm() {
            this.$refs["ruleForm"].validate(async (valid) => {
                if (valid) {
                    const form = {
                        goods_id: this.id,
                    }
                    Object.assign(form, this.form);
                    await goodsAdd(form);
                    if (this.id) {
                        this.$message({
                            type: 'success',
                            message: this.$t('webBaseTips.editConfirm')
                        });
                    } else {
                        this.$message({
                            type: 'success',
                            message: this.$t('webBaseTips.editConfirm')
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
                pageSize: 999
            };
            goodsTypeIndex(form).then(res => {
                this.options = res.records;
            });
        },
        cancel() {
            this.$refs["ruleForm"].resetFields();
            this.show = false;
        }
    },
};
</script>
<style scoped lang='less'>
</style>
