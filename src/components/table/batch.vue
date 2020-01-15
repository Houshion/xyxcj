<!--批量操作-->
<template>
    <div class="ml10 batch">
        <el-checkbox :indeterminate="isIndeterminate" v-model="selectAllChecked" @change="allChecked">{{$t('webBaseMessage.all')}}</el-checkbox>
        <el-select class="ml10 mr10" style="width:120px;" v-model="batchValue" :placeholder="$t('webBaseMessage.batch')">
            <el-option :label="item.name" :value="item.key" v-for="item in batchList"></el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="batchSubmit">{{$t('webBaseMessage.confirm')}}</el-button>
    </div>
</template>
<script>
    export default {
        name: "batch",
        inject:['_that'],
        data () {
            return {
                batchValue:'',
                checked:false,
                // selectAllChecked : false,
            }
        },
        props:{
            batchList : {
                type:Array,
                // required : true,
                default :function () {
                    return [{ name: this.$t('webBaseBtn.dele'),key:'1', }]
                }
            },
            selectAllChecked:{
                type:Boolean,
                default:false,
            },
            isIndeterminate: {
                type:Boolean,
            }
        },
        methods: {
            allChecked( val ){
                if( val ){
                    this._that.$refs.multipleTable.toggleAllSelection();
                }else
                {
                    this._that.$refs.multipleTable.toggleAllSelection()
                }
            },
            batchSubmit () {
                this.$emit("batchSubmit",this.batchValue);
            }
        }
    }
</script>
