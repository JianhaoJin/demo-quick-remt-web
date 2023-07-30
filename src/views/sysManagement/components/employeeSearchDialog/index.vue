<template>
  <div >
    <!-- Table Filter -->
    <div >
      <el-form ref="filterForm" :model="filterForm" :inline="true" >
        <el-form-item prop="jobNumber" label="用户工号:">
          <el-input
            v-model="filterForm.jobNumber"
            placeholder="用户工号"
            clearable
            @keyup.enter.native="getEmployeeList()"/>
        </el-form-item>
        <el-form-item prop="name" label="用户姓名:">
          <el-input
            v-model="filterForm.name"
            placeholder="用户姓名"
            clearable
            style="width: 110px;"
            class="filter-item"
            @keyup.enter.native="getEmployeeList()"/>
        </el-form-item>
        <el-button type="primary" 
        class="filter-item" 
        style="margin-left: 10px;" 
        icon="el-icon-search" 
        @click="getEmployeeList()">查询</el-button>
      </el-form>
    </div>

    <!-- Table -->
    <el-table
      v-loading="tableLoading"
      ref="userTable"
      :data="userList"
      border
      highlight-current-row
      height="calc(100vh - 365px)"
      :header-cell-style="{background: 'rgb(222, 223, 224)'}"
      style="width: 100%"
      @row-dblclick="rowDoubleClick">
      <el-table-column
        v-if="false"
        prop="empId"
        label="用户ID"
        width="100"
        align="center"/>

      <el-table-column
        prop="jobNumber"
        label="用户工号"
        width="100"
        align="center"/>
      <el-table-column
        prop="name"
        label="用户姓名"
        align="center"/>
      <el-table-column
        prop="orgName"
        label="机构"
        align="center"/>
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
  </div>
</template>

<script>
import * as Constant from '@/utils/constant.js'
import { queryEmployeesByOrgId } from '@/api/sysManagement/orgManagement/sysEmployeeApi'

export default {
  name: 'EmployeeSearchDialog',
  props: {
    orgId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      userList: [], // 用户列表
      tableLoading: false,
      currentPage: 1, // 当前页
      total: 0, // 总数
      pageSizes: Constant.pageSizes,
      pageSize: 10, // 每页数量
      filterForm: { // 查询的变量
        jobNumber: '',
        name: '',
        empStatus : '0'
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
        label: 'orgName'
      },
      roleIdFilterName: '角色名称',
      branchFilterName: '机构名称'
    }
  },

  watch: {
    orgId(val) {
      this.getEmployeeList()
    }
  },

  /**
   * 初始化钩子函数
   */
  mounted() {
    this.getEmployeeList()
  },

  methods: {
    /**
     * 鼠标双击事件
     */
    rowDoubleClick(row) {
      this.$emit('onUserSelect', row)
    },

    /**
       * 获取分页用户列表
       */
    getEmployeeList() {
      this.tableLoading = true
      const query = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        jobNumber: this.filterForm.jobNumber,
        name: this.filterForm.name,
        empStatus : this.filterForm.empStatus,
        orgId: this.orgId,
      }
      queryEmployeesByOrgId(query).then(res => {
        if (res.data.errorCode === "000000") {
          this.tableLoading = false
          this.userList = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.$message({
            message: '获取用户数据失败！',
            type: 'error'
          })
        }
      }).catch(error => {
        console.log(error)
      })
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
    }
  }
}
</script>