<template>
    <div id="shopDialog">
        <el-dialog :title="title" :visible.sync="show" @close="cancel">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item :label="$t('webMerchant.dia_shop_name')" prop="shop_name">
                    <el-input
                        class="wd-50"
                        v-model="form.shop_name"
                        autocomplete="off"
                        :placeholder="$t('webMerchant.rules_shop_name')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webMerchant.dia_address')" prop="address">
                    <el-input
                        class="wd-70"
                        v-model="form.address"
                        :placeholder="$t('webMerchant.rules_address')"
                        suffix-icon="el-icon-location-outline"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('webMerchant.dia_phone')" prop="mobile">
                    <el-input
                        class="wd-50"
                        v-model="form.mobile"
                        :placeholder="$t('webMerchant.rules_phone')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="status">
                    <el-radio v-model="form.status" label="1">{{$t('webMerchant.shopStatusOpen')}}</el-radio>
                    <el-radio v-model="form.status" label="2">{{$t('webMerchant.shopStatusStop')}}</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
                <el-button type="primary" @click="submitForm">{{$t('webBaseBtn.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { operateAdd, operateInfo } from "@/api/merchant";
export default {
    name: 'indexDialog',
    data() {
        let self = this;
        return {
            show: false,
            id: '',
            upload: false,
            form: {
                shop_name: '',
                status: '1',
                address: '',
                mobile: ''
            },
            rules: {
                shop_name: [
                    { required: true, message: this.$t('webMerchant.rules_shop_name'), trigger: 'blur' },
                ],
                address: [
                    { required: true, message: this.$t('webMerchant.rules_address'), trigger: 'blur' },
                ],
                mobile: [
                    { required: true, message: this.$t('webMerchant.rules_phone'), trigger: 'blur' },
                ],
                status: []
            },
            zoom: 12,
            center: [116.440396, 40.08535],
            events: {
                click(e) {
                    let { lng, lat } = e.lnglat;
                    self.lng = lng;
                    self.lat = lat;

                    // 这里通过高德 SDK 完成。
                    var geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: "all"
                    });
                    geocoder.getAddress([lng, lat], function (status, result) {
                        console.log(result)
                        self.markers = [];
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.regeocode) {
                                self.form.address = result.regeocode.formattedAddress;
                                self.init();
                                self.$nextTick();
                            }
                        }
                    });
                }
            },
            lng: 0,
            lat: 0,
            loading: true,
            // plugin: this.getLocation(),
            markers: [],
            searchOption: {
                city: '',
                citylimit: false
            },
            mapShow: false,
        }
    },
    props: {
        title: String,
    },
    watch: {
        upload(val) {
            console.log(val)
            // this.plugin = this.getLocation();
        },
        id(val) {
            this.initData()
        }
    },
    created() {

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
        getLocation() {
            const self = this;
            this.mapShow = true;
            return [{
                pName: 'Geolocation',
                events: {
                    init(o) {
                        // o 是高德地图定位插件实例
                        o.getCurrentPosition((status, result) => {
                            console.log(result.formattedAddress)
                            if (result && result.position) {
                                self.lng = result.position.lng;
                                self.lat = result.position.lat;
                                self.center = [self.lng, self.lat];
                                self.loading = false;
                                self.form.address = result.formattedAddress;
                                self.init();
                                self.$nextTick();
                                if (self.id) {
                                    self.initData();
                                }
                            }
                        });
                    }
                }
            }]
        },
        async initData() {
            const res = await operateInfo({ shop_id: this.id });
            console.log(res);
            this.form = {
                shop_name: res.shop_name,
                status: res.status.toString(),
                address: res.address,
                mobile: res.mobile
            };
            this.lng = res.lng;
            this.lat = res.lat;
        },
        submitForm() {
            this.$refs['ruleForm'].validate(async (valid) => {
                if (valid) {
                    const form = {
                        shop_id: this.id,
                        lng: this.lng,
                        lat: this.lat
                    };
                    Object.assign(form, this.form)
                    await operateAdd(form);
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
                    this.$parent.init();
                }
            });
        },
        cancel() {
            this.$refs['ruleForm'].resetFields();
            this.show = false;
            this.mapShow = false;
            this.form = {
                shop_name: '',
                status: '1',
                address: ''
            }
        },
        init() {
            const that = this;
            this.markers.push(
                {
                    position: [that.lng, that.lat],
                    events: {
                        click: () => {

                        }
                    },
                    visible: true,
                    draggable: false,
                }
            );
        },
        onSearchResult(pois) {
            this.markers = [];
            console.log(pois)
            let latSum = 0;
            let lngSum = 0;
            if (pois.length > 0) {
                pois.forEach(poi => {
                    let { lng, lat } = poi;
                    lngSum += lng;
                    latSum += lat;
                    // this.markers.push([poi.lng, poi.lat]);
                    this.markers.push({
                        position: [poi.lng, poi.lat],
                        events: {
                            click: () => {
                                this.form.address = poi.name;
                                this.lng = poi.lng;
                                this.lat = poi.lat;
                            },
                        },
                        visible: true,
                        draggable: false,
                    });
                });
                let center = {
                    lng: lngSum / pois.length,
                    lat: latSum / pois.length
                };
                this.center = [center.lng, center.lat];
            }
        }
    }
}
</script>

<style scoped>
.amap-demo {
  height: 300px;
}
.search-box {
  position: absolute;
  top: 25px;
  left: 20px;
}
.amap-page-container {
  position: relative;
}
</style>
