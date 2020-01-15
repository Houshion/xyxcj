<template>
	<div>
		<div class="mg-t-5 bfff pd-10">
			<el-button type="primary" icon="el-icon-circle-plus-outline" @click="openDialog('add')">{{$t('webAdvert.add_advert')}}</el-button>
			<oDialog ref="goodsDialog" :title="dialogMsg.title"></oDialog>
			<el-row :gutter="10" class="mg-t-5">
				<el-col :span="4">
					<el-input :placeholder="$t('webAdvert.advertName')" v-model="searchForm.name"></el-input>
				</el-col>
				<el-col :span="7">
					<el-select v-model="searchForm.type" :placeholder="$t('webAdvert.changeType')" @change="typeChange">
						<el-option :label="$t('webAdvert.img')" value="1"></el-option>
						<el-option :label="$t('webAdvert.video')" value="2"></el-option>
					</el-select>
				</el-col>
				<el-col :span="13" class="tar">
					<el-button icon="el-icon-search" type="primary" @click="search">{{$t('webBaseBtn.search')}}</el-button>
					<el-button icon="el-icon-refresh-left" @click="resetForm">{{$t('webBaseBtn.reset')}}</el-button>
				</el-col>
			</el-row>
			<o-table
				class="mg-t-5"
				:tableData="tableData"
				:tableTitle="tableTitle"
				:tableSlot="tableSlot"
				:pageMsg="pageMsg"
				@btnFunc="btnFunc"
			>
				<template slot="detail" slot-scope="slot">
					<el-popover placement="right" width="400" trigger="click">
						<template v-for="(item,idx) in slot.data.file">
							<img v-if="item.type==1" :src="item.src" style="width: 375px;height: 250px;" :key="idx">
							<video v-else :src="item.src" style="width: 375px;height: 250px;" :key="idx" controls></video>
						</template>
						<el-link slot="reference" style="cursor: pointer;">
							{{$t('webAdvert.check')}}
							<i class="el-icon-view el-icon--right"></i>
						</el-link>
					</el-popover>
				</template>
			</o-table>
		</div>
	</div>
</template>

<script>
import oDialog from "./components/advertDialog";
import { advertList, detail, del } from '@/api/advert'
import { parseTime } from '@/utils'
export default {
	data() {
		return {
			dialogMsg: {
				title: this.$t('webAdvert.creat_advert'),
				edit: ''
			},
			searchForm: {
				name: '',
				type: '',
			},
			url: process.env.VUE_APP_BASE_API,
			tableTitle: [{
				prop: "id",
				label: "ID",
				width: "65",
				align: 'center'
			},
			{
				prop: "title",
				label: this.$t('webAdvert.tableTit'),
				width: "130",
				align: 'center'
			},
			{
				prop: "shop_name",
				label: this.$t('webAdvert.table_shop_name'),
				width: "200",
				align: 'center'
			},
			{
				prop: "detail",
				label: this.$t('webAdvert.table_detail'),
				width: "auto",
				align: 'center',
				custom: true
			},
			{
				prop: "ctime",
				label: this.$t('webAdvert.table_ctime'),
				width: "180",
				align: 'center'
			},
			],
			//   表头信息，prop对应
			tableSlot: [{
				title: this.$t('webAdvert.handle'),
				slotType: "btn",
				buttontype: "info", // text为文字按钮，默认不传为正常按钮
				width: '180',
				slot: [{
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
			loading: false
		};
	},
	components: {
		oDialog
	},
	created() {

	},
	mounted() {
		const _this = this;
		this.init()
	},
	methods: {
		btnFunc(index, type) {
			const id = this.tableData[index].id
			this.openDialog(type, id)
		},
		openDialog(type, id = 0) {
			const _this = this;
			switch (type) {
				case 'add':
					this.$refs.goodsDialog.show = true;
					_this.$refs.goodsDialog.form.submit_type = 'add'
					break;
				case 'edit':
					this.$refs.goodsDialog.show = true;
					console.log(this.$refs.goodsDialog)
					let param = {
						id: id
					}
					detail(param).then(res => {
						console.log(res)
						_this.$refs.goodsDialog.form.name = res.title;
						_this.$refs.goodsDialog.form.type = res.type == 1 ? this.$t('webAdvert.img') : this.$t('webAdvert.video');
						_this.$refs.goodsDialog.form.classify = res.shop_id;
						_this.$refs.goodsDialog.form.id = res.id;
						_this.$refs.goodsDialog.form.submit_type = 'save'
						_this.$refs.goodsDialog.form.img = []
						_this.$refs.goodsDialog.form.imgList = []
						res.detail.forEach((val, idx) => {
							_this.$refs.goodsDialog.form.img.push({ name: val.substr(-15), url: val, uid: Date.now(), status: "success" });
							_this.$refs.goodsDialog.form.imgList.push(val)
						})
					})
					break;
				case "dele":
					this.$confirm(this.$t('webAdvert.dialog'), this.$t('webAdvert.tip'), {
						confirmButtonText: this.$t('webAdvert.confirm'),
						cancelButtonText: this.$t('webAdvert.cancel'),
						type: 'warning'
					}).then(() => {
						let param = {
							id: id
						}
						del(param).then(res => {
							console.log(res)
							this.$message({
								type: 'success',
								message: this.$t('webBaseTips.deleSuccess')
							});
							this.init()
						})
					}).catch(() => {

					});
					break;
			}
		},
		typeChange(e) {
			this.searchForm.type = e
		},
		async init() {
			advertList().then(res => {
				res.records.forEach(val => {
					val.type = val.type == 1 ? this.$t('webAdvert.img') : this.$t('webAdvert.video')
					val.ctime = parseTime(val.ctime);
					val.file = [];
					val.detail.forEach(item => {
						if (item) {
							let url = item.split('com')[1]
							let type = url.split('.')[1]
							if (type != "jpg" && type != "jpeg" && type != "gif" && type != "png" && type != "bmp") {
								val.file.push({ src: item, type: '2' })
							} else {
								val.file.push({ src: item, type: '1' })
							}
						}
					})
				})
				this.tableData = res.records
				this.pageMsg.total = res.total
				console.log(res.records)
			})
		},
		resetForm() {
			[this.searchForm.name, this.searchForm.type] = ['', '', ''];
			this.init()
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
				title: this.searchForm.name,
				type: this.searchForm.type,
			}
			let that = this
			advertList(form).then(res => {
				res.records.forEach(val => {
					val.type = val.type == 1 ? this.$t('webAdvert.img') : this.$t('webAdvert.video')
					val.ctime = parseTime(val.ctime)
				})
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
