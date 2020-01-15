<template>
	<div id="message">
		<div class="mg-t-5 bfff pd-10">
			<el-row :gutter="10">
				<el-col :span="4">
					<el-input :placeholder="$t('webSystem.macno')" v-model="searchForm.macno"></el-input>
				</el-col>
				<el-col :span="4">
					<el-input :placeholder="$t('webSystem.branch')" v-model="searchForm.shopName"></el-input>
				</el-col>
				<el-col :span="16" class="tar">
					<el-button icon="el-icon-search" type="primary" @click="search" >{{$t('webBaseBtn.search')}}</el-button>
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
      >
        <template slot="type" slot-scope="slot">
          <span>{{slot.data.type ==1 ? $t('webSystem.macno_OffLine') : $t('webSystem.fault')}}</span>
        </template>
      </o-table>
		</div>
	</div>
</template>

<script>
  import { message } from "@/api/SystemMsg";
  import { parseTime } from "@/utils";
	export default {
		data() {
			return {
				searchForm: {
					macno: '',
					shopName: '',
				},
				tableTitle: [{
						prop: "id",
						label: "ID",
						width: "65",
						align: 'center'
					},
					{
						prop: "type",
						label: this.$t('webSystem.tableType'),
						width: "85",
						align: 'center',
            			custom: true
					},
					{
						prop: "macno",
						label: this.$t('webSystem.tableMacno'),
						width: "230",
						align: 'center'
					},
					{
						prop: "title",
						label: this.$t('webSystem.tableTit'),
						width: "130",
						align: 'center'
					},
					{
						prop: "address",
						label: this.$t('webSystem.tableAddress'),
						width: "130",
						align: 'center'
					},
					{
						prop: "shop_name",
						label: this.$t('webSystem.table_Shop_name'),
						width: "auto",
						align: 'center'
					},
					{
						prop: "ctime",
						label: this.$t('webSystem.tableCtime'),
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
				loading: false
			};
		},
		created() {
      this.init()
		},
		mounted() {

		},
		methods: {
			async init() {
        let form = {
          pageNo: this.pageMsg.page,
          pageSize: this.pageMsg.size
        }
        Object.assign(form,this.searchForm);
        let res = await message(form);
        res.records.forEach(item => {
          item.ctime = parseTime(item.ctime);
        })
        this.tableData = res.records;
        this.pageMsg.total = res.total;
			},
      pageChange(val) {//分页页数改变
        this.pageMsg.page=val;
        this.init();
      },
      sizeChange(val){//分页条数改变
        this.pageMsg.size=val;
        this.init();
      },
      search() {
        this.pageMsg.page=1;
        this.init();
      },
      reset() {
        this.pageMsg={
          page: 1,
          status: true,
          size: 10,
          sizes: [10, 20, 50, 100],
          total:0
        };
        this.searchForm={
          macno: '',
          shopName: ''
        };
        this.init();
      },
		}
	}
</script>

<style scoped>

</style>
