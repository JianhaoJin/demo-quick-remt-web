<template>
  <div>
    <div class="filter-container">
      <el-form
        :inline="true"
        size="mini"
        :model="filterData"
        label-position="left">
        <el-form-item label="所属模块:" >
          <el-input v-model="filterData.module" clearable @keyup.enter.native="search()" style="width:150px;" placeholder="所属模块"/>
        </el-form-item>
        <el-form-item label="请求类型:">
          <el-select  v-model="filterData.requestType" clearable @change="search" style="width:120px;">
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
        <el-form-item label="URL:" style="width:200px;">
          <el-input v-model="filterData.url" clearable @keyup.enter.native="search()" style="width:150px;" placeholder="URL"/>
        </el-form-item>
         <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="search">查询</el-button>
      </el-form>
    </div>
    
    <el-table
      :data="sysApiList"
      ref="sysApiDataTable"
      :header-cell-style="{background: 'rgb(222, 223, 224)'}"
      v-loading="listLoading"
      style="width:100%;margin-bottom:20px"
      border
      @select="selectDatas"
      @select-all="selectAll">
      <el-table-column 
        type="selection"  
        :show-overflow-tooltip="true"
        width="40">
      </el-table-column>
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
        align="center"
        label="方法名"
        prop="methodName" />
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="接口概述"
        prop="descriptions">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.descriptions" effect="light" placement="bottom">
            <span 
              v-if="scope.row.descriptions" 
              v-text="scope.row.descriptions">
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <span v-show="selectionData.length != 0">{{descName}}：</span>
    <el-tag 
    v-for="item in selectionData" 
    :key="item.id" 
    closable 
    @close="closeSelectionData(item)">
    {{item.descriptions ? item.descriptions : item.url}}
    </el-tag>&nbsp;&nbsp;&nbsp;

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
import { pageList, updateDesc,details } from '@/api/sysManagement/sysApiManageApi'
import * as constants from '@/utils/constant.js'
import Utils from "@/utils/util";
export default {
  props: {
    id: {
      type: String,
      default: 'selectList'
    },
    descName: {
      type: String,
      default: '已选API列表'
    }
  },
  name: "listSelected",
  data() {
    return {
      filterData: {
        module : '',
        requestType : '',
        methodName: '',
        url: ''
      },
      sysApiList : [],
      selectionData : [],
      listLoading : false,
      currentPage: 1,
      pageSizes: constants.pageSizes,
      pageSize: 10,
      total: 0,
    }
  },

  /**
   * mounted钩子函数，用于初始化数据
   */
  mounted() {
    var that = this;
    Utils.$on(that.id, function (closeFlag) {
      if(closeFlag){
        that.closeApiVisibleModel()
        return;
      }
    }),
    that.getPageList()
  },

  /**
   * 自定义方法列表
   */
  methods: {
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
            message: res.data.errorMsg,
            type: 'error'
          })
        }
        this.defaultSelectTable();
      })
    },

    /**
     * 搜索
     */
    search(){
      this.currentPage = 1
      this.getPageList()
    },

    //单选事件
    selectDatas(objs){
      //先移除
      var isDel = false;
      var apiArrays = [];
      for(let a = 0; a < this.selectionData.length; a++){
          for(let i = 0; i < this.sysApiList.length;i++){
              if(this.selectionData[a].id == this.sysApiList[i].id){
                  isDel = true;
              }
          }
          if(!isDel){
              apiArrays.push(this.selectionData[a]);
          }
          isDel = false;
      }
      this.selectionData = apiArrays
      //重新增加
      let data  = objs
      let apis = this.selectionData
      let flag = false
      for(let i = 0; i < data.length; i++){
          for(let a  = 0; a < apis.length; a++){
              if(data[i].id === apis[a].id){
                  flag = true
                  continue
              }
          }
          if(!flag){
              this.selectionData.push(data[i])
          }
          flag = false
      }
    },

    /**
     * 全选
     */
    selectAll(all){
        var tempData = {};
        for(let i = 0; i < this.selectionData.length; i++){
            tempData[this.selectionData[i].id] = 1;
        }
        if(all.length > 0){
            //全选则新增
            for(let a  = 0; a < all.length; a++){
              if(tempData[all[a].id] != 1){
                  this.selectionData.push(all[a])
              }
            } 
        }else{ //反选则移除
            var flag = false;
            var apiArrays = [];
            for(let a  = 0; a < this.selectionData.length; a++){
                for(let i = 0; i < this.sysApiList.length; i++){
                    if(this.selectionData[a].id == this.sysApiList[i].id){
                      flag = true;
                    }
                }
                if(!flag){
                    apiArrays.push(this.selectionData[a]);
                }
                flag = false;
            }
            this.selectionData = apiArrays
        }
    },

    // 切换分页，自动勾选table数据
    defaultSelectTable(){
        var temp = {};
        for(var x = 0; x < this.selectionData.length; x++){
            temp[this.selectionData[x].id] = 1;
        }
        this.$nextTick(()=>{
            for(var i = 0;i < this.sysApiList.length; i++){
                if(temp[this.sysApiList[i].id] == 1){
                  this.$refs.sysApiDataTable.toggleRowSelection(this.sysApiList[i]);
                }
            }
        }); 
    },

    /**
     * 清除掉已选择的数据
     */
    closeSelectionData(value){
      for(var i=0; i < this.sysApiList.length; i++){
          if(this.sysApiList[i].id == value.id){
            this.$refs.sysApiDataTable.toggleRowSelection(this.sysApiList[i],false);
          }
      }
      this.selectionData.splice(this.selectionData.indexOf(value),1);
    },

    /**
     * 清理已勾选的状态
     */
    closeApiVisibleModel(){
      var that = this;
      that.$nextTick(()=>{
        that.selectionData = [];
        if(that.$refs.sysApiDataTable){
          that.$refs.sysApiDataTable.clearSelection();
        }
      });
    },

    /**
     * 获取已选择的数据
     */
    getSelectionData(){
      return this.selectionData;
    },


    /**
     * 当前页码发生变化的事件
     */
    currentPageChange(val) {
      this.currentPage = val
      this.getPageList();
    },

    /**
     * 页码总数发生变化的事件
     */
    pageSizeChange(val) {
      this.pageSize = val
      this.getPageList();
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
