<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="filterData"
        label-position="left">
        <el-form-item label="所属模块:">
          <el-input v-model="filterData.module" placeholder="所属模块" size="mini" clearable @keyup.enter.native="search()"/>
        </el-form-item>
        <el-form-item label="请求类型:">
          <el-select  v-model="filterData.requestType" placeholder="请求类型" clearable @change="search" size="mini">
            <el-option value="GET" label="GET"/>
            <el-option value="POST" label="POST"/>
            <el-option value="PUT" label="PUT"/>
            <el-option value="DELETE" label="DELETE"/>
            <el-option value="PATCH" label="PATCH"/>
            <el-option value="TRACE" label="TRACE"/>
            <el-option value="OPTIONS" label="OPTIONS"/>
            <el-option value="AUTO" label="AUTO"/>
          </el-select>
        </el-form-item>
        <el-form-item label="URL:">
          <el-input v-model="filterData.url" placeholder="URL" clearable @keyup.enter.native="search()"  size="mini"/>
        </el-form-item>
        
        <el-form-item>
          <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="search">查询</el-button>
        </el-form-item>
        
        <el-form-item>
          <el-button
          type="primary"
          icon="el-icon-refresh"
          size="mini"
          @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <el-table
      :header-cell-style="{background: 'rgb(222, 223, 224)'}"
      v-loading="listLoading"
      :data="sysApiList"
      border
      highlight-current-row
      height="calc(100vh - 280px)">
      <el-table-column
        align="center"
        label="所属模块"
        min-width="70"
        prop="module" />
      <el-table-column
        align="center"
        label="URL"
        prop="url" />
      <el-table-column
        align="center"
        label="请求类型"
        min-width="35"
        prop="requestType" />
      <el-table-column
        align="center"
        label="方法名"
        prop="methodName" />
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="接口概述"
        prop="descriptions">
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime" />
      <el-table-column
        align="center"
        label="更新时间"
        prop="updateTime" />
      <el-table-column
        align="center"
        min-width="70"
        label="操作">
        <template slot-scope="scope" >
          <el-button
          v-permission="'api:edit'"
          type="text" 
          @click="openUpdateModel(scope.row)" 
          icon="el-icon-edit"
          v-if="!scope.row.descriptions || !scope.row.module">编辑</el-button>
          <span v-permission="'api:edit'">
            <el-divider direction="vertical" v-if="!scope.row.descriptions || !scope.row.module"/>
          </span>
          <el-button type="text" icon="el-icon-more"
           @click="openDetailsModel(scope.row)">详情</el-button>
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

    <!-- 修改API概述 -->
    <el-dialog :visible.sync="updateVisible" title="修改API概述" center>
      <el-form ref="updateForm" :rules="formRules" :model="updateData" label-width="100px">
        <el-row>
          <el-col :span="12">
             <el-form-item label="URL:" prop="url">
                <el-input v-model="updateData.url" :readonly="true" placeholder="URL">
                </el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求类型:" prop="requestType">
              <el-input v-model="updateData.requestType" :readonly="true" placeholder="URL"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="所属模块:" prop="module">
              <el-input v-if="updateFlag.module" :readonly="true" v-model="updateData.module" placeholder="所属模块"/>
              <el-input v-else v-model="updateData.module" placeholder="所属模块"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="API概述:" prop="descriptions">
              <el-input
                v-model="updateData.descriptions"
                :autosize="{minRows:4,maxRows:6}"
                v-if="updateFlag.descriptions"
                type="textarea"
                style="width: 100%;"
                prop="descriptions"
                :readonly="true"
                placeholder="API概述"
              />
               <el-input
                v-model="updateData.descriptions"
                :autosize="{minRows:4,maxRows:6}"
                v-else
                type="textarea"
                style="width: 100%;"
                prop="descriptions"
                placeholder="API概述"
              />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="updateDesc">确认</el-button>
        <el-button type="info" size="mini" @click="updateVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-drawer
     title="API详情"
     :visible.sync="detailsVisible"
     direction="rtl"
     size="35%"
     :before-close="detailsModelClose">
      <el-form :model="details" label-width="100px" style="margin:auto;width:100%;padding:5px 25px 30px">
        <el-form-item label="所属模块:">
          <el-input readonly v-model="details.module" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="请求类型:">
          <el-input readonly v-model="details.requestType" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="请求地址:" prop="module">
          <el-input readonly v-model="details.url" placeholder="请求地址"/>
        </el-form-item>
        <el-form-item label="通配URL:" prop="matchingUrl">
          <el-input readonly v-model="details.matchingUrl" placeholder="通配URL"/>
        </el-form-item>

        <el-form-item label="全类名:" prop="className">
          <el-input readonly v-model="details.className" placeholder="全类名"/>
        </el-form-item>

        <el-form-item label="权限标识:" prop="code">
          <el-input readonly v-model="details.code" placeholder="权限标识"/>
        </el-form-item>
        <el-form-item label="方法名:" prop="methodName">
          <el-input readonly v-model="details.methodName" placeholder="权限标识"/>
        </el-form-item>

        <el-form-item label="创建时间:" prop="createTime">
          <el-input readonly v-model="details.createTime" placeholder="权限标识"/>
        </el-form-item>
        <el-form-item label="修改时间:" prop="updateTime">
          <el-input readonly v-model="details.updateTime" placeholder="权限标识"/>
        </el-form-item>

        <el-form-item label="API概述:" prop="descriptions">
          <el-input
            v-model="details.descriptions"
            :autosize="{minRows:4,maxRows:6}"
            type="textarea"
            style="width: 100%;"
            prop="descriptions"
            :readonly="true"
            placeholder="API概述" />
        </el-form-item>
      </el-form>
    </el-drawer>

  </div>
</template>

<script>
import { pageList, updateDesc,details } from '@/api/sysManagement/sysApiManageApi'
import * as constants from '@/utils/constant.js'
export default {
  name: "SysApiManagement",

  data() {
    return {
      filterData: {
        module : '',
        requestType : '',
        methodName: '',
        url: ''
      },
      sysApiList:[],
      listLoading : false,
      detailsVisible : false,
      details: {},
      //修改后的api概述信息
      updateData : {
        descriptions : '',
        module : '',
        requestType : '',
        methodName: '',
        url: '',
      },
      updateFlag: {
        descriptions : '',
        module : '',
      },
      currentPage: 1,
      pageSizes: constants.pageSizes,
      pageSize: 10,
      total: 0,
      updateVisible: false,
      formRules: {
        module: [
          { required: true, message: '所属模块不能为空！', trigger: 'blur' }
        ],
        descriptions: [
          { required: true, message: '接口概述不能为空！', trigger: 'blur' }
        ]
      },
      sysApiList:[]
    }
  },

  /**
   * mounted钩子函数，用于初始化数据
   */
  mounted() {
    this.getPageList()
  },


  /**
   * 自定义方法列表
   */
  methods: {

    reset(){
        this.filterData.module=''
        this.filterData.requestType=''
        this.filterData.methodName=''
        this.filterData.url=''
        this.getPageList();
    },
    getPageList() {
      this.listLoading = true
      const params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        module: this.filterData.module,
        requestType: this.filterData.requestType,
        url : this.filterData.url
      }
      pageList(params).then(res => {
         this.listLoading = false
        if (res.data.errorCode === '000000') {
          this.sysApiList = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.$message({
            center: true,
            showClose: true,
            showIcon: true,
            message: res.data.errMsg,
            type: 'error'
          })
        }
      })
    },

    /**
     * 搜索
     */
    search(){
      this.currentPage = 1
      this.getPageList()
    },


    /**
     * 打开修改概述模态框
     */
    openUpdateModel(row) {
      this.updateVisible = true
      var newData = JSON.stringify(row)
      this.updateData = JSON.parse(newData);
      this.updateFlag.descriptions = JSON.parse(newData).descriptions
      this.updateFlag.module = JSON.parse(newData).module
    },

    /**
     * 打开详情模态框
     */
    openDetailsModel(row){
      this.detailsVisible = true
      details(row.id).then(res => {
        if(res.data.errorCode === '000000'){
          this.details = res.data.data
        }
      })
    },

    /**
     * 关闭详情模态框
     */
    detailsModelClose(){
      this.detailsVisible = false
    },

    /**
     * 修改api概述
     */
    updateDesc(){
        var params = {
          id: this.updateData.id,
          descriptions: this.updateData.descriptions
        } 
        this.$refs['updateForm'].validate((valid) => {
        if (valid) {
           updateDesc(params).then(res => {
            this.$message({
              center: true,
              showClose: true,
              showIcon: true,
              message: res.data.errorMsg,
              type: res.data.errorCode === '000000' ? 'success' : 'error'
            })
            if(res.data.errorCode === '000000'){
              this.updateVisible = false
              this.search()
            }
          })
        }
      })
    },


    /**
     * 当前页码发生变化的事件
     */
    currentPageChange(val) {
      this.currentPage = val
      this.getPageList()
    },

    /**
     * 页码总数发生变化的事件
     */
    pageSizeChange(val) {
      this.pageSize = val
      this.getPageList()
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
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
</style>
