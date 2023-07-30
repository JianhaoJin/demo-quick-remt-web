<template>
  <div id="apiSelect" class="app-container">
    <!-- Table Filter -->
    <div class="filter-container">
      <el-form
        size="mini"
        :inline="true"
        :model="filterData"
        label-position="left">
        <el-form-item label="所属模块:">
          <el-input v-model="filterData.module" clearable/>
        </el-form-item>
        <el-form-item label="URL:">
          <el-input v-model="filterData.url" clearable/>
        </el-form-item>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="loadAuthorizedApiList">查询</el-button>
      </el-form>
    </div>
    <p/>
    <!-- Table -->
    <el-table
      v-loading="tableLoading"
      ref="dataList"
      :header-cell-style="{background: 'rgb(222, 223, 224)'}"
      :data="dataList"
      border
      height="calc(100vh - 280px)"
      style="width: 100%">
      <el-table-column
        :show-overflow-tooltip="true"
        type="selection"
        width="40"/>
      <el-table-column
        type="index"
        label="序号"
        width="52"
        align="center" />
      <el-table-column
        align="center"
        label="所属模块"
        min-width="60"
        prop="module" />
      <el-table-column
        align="请求地址"
        label="URL"
        prop="url" />
      <el-table-column
        align="center"
        label="请求类型"
        min-width="35"
        prop="requestType" />
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="接口概述"
        prop="descriptions"/>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-container">
      <el-pagination
        :current-page.sync="pageParam.currentPage"
        :page-sizes="pageParam.pageSizes"
        :page-size="pageParam.pageSize"
        :total="pageParam.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="currentPageChange"
        @size-change="pageSizeChange" />
    </div>
  </div>
</template>

<script>
import { pageApiList } from '@/api/sysManagement/externalAppApi'
import * as constants from '@/utils/constant.js'

export default {
  name: 'ApiSelect',
  props: {
    externalAppId: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableLoading: false,
      dataList: [],
      filterData: {
        module: null,
        url: null
      },
      pageParam: {
        pageSizes: constants.pageSizes,
        pageSize: 10,
        currentPageUser: 1,
        total: 0
      }
    }
  },
  computed: {
    selection: function() {
      return this.$refs.dataList.selection
    }
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.loadAuthorizedApiList()
      } else {
        this.filterData = {
          module: null,
          url: null
        }
        this.pageParam = {
          pageSizes: constants.pageSizes,
          pageSize: 10,
          currentPageUser: 1,
          total: 0
        }
        this.$refs.dataList.clearSelection()
      }
    }
  },
  mounted() {
    this.loadAuthorizedApiList()
  },
  /**
   * 自定义方法
   */
  methods: {
    /**
     * 加载数据列表
     */
    loadAuthorizedApiList() {
      this.tableLoading = true
      const query = {
        ...this.filterData,
        pageNum: this.pageParam.currentPage,
        pageSize: this.pageParam.pageSize,
        authorized: false
      }
      pageApiList(this.externalAppId, query).then(res => {
        this.tableLoading = false
        if (res.data.errorCode === '000000') {
          this.dataList = res.data.data.records
          this.pageParam.total = res.data.data.total
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
    /**
     * 分页功能 - 检测当前页变化
     */
    currentPageChange(val) {
      this.pageParam.currentPage = val
      this.loadAuthorizedApiList()
    },
    /**
     * 分页功能 - 检测PageSize变化
     */
    pageSizeChange(val) {
      this.pageParam.pageSize = val
      this.loadAuthorizedApiList()
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
.td1 {
  text-align: center;
  width: 15%;
  border: 1px solid #e6d8d8;
  font-weight: bold;
  padding: 10px;
  background-color: aliceblue;
}
.td2 {
  text-align: left;
  border: 1px solid #e6d8d8;
  padding: 15px 15px 15px 15px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
</style>
