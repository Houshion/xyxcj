<!-- treeMenuTable -->
<template>
    <div id="treeMenuTable" class="pd-10 bfff">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="AddMenuShow">{{$t('webMenuManagement.addMenu')}}</el-button>
        <tree-table
            class="mg-t-5"
            :key="key"
            :default-expand-all="defaultExpandAll"
            :data="data"
            :columns="columns"
            :indent="indent"
            :defaultChildren="tableTreeChildren"
            border=""
        >
            <template slot="operation" slot-scope="{scope}">
                <!-- <el-button type="success" size @click="editChild(scope)">新增子菜单</el-button> -->
                <el-button size="mini" @click="edit(scope)">{{$t('webBaseBtn.edit')}}</el-button>
                <el-button type="danger" size="mini" @click="remove(scope)">{{$t('webBaseBtn.dele')}}</el-button>
            </template>
        </tree-table>
        <el-dialog
            :title="formTitle"
            :visible.sync="dialogMenu"
            width="30%"
            :close-on-click-modal="false"
        >
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item :label="$t('webMenuManagement.menu_name')" label-width="90px" prop="menu_name">
                    <el-input v-model="form.menu_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item :label="$t('webMenuManagement.menu_url')" label-width="90px">
                    <el-input v-model="form.menu_url" auto-complete="off"></el-input>
                </el-form-item>
              <el-form-item label="接口链接" label-width="90px">
                <el-input v-model="form.interface_url" auto-complete="off"></el-input>
              </el-form-item>
                <el-form-item :label="$t('webMenuManagement.selectMenu')" v-if="formTitle == $t('webMenuManagement.addNew')" label-width="90px">
                    <el-cascader
                        class="wd-100"
                        :options="data"
                        :props="menuProps"
                        v-model="selectedOptions"
                        @change="handleChange"
                        change-on-select
                    ></el-cascader>
                </el-form-item>
                <el-form-item :label="$t('webMenuManagement.weight')" label-width="90px">
                    <el-input v-model="form.weight" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" label-width="90px">
                  <el-radio-group v-model="form.menu_type">
                    <el-radio :label="0">菜单</el-radio>
                    <el-radio :label="1">按钮</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item class="align-right">
                    <el-button @click="cancel('form')">{{$t('webBaseBtn.cancel')}}</el-button>
                    <el-button
                        v-loading.fullscreen.lock="fullscreenLoading"
                        v-if="dialogSave"
                        type="primary"
                        @click="EditMenuSave('form')"
                    >{{$t('webBaseBtn.save')}}</el-button>
                    <el-button
                        v-loading.fullscreen.lock="fullscreenLoading"
                        v-else
                        type="primary"
                        @click="AddMenuSave('form')"
                    >{{$t('webBaseBtn.create')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import treeTable from "@/components/TreeTable";
import * as menu from "@/api/menu";
export default {
    name: 'treeMenuTable',
    data() {
        return {
            fullscreenLoading: false,
            defaultExpandAll: true,
            key: 1,
            indent: 30,
            updata: false,
            columns: [
                {
                    label: this.$t('webMenuManagement.select'),
                    checkbox: true,
                    width: 100,
                    align: "left"
                },
                {
                    label: this.$t('webMenuManagement.menu_name'),
                    key: "menu_name",
                    expand: true,
                    align: "left"
                },
                {
                    label: this.$t('webMenuManagement.edit'),
                    key: "operation",
                    width: 200
                }
            ],
            tableTreeChildren: "childlist",
            loading: true,
            tableData: [],
            tableData1: [],
            dialogMenu: false,
            dialogSave: false,
            formTitle: this.$t('webMenuManagement.addNew'),
            form: {
                menu_id: "",
                menu_name: "",
                menu_url: "",
                menu_pid: 0,
                menu_url: "",
                weight: "",
                menu_type:0,
                interface_url:''
            },
            rules: {
                menu_name: [
                    {
                        required: true,
                        message: this.$t('webMenuManagement.pleaseEnterMenuName'),
                        trigger: "blur"
                    }
                ]
            },
            selectedOptions: [],
            data: [],
            menuProps: {
                children: "childlist",
                value: "menu_id",
                label: "menu_name"
            },
        };
    },
    components: { treeTable },
    computed: {},
    created() {
        const _this = this
        this.init()
    },
    methods: {
        async init() {
            let res = await menu.menuList();
            this.data = res.records;
            // console.log(JSON.stringify(this.data))
            this.loading = false;
        },
        remove(scope) {
            this.$confirm(this.$t('webMenuManagement.del_menu_tip'),  this.$t('webBaseTips.confirm'), {
                confirmButtonText: this.$t('webBaseTips.confirmButtonText'),
          cancelButtonText: this.$t('webBaseTips.cancelButtonText'),
                type: "warning"
            })
                .then(() => {
                    console.log(1)
                    menu.menuDel({ menu_id: scope.row.menu_id }).then(res => {
                        this.$message({
                            type: "success",
                            message: this.$t('webBaseTips.deleSuccess')
                        });
                        this.init();
                    });
                })
                .catch(() => {

                });
        },
        edit(scope) {
            console.log(scope);
            this.formTitle = this.$t('webMenuManagement.editMenu');
            this.dialogMenu = true;
            this.dialogSave = true;
            // this.menu_first = scope.row;
            console.log(scope.row.menu_id);
            this.form.menu_id = scope.row.menu_id;
            this.form.menu_pid = scope.row.menu_pid;
            this.form.menu_url = scope.row.menu_url;
            this.form.menu_name = scope.row.menu_name;
            this.form.weight = scope.row.weight;
            this.form.menu_type = scope.row.menu_type;
            this.form.interface_url = scope.row.interface_url;
            // this.menu_second = scope.row.childlist;
            const row = scope.row;
        },
        cancel(formName) {
            this.$refs[formName].resetFields();
            this.dialogMenu = false;
            // this.form = {};
        },

        //新增子菜单
        editChild(scope) {
            this.formTitle = this.$t('webMenuManagement.addChildrenMenu');
            this.dialogMenu = true;
            this.form = {};
        },
        async AddMenuShow() {
            // this.menu_first = this.data;
            this.formTitle = this.$t('webMenuManagement.addNew');
            this.dialogSave = false;
            this.dialogMenu = true;
            this.form = {
                menu_id: "",
                menu_name: "",
                menu_url: "",
                menu_pid: 0,
                menu_url: "",
                weight: "",
                menu_type:0,
                interface_url:''
            };
            this.selectedOptions = []
        },
        EditMenuSave(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    if (!this.form.menu_pid) this.form.menu_pid = 0;
                    this.fullscreenLoading = true;
                    await menu.menuEdit(this.form);
                    this.fullscreenLoading = false;
                    this.init();
                    this.dialogMenu = false;
                    this.$message({
                        type: "success",
                        message: this.$t('webBaseTips.editConfirm')
                    });
                } else {
                    return false;
                }
            });
        },
        AddMenuSave(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    if (!this.form.menu_pid) this.form.menu_pid = 0;
                    this.fullscreenLoading = true;
                    await menu.menuAdd(this.form);
                    this.fullscreenLoading = false;
                    this.init();
                    // this.$bus.emit("AddMenuUpdate");
                    this.dialogMenu = false;
                    this.form = {};
                    this.selectedOptions = []
                    this.$message({
                        type: "success",
                        message: this.$t('webBaseTips.addConfirm')
                    });
                } else {
                    return false;
                }
            });
        },
        handleChange(val) {
            this.form.menu_pid = val[val.length - 1];
        },
    }
};
</script>
<style scoped lang='less'>
</style>
