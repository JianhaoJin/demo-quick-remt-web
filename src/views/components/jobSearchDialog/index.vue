<template>
  <div id="jobManage" class="app-container">
    <div>
      <!-- Table Filter -->
      <div class="filter-container">
        <el-form ref="filterForm" :model="filterForm" :inline="true">
          <el-form-item prop="jobCode" label="岗位编码:">
            <el-input
              v-model="filterForm.jobCode"
              placeholder="岗位编码"
              clearable
              style="width: 110px;"
              class="filter-item"
              @keyup.enter.native="getJobList()"
            />
          </el-form-item>
          <el-form-item prop="jobName" label="岗位名称:">
            <el-input
              v-model="filterForm.jobName"
              placeholder="岗位名称"
              clearable
              style="width: 110px;"
              class="filter-item"
              @keyup.enter.native="getJobList()"
            />
          </el-form-item>
          <el-button
            type="primary"
            class="filter-item"
            style="margin-left: 10px;"
            @click="getJobList()"
          >查询</el-button>
        </el-form>
      </div>

      <!-- Table -->
      <el-table
        v-loading="tableLoading"
        ref="jobListTable"
        :header-cell-style="{background: 'rgb(222, 223, 224)'}"
        :data="jobList"
        border
        height="calc(70vh - 200px)"
        highlight-current-row
        style="width: 100%"
        @row-dblclick="dblClick"
        @row-click="selectedCur"
      >
        <el-table-column label="岗位编码" align="center" prop="jobCode"/>
        <el-table-column label="岗位名称" align="center" prop="jobName"/>
        <el-table-column label="所属机构" align="center" prop="orgName"/>
        <el-table-column label="所属部门" align="center" prop="deptName"/>
        <el-table-column :formatter="boardlineFormat" label="所属条线" align="center" prop="boardLine"/>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page.sync="pageNum"
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
  </div>
</template>

<script>
import * as Constant from '@/utils/constant.js'
import { fetchJobList } from '@/api/sysManagement/orgManagement/sysJobApi'

export default {
  name: 'JobSearchDialog',
  props: {
    deptId: {
      type: Number,
      default: null
    },
    parentDialogvisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fullscreen: false,
      titleDialog: '新增岗位',
      jobList: [],
      jobData: {},
      boardlineOptions: [], // 所属条线数据字典
      tableLoading: false,
      total: 0, // 总数
      pageNum: 1, // 当前页
      pageSizes: Constant.pageSizes,
      pageSize: 10, // 每页数量
      filterForm: {
        jobCode: '',
        jobName: ''
      }, // 过滤条件表格
      JobManageDialog: false,
      editType: 0,
      dialogjobData: {},
      result: false,
      dictentryList: {}
    }
  },
  watch: {
    parentDialogvisible(val) {
      if (val) {
        this.getJobList()
      }
    }
  },
  created() {
    var _this = this
    this.getDicts({ dicttypeid: 'COMM_BOARDLINE' }).then(response => {
      response.data.results.forEach(element => {
        _this.dictentryList[element.dictid] = element.dictname
      })
    })
    this.getJobList()
  },
  methods: {
    boardlineFormat(row) {
      return this.dictentryList[row.boardLine]
    },
    getJobList() {
      const query = {
        deptId: this.deptId,
        jobCode: this.filterForm.jobCode,
        jobName: this.filterForm.jobName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      fetchJobList(query)
        .then(res => {
          if (res.data.code === 200) {
            this.tableLoading = false
            this.jobList = res.data.results.rows
            this.total = res.data.results.total
          } else {
            this.$message({
              message: '获取岗位失败！',
              type: 'error'
            })
          }
          this.tableLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    /**
     * 分页功能 - 检测当前页变化
     */
    currentPageChange(val) {
      this.pageNum = val
      this.getJobList()
    },
    /**
     * 分页功能 - 检测PageSize变化
     */
    pageSizeChange(val) {
      this.pageSize = val
      this.getJobList()
    },
    dblClick(row) {
      this.jobData.jobId = row.jobId
      this.$emit('selectedJob', row)
    },
    selectedCur(row) {
      if (row) {
        this.$refs.jobListTable.toggleRowSelection(row)
      }
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
    z-index: 1;
    overflow-y: scroll;
  }
  .popoverDiv{
    text-align: right;
    margin: 0;
  }

</style>
