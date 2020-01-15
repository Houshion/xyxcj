<template>
	<div class="mg-t-5 bfff pd-10">
		<el-button type="primary" icon="el-icon-circle-plus-outline" @click="openDialog('add')">{{$t('webQuestionnaire.add')}}</el-button>
		<o-table
			class="mg-t-5"
			:tableData="tableData"
			:tableTitle="tableTitle"
			@btnFunc="btnFunc"
			:pageMsg="pageMsg"
			:tableSlot="tableSlot"
			@pageChange="pageChange"
			@sizeChange="sizeChange"
		>
			<template slot="detail_list" slot-scope="slot">
				<!--<div v-for="(item,idx) in slot.data.detail_list">{{item.question}}</div>-->
				<div v-if="slot.data.detail_list.length<=1">{{slot.data.detail_list[0].question}}</div>
				<div v-else>{{slot.data.detail_list[0].question}}...</div>
			</template>
		</o-table>
		<!--生成调查报告-->
		<oDialog ref="reportDialog"></oDialog>
		<!--新增和编辑报告-->
		<iDialog ref="indexDialog"></iDialog>
	</div>
</template>

<script>
import { question, questionDele } from '@/api/questionnaire'
import { parseTime } from '@/utils'
import oDialog from "./components/report";
import iDialog from "./components/indexDialog";
export default {
	data() {
		return {
			tableTitle: [
				{
					prop: "id",
					label: this.$t('webQuestionnaire.id'),
					width: "65",
					align: 'center'
				},
				{
					prop: "title",
					label: this.$t('webQuestionnaire.title'),
					width: "230",
					align: 'center'
				},
				{
					prop: "detail_list",
					label: this.$t('webQuestionnaire.detail_list'),
					width: "auto",
					align: 'center',
					custom: true
				},
				{
					prop: "endtime",
					label: this.$t('webQuestionnaire.endtime'),
					width: "180",
					align: 'center'
				},
				{
					prop: "money",
					label: this.$t('webQuestionnaire.reward'),
					width: "85",
					align: 'center'
				},
			],
			tableSlot: [{
				title: this.$t('webQuestionnaire.handle'),
				slotType: "btn",
				buttontype: "info", // text为文字按钮，默认不传为正常按钮
				width: 'auto',
				slot: [{
					label: this.$t('webQuestionnaire.create'),
					type: "create"
				},
				{
					label: this.$t('webBaseBtn.edit'),
					type: "edit"
				},
				{
					label: this.$t('webBaseBtn.dele'),
					type: "dele"
				}
				]
			}],
			tableData: [],
			pageMsg: {
				page: 1,
				status: true,
				size: 10,
				sizes: [10, 20, 50, 100],
			},
			loading: false,
		};
	},
	components: {
		oDialog,
		iDialog
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
			question(form).then(res => {
				console.log(res)
				res.records.forEach(val => {
					val.endtime = parseTime(val.endtime)
				})
				this.tableData = res.records
				this.pageMsg.total = res.total
			})
		},
		openDialog(type, id) {
			switch (type) {
				case 'add':
					this.$refs.indexDialog.form.dialogFormVisible = true;
					this.$refs.indexDialog.form.id = '';
					this.$refs.indexDialog.dialogMsg.title = this.$t('webQuestionnaire.add');
					this.$refs.indexDialog.form.title = '';
					this.$refs.indexDialog.form.money = '';
					this.$refs.indexDialog.form.date = '';
					this.$refs.indexDialog.form.group = '';
					this.$refs.indexDialog.form.question = [];
					break;
				case 'edit':
					this.$refs.indexDialog.form.dialogFormVisible = true;
					this.$refs.indexDialog.form.id = id;
					this.$refs.indexDialog.dialogMsg.title = this.$t('webQuestionnaire.edit');
					break;
				case 'create':
					this.$refs.reportDialog.id = id;
					this.$refs.reportDialog.show = true;
					break;
				case "dele":
					this.$confirm(this.$t('webPayWay.deleConfirm'), this.$t('webBaseTips.confirm'), {
						confirmButtonText: this.$t('webBaseBtn.confirm'),
						cancelButtonText: this.$t('webBaseBtn.cancel'),
						type: 'warning'
					}).then(async () => {
						await questionDele({ id });
						this.loading = true
						this.$message({
							type: 'success',
							message: this.$t('webBaseTips.deleSuccess')
						});
						this.init()
					})
					break;
			}

		},
		btnFunc(index, type) {
			console.log(index, type);
			const id = this.tableData[index].id;
			this.openDialog(type, id)
		},
		pageChange(val) {//分页页数改变
			this.pageMsg.page = val;
			this.init();
		},
		sizeChange(val) {//分页条数改变
			this.pageMsg.size = val;
			this.init();
		}
	}
}
</script>

<style scoped>
</style>
