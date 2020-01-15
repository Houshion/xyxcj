<template>
	<div id="message">
		<div class="mg-t-5 bfff pd-10">
			<el-button
				type="primary"
				icon="el-icon-circle-plus-outline"
				@click="openDialog('add')"
			>{{$t('webMessage.add_msg')}}</el-button>
			<el-row :gutter="10" class="mg-t-5">
				<el-col :span="6">
					<el-input :placeholder="$t('webMessage.msgTitle')" v-model="searchForm.macno"></el-input>
				</el-col>
				<el-col :span="18" class="tar">
					<el-button icon="el-icon-search" type="primary" @click="search">{{$t('webBaseBtn.search')}}</el-button>
					<el-button icon="el-icon-refresh-left" @click="resetForm">{{$t('webBaseBtn.reset')}}</el-button>
				</el-col>
			</el-row>
			<o-table
				class="mg-t-5"
				:tableData="tableData"
				:pageMsg="pageMsg"
				:tableTitle="tableTitle"
				:tableSlot="tableSlot"
				@btnFunc="btnFunc"
				@pageChange="pageChange"
				@sizeChange="sizeChange"
			>
				<template slot="link" slot-scope="solt">
					<a
						:href="solt.data.link"
						style="color: #0000FF;text-decoration:underline;cursor: pointer;"
					>{{solt.data.link}}</a>
				</template>
				<template slot="content" slot-scope="slot">
					<div v-html="slot.data.content"></div>
				</template>
			</o-table>
			<!-- 创建讯息Dialog -->
			<el-dialog
				:title="$t('webMessage.msgTitle')"
				:visible.sync="form.dialogFormVisible"
				@close="cancel"
			>
				<el-form :model="form" :rules="rules" ref="ruleForm">
					<el-form-item prop="title">
						<el-input
							v-model="form.title"
							autocomplete="off"
							:placeholder="$t('webMessage.input_msgTitle')"
						></el-input>
					</el-form-item>
					<tinymce class="mg-b-5" ref="editor" v-model="form.centents" :height="300"/>
					<el-form-item prop="link_name">
						<el-input
							v-model="form.link_name"
							autocomplete="off"
							:placeholder="$t('webMessage.input_link')"
						></el-input>
					</el-form-item>
					<el-form-item prop="link">
						<el-input
							v-model="form.link"
							autocomplete="off"
							:placeholder="$t('webMessage.input_fullLink')+':http://xxx.com'"
						>
							<template slot="prepend">http://</template>
						</el-input>
					</el-form-item>
					<el-radio-group v-model="form.radio" @change="check">
						<el-radio :label="1">{{$t('webMessage.all')}}</el-radio>
						<el-radio :label="2">{{$t('webMessage.group')}}</el-radio>
						<el-radio :label="3">{{$t('webMessage.individual')}}</el-radio>
					</el-radio-group>
					<el-form-item>
						<!-- 多选 -->
						<el-select
							v-if="form.radio==2"
							v-model="form.group"
							multiple
							collapse-tags
							style="margin-top: 20px;"
							:placeholder="$t('webMessage.change')"
							:value="form.group"
							@change="growCheck"
						>
							<el-option v-for="item in options" :label="item.name" :value="item.id"></el-option>
						</el-select>
						<!-- 单选 -->
						<el-select
							v-model="form.mid"
							:placeholder="$t('webMessage.change')"
							v-if="form.radio==3"
							style="margin-top: 20px;"
							:value="form.mid"
							filterable
							@change="midCheck"
						>
							<el-option v-for="item in options" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancel">{{$t('webBaseBtn.cancel')}}</el-button>
					<el-button type="primary" @click="submitForm">{{$t('webBaseBtn.confirm')}}</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { list, detail, del, add_save, group, member } from '@/api/message'
import { parseTime } from '@/utils'
export default {
	components: {
		Tinymce
	},
	data() {
		return {
			searchForm: {
				macno: '',
				shopName: '',
			},
			tableTitle: [{
				prop: "id",
				label: "ID",
				width: "65"
			},
			{
				prop: "title",
				label: this.$t('webMessage.tableTitle'),
				width: "130"
			},
			{
				prop: "content",
				label: this.$t('webMessage.tableContent'),
				width: "230",
				custom: true
			},
			{
				prop: "link",
				label: this.$t('webMessage.tableLink'),
				width: "auto",
				custom: true
			},
			{
				prop: "link_name",
				label: this.$t('webMessage.tableLink_name'),
				width: "auto",
			},
			{
				prop: "ctime",
				label: this.$t('webMessage.tableCtime'),
				width: "auto"
			}
			],
			//   表头信息，prop对应
			tableSlot: [
				{
					title: this.$t('webMessage.handle'),
					slotType: "btn",
					buttontype: "primary", // text为文字按钮，默认不传为正常按钮
					width: 150,
					slot: [
						{
							label: this.$t('webBaseBtn.edit'),
							type: "edit"
						},
						{
							label: this.$t('webBaseBtn.dele'),
							type: "dele"
						}
					]
				}
			],
			tableData: [],
			pageMsg: {
				page: 1,
				status: true,
				size: 10,
				sizes: [10, 20, 50, 100],
				total: 20
			},
			loading: false,
			form: {
				dialogFormVisible: false,
				radio: '',
				title: '',
				link: '',
				link_name: '',
				centents: '',
				is_all: '',
				group: [],
				mid: '',
				url: '',
				id: '',
			},
			radioshow: '',
			options: [{
				id: '选项1',
				name: '黄金糕'
			}, {
				id: '选项2',
				name: '双皮奶'
			}, {
				id: '选项3',
				name: '蚵仔煎'
			}, {
				id: '选项4',
				name: '龙须面'
			}, {
				id: '选项5',
				name: '北京烤鸭'
			}],
			rules: {
				title: [
					{ required: true, message: this.$t('webMessage.input_msgTitle'), trigger: 'blur' },
				],
				link_name: [
					{ required: true, message: this.$t('webMessage.input_linkName'), trigger: 'blur' },
				],
				link: [
					{ required: true, message: this.$t('webMessage.input_link'), trigger: 'blur' },
				]
			}
		};
	},
	created() {

	},
	mounted() {
		const _this = this;
		this.init()
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
		pageChange(val) {//分页页数改变
			this.pageMsg.page = val;
			this.init();
		},
		sizeChange(val) {//分页条数改变
			this.pageMsg.size = val;
			this.init();
		},
		check(e) {
			let that = this
			this.form.radio = e
			this.form.is_all = 0
			this.form.group = []
			this.form.mid = ''
			if (e == 1) {
				this.form.is_all = 1
			} else if (e == 2) {
				let form = {
					pageNo: 1,
					pageSize: 50,
				}
				group(form).then(res => {
					console.log(res)
					that.options = []
					that.options = res.records
				})

			} else {
				let form = {
					pageNo: 1,
					pageSize: 100,
				}
				member(form).then(res => {
					console.log(res)
					that.options = []
					res.records.forEach(val => {
						that.options.push({ id: val.mid, name: val.nickname })
					})

				})
			}
		},
		growCheck(e) {
			console.log(e)
			this.form.group = e
		},
		midCheck(e) {
			console.log(e)
		},
		async init() {
			let form = {
				pageNo: this.pageMsg.page,
				pageSize: this.pageMsg.size,
			}
			list(form).then(res => {
				console.log(res)
				res.records.forEach(val => {
					val.link = val.link ? 'http://' + val.link : '';
					val.ctime = parseTime(val.ctime)
				})
				this.tableData = res.records
				this.pageMsg.total = res.total
			})
		},
		btnFunc(index, type) {
			const _this = this;
			const id = this.tableData[index].id
			this.openDialog(type, id)
		},
		selecChange(val) {
			const _this = this;
			let data = [];
			val.forEach(item => {
				data.push(item.date);
			});
			console.log(data);
		},
		switchChange(row, index) {
			console.log("switchChange", row, index);
		},
		inputChange(val) {
			console.log(val);
		},
		openDialog(type, id = 0) {
			switch (type) {
				case 'add':
					this.form.dialogFormVisible = true;
					this.form.url = 'add'
					break;
				case 'edit':
					this.form.dialogFormVisible = true;
					this.form.url = 'save'
					this.form.id = id;
					let param = {
						id: this.form.id,
					}
					let that = this
					detail(param).then(res => {
						console.log(res);
						that.form.title = res.title
						that.form.centents = res.content;
						that.form.link = res.link;
						that.form.link_name = res.link_name;
						if (res.is_all == 1) {
							that.form.radio = 1
						}
						if (res.group_ids) {
							let form = {
								pageNo: 1,
								pageSize: 50,
							}
							group(form).then(res => {
								console.log(res)
								that.options = []
								that.options = res.records
							});
							that.form.radio = 2;
							that.form.group_ids = res.group_ids
						}
						if (res.mid) {
							let form = {
								pageNo: 1,
								pageSize: 100,
							}
							member(form).then(res => {
								console.log(res)
								that.options = []
								res.records.forEach(val => {
									that.options.push({ id: val.mid, name: val.nickname })
								})

							});
							that.form.radio = 3;
							that.form.mid = res.mid
						}
						console.log(that.form.radio)
					})
					break;
				case "dele":
					this.$confirm(this.$t('webMessage.dialog'), this.$t('webMessage.tip'), {
						confirmButtonText: this.$t('webMessage.confirm'),
						cancelButtonText: this.$t('webMessage.cancel'),
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
		submitForm() {
			let that = this
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					/*   this.$message({
						   type: 'success',
						   message: '添加成功!'
					   });
					   this.show = false;	 */
					let param = {
						id: that.form.id ? that.form.id : '',
						title: that.form.title,
						content: that.form.centents,
						link: that.form.link,
						link_name: that.form.link_name,
						is_all: that.form.is_all ? 1 : 0,
						group_ids: that.form.group.length ? that.form.group.toString() : '',
						mid: that.form.mid ? that.form.mid : '',
					}
					add_save(that.form.url, param).then(res => {
						console.log(res)
						this.show = false;
						if (that.form.url == 'add') {
							that.$message({ type: 'success', message: this.$t('webMessage.AddedSuccessfully') });
						} else {
							that.$message({ type: 'success', message: this.$t('webMessage.EditorialSuccess') });
						}
						this.init()
						this.cancel()
					})
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		resetForm() {
			this.searchForm.macno = '';
			this.init()
		},
		search() {
			let form = {
				title: this.searchForm.macno,
				pageNo: 1,
				pageSize: this.pageMsg.size,
			}
			list(form).then(res => {
				console.log(res)
				res.records.forEach(val => {
					val.ctime = parseTime(val.ctime)
				})
				this.tableData = res.records
				this.pageMsg.total = res.total
			})
		},
		cancel() {
			this.form = {
				dialogFormVisible: false,
				radio: '',
				title: '',
				link: '',
				link_name: '',
				centents: '',
				is_all: '',
				group: [],
				mid: '',
				url: '',
				id: '',
			}
		}
	}
}
</script>

<style scoped>
</style>
