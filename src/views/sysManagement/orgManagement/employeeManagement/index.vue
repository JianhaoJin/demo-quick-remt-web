<template>
  <div id="empManage" class="app-container">
    <!-- Table Filter -->
    <div class="filter-container">
      <el-form ref="filterForm" :model="filterForm" :inline="true">
        <el-form-item prop="empBadge" label="员工工号:">
          <el-input
            v-model="filterForm.jobNumber"
            placeholder="员工工号"
            clearable
            style="width: 120px;"
            size="mini"
            @keyup.enter.native="getEmployeeList()"/>
        </el-form-item>
        <el-form-item prop="empName" label="员工姓名:">
          <el-input
            v-model="filterForm.name"
            placeholder="员工姓名"
            clearable
            style="width: 120px;"
            size="mini"
            @keyup.enter.native="getEmployeeList()"/>
        </el-form-item>
        <el-form-item prop="empStatus" label="状态:" size="mini">
          <el-select  v-model="filterForm.empStatus" clearable style="width:120px;" @change="empStatusChange">
            <el-option label="在职" value="0"></el-option>
            <el-option label="离职" value="1"></el-option>
          </el-select>
        </el-form-item>
          <el-button 
          type="primary" 
          size="mini" 
          icon="el-icon-search" 
          style="margin-left: 10px;" 
          @click="getEmployeeList()">查询</el-button>
      </el-form>
    </div>
    <!-- Table -->
    <el-table
      v-loading="tableLoading"
      ref="empListTable"
      :header-cell-style="{background: 'rgb(222, 223, 224)'}"
      :data="employList"
      border
      highlight-current-row
      height="calc(100vh - 365px)"
      style="width: 100%">
      <el-table-column type="selection" align="center" :selectable="selectableDisabled" width="55"/>
      <el-table-column
        prop="jobNumber"
        label="员工工号"
        min-width="70"
        align="center">
          <template slot-scope="scope">
            <el-tooltip 
            class="item" 
            effect="light" 
            content="超级管理员不可编辑，不可修改，系统默认用户！" 
            placement="top" 
            v-if="scope.row.jobNumber === 'superAdmin'">
              <span>{{scope.row.jobNumber}}</span>
            </el-tooltip>
            <span v-else>{{scope.row.jobNumber}}</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="员工姓名"
        min-width="80"
        align="center"/>

      <el-table-column
        label="所属机构"
        min-width="120"
        prop="orgName"
        align="center"/>

      <el-table-column
        label="所属部门"
        min-width="180"
        prop="deptName"
        align="center"/>

      <el-table-column
        label="所属岗位"
        prop="jobName"
        min-width="120"
        align="center"/>

      <el-table-column
        :formatter="boardlineFormat"
        show-overflow-tooltip
        label="所属条线"
        prop="boardLine"
        min-width="120"
        align="center"/>

      <el-table-column
        :formatter="headshipFormatter"
        show-overflow-tooltip
        label="职务"
        prop="headShip"
        min-width="80"
        align="center"
      />

      <el-table-column
        label="上级领导"
        prop="reportToName"
        align="center"/>

      <el-table-column
        v-if="false"
        label="联系手机"
        prop="mobileTelephone"
        align="center"/>

      <el-table-column
        label="状态"
        prop="empStatus"
        min-width="80"
        align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.empStatus === '0'" >在职</el-tag>
          <el-tag v-if="scope.row.empStatus === '1'" type="info">离职</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-container">
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="currentPageChange"
        @size-change="pageSizeChange"
      />
    </div>
    <el-form style="padding-top:10px">
      <el-button v-permission="'org:employee:dowload'" type="primary" icon="el-icon-download" size="mini" @click="download">下载导入模板</el-button>
      <el-button v-permission="'org:employee:import'" type="primary" icon="el-icon-upload2" size="mini" @click="importData">导入</el-button>
      <el-button v-permission="'org:employee:export'" type="primary" icon="el-icon-download" size="mini" @click="exportExcel">导出</el-button>
      <el-button v-permission="'org:employee:add'" class="add-btn" type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="handleAdd">新增</el-button>
      <el-button v-permission="'org:employee:update'" icon="el-icon-edit" type="primary" size="mini" @click="handleEdit">编辑</el-button>
      <el-button v-permission="'org:employee:delete'" icon="el-icon-delete" type="danger" size="mini" @click="handleDelete">删除</el-button>
    </el-form>
    <el-dialog :close-on-click-modal="false" :show-close="false" :fullscreen="fullscreen" :title="titleDialog" :visible.sync="userDialog" center width="60%" top="25hv">
      <NewEmployee ref="addUser" @saveSuccess="employeeSaveSuccess"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" icon="el-icon-check" @click="confirm">保存</el-button>
        <el-button type="info" size="mini" icon="el-icon-close" @click="userDialog = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 模板导入 -->
    <el-dialog :visible.sync="uploadVisible" title="员工数据导入" center width="50%" :close="excelVisibleClose" :close-on-press-escape="false" :close-on-click-modal="false">
      <div style="margin-bottom:15px">
        <el-button v-if="errorMessageList.length != 0" type="danger" size="mini" icon="el-icon-view" @click="catErrorMsg">查看失败明细</el-button>
      </div>
      <el-upload
        ref="employeeUpload"
        :action="importUrl"
        :headers="headersObject"
        :on-success="uploadSuccess"
        :on-progress="uploadProgress"
        :on-error="fileError"
        :multiple="false"
        :before-upload="reportedBeforeUpload"
        :auto-upload="true"
        accept=".xls, .xlsx"
        class="upload-demo"
        drag>
        <i class="el-icon-upload"/>
        <div class="el-upload__text">
          将文件拖到此处上传或
          <em>点击此处上传</em>
        </div>
        <div slot="tip" class="el-upload__tip" style="color:red;">只能上传Excel文件</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="excelVisibleClose">取消</el-button>
      </div>
    </el-dialog>


    <!-- 查看失败原因模态框 -->
    <el-drawer title="导入失败原因明细" :visible.sync="errorVisible" :with-header="false" width="60%">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>导入失败原因明细</span>
        </div>
        <div v-for="(item,index) in errorMessageList" :key="index" class="text item">
          {{ item }}
        </div>
      </el-card>
    </el-drawer>


  </div>
</template>

<script>
import * as Constant from '@/utils/constant.js'
import { deleteEmployee, fetchEmployees, downloadApi } from '@/api/sysManagement/orgManagement/sysEmployeeApi'
import store from '@/store'
const Qs = require('qs')
import { Loading } from 'element-ui'
import NewEmployee from './NewEmployee'
import {fetchDictItemByTypeCode,checkDictItemCode} from '@/api/sysManagement/sysDictItemApi'
import setting from '@/settings'

/**
 * 超级管理员常量
 */
const super_admin = "superAdmin";
export default {
  name: 'EmployeeManagement',
  components: {
    NewEmployee
  },
  props: {
    org: {
      type: Object,
      default: function() {
        return { orgId: '' }
      }
    }
  },
  data() {
    return {
      fullscreen: false,
      errorMessageList: [],
      errorVisible: false,
      center: true,
      uploadVisible: false,
      importUrl: process.env.BASE_API + "/employees/template",
      headersObject: { [setting.header_key] : store.getters.token},
      titleDialog: '新增人员用户',
      userDialog: false,
      employList: [], // 员工列表
      tableLoading: false,
      currentPage: 1, // 当前页
      total: 0, // 总数
      pageSizes: Constant.pageSizes,
      pageSize: 10, // 每页数量
      loading: false,
      filterForm: {
        jobNumber: '',
        name: '',
        empStatus : ''
      }, // 过滤条件表格
      roleIdFilter: false,
      orgIdFilter: false,
      roleData: [], // 角色树数据
      branchData: [],
      roleProp: {
        children: 'children',
        label: 'roleName'
      },
      branchProp: {
        children: 'children',
        label: 'deptName'
      },
      roleIdFilterName: '角色名称',
      branchFilterName: '机构名称',
      boardlineOptions: [], // 所属条线数据字典
      headshipOptions:[]
    }
  },
  computed: {
    orgId: function() {
      return this.org.orgId
    }
  },

  /**
   * 监听orgId变化
   */
  watch: {
    orgId(val) {
      if(val){
        this.getEmployeeList()
      }
    }
  },

  /**
   * 初始化方法列表
   */
  mounted() {
    const this_ = this
    checkDictItemCode('COMM_HEADSHIP').then(res=>{
      res.data.data.forEach(element=>{
        this_.headshipOptions[element.code] = element.name
      })
    })
    checkDictItemCode('COMM_BOARDLINE').then(res=>{
      res.data.data.forEach(element=>{
        this_.boardlineOptions[element.code] = element.name
      })
    })
    this.getEmployeeList()
  },
  /**
   * 自定义方法列表
   */
  methods: {

    /**
     * 获取分页员工列表
     */
    getEmployeeList() {
      this.tableLoading = true
      const query = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        jobNumber: this.filterForm.jobNumber,
        name: this.filterForm.name,
        empStatus: this.filterForm.empStatus,
        orgId: this.orgId
      }
      fetchEmployees(query).then(res => {
        if (res.data.errorCode === "000000") {
          this.tableLoading = false
          this.employList = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.$message({
            message: '获取员工数据失败！',
            type: 'error'
          })
        }
        this.tableLoading = false
      }).catch(error => {
        console.log(error)
      })
    },


    /**
     * 员工离职在职状态的变更事件 
     */
    empStatusChange(){
      this.pageNum = 1;
      this.getEmployeeList();
    },

    /**
     * 人员选择框禁用
     */
    selectableDisabled(row, index){
      if(row.jobNumber === super_admin){
        return false;
      }else {
        return true;
      }
    },


    reset() {
      this.$refs.addUser.clearvalid()
      this.$refs.addUser.reset()
    },

    confirm() {
      this.$refs.addUser.handleConfirm()
      this.getEmployeeList();
    },


    employeeSaveSuccess() {
      this.userDialog = false
      this.getEmployeeList()
    },


    boardlineFormat(row) {
      return this.boardlineOptions[row.boardLine]
    },

    

    headshipFormatter(row) {
      return this.headshipOptions[row.headShip]
    },
    
    /**
     * 分页功能 - 检测当前页变化
     */
    currentPageChange(val) {
      this.currentPage = val
      this.getEmployeeList()
    },
    /**
     * 分页功能 - 检测PageSize变化
     */
    pageSizeChange(val) {
      this.pageSize = val
      this.getEmployeeList()
    },
    
    /**
     * 创建新的员工
     */
    handleAdd() {
      this.titleDialog = '新增人员用户'
      this.userDialog = true
      // type 0新建 1修改
      var _this = this
      this.$nextTick(() => {
        this.$refs.addUser.clearvalid()
        this.$refs.addUser.reset()
        this.$refs.addUser.init(0, _this.org.orgId, _this.org.orgName, null)
      })
    },

    /**
     * 修改员工
     */
    handleEdit() {
      var items = this.$refs.empListTable.selection
      if (items.length <= 0) {
        this.$message({
          message: '请选择一条信息！',
          type: 'error'
        })
        return
      }
      if (items.length > 1) {
        this.$message({
          message: '只可选择一条信息！',
          type: 'error'
        })
        return
      }
      const item = items[0]
      this.titleDialog = '修改人员用户'

      this.userDialog = true
      // type 0新建 1修改
      const query = {
        id:item.id,
        orgId: this.orgId,
        orgName: item.orgName,
        empBadge: item.jobNumber,
        empName: item.name,
        gender:item.gender,
        birthDay:item.birthDay,
        depId: item.deptId,
        jobId: item.jobId,
        boardLine: item.boardLine,
        depName: item.deptName,
        jobName: item.jobName,
        headShip: item.headShip,
        empAuth:item.empAuth,
        authProperty:item.authProperty,
        reportTo: item.superior, // 这是整型
        reportToName: item.reportToName,
        mobileTelephone: item.mobiletelPhone,
        remark: item.remark,
        empStatus: item.empStatus,
        boardLineName:this.boardlineOptions[item.boardLine]
      }
      this.$nextTick(() => {
        this.$refs.addUser.reset()
        this.$refs.addUser.clearvalid()
        this.$refs.addUser.init(1, query.orgId, query.orgName, query)
      })
    },

    /**
     * 处理删除员工按钮
     */
    handleDelete() {
      var selections = this.$refs.empListTable.selection
      if (selections.length <= 0) {
        this.$message({
          message: '请选择员工！',
          type: 'error'
        })
        return
      }
      var text = "";
      if (selections.length > 1) {
        text = "确认删除所选的【<font color='blue'>" + selections.length + '</font>】个用户吗?'
      } else {
        text = "确认删除所选用户【<font color='blue'>" + selections[0].name + '</font>】吗?'
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'comfirm-dialog-btn-cancel',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        let ids = [];
        selections.forEach(item => {
          ids.push(item.jobNumber)
        })
        deleteEmployee(ids).then(res => {
            if (res.data.errorCode === "000000") {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getEmployeeList()
            } else {
              this.$message({
                message: '删除失败！',
                type: 'error'
              })
            }
          }).catch(error => {
            console.log(error)
          })
      }).catch(() => {})
    },


    /**
     * 导出
     */
    exportExcel() {
      let urlString = "excel/" + this.orgId + "?"
      + (this.filterForm.jobNumber ? "reportType=" + this.filterForm.jobNumber : "")
      + (this.filterForm.name ? "&startDate="+ this.filterForm.name:"")
      + (this.filterForm.empStatus ? "&endDate="+ this.filterForm.empStatus:"");
      
      downloadApi(urlString);
    },
    
    /**
     * 下载导入模板
     */
    download() {
      downloadApi('template');
    },

    // 导入
    importData() {
      this.uploadVisible = true;
    },

    /**
     * 关闭文件上传模态框
     */
    excelVisibleClose() {
      this.uploadVisible = false;
      // 清除文件
      this.$refs.employeeUpload.clearFiles();
      this.errorMessageList = []

    },

    /**
     * 文件导入时的钩子
     */
    uploadProgress(event, file, fileList){
      this.loading = Loading.service({
        fullscreen: true,
        lock: true,
        text: '数据处理中，请稍后........',
        background: 'rgba(0,0,0,0.7)'
      })
    },


    /**
     * 导入成功触发的事件
     */
    uploadSuccess(response, file, fileList) {
      this.$message({
        showIcon: true,
        showClose: true,
        center: true,
        message: response.errorMsg,
        type: response.errorCode === "000000" ? "success" : "error"
      });
      if (response.errorCode === "000000") {
        this.getEmployeeList();
        this.uploadVisible = false;
      }else {
        this.errorMessageList = response.data
      }
      this.loading.close()
    },

    /**
     * 查看失败原因
     */
    catErrorMsg(){
      this.errorVisible = true
    },

    /**
     * 上传文件前触发的钩子函数
     */
    reportedBeforeUpload(file) {
      const name = file.name;
      if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
        return true;
      }
      this.$message({
        message: "只能上传exlce文档！",
        type: "warning"
      });
      return false;
    },

    /**
     * 文件上传失败时的钩子
     */
    fileError(file) {
      this.loading.close()
      this.$message({
        message: "文件导入失败！",
        type: "error"
      });
    }

  }
}
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
  .app-container .el-table--medium td{
    padding: 5px 0;
  }
  .app-container .el-tag{
    margin: 0 3px 0 0;
  }
  .app-container .el-dialog__body{
    height: 400px;
    overflow-y: scroll;
  }
  .popoverDiv{
    text-align: right;
    margin: 0;
  }

.app-container .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  padding: 0px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-height: calc(100% - 30px);
  height: 500px;
}
</style>
