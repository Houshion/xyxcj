<template>
    <div>
        <el-table
                ref="multipleTable"
                :data="data"
                tooltip-effect="dark"
                :highlight-current-row="true"
                @select-all="selectAll"
                style="width: 100%"
                border
                @selection-change="handleSelectionChange"
        >
            <template v-if="checkbox">
                <el-table-column type="selection"></el-table-column>
            </template>
            <template v-for="item in columns">
                <el-table-column
                        :label="item.label"
                        :width="item.width ? item.width : 'auto' "
                        :align="item.align||'center'"
                >
                    <template slot-scope="scope">
                        <slot :scope="scope" :name="item.key" v-if="item.type =='types'">{{ scope.row[item.key] == '11' ? '格子柜' : (scope.row[item.key] == '12' ? '弹簧柜' : (scope.row[item.key] == '13' ? 'RFID' : ({'称重' : scope.row[item.key] == '14'}))) }}</slot>

                        <slot :scope="scope" :name="item.key" v-if=" !item.type ">{{ scope.row[item.key] }}</slot>

                        <slot :scope="scope" :name="item.key" v-if=" item.type == 'images' ">
                            <el-popover trigger="hover" placement="right">
                                <img style="width: 200px;height: 200px;object-fit: contain" :src="scope.row[item.key]" alt="">
                                <div slot="reference" class="name-wrapper">
                                    <img style="width: 48px;height: 48px;object-fit: contain;display: block;margin: 0 auto;" :src="scope.row[item.key]" alt="">
                                </div>
                            </el-popover>
                        </slot>

                        <slot :scope="scope" :name="item.key" v-if=" item.type == 'role' ">{{
                            scope.row[item.type].length > 0 ? scope.row[item.type][0][item.key] : '无' }}
                        </slot>

                        <slot :scope="scope" :name="item.key" v-if=" item.type == 'status' ">{{ scope.row[item.key] == 1 ? item.status_name[0] : ( scope.row[item.key] == 0 ? item.status_name[1] : item.status_name[2]) }}</slot>

                        <slot :scope="scope" :name="item.key" v-if=" item.type == 'spec' ">{{ scope.row[item.key[0]]}} * {{ scope.row[item.key[1]] }}
                        </slot>

                        <template v-if=" item.type == 'time' ">
                            <slot :scope="scope" :name="item.key" >{{ scope.row[item.key] | parseTime }}
                            </slot>
                        </template>

                        <template v-if=" item.type == 'times' ">
                            <slot :scope="scope" :name="item.key" >{{ scope.row[item.key[0]] | parseTime }}
                            </slot>-
                            <slot :scope="scope" :name="item.key" >{{ scope.row[item.key[1]] | parseTime }}
                            </slot>
                        </template>
                    </template>
                </el-table-column>
            </template>

            <el-table-column align="center" :label="itemSlot.title" v-for="itemSlot in tableSlot" :width="itemSlot.width ? itemSlot.width : 'auto'">
                <template slot-scope="scope">
                    <div class="typeSwitch" align="center" v-if="itemSlot.type=='switch'">
                        <el-switch
                                v-model="scope.row.status"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                :width="60"
                                :active-value="1"
                                :inactive-value="0"
                                @change="switchChange(scope.row,$event)"
                                :active-text="itemSlot.switch_name[1]"
                                :inactive-text="itemSlot.switch_name[0]"
                        ></el-switch>
                    </div>
                    <div class="typeButton" v-if="itemSlot.type=='btn'">
                        <template v-for="i in itemSlot.slot">
                            <el-button
                                    v-if="i.type !== 'more' "
                                    size="mini"
                                    :type="i.buttontype"
                                    @click="handleButton(scope.$index, scope.row, i.methods)"
                            >
                                {{ i.name }}
                            </el-button>

                            <el-dropdown v-else class="ml10" trigger="click" @command="handleCommand">
                                <el-button size="mini">
                                    {{ i.name }}
                                    <i class="el-icon-arrow-down"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="itemMore in i.more" :command="[scope.row, itemMore.key]">{{ itemMore.name }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <template v-if="batchShow">
            <div class="mt20 layout-jcsb">
                <batch :batchList="batchList" :isIndeterminate="isIndeterminate" @batchSubmit="batchSubmit" :selectAllChecked="select_all_checked"/>
                <!--<el-button class="mr10" @click="exportExcel" type="primary" size="mini" icon="el-icon-download-->
<!--">导出</el-button>-->
            </div>
        </template>
        <template v-if="pages">
            <el-pagination
                    class="mt30"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="current"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </template>
    </div>
</template>

<script>
    import { parseTime } from '@/utils'
    import batch from './batch'

    export default {
        components : {
            batch
        },
        provide () {
            return {
                _that : this
            }
        },
        data () {
            return {
                ids      : [],
                selection_list:[],
                select_all_checked : false,
                isIndeterminate : false,
                tableItems : [],
            }
        },
        props : {
            data : {
                type : Array,
                required : true,
                default : () => []
            },
            batchList : {
                type:Array,
                // required : true,
                default :function () {
                    return [{ name: '删除',key:'1', }]
                }
            },
            // height:{
            //     type:String,
            //     default: false
            // },
            pages : {
                type: Boolean,
                default : true
            },
            pageSize : {
                type : Number,
                default : 10,
            },
            current : {
                type : Number,
                default : 1,
            },
            status : {
                type : Number,
                default : 1,
            },
            total : {
                type : Number,
            },
            loading : {
                type : Boolean,
                default : false
            },
            checkbox : {
                type : Boolean,
                default : false
            },
            columns : {
                type : Array,
                default : () => []
            },
            tableSlot : {
                type : Array,
                default : () => []
            },
            batchShow : {
                type: Boolean,
                default : false,
            }
        },
        filters : {
            parseTime ( data ) {
                let time = new Date (data * 1000)
                return parseTime (time, '{y}:{m}:{d}')
            }
        },
        methods : {
            handleSelectionChange (item) {
                console.log(item)
                if(item.length == this.data.length)
                {
                    this.select_all_checked = true;
                }else if(item.length == 0){
                    this.isIndeterminate = false;
                    this.select_all_checked = false;
                }else {
                    this.isIndeterminate = true
                }
                this.selection_list = item
                // this.ids = item.map((item,val,index)=>{
                //     return item.mid ? item.mid : (item.device_id ? item.device_id : item.type_id)
                // }).join(",")
                // console.log(this.ids)
            },
            selectAll (val)
            {
                console.log(val)
                if(val.length == 0) return this.select_all_checked = false;
                this.select_all_checked = true;
                this.isIndeterminate = false;
                console.log('1111')
                // this.select_all_checked = !this.select_all_checked
            },
            batchSubmit (val) {
                this.$emit ('batchSubmit', val, this.selection_list)
            },
            handleButton ( index, item, name ) {
                // console.log(index,item,e);
                this.$emit ('handleButton', index,item,name)
            },
            handleCommand ( command ) {
                this.$emit( 'command', command)
            },
            handleSizeChange (val) {
                this.$emit( 'sizeChange', val)
            },
            handleCurrentChange (val) {
                this.$emit( 'currentChange', val)
            },
            switchChange(item, val){
                this.$emit('switchChange', item, val)
            },
            exportExcel () {
                let label = this.columns.map((item,val,index)=>{
                    return item.label
                })
                let key = this.columns.map((item,val,index)=>{
                    return item.key
                })
                let status_name = this.columns.map((item,val,index)=>{
                    return item.status_name
                })
                // const data = this.formatJson(key, this.data, status_name)
                // for(var i in this.data)
                // {
                //     // this.data[i]
                // }
                console.log(data)
                // return;
                // import('@/vendor/Export2Excel').then(excel => {
                //     // const tHeader = this.columns
                //     excel.export_json_to_excel({
                //         header: label, //表头 必填
                //         data:this.data, //具体数据 必填
                //         filename: 'excel-list', //非必填
                //         autoWidth: true, //非必填
                //         bookType: 'xlsx' //非必填
                //     })
                // })
            },
            formatJson(filterVal, jsonData, statusName) {
                return jsonData.map(v => filterVal.map(j =>{
                    console.log(j)
                    if (j === 'status') {
                        // return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            }
        }
    }
</script>
