<template>
	<div id="loginLog">
		<div class="mg-t-5 bfff pd-10">
			<o-table
				class="mg-t-5"
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
import { login_log } from '@/api/log'
export default {
	data() {
		return {
			tableTitle: [{
				prop: "ctime",
				label: this.$t('webLog.tableCtime'),
				width: "auto",
				align: 'center'
			},
			{
				prop: "ip",
				label: "ip",
				width: "auto",
				align: 'center'
			},
			{
				prop: "address",
				label: this.$t('webLog.tableAddress'),
				width: "auto",
				align: 'center'
			},
			{
				prop: "browser",
				label: this.$t('webLog.tableBrowser'),
				width: "auto",
				align: 'center'
			},
			],
			//   表头信息，prop对应
			// 		  tableSlot: [Internet
			// 			{
			// 			  title: "操作",
			// 			  slotType: "btn",
			// 			  buttontype: "info", // text为文字按钮，默认不传为正常按钮
			// 			  width: 300,
			// 			  slot: [
			// 				{ label: "信用记录", type: "edit" },
			// 				{ label: "货柜记录", type: "edit" },
			// 				{ label: "商城记录", type: "edit" }
			// 			  ]
			// 			}
			// 		  ],
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
		const _this = this;
		this.init()

	},
	methods: {
		async init() {
			let form = {
				pageNo: this.pageMsg.page,
				pageSize: this.pageMsg.size,
			}
			login_log(form).then(res => {
				console.log(res)
				this.tableData = res.records
				this.pageMsg.total = res.total
			})
		},
		pageChange(val) {//分页页数改变
			this.pageMsg.page = val;
			this.init();
		},
		sizeChange(val) {//分页条数改变
			this.pageMsg.size = val;
			this.init();
		},
	}
}
</script>

<style scoped lang='less'>
</style>
