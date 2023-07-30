<template>
  <div>
    <!-- Table Filter -->
    <div>
      <el-form ref="filterForm" :model="filterForm" :inline="true" size="mini">
        <el-form-item prop="jobNumber" label="用户名:">
          <el-input
            v-model="filterForm.jobNumber"
            placeholder="用户名"
            clearable
            style="width: 120px;"
            class="filter-item"
            @keyup.enter.native="fetchUserList()"/>
        </el-form-item>
        <el-form-item prop="fullName" label="姓名:">
          <el-input
            v-model="filterForm.fullName"
            placeholder="姓名"
            clearable
            style="width: 150px;"
            class="filter-item"
            @keyup.enter.native="fetchUserList()"/>
        </el-form-item>
        <el-form-item prop="deptName" label="部门">
          <el-input
            v-model="filterForm.deptName"
            placeholder="部门"
            clearable
            style="width: 150px;"
            class="filter-item"
            @keyup.enter.native="fetchUserList()"/>
        </el-form-item>
        <el-button type="primary" 
        class="filter-item" size="mini" 
        icon="el-icon-search" 
        style="margin-left: 10px;" 
        @click="fetchUserList()">查询</el-button>
      </el-form>
    </div>
    <el-table
      ref="userPerList"
      v-loading="userLoading"
      :header-cell-style="{background: 'rgb(222, 223, 224)'}"
      :data="userList"
      border
      highlight-current-row
      height="calc(100vh - 340px)"
      style="width: 100%">
      <el-table-column
        type="selection"
        :selectable="userIsselected"
        align="center"
        width="55" />
      <el-table-column
        prop="jobNumber"
        label="用户名"
        min-width="70"
        align="center">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.jobNumber === 'superAdmin'" 
          content="超级管理员superAdmin不能被删除！" 
          effect="light" 
          placement="top">
            <span v-if="scope.row.jobNumber" v-text="scope.row.jobNumber"></span>
          </el-tooltip>
          <span v-else v-text="scope.row.jobNumber"></span>
        </template>
      </el-table-column>

      <el-table-column
        label="工号"
        min-width="120"
        prop="jobNumber"
        align="center" />

      <el-table-column
        label="姓名"
        min-width="180"
        prop="fullName"
        align="center" />

       <el-table-column
        label="部门"
        show-overflow-tooltip
        prop="deptName"
        min-width="120"
        align="center" />

      <el-table-column
        label="创建时间"
        prop="createTime"
        min-width="120"
        align="center" />
      
      <el-table-column
        label="修改时间"
        prop="updateTime"
        min-width="120"
        align="center" />
    </el-table>
    <!-- Pagination -->
    <div class="pagination-container">
      <el-pagination
        :current-page="currentPage"
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
import Utils from "@/utils/util"
export default {
  name: 'UserTable',
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    pageSizes: {
      type: Array,
      default: () => Constant.pageSizes
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    userList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      listData: this.userList,
      pageSize1: this.pageSize,
      currentPage1: this.currentPage,
      userLoading : false,
      filterForm: {
        jobNumber: null,
        fullName: null,
        deptName: null
      }
    }
  },

  mounted() {

  },

  created() {
  },

  methods: {
    getSelections() {
      return this.$refs.userPerList.selection
    },


    /**
     * 搜索，重新获取新数据
     */
    fetchUserList() {
      let obj = {
        jobNumber : this.filterForm.jobNumber,
        fullName : this.filterForm.fullName,
        deptName: this.filterForm.deptName,
        pageNum : this.currentPage1,
        pageSize : this.pageSize1
      }
      this.$emit('getUserList', obj)
    },

    /**
     * 分页功能 - 检测当前页变化
     */
    currentPageChange(val) {
      this.currentPage1 = val
      let obj = {
        username : this.filterForm.username,
        fullName : this.filterForm.fullName,
        deptName: this.filterForm.deptName,
        pageNum : this.currentPage1,
        pageSize : this.pageSize1
      }
      this.$emit('getUserList', obj)
    },

    /**
     * 分页功能 - 检测PageSize变化
     */
    pageSizeChange(val) {
      this.pageSize1 = val
      let query = {
        username : this.filterForm.username,
        fullName : this.filterForm.fullName,
        deptName: this.filterForm.deptName,
        pageNum : this.currentPage1,
        pageSize : this.pageSize1
      }
      this.$emit("getUserList", query);
    },

    /**
     * 设置是否禁用勾选框
     */
    userIsselected(row, index){
      if(row.jobNumber === 'superAdmin'){
        return false;
      }else {
        return true;
      }
    },
  }

}
</script>
<style lang="scss" scoped>
.filter-container {
  position: relative;
  top : 5px;
  .add-btn {
    position: relative;
    top: 0px;
    right: -10px;
  }
}
</style>

