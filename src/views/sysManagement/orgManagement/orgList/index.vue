
<template>
  <div id="orgManage" class="app-container">
    <div>
      <div class="filter-container">
        <el-form ref="filterForm" :model="filterForm" :inline="true">
          <el-form-item prop="orgCode" label="机构代码(十位):">
            <el-input
              v-model="filterForm.orgCode"
              placeholder="机构代码"
              maxlength="10"
              clearable
              style="width: 150px;"
              class="filter-item"
              size="mini"
              @keyup.enter.native="getOrgList()"/>
          </el-form-item>
          <el-form-item prop="orgName" label="机构名称:">
            <el-input
              v-model="filterForm.orgName"
              placeholder="机构名称"
              clearable
              style="width: 150px;"
              class="filter-item"
              size="mini"
              @keyup.enter.native="getOrgList()"/>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select 
            v-model="filterForm.isDisabled" 
            placeholder="请选择" 
            style="width: 110px" 
            size="mini"
            @change="isDisabledChange">
              <el-option label="有效" value="0"></el-option>
              <el-option label="无效" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据类型:">
            <el-select 
            v-model="filterForm.updateFlag"
            clearable 
            placeholder="请选择" 
            style="width: 110px"  
            size="mini"
            @change="updateFlagChange">
              <el-option  label="任务同步" value="0"></el-option>
              <el-option  label="手动维护" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button 
            type="primary" 
            size="mini" 
            icon="el-icon-search" 
            style="margin-left: 10px;" 
            @click="search()">查询</el-button>
          </el-form-item>
        </el-form>

      </div>

      <!-- Table -->
      <el-table
        v-loading="tableLoading"
        :data="orgList"
        :header-cell-style="{background: 'rgb(222, 223, 224)'}"
        border
        highlight-current-row
        :height="calcHeight()"
        style="width: 100%">
        <el-table-column label="机构代码(十位)" align="center" prop="code"/>
        <el-table-column label="机构名称" align="center" prop="location" show-overflow-tooltip/>
        <el-table-column label="机构级别" :formatter="gradeFormatter" align="center" prop="grade"/>
        <el-table-column label="上级机构" align="center" prop="parentName" show-overflow-tooltip/>
        <el-table-column label="机构负责人" align="center" prop="chargeName"/>
        <el-table-column label="分管领导" align="center" prop="directorName"/>
        <el-table-column label="是否有效" align="center" prop="isDisabled">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isDisabled === '0'">有效</el-tag>
            <el-tag type="info" v-if="scope.row.isDisabled === '1'">失效</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="数据来源" align="center" prop="updateFlag">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.updateFlag === '0'">批量导入</el-tag>
            <el-tag type="success" v-if="scope.row.updateFlag === '1'">手动维护</el-tag>
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
          @size-change="pageSizeChange"/>
      </div>
      <el-form style="padding-top:10px">
      <el-button 
      v-if="showDisabledButtion" 
      icon="el-icon-delete" 
      type="danger" 
      size="mini" 
      @click="removeDisabledConfirm">删除失效机构</el-button>
    </el-form>
    </div>
  </div>

</template>

<script>
import { fetchOrgList,removeDisabledOrg } from '@/api/sysManagement/orgManagement/sysOrganizationApi'
import * as Constant from '@/utils/constant.js'
import {checkDictItemCode} from '@/api/sysManagement/sysDictItemApi'

export default {
  name: 'OrgList',
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
      orgList: [], // 机构列表
      tableLoading: false,
      currentPage: 1, // 当前页
      total: 0, // 总数
      pageSizes: Constant.pageSizes,
      pageSize: 10, // 每页数量
      searchFlag : false,
      gradeList: [],
      showDisabledButtion: false,
      filterForm: {
        orgCode: '',
        orgName: '',
        isDisabled: '0',
        updateFlag: '',
      }
    }
  },


  computed: {
    orgId: function() {
      return this.org.id
    }
  },

  /**
   * 监听机构ID，如果发生变化则重新查询
   */
  watch: {
    orgId(val) {
      this.getOrgList()
    }
  },

  /**
   * 初始化钩子函数
   */
  mounted() {
    this.gradeDataList();
    this.getOrgList()
  },

  /**
   * 自定义方法列表
   */
  methods: {
    /**
     * 分页获取机构列表
     */
    getOrgList() {
      this.tableLoading = true
      const query = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        code: this.filterForm.orgCode,
        location: this.filterForm.orgName,
        isDisabled: this.filterForm.isDisabled,
        updateFlag : this.filterForm.updateFlag,
        loadCode : this.org.orgCode
      }
      fetchOrgList(query).then(res => {
        this.tableLoading = false
        if(res.data.errorCode === '000000') {
          this.orgList = res.data.data.records
          this.total = res.data.data.total
          //等于1是失效
          if(this.filterForm.isDisabled === '1' && this.orgList.length != 0){
            this.showDisabledButtion = true
          }else{
            this.showDisabledButtion = false
          }
        }else{
          this.$message({
            center: true,
            showClose: true,
            showIcon: true,
            message: res.data.errorMsg,
            type: 'error'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },

    /**
     * 根据字典项编码获取字典项，获取机构级别
     */
    gradeDataList(){
      const _this = this;
      checkDictItemCode('COMM_ORG_GRADE').then(res=>{
        res.data.data.forEach(element=>{
          _this.gradeList.push(element)
        })
      })
    },

    /**
     * 格式化机构级别
     */
    gradeFormatter(row){
      var dataList = this.gradeList
      if(!dataList || dataList.length === 0){
        return row.grade
      }
      for(var i = 0; i < dataList.length; i++){
        if(dataList[i].code === row.grade){
          return dataList[i].name;
        }
      }
    },

    /**
     * 计算设置Height的高
     */
    calcHeight(){
      if(this.showDisabledButtion){
        return 'calc(100vh - 360px)'
      }else {
        return 'calc(100vh - 335px)'
      }
    },

    

    /**
     * 删除失效机构
     */
    removeDisabledConfirm(){
      var num = this.orgList.length
      const text = "确认彻底删除当前失效的<<font color='blue'>" + num + '</font>>条机构吗吗？'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'comfirm-dialog-btn-cancel',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.removeDisabledOrg()
      }).catch((error) => {
        console.log(error)
      })
    },

     /**
     * 删除失效机构
     */
    removeDisabledOrg(){
      var dataList = this.orgList;
      var orgIds = [];
      for(var i = 0; i < dataList.length; i ++){
        orgIds.push(dataList[i].id)
      }
      removeDisabledOrg(orgIds).then(res => {
        this.$message({
          center: true,
          showClose: true,
          showIcon: true,
          message: res.data.errorMsg,
          type: res.data.errorCode === '000000' ? 'success' : 'error'
        })
        if(res.data.errorCode === '000000'){
          //重新获取机构数
          this.getOrgList();
        }
      })
    },




    /**
     * 查询按钮
     */
    search(){
      this.currentPage = 1
      this.searchFlag = true;
      this.getOrgList();
    },



    /**
     * 数据类型的变更事件
     */
    updateFlagChange(val){
      this.currentPage = 1
      this.getOrgList();
     
    },

    /**
     * 是否有效的变更事件
     */
    isDisabledChange(val){
      this.currentPage = 1
      this.getOrgList();
    },


    /**
       * 分页功能 - 检测当前页变化
       */
    currentPageChange(val) {
      this.currentPage = val
      this.getOrgList()
    },
    /**
       * 分页功能 - 检测PageSize变化
       */
    pageSizeChange(val) {
      this.pageSize = val
      this.getOrgList()
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
