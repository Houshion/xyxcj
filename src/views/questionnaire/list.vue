<template>
	<div class="mg-t-5 bfff pd-10">
		<el-row :gutter="10" class="mg-t-5">
			<el-col :span="4">
				<el-input :placeholder="$t('webQuestionList.searchName')" v-model="searchForm.nickname"></el-input>
			</el-col>
			<el-col :span="4">
				<el-input :placeholder="$t('webQuestionList.searchMobile')" v-model="searchForm.mobile"></el-input>
			</el-col>
			<el-col :span="4">
				<el-input :placeholder="$t('webQuestionList.searchTitle')" v-model="searchForm.title"></el-input>
			</el-col>
			<el-col :span="5">
				<div class="block">
					<el-date-picker
						class="wd-100"
						v-model="date"
						type="daterange"
						:range-separator="$t('webBaseMessage.date_separator')"
						:start-placeholder="$t('webBaseMessage.date_start')"
						:end-placeholder="$t('webBaseMessage.date_end')"
						value-format="yyyy-MM-dd"
					></el-date-picker>
				</div>
			</el-col>
			<el-col :span="7" class="tar">
				<el-button icon="el-icon-search" type="primary" @click="search">{{$t('webBaseBtn.search')}}</el-button>
				<el-button icon="el-icon-refresh-left" @click="reset">{{$t('webBaseBtn.reset')}}</el-button>
			</el-col>
		</el-row>
		<o-table
			class="mg-t-5"
			:tableData="tableData"
			:tableTitle="tableTitle"
			:pageMsg="pageMsg"
			@pageChange="pageChange"
			@sizeChange="sizeChange"
		></o-table>
	</div>
</template>

<script>
import { answer_list } from '@/api/questionnaire'
import { parseTime } from '@/utils'
export default {
	data() {
		return {
			searchForm: {
				title: '',
				nickname: '',
				mobile: '',
			},
			date: '',
			tableTitle: [
				{
					prop: "id",
					label: this.$t('webQuestionList.tableId'),
					width: "65",
					align: 'center'
				},
				{
					prop: "nickname",
					label: this.$t('webQuestionList.tableNickname'),
					width: "130",
					align: 'center'
				},
				{
					prop: "mobile",
					label: this.$t('webQuestionList.tableMobile'),
					width: "180",
					align: 'center'
				},
				{
					prop: "title",
					label: this.$t('webQuestionList.tableTitle'),
					width: "230",
					align: 'center'
				},
				{
					prop: "detail",
					label: this.$t('webQuestionList.tableDetail'),
					width: "auto",
					align: 'center'
				},
				{
					prop: "money",
					label: this.$t('webQuestionList.tableMoney'),
					width: "85",
					align: 'center'
				},
				{
					prop: "finish_time",
					label: this.$t('webQuestionList.tableFinish_time'),
					width: "auto",
					align: 'center'
				}
			],

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
				time: this.date ? this.date.join('/') : '',
				...this.searchForm
			}
			answer_list(form).then(res => {
				console.log(res)
				res.records.forEach(val => {
					val.finish_time = parseTime(val.finish_time)
				})
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
		search() {
			this.init();
		},
		reset() {
			this.date = '';
			this.searchForm = {
				title: '',
				nickname: '',
				mobile: '',
			};
			this.pageMsg = {
				page: 1,
				status: true,
				size: 10,
				sizes: [10, 20, 50, 100],
			};
			this.init();
		},
	}
}
</script>

<style scoped>
</style>
