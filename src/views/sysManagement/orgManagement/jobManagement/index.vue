<template>
  <div id="jobManage" class="app-container">
    <div>
      <div class="filter-container">
        <el-form ref="filterForm" :model="filterForm" :inline="true">
          <el-form-item prop="code" label="岗位编码:">
            <el-input
              v-model="filterForm.code"
              placeholder="岗位编码"
              clearable
              style="width: 110px;"
              class="filter-item"
              size="mini"
              @keyup.enter.native="getJobList()"
            />
          </el-form-item>
          <el-form-item prop="location" label="岗位名称:">
            <el-input
              v-model="filterForm.location"
              placeholder="岗位名称"
              clearable
              style="width: 110px;"
              class="filter-item"
              size="mini"
              @keyup.enter.native="getJobList()"/>
          </el-form-item>
          <el-form-item prop="location" label="是否有效:">
            <el-select v-model="filterForm.isDisabled" @change="getJobList()" style="width:120px;" size="mini">
              <el-option label="有效" value="0"></el-option>
              <el-option label="无效" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
            type="primary"
            style="margin-left: 10px;"
            @click="getJobList()"
            icon="el-icon-search"
            size="mini"
           >查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- Table -->
      <el-table
        v-loading="tableLoading"
        ref="jobListTable"
        :header-cell-style="{background: 'rgb(222, 223, 224)'}"
        :data="jobList"
        border
        height="calc(100vh - 365px)"
        highlight-current-row
        style="width: 100%"
        @row-dblclick="dblClick"
        @row-click="selectedCur">
        <el-table-column type="selection" align="center" width="55"/>
        <el-table-column label="岗位编码" align="center" prop="code"/>
        <el-table-column label="岗位名称" align="center" prop="location" show-overflow-tooltip/>
        <el-table-column label="所属机构" align="center" prop="orgName" show-overflow-tooltip/>
        <el-table-column label="所属部门" align="center" prop="deptName" show-overflow-tooltip/>
        <el-table-column :formatter="boardlineFormat" label="所属条线" align="center" prop="boardLine"/>
        <el-table-column min-width="80" label="是否有效" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isDisabled === '0'">有效</el-tag>
            <el-tag type="info" v-if="scope.row.isDisabled === '1'">无效</el-tag>
          </template>
        </el-table-column>
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
      <el-form style="padding-top:10px">
        <el-button type="primary" v-permission="'org:job:add'" size="mini" icon="el-icon-circle-plus-outline" @click="add">新增</el-button>
        <el-button type="primary" v-permission="'org:job:update'" size="mini" icon="el-icon-edit" @click="edit">编辑</el-button>
        <el-button class="add-btn" v-if="!showDelDisabledButtion && jobList && jobList.length != 0" 
         v-permission="'dict:item:delete'" icon="el-icon-delete" type="danger" size="mini" @click="setUpDeptDisable">设为失效</el-button>
        <el-button type="danger" v-if="showDelDisabledButtion && jobList && jobList.length != 0" 
        v-permission="'org:job:delete'" size="mini" icon="el-icon-delete" @click="deleteJob">删除</el-button>
      </el-form>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="titleDialog"
      :fullscreen="fullscreen"
      :show-close="false"
      :visible.sync="JobManageDialog"
      center
      width="60%"
    >
      <NewJob ref="addJob" @onSaveSuccess="onSaveSuccess"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" icon="el-icon-check" @click="confirm">保存</el-button>
        <el-button type="info" size="mini" icon="el-icon-close" @click="JobManageDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Constant from '@/utils/constant.js'
import { fetchJobList, deleteJobs,setUpDeptDisable } from '@/api/sysManagement/orgManagement/sysJobApi'
import NewJob from './NewJob'
import {checkDictItemCode} from '@/api/sysManagement/sysDictItemApi'

export default {
  name: 'JobManagement',
  components: {
    NewJob
  },
  props: {
    org: {
      type: Object,
      default: function() {
        return {
          orgId: ''
        }
      }
    }
  },
  data() {
    return {
      fullscreen: false,
      titleDialog: '新增岗位',
      jobList: [],
      jobData: {},
      tableLoading: false,
      showDelDisabledButtion: false,
      total: 0, // 总数
      pageNum: 1, // 当前页
      pageSizes: Constant.pageSizes,
      pageSize: 10, // 每页数量
      filterForm: {
        code: '',
        location: '',
        isDisabled: '0'
      }, 
      JobManageDialog: false,
      editType: 0,
      dialogjobData: {},
      boardlineOptions: [], // 所属条线数据字典
    }
  },
  computed: {
    orgId: function() {
      return this.org.orgId
    }
  },
  watch: {
    orgId(val) {
      if(val){
        this.getJobList()
      }
    }
  },

  /**
   * 初始化钩子函数
   */
  mounted() {
    var this_ = this
     checkDictItemCode('COMM_BOARDLINE').then(res=>{
      res.data.data.forEach(element=>{
        this_.boardlineOptions[element.code] = element.name
      })
    })
    this.getJobList()
  },


  /**
   * 自定义方法列表
   */
  methods: {
    boardlineFormat(row) {
      return this.boardlineOptions[row.boardLine]
    },

    /**
     * 获取列表
     */
    getJobList() {
      const query = {
        code: this.filterForm.code,
        location: this.filterForm.location,
        isDisabled: this.filterForm.isDisabled,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orgId: this.org.orgId
      }
      if(this.filterForm.isDisabled === '0'){
        this.showDelDisabledButtion = false
      }else {
        this.showDelDisabledButtion = true
      }
      fetchJobList(query).then(res => {
        this.tableLoading = false
        if (res.data.errorCode === "000000") {
          this.tableLoading = false
          this.jobList = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.$message({
            message: '获取岗位失败！',
            type: 'error'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },


    /**
     * 新增岗位
     */
    add() {
      this.titleDialog = '新增岗位'
      // type 0新建 1修改
      this.JobManageDialog = true
      this.editType = 0
      this.dialogjobData = {
        orgId: this.org.orgId,
        orgName: this.org.orgName
      }
      var _this = this
      this.$nextTick(() => {
        _this.$refs.addJob.reset()
        _this.$refs.addJob.clearvalid()
        _this.$refs.addJob.init(_this.dialogjobData, _this.editType)
      })
    },

    /**
     * 编辑岗位
     */
    edit() {
      var item = this.$refs.jobListTable.selection
      if (item.length <= 0) {
        this.$message({
          message: '请选择一条岗位信息！',
          type: 'error'
        })
        return
      }
      if (item.length > 1) {
        this.$message({
          message: '只可选择一条岗位信息！',
          type: 'error'
        })
        return
      }
      this.titleDialog = '修改岗位'
      this.JobManageDialog = true
      var _this = this
      this.$nextTick(() => {
        _this.$refs.addJob.clearvalid()
        _this.editType = 1
        
        _this.dialogjobData = {
          id: item[0].id,
          orgId: item[0].orgId,
          jobCode: item[0].code,
          jobName:item[0].location,
          orgName: item[0].orgName,
          depId: item[0].depId,
          depName: item[0].deptName,
          boardLine: item[0].boardLine,
          remark: item[0].remark
        }
        _this.$refs.addJob.reset()
        _this.$refs.addJob.clearvalid()
        _this.$refs.addJob.init(_this.dialogjobData, _this.editType)
      })
    },

    /**
     * 将岗位设置为失效
     */
    setUpDeptDisable(){
       var selections = this.$refs.jobListTable.selection
      if (selections.length <= 0) {
        this.$message({
          message: '请选择岗位信息！',
          type: 'warning'
        })
      }
      const text = "确认将所选的<<font color='blue'>" + selections.length + '</font>>条岗位设置为失效状态吗？'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
          const jobIds = [];
          selections.forEach(item => {
            jobIds.push(item.id)
          })
          setUpDeptDisable(jobIds).then(res => {
            this.tableLoading = false
            this.$message({
              center: true,
              showClose: true,
              showIcon: true,
              message: res.data.errorMsg,
              type: res.data.errorCode  === "000000" ? 'success' : 'error'
            })
            if (res.data.errorCode === "000000") {
              this.getJobList()
            } 
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {})
    },


    /**
     * 删除岗位
     */
    deleteJob() {
      var selections = this.$refs.jobListTable.selection
      if (selections.length <= 0) {
        this.$message({
          message: '请选择岗位信息！',
          type: 'warning'
        })
      }
      const text = "确认删除选中的<<font color='blue'>" + selections.length + '</font>>个岗位? 删除后将不可恢复！'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
          const jobIds = [];
          selections.forEach(item => {
            jobIds.push(item.id)
          })
          deleteJobs(jobIds).then(res => {
            this.tableLoading = false
            this.$message({
              center: true,
              showClose: true,
              showIcon: true,
              message: res.data.errorMsg,
              type: res.data.errorCode  === "000000" ? 'success' : 'error'
            })
            if (res.data.errorCode === "000000") {
              this.getJobList()
            }
            }).catch(error => {
              console.log(error)
            })
        }).catch(() => {})
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
    },
    // 重置dialog表单元素
    reset() {
      this.$refs.addJob.clearvalid()
      this.$refs.addJob.reset()
    },
    // 保存dialog表单元素
    confirm() {
      this.$refs.addJob.submit()
    },
    onSaveSuccess() {
      this.JobManageDialog = false
      this.getJobList()
    },
    init(orgId) {
      console.log('init:', orgId)
      this.org.orgId = orgId
      if (this.org.orgId === '1' || this.org.orgId === 1) {
        this.org.orgId = ''
      }
      this.getJobList()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .el-form--inline {
    .el-form-item {
      margin: 0 10px 0 0;
    }
  }
  .el-dialog {
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
}
</style>
