
<template>
  <div class="app-container" style="margin-top:0px;margin-bottom:0px;padding-top:0px;padding-bottom:0px;">
    <div>
      <!-- Table Filter -->
      <div class="filter-container">
        <el-form ref="filterForm" :model="filterForm" :inline="true">
          <el-form-item prop="depCode" label="部门代码(十位):">
            <el-input
              v-model="filterForm.depCode"
              placeholder="部门代码"
              clearable
              style="width: 110px;"
              class="filter-item"
              @keyup.enter.native="getDepList()"/>
          </el-form-item>
          <el-form-item prop="depName" label="部门名称:">
            <el-input
              v-model="filterForm.depName"
              placeholder="部门名称"
              clearable
              style="width: 110px;"
              class="filter-item"
              @keyup.enter.native="getDepList()"/>
          </el-form-item>
          <el-button type="primary" class="filter-item" icon="el-icon-search" style="margin-left: 10px;" @click="getDepList()">查询</el-button>
        </el-form>
      </div>

      <!-- Table -->
      <el-table
        v-loading="tableLoading"
        :data="depList"
        :header-cell-style="{background: 'rgb(222, 223, 224)'}"
        border
        highlight-current-row
        height="calc(70vh - 200px)"
        style="width: 100%;"
        @row-click="rowClick"
        @row-dblclick="rowDoubleClick">
        <el-table-column label="部门代码(十位)" width="150" align="center" prop="code"/>
        <el-table-column label="部门名称" align="center" prop="location"/>
        <el-table-column label="部门级别" width="150" align="center" prop="grade" :formatter="grandeFormatter"/>
        <el-table-column label="上级部门" align="center" prop="parentName"/>
        <el-table-column label="是否失效" width="90" align="center">
          <template slot-scope="scope">
            {{ scope.row.isDisabled == 1 ?'无效':'有效' }}
          </template>
        </el-table-column>

      </el-table>

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
  </div>

</template>

<script>
import { fetchDepList } from '@/api/sysManagement/orgManagement/sysDepartmentApi'
import * as Constant from '@/utils/constant.js'
import {checkDictItemCode} from '@/api/sysManagement/sysDictItemApi'
export default {
  name: 'DepSearchDialog',
  props: {
    orgId: {
      type: String,
      default: null
    },
    parentDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      depList: [], // 部门列表
      depData: {
        depId: '',
        depName: ''
      },
      tableColumns: [
        {
          text: '部门代码',
          value: 'depCode',
          width: '250'
        }
      ],
      tableLoading: false,
      currentPage: 1, // 当前页
      total: 0, // 总数
      pageSizes: Constant.pageSizes,
      pageSize: 10, // 每页数量
      filterForm: {
        depCode: '',
        depName: '',
        isDisabled: '',
        depId: ''
      }, // 过滤条件表格
      dictDeptGrade: {}
    }
  },
  watch: {
    parentDialogVisible(val) {
      if (val) {
        this.getDepList()
      }
    }
  },

  /**
   * 初始化钩子函数
   */
  created() {
    const _this = this
    checkDictItemCode('COMM_DEPGRADE' ).then(response => {
      if (response.data.errorCode === '000000') {
        response.data.data.forEach(element => {
          _this.dictDeptGrade[element.code] = element.name
        })
      } else {
        _this.$message({
          message: '获取字典数据失败：' + response.data.message,
          type: 'error'
        })
      }
    })
    this.getDepList()
  },

  /**
   * 自定义方法列表
   */
  methods: {
    /**
     * 格式化部门级别
     */
    grandeFormatter(row,column){
      return this.dictDeptGrade[row.grade]
    },

    /**
    * 鼠标单击事件
    */
    rowClick(row) {
      this.depData.depId = row.id
      this.depData.depName = row.location
    },
    /**
     * 鼠标双击事件
     */
    rowDoubleClick(row) {
      this.depData.depId = row.id
      this.depData.depName = row.location
      // "子组件向父组件传值"
      this.$emit('chargeChange', row)
    },

    /**
     * 获取分页部门列表
     */
    getDepList() {
      this.tableLoading = true
      const query = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        code: this.filterForm.depCode,
        location: this.filterForm.depName,
        isDisabled: this.filterForm.isDisabled,
        // 指定部门下的子部门
        orgId: this.orgId
      }
      fetchDepList(query).then(res => {
        if (res.data.errorCode === '000000') {
          
          this.tableLoading = false
          this.depList = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.$message({
            message: '获取部门数据失败！',
            type: 'error'
          })
        }
        this.tableLoading = false
      }).catch(error => {
        console.log(error)
      })
    },
    /**
     * 分页功能 - 检测当前页变化
     */
    currentPageChange(val) {
      this.currentPage = val
      this.getDepList()
    },
    /**
     * 分页功能 - 检测PageSize变化
     */
    pageSizeChange(val) {
      this.pageSize = val
      this.getDepList()
    },
    deptGradeFormatter(val) {
      return this.dictDeptGrade[val.depLevel]
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
