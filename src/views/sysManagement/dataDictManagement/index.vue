<template>
  <div>
    <el-container>
      <el-container>
        <el-aside width="500px">
          <div class="app-container">
            <div class="filter-container">
              <el-form ref="filterForm" :model="filterForm" :inline="true">
                <el-form-item prop="code" label="类型代码:">
                  <el-input
                    v-model="filterForm.code"
                    clearable
                    style="width: 125px;"
                    class="filter-item"
                    size="mini"
                    @keyup.enter.native="getDictList()"
                  />
                </el-form-item>
                <el-form-item prop="name" label="类型名称:">
                  <el-input
                    v-model="filterForm.name"
                    clearable
                    style="width: 125px;"
                    class="filter-item"
                    size="mini"
                    @keyup.enter.native="getDictList()"
                  />
                </el-form-item>
              </el-form>
            </div>
            <el-row :gutter="50" style="margin-bottom:20px;">
              <el-col :span="5">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-search"
                  @click="getDictList()"
                >查询</el-button>
              </el-col>
              <el-col :span="5">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-refresh"
                  @click="resetFilterAndQuery"
                >重置</el-button>
              </el-col>
            </el-row>
            <el-table
              v-loading="tableLoading"
              ref="dictListTable"
              :header-cell-style="{background: 'rgb(222, 223, 224)'}"
              :data="dictList"
              border
              @row-click="rowClike"
              height="410"
              highlight-current-row
              @current-change="getDetails"
            >
              <el-table-column prop="code" label="字典类型代码" align="center"/>
              <el-table-column prop="name" label="字典类型名称" align="center"/>
            </el-table>
            <el-row :gutter="10" style="margin-top:15px">
              <el-col :span="5">
                <el-button 
                type="primary" 
                size="mini" 
                icon="el-icon-circle-plus-outline" 
                v-permission="'dict:add'"
                 @click="newDicttype">增加</el-button>
              </el-col>
              <el-col :span="5">
                <el-button 
                type="primary" 
                size="mini"
                icon="el-icon-edit"
                v-permission="'dict:update'"
                 @click="modifyDict">编辑</el-button>
              </el-col>
              <el-col :span="5">
                <el-button 
                type="danger" 
                size="mini"
                v-permission="'dict:delete'" 
                icon="el-icon-delete" 
                @click="handleDelete">删除</el-button>
              </el-col>
            </el-row>
            <!-- Pagination -->
            <div class="pagination-container">
              <el-pagination
                :current-page.sync="currentPage"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                :total="total"
                small
                background
                layout="total, sizes, pager, next"
                @current-change="currentPageChange"
                @size-change="pageSizeChange"
              />
            </div>
          </div>
        </el-aside>
        <!--字典右侧布局-->
        <el-main>
          <div class="app-container">
            <el-row style="margin-bottom:10px;">
              <el-col :span="3">
                <el-button 
                class="add-btn" 
                type="primary" 
                size="mini" 
                icon="el-icon-circle-plus" 
                v-permission="'dict:item:add'"
                @click="addRow">增加
                </el-button>
              </el-col>
              <el-col :span="4">
                <el-button 
                type="primary" 
                size="mini" 
                v-permission="'dict:item:submit'"
                icon="el-icon-success" 
                @click="saveDictentry">保存
                </el-button>
              </el-col>
            </el-row>
            <el-table
              v-loading="tableLoading"
              :header-cell-style="{background: 'rgb(222, 223, 224)'}"
              :data="dictentryList"
              :row-class-name="tableRowClassName"
              border
              height="450"
              highlight-current-row
              class="tb-edit"
              style="width: 100%"
              @row-click="handleCurrentChange"
            >
            <el-table-column label="字典类型项编码" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.code"
                    size="small"
                    placeholder="请输入字典类型项编码"
                    @change="handleEdit(scope.$index,scope.row)"
                  />
                  <span>{{ scope.row.code }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典类型项名称" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.name"
                    size="small"
                    placeholder="请输入字典项名称"
                    @change="handleEdit(scope.$index,scope.row)"
                  />
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="排序" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.sort"
                    size="small"
                    type="number"
                    placeholder="请输入排序"
                    @change="handleEdit(scope.$index,scope.row)"
                  />
                  <span>{{ scope.row.sort }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button 
                  type="text" 
                  icon="el-icon-delete-solid" 
                  size="mini" 
                  v-permission="'dict:item:delete'"
                  @click="deleteRow2(scope.$index,scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination-container">
              <el-pagination
                :current-page.sync="currentPage2"
                :page-sizes="pageSizes2"
                :page-size="pageSize2"
                :total="total2"
                background
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="currentPageChange2"
                @size-change="pageSizeChange2"
              />
            </div>
          </div>

          <!-- 字典类型增改对话框 -->
          <el-dialog
            :close-on-click-modal="false"
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form
              ref="form"
              :model="dialogForm"
              :rules="formRules"
              label-width="150px"
              label-position="right">
              <el-form-item label="字典类型代码" prop="code">
                <el-input
                  v-model="dialogForm.code"
                  :disabled="dialogType == 1"
                  placeholder="请输入字典类型代码"
                  clearable
                  style="width: 200px;"
                  maxlength="30"/>
              </el-form-item>
              <el-form-item label="字典类型名称" prop="name">
                <el-input
                  v-model="dialogForm.name"
                  placeholder="字典类型名称"
                  clearable
                  style="width: 200px;"
                  maxlength="100"
                />
              </el-form-item>
              <el-form-item label="字典类型排序" prop="sort">
                <el-input
                  v-model="dialogForm.sort"
                  placeholder="字典类型排序"
                  clearable
                  style="width: 200px;"
                  maxlength="20"
                  type="number"/>
              </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer" align="center">
              <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="handleDialogConfirm">确认</el-button>
              <el-button type="info" icon="el-icon-circle-close" size="mini" @click="handleCancel">取消</el-button>
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  fetchDict,
  createDict,
  deleteDicttype,
  updateDicttype,
  checkDictCode
} from "@/api/sysManagement/sysDictApi";
import {
  deleteDictentry,
  fetchDictentry,
  saveDictentry,
  checkDictItemCode
} from "@/api/sysManagement/sysDictItemApi";
const Qs = require("qs");
import * as constants from '@/utils/constant.js'

export default {
  name: "dataDictManagement",
  components: {},
  data() {
    return {
      dictList: [], // 字典列表
      dictentryList: [], // 字典
      newDictEntryList:[],//新增字典
      tableLoading: false,
      currentPage: 1, // 当前页
      total: 0, // 总数
      pageSizes: [10, 20, 50, 100],
      pageSize: 10, // 每页数量
      //当前点击的类型行
      currentRowData : "",
      currentPage2: 1, // 当前页
      total2: 0,
      pageSizes2: constants.pageSizes,
      pageSize2: 10, // 每页数量
      filterForm: {},
      dialogForm: {
        // 弹框表单数据
        code: "",
        name: "",
        editType: "0",
        sort:"0"
      },
      dialogTitle: "", // 弹框标题
      dialogType: 0, // 0 新增角色 1 修改角色
      dialogVisible: false, // 弹框显示
      formRules: {
        // 表单校验
        code: [
          { required: true, message: "请输入字典类型id", trigger: "blur" }
        ],
        name: [{ required: true, message: "字典类型名称", trigger: "blur" }]
      },
      newDictMap:{}
    };
  },
  created() {
    this.getDictList();
  },
  methods: {
    /**
     * 获取分页字典列表
     */
    getDictList() {
      this.tableLoading = true;
      const query = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        name: this.filterForm.name,
        code: this.filterForm.code
      };
      fetchDict(query)
        .then(res => {
          console.log(res.data);
          if (res.data.errorCode === "000000") {
            this.tableLoading = false;
            this.dictList = res.data.data.records;
            if (this.dictList && this.dictList.length > 0) {
              this.$refs.dictListTable.setCurrentRow(this.dictList[0]);
              this.currentRowData = this.dictList[0];
            }
            this.total = res.data.data.total;
          } else {
            this.$message({
              message: "获取字典数据失败！",
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    /**
     * 字典类型的行点击事件
     */
    rowClike(row){
      let rowData = JSON.stringify(row);
      this.currentRowData = JSON.parse(rowData);
      
    },


    /**
     * 获取字典详情
     */
    getDetails(row) {
      const data = {};
      this.code = row.code;
      this.name = row.name;
      this.dictTypeId = row.id;
      this.sort =  row.sort;
      data.typeCode = row.code;
      data.pageNum = 0;
      data.pageSize = 10;
      fetchDictentry(data).then(res => {
          if (res.data.errorCode === "000000") {
            this.tableLoading = false;
            this.dictentryList = res.data.data.records;
            this.total2 = res.data.data.total;
          } else {
            this.$message({
              message: "获取字典数据失败！",
              type: "error"
            });
          }
        }).catch(error => {
          console.log(error);
        });
    },

    /**
     * 分页功能 - 检测当前页变化
     */
    currentPageChange(val) {
      this.currentPage = val;
      this.getDictList();
    },

    /**
     * 分页功能 - 检测PageSize变化
     */
    pageSizeChange(val) {
      this.pageSize = val;
      this.getDictList();
    },

    currentPageChange2(val) {
      this.currentPage2 = val;
      this.getDetails2();
    },
    pageSizeChange2(val) {
      this.pageSize2 = val;
      this.getDetails2();
    },

    getDetails2(row) {
      const data = {
        pageNum: this.currentPage2,
        pageSize: this.pageSize2
      };
      data.typeCode = this.currentRowData.code;
      fetchDictentry(data)
        .then(res => {
          console.log(res);
          this.tableLoading = false;
          this.dictentryList = res.data.data.records;
          this.total2 = res.data.data.total;
        })
        .catch(error => {
          console.log(error);
        });
    },

    handleCancel() {
      this.dialogVisible = false;
      this.$refs["form"].resetFields();
    },

    /**
     * 重置
     */
    resetFilterAndQuery() {
      this.filterForm = {};
      this.getDictList();
    },

    /**
     * 弹框确认按钮
     */
    handleDialogConfirm() {
      if (this.dialogType === 0) {
        if(this.dialogForm.code==''||this.dialogForm.name==''){
          this.$message({
              message: "请输入字典信息",
              type: "warning"
            });
        }else{
        checkDictCode(this.dialogForm.code).then(res=>{
          if(res.data.errorCode === "201"){
            this.$message({
              message: "存在重复字典类型代码",
              type: "warning"
            });
            return;
          }else{
            this.submit();
          }
        }).catch(error => {
          console.log(error);
        });
        }
      
      } else {
        this.modify();
      }
    },

    /**
     * 提交信息
     */
    submit() {
      if(this.dialogForm.sort == null || this.dialogForm.sort == ""){
        this.dialogForm.sort = 0;
      }
      
      createDict(JSON.stringify(this.dialogForm))
        .then(res => {
          console.log(res);
          if (res.data.errorCode === "000000") {
            this.dialogVisible = false;
            this.$message({
              message: "字典类型创建成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "字典创建失败",
              type: "error"
            });
          }
          this.getDictList();
        })
        .catch(error => {
          console.log(error);
        });
    },

    /**
     * 修改字典类型信息
     */
    modify() {
      updateDicttype(JSON.stringify(this.dialogForm))
        .then(res => {
          if (res.data.errorCode === "000000") {
            this.dialogVisible = false;
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "修改失败",
              type: "error"
            });
          }
          this.getDictList();
        })
        .catch(error => {
          console.log(error);
        });
    },

    /**
     * 创建字典类型
     */
    newDicttype() {
      this.dialogTitle = "新增字典类型";
      this.dialogType = 0;
      this.dialogVisible = true;
      this.editType = 0;
      this.dialogForm.id = ''
      this.dialogForm.code = "";
      this.dialogForm.name = "";
      this.dialogForm.sort = "0";
    },
    /**
     * 修改字典类型
     */
    modifyDict(item) {
      if (this.dictTypeId == null) {
        this.$message({
          message: "请选择要编辑的字典类型代码",
          type: "warning"
        });
        return;
      }
      this.dialogForm.id = this.dictTypeId;
      this.dialogForm.code = this.code;
      this.dialogForm.name = this.name;
      this.dialogForm.sort = this.sort;
      this.dialogTitle = "修改字典类型";
      this.dialogType = 1;
      this.dialogVisible = true;
      this.editType = 0;
    },
    /**
     * 处理删除字典按钮
     */
    handleDelete() {
      if (!this.currentRowData) {
        this.$message({
          message: "请点击行选择要删除的字典类型",
          type: "warning"
        });
        return;
      }
      this.$confirm('确认删除字典类型  "' + this.currentRowData.name + '"  ?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "comfirm-dialog-btn-cancel",
        type: "warning"
      }) .then(() => {
          this.deleteDict(this.currentRowData);
          this.getDetails;
        })
        .catch(() => {});
    },
    /**
     * 删除字典
     */
    deleteDict(item) {
      deleteDicttype(item.code)
        .then(res => {
          if (res.data.errorCode === "000000") {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.currentRowData = "";
            this.getDictList();
          } else {
            this.$message({
              message: "删除失败",
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    handleCurrentChange(row, event, column) {
      this.selectedrowid = row.index;
    },
    handleEdit(index, row) {
      this.newDictMap[index] =  row;
    },

    addRow() {
      if (!this.currentRowData) {
        this.$message({
          message: "请先选择业务字典类型",
          type: "warning"
        });
        return;
      }
      const j = {
        typeCode: this.currentRowData.code,
        code: "",
        name: "",
        sort: ""
      };
      this.dictentryList.push(j);
    },

    deleteRow2(index, row) {
      console.log(row);
      this.$confirm("确认删除该字典类型项  " + row.name, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "comfirm-dialog-btn-cancel",
        type: "warning"
      })
        .then(() => {
          if (row.id === "" || row.id == null) {
            this.dictentryList.splice(index, 1);
            return;
          }
          deleteDictentry(row.id)
            .then(res => {
              if (res.data.errorCode === "000000") {
                this.dictentryList.splice(index, 1);
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.total2 = this.total2 -1;
              } else {
                this.$message({
                  message: "删除失败",
                  type: "error"
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    saveDictentry(index, row) {
      var flag=0;
      for(var item in this.newDictMap){
        if(this.newDictMap[item].code && this.newDictMap[item].name){
          this.newDictEntryList.push(this.newDictMap[item]);
         
        }else{
          this.$message({
                  message: "字典类型项信息不完整",
                  type: "error"
                });
          flag=1;
          break;
        }
      }
      if(flag==1){
          return;
      }
      saveDictentry(JSON.stringify(this.newDictEntryList))
        .then(res => {
          if (res.data.errorCode === "000000") {
            this.dialogVisible = false;
            this.$message({
              message: "字典保存成功",
              type: "success"
            });
            this.newDictMap = {};
            this.newDictEntryList = [];
            this.getDetails2();
          } else {
            this.$message({
              message: res.data.errorMsg,
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.filter-container {
  position: relative;
  .add-btn {
    position: relative;
    top: 0px;
    right: -10px;
  }
}
.el-form--inline .el-form-item {
  margin: 0 10px 0 0;
}
.app-container .el-table--medium td {
  padding: 5px 0;
}
.app-container .el-tag {
  margin: 0 3px 0 0;
}
.app-container .el-dialog__body {
  height: 400px;
  overflow-y: scroll;
}
.popoverDiv {
  text-align: right;
  margin: 0;
}

.tb-edit .el-input {
  display: none;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
}
</style>
