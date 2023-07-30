<template>
  <div
    id="empManage"
    class="app-container">
    <!-- Table Filter -->
    <div class="filter-container">
      <el-form
        ref="filterForm"
        :model="filterForm"
        size="mini"
        :inline="true">
        <el-form-item
          prop="jobNumber"
          label="工号:">
          <el-input
            v-model="filterForm.jobNumber"
            placeholder="工号"
            clearable
            style="width: 120px;"
            class="filter-item"
            @keyup.enter.native="queryUserList()" />
        </el-form-item>
        <el-form-item
          prop="fullName"
          label="用户名:">
          <el-input
            v-model="filterForm.fullName"
            placeholder="用户名"
            clearable
            style="width: 130px;"
            class="filter-item"
            @keyup.enter.native="queryUserList()" />
        </el-form-item>

        <el-form-item
          prop="status"
          label="状态:">
          <el-select style="width:130px;" @change="statusChange" clearable v-model="filterForm.status">
            <el-option label="禁用" value="1"></el-option>
            <el-option label="正常" value="0"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button
          type="primary"
          class="filter-item"
          style="margin-left: 10px;"
          icon="el-icon-search"
           size="mini"
          @click="queryUserList()">查询
          </el-button>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary"  size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
    <el-table
      v-loading="tableLoading"
      ref="userListTable"
      :header-cell-style="{background: 'rgb(222, 223, 224)'}"
      :data="userList"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      height="calc(100vh - 278px)"
      style="width: 100%">
      <el-table-column
        label="工号"
        min-width="40"
        prop="jobNumber"
        align="center" />

      <el-table-column
        label="姓名"
        min-width="70"
        prop="fullName"
        align="center" />
      
      <el-table-column
        label="机构"
        show-overflow-tooltip
        prop="orgName"
        min-width="90"
        align="center" />

      <el-table-column
        label="部门"
        show-overflow-tooltip
        prop="deptName"
        min-width="100"
        align="center" />

      <el-table-column
        prop="status"
        min-width="40"
        align="center"
        label="状态:">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '0'" type="info">正常</el-tag>
          <el-tag v-if="scope.row.status === '1'" type="danger">禁用</el-tag>
        </template>
      </el-table-column>


      <el-table-column
        label="创建时间"
        prop="createTime"
        min-width="80"
        align="center" />

      <el-table-column
        label="更新时间"
        prop="updateTime"
        min-width="80"
        align="center" />

      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button 
          v-permission="'user:reset:password'" 
          type="text" 
          icon="el-icon-refresh-left" 
          @click="resetPwd(scope.row)" 
          style="color: #409eff">重置密码</el-button>
          <span v-permission="'user:reset:password'" v-if="scope.row.jobNumber != 'superAdmin'">
            <el-divider direction="vertical" />
          </span>
          <el-button 
          v-permission="'user:disable:enable'" 
          type="text" 
          v-if="scope.row.status === '0' && scope.row.jobNumber != 'superAdmin'" 
          icon="el-icon-edit-outline" 
          @click="changeStatus(scope.row)" 
          style="color: red">禁用</el-button>
          <el-button 
          v-permission="'user:disable:enable'" 
          type="text" 
          v-if="scope.row.status === '1' && scope.row.jobNumber != 'superAdmin'" 
          icon="el-icon-edit-outline" 
          @click="changeStatus(scope.row)" 
          style="color: #409eff">启用</el-button>
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
        @size-change="pageSizeChange" />
    </div>
  </div>
</template>


<script>
import * as Constant from '@/utils/constant.js'
import { personList,resetPwd,changeStatus } from '@/api/sysManagement/sysUserApi'
import { listPage } from '@/api/sysManagement/sysDeptApi'

export default {
  name: 'userManagement',
  data() {
    return {
      tableLoading: false,
      //检索参数
      filterForm: {
        fullName: null,
        jobNumber: null,
        deptName: null,
        status : null
      },
      deptList:[],
      userList: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: Constant.pageSizes,
      total: 0,
      currentRow: null
    }
  },
  mounted() {
    this.queryUserList();
  },

  methods: {
    //获取当前行数据
    handleCurrentChange(val){ 
      this.currentRow = val;
    },

    /**
     * 用户状态发生变化得Change事件
     */
    statusChange(val){
      this.filterForm.status = val;
      this.currentPage = 1;
      this.queryUserList();
    },


    //检索数据列表
    queryUserList() {
      this.tableLoading = true
      const query = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        fullName: this.filterForm.fullName,
        jobNumber: this.filterForm.jobNumber,
        status: this.filterForm.status
      }
      personList(query).then(res => {
        this.tableLoading = false
        if (res.data.errorCode === '000000') {
          this.userList = res.data.data.records
          this.total = res.data.data.total
        } else if (res.data.errorCode !== '000000') {
          this.$message({
            message: res.data.errorMsg,
            type: 'error',
            center: true,
            showIcon: true,
            showClose: true
          })
        }
      })
    },

    formatPlatform(row, column, cellValue, index) {
      if (!cellValue || cellValue.length === 0) {
        return '/'
      } else if (cellValue.length === 1) {
        return cellValue[0].sysName
      } else {
        return cellValue[0].sysName + '...'
      }
    },

    cancelUpdate() {
      this.$refs['updateUser'].resetFields()
      this.udateUserDialogVisible = false
    },

    /**
     * 分页功能 - 检测当前页变化
     */
    currentPageChange(val) {
      this.currentPage = val
      this.queryUserList()
    },
    /**
     * 分页功能 - 检测PageSize变化
     */
    pageSizeChange(val) {
      this.pageSize = val
      this.queryUserList()
    },
     reset() {
      
      this.filterForm.fullName = '';
      this.filterForm.jobNumber = '';
      this.queryUserList();
    },

    /**
     * 变更用户状态，禁用，启用
     */
    changeStatus(val){
      var statusName = "禁用";
      if (val.status === '1') {
        statusName = "启用"
      }
      var text = "确认" + statusName + "用户【<font color='blue'>" + val.fullName + '</font>】吗?'
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "comfirm-dialog-btn-cancel",
        dangerouslyUseHTMLString: true,
        type: "warning"
      }) .then(() => {
        changeStatus(val.jobNumber).then(res=>{
            this.$message({
              message: res.data.errorMsg,
              type: res.data.errorCode === '000000' ? "success" : "error"
            });
            if (res.data.errorCode === '000000') {
              this.queryUserList();
            }
          })
        }) .catch(() => {});
    },


    /**
     * 重置密码
     */
    resetPwd(val){
      let text = "确定要重置<<font color='blue'>" + val.fullName + '</font>>的密码?';
      this.$confirm(text, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "comfirm-dialog-btn-cancel",
        type: "warning"
      }) .then(() => {
        resetPwd(val.jobNumber).then(res => {
            this.$message({
              message: res.data.errorMsg,
              type: res.data.errorCode === '000000' ? "success" : "error"
            });
            if(res.data.errorCode === '000000') {
              //重置成功后,如果重置的是当前的登录用户,那么则退出重新登录.
              let jobNumber = this.$store.getters.name;
              if(jobNumber === val.jobNumber){
                this.logout();
              }
              this.queryUserList();
            }
          })
        }).catch((res) => {});
    },


    /**
     * 退出登录
     */
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()
      })
    },

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
.app-container .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  padding: 0px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-height: calc(100% - 30px);
  height: 500px;
}
.addUser {
  width: 70%;
  margin: 0 auto;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
</style>
