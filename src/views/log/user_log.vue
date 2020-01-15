<template>
	<div id="userLog">
		<div class="mg-t-5 bfff pd-10">
			<el-row :gutter="10">
				<el-col :span="4">
					<el-input :placeholder="$t('webLog.operator')" v-model="searchForm.result"></el-input>
				</el-col>
				<el-col :span="4">
					<el-input :placeholder="$t('webLog.mobile')" v-model="searchForm.phone"></el-input>
				</el-col>
				<el-col :span="5">
					<div class="block">
						<el-date-picker class="wd-100" v-model="searchForm.date" type="datetime" :placeholder="$t('webLog.changeDeta')"></el-date-picker>
					</div>
				</el-col>
				<el-col :span="8" class="tar">
					<el-button icon="el-icon-search" type="primary" @click="search">{{$t('webBaseBtn.search')}}</el-button>
					<el-button icon="el-icon-refresh-left" @click="resetForm">{{$t('webBaseBtn.reset')}}</el-button>
				</el-col>
			</el-row>
			<o-table
				class="mg-t-5"
				:loading="loading"
				:tableData="tableData"
				:tableTitle="tableTitle"
				:pageMsg="pageMsg"
        @pageChange="pageChange"
        @sizeChange="sizeChange"
			></o-table>
		</div>
	</div>
</template>

<script>
import { user_log } from '@/api/log'
export default {
	data() {
		return {
			searchForm: {
				phone: '',
				result: '',
				date: ''
			},
			tableTitle: [{
				prop: "id",
				label: this.$t('webLog.tableId'),
				width: "65",
				align: 'center'
			},
			{
				prop: "username",
				label: this.$t('webLog.operator'),
				width: "85",
				align: 'center'
			},
			{
				prop: "ctime",
				label: this.$t('webLog.tableTime'),
				width: "230",
				align: 'center'
			},
			{
				prop: "ip",
				label: this.$t('webLog.tableIp'),
				width: "130",
				align: 'center'
			},
			{
				prop: "mobile",
				label: this.$t('webLog.tableMobile'),
				width: "130",
				align: 'center'
			},
			{
				prop: "message",
				label: this.$t('webLog.tableRecords'),
				width: "auto",
				align: 'center'
			},
			],
			//   表头信息，prop对应
			// 			  tableSlot: [
			// 				{
			// 				  title: "操作记录",
			// 				  slotType: "btn",
			// 				  buttontype: "info", // text为文字按钮，默认不传为正常按钮
			// 				  width: 300,
			// 				  slot: [
			// 					{ label: "信用记录", type: "edit" },
			// 					{ label: "货柜记录", type: "edit" },
			// 					{ label: "商城记录", type: "edit" }
			// 				  ]
			// 				}
			// 			  ],
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
	created() {

	},
	mounted() {
		this.init()
	},
	methods: {
		async init() {
			let form = {
				pageNo: this.pageMsg.page,
				pageSize: this.pageMsg.size,
			}
			let that = this
			user_log(form).then(res => {
				that.tableData = res.records
				that.pageMsg.total = res.total
			})
		},
    pageChange(val) {//分页页数改变
      this.pageMsg.page=val;
      this.init();
    },
    sizeChange(val){//分页条数改变
      this.pageMsg.size=val;
      this.init();
    },
		resetForm() {
			[this.searchForm.phone, this.searchForm.result, this.searchForm.date] = ['', '', '']
		},
		search() {
			// 				switch (true){
			// 					case !this.searchForm.result:
			// 					this.$message('填写操作人');
			// 						break;
			// 					case !this.searchForm.phone:
			// 					this.$message('填写手机号码');
			// 						break;
			// 					case !this.searchForm.date:
			// 					this.$message('选择日期时间');
			// 						break;
			// 					default:
			let form = {
				pageNo: 1,
				pageSize: this.pageMsg.size,
				username: this.searchForm.result,
				mobile: this.searchForm.phone,
				play_time: this.searchForm.date
			}
			let that = this
			user_log(form).then(res => {
				that.tableData = res.records
				that.pageMsg.total = res.total
			})
			//				}
		}
	}
}
</script>

<style scoped>
</style>
