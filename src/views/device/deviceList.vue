<template>
    <div id="deviceList">
        <div class="mg-t-5 bfff pd-10">
            <el-row :gutter="10" class="mg-t-5">
                <el-col :span="12">
                    <el-button
                        type="primary"
                        icon="el-icon-circle-plus-outline"
                        @click="openDialog('add')"
                    >{{dialogMsg.title}}</el-button>
                    <el-button
                        type="primary"
                        icon="el-icon-circle-plus-outline"
                        @click="getDownload"
                    >{{$t('webDeviceList.download')}}</el-button>
                </el-col>
                <el-col :span="12" class="tar">
                    <import-excel :on-success="handleSuccess" :before-upload="beforeUpload"/>
                </el-col>
            </el-row>
            <el-form :model="recordForm">
                <el-row :gutter="10" class="mg-t-5">
                    <el-col :span="3">
                        <el-form-item>
                            <el-input
                                :placeholder="$t('webDeviceList.search_title')"
                                v-model="recordForm.title"
                            >
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-input
                                :placeholder="$t('webDeviceList.search_macno')"
                                v-model="recordForm.macno"
                            >
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-select
                                v-model="recordForm.shop_name"
                                :placeholder="$t('webDeviceList.search_shop_name')"
                            >
                                <el-option
                                    v-for="item in shops"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.label"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-select
                                v-model="recordForm.open"
                                :placeholder="$t('webDeviceList.search_open')"
                            >
                                <el-option :label="$t('webDeviceList.statusOpen')" value="1"></el-option>
                                <el-option :label="$t('webDeviceList.statusStop')" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-select
                                v-model="recordForm.status"
                                :placeholder="$t('webDeviceList.search_status')"
                            >
                                <el-option :label="$t('webDeviceList.statusOn')" value="1"></el-option>
                                <el-option :label="$t('webDeviceList.statusOff')" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" class="tar">
                        <search-btn @search="search" @reset="reset"></search-btn>
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
                @pageChange="pageChange"
                @sizeChange="sizeChange"
            >
                <template slot="shareQrcode" slot-scope="slot">
                    <img
                        :src="slot.data.shareQrcode"
                        alt=""
                        class="qrCode"
                        @click="showCode(slot.data.shareQrcode)"
                    >
                </template>
                <template
                    slot="open"
                    slot-scope="slot"
                >{{slot.data.open==1?$t('webDeviceList.statusOpen'):$t('webDeviceList.statusStop')}}</template>
                <template slot="status" slot-scope="slot">
                    <span
                        :class="slot.data.status==1?'csuccess':'cdanger'"
                    >{{slot.data.status==1?$t('webDeviceList.statusOnLine'):$t('webDeviceList.statusOffLine')}}</span>
                </template>
                <template
                    slot="sense_status"
                    slot-scope="slot"
                >{{slot.data.sense_status==1?$t('webDeviceList.statusOn'):$t('webDeviceList.statusOff')}}</template>
                <template slot="createtime" slot-scope="slot">{{slot.data.createtime|timeStr}}</template>
            </o-table>
            <oDialog ref="deviceListDialog" :title="dialogMsg.title" :shops="shops"></oDialog>
            <el-dialog
                :title="$t('webDeviceList.qrCode')"
                width="600px"
                :visible.sync="deviceCode.show"
                @close="deviceCode.show=false"
            >
                <div class="box">
                    <img :src="deviceCode.img">
                </div>
                <span slot="footer">
                    <el-button
                        type="primary"
                        @click="deviceCode.show=false"
                    >{{$t('webBaseBtn.confirm')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { deviceList, setSenseStatus, deviceDel, sellerDeviceList, sellerSetSenseStatus, multi_add } from "@/api/device";
import { operateIndex } from "@/api/merchant";
import oDialog from "./components/deviceListDialog";
import importExcel from '@/components/UploadExcel/index.vue'
export default {
    name: 'deviceList',
    data() {
        return {
            dialogMsg: {
                title: this.$t('webDeviceList.titleAdd'),
            },
            recordForm: {
                title: '',
                macno: '',
                shop_name: '',
                open: '',
                status: '',
            },
            tableTitle: [
                { prop: "title", label: this.$t('webDeviceList.title'), width: "auto" },
                { prop: "macno", label: this.$t('webDeviceList.macno'), width: "100" },
                { prop: "shareQrcode", label: this.$t('webDeviceList.shareQrcode'), width: "120", custom: true },
                { prop: "shop_name", label: this.$t('webDeviceList.shop_name'), width: "auto" },
                { prop: "order_count", label: this.$t('webDeviceList.order_count'), width: "auto" },
                { prop: "order_payment", label: this.$t('webDeviceList.order_payment'), width: "auto" },
                { prop: "open", label: this.$t('webDeviceList.open'), width: "auto", custom: true },
                { prop: "status", label: this.$t('webDeviceList.status'), width: "auto", custom: true },
                { prop: "sense_len", label: this.$t('webDeviceList.sense_len'), width: "auto" },
                { prop: "sense_status", label: this.$t('webDeviceList.sense_status'), width: "auto", custom: true },
                { prop: "createtime", label: this.$t('webDeviceList.createtime'), width: "100", custom: true },
            ],
            //   表头信息，prop对应
            tableSlot: [
                {
                    title: this.$t('webBaseMessage.operation'),
                    slotType: "btn",
                    width: '255 ',
                    buttontype: "info", // text为文字按钮，默认不传为正常按钮
                    slot: [
                        { label: this.$t('webBaseBtn.edit'), type: "edit" },
                        { label: this.$t('webBaseBtn.dele'), type: "dele" },
                        { label: this.$t('webDeviceList.changeStatus'), type: "close" },
                    ],
                }
            ],
            tableData: [],
            pageMsg: {
                status: true,
                page: 1,
                size: 10,
                sizes: [10, 20, 50, 100],
                total: 0
            },
            shops: [],
            excel: {
                tableData: [],
                tableHeader: []
            },
            deviceCode: {
                show: false
            }
        };
    },
    components: {
        oDialog,
        importExcel
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ])
    },
    created() {
        const _this = this
        this.recordForm.pageSize = this.pageMsg.size
        this.init()
        operateIndex({ pageSize: 999 }).then(res => {
            res.records.forEach(item => {
                this.shops.push(
                    { label: item.shop_name, value: item.shop_id, }
                )
            });
        })
        if (this.userInfo.type == 1) {
            console.log(this.userInfo)
        }
    },
    methods: {
        async init() {
            let res;
            const form = {
                pageNo: this.pageMsg.page,
                pageSize: this.pageMsg.size,
                ...this.recordForm
            }
            if (this.userInfo.type == 1) {
                res = await deviceList(form)
            } else {
                res = await sellerDeviceList(form)
            }
            this.pageMsg.total = res.total
            this.tableData = res.records
        },
        pageChange(val) {//分页页数改变
            this.pageMsg.page = val;
            this.init();
        },
        sizeChange(val) {//分页条数改变
            this.pageMsg.size = val;
            this.init();
        },
        btnFunc(index, type) {
            const _this = this;
            console.log(index, type);
            const id = this.tableData[index].id
            this.openDialog(type, this.tableData[index])
        },
        openDialog(type, item) {
            const _this = this;
            console.log(type)
            const id = item ? item.id : ''
            this.$refs.deviceListDialog.form.id = id
            switch (type) {
                case 'add':
                    this.$refs.deviceListDialog.show = true
                    break;
                case 'edit':
                    this.$refs.deviceListDialog.show = true
                    break;
                case "dele":
                    this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                        confirmButtonText: this.$t('webBaseBtn.confirm'),
                        cancelButtonText: this.$t('webBaseBtn.cancel'),
                        type: 'warning'
                    }).then(() => {
                        deviceDel({ id }).then(res => {
                            this.$message({
                                type: 'success',
                                message: this.$t('webBaseTips.deleSuccess')
                            });
                            this.init()
                        })
                    })
                    break;
                case "close":
                    this.$confirm(this.$t('webDeviceList.changeConfirm'), this.$t('webBaseTips.confirm'), {
                        confirmButtonText: this.$t('webBaseBtn.confirm'),
                        cancelButtonText: this.$t('webBaseBtn.cancel'),
                        type: 'warning'
                    }).then(async () => {
                        if (this.userInfo.type == 1) {
                            await setSenseStatus({ id })
                        } else {
                            await sellerSetSenseStatus({ id })
                        }
                        this.$message({
                            message: this.$t('webBaseTips.editConfirm'),
                            type: 'success',
                            showClose: true,
                        });
                        this.init()
                    })
                    break;
            }
        },
        search() {
            this.recordForm.pageNo = 1;
            this.init()
        },
        dele(id) {
            this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
                confirmButtonText: this.$t('webBaseBtn.confirm'),
                cancelButtonText: this.$t('webBaseBtn.cancel'),
                type: 'warning'
            }).then(async () => {
                await deviceDel({ id })
                this.$message({
                    type: 'success',
                    message: this.$t('webBaseTips.deleSuccess')
                });
                this.init()
            });
        },
        reset() {
            this.recordForm = {
                title: '',
                macno: '',
                shop_name: '',
                open: '',
                status: '',
            }
        },
        // batchSubmit(type, val) {
        //     if (type == 1 && val.length > 0) {
        //         this.dele(val.join(','))
        //     }
        // },
        beforeUpload(file) {
            const isLt1M = file.size / 1024 / 1024 < 1
            if (isLt1M) {
                return true
            }
            this.$message({
                message: this.$t('webDeviceList.uploadLimit'),
                type: 'warning'
            })
            return false
        },
        handleSuccess({ results, header }) {
            // console.log(results, header)
            let param = [];
            results.forEach(item => {
                param.push(
                    { title: item['设备名称'], macno: item['设备号'], shop: item['所属分店'] }
                )
            });
            param = JSON.stringify(param)
            multi_add({ param }).then(res => {
                console.log(res)
                this.init()
            })
            // this.excel.tableData = results
            // this.excel.tableHeader = header
        },
        getDownload() {
            // location.href = 'http://xueyuexyj.app.xiaozhuschool.com/excel/device.xls'
            location.href = 'http://app.alicar.com.hk/excel/device.xls'
        },
        showCode(img) {
            this.deviceCode.show = true
            this.deviceCode.img = img
        }
    }
}
</script>
<style scoped lang='scss'>
#deviceList {
  .qrCode {
    width: 100px;
    height: 100px;
  }
}
</style>
