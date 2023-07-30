<template>
  <div id="externalAppManage" class="app-container">
    <!-- Table Filter -->
    <div class="filter-container">
      <el-form
        ref="filterForm"
        :model="filterForm"
        size="mini"
        :inline="true">
        <el-form-item
          prop="appId"
          label="AppId:">
          <el-input
            v-model="filterForm.appId"
            placeholder="AppId"
            clearable
            style="width: 120px;"
            class="filter-item"/>
        </el-form-item>
        <el-form-item
          prop="remark"
          label="备注:">
          <el-input
            v-model="filterForm.remark"
            placeholder="备注"
            clearable
            style="width: 180px;"
            class="filter-item"/>
        </el-form-item>
        <el-button
          type="primary"
          class="filter-item"
          style="margin-left: 10px;"
          icon="el-icon-search"
           size="mini"
          @click="loadList()">查询</el-button>
          <el-button type="primary"  size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form>
    </div>
    <el-button
      type="primary"
      v-permission="'external:add'"
      class="filter-item"
      style="margin-left: 10px;"
      icon="el-icon-circle-plus-outline"
      size="mini"
      @click="updateOrAddOpenModel('','add')">新增
    </el-button>
    <p/>

    <!-- Table -->
    <el-table
      v-loading="tableLoading"
      ref="dataList"
      :header-cell-style="{background: 'rgb(222, 223, 224)'}"
      :data="dataList"
      border
      highlight-current-row
      height="calc(100vh - 300px)"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="52"
        align="center" />
      <el-table-column
        prop="appId"
        label="AppId"
        width="200"
        align="center" />
      <el-table-column
        prop="token"
        label="Token"
        width="300"
        align="center" />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160"
        align="center" />

      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注"
        min-width="100"
        align="center" />
      <el-table-column
        label="操作"
        header-align="center"
        min-width="80"
        align="center" >
        <template slot-scope="scope">
          <el-button
            type="text"
            v-permission="'external:update'"
            icon="el-icon-edit"
            @click="updateOrAddOpenModel(scope.row,'update')">修改</el-button>
            <span v-permission="'external:update'">
              <el-divider direction="vertical" />
            </span>
          <el-button
            type="text"
            v-permission="'external:reset:token'"
            icon="el-icon-refresh-left"
            @click="resetTokenOpenModel(scope.row)">重置token</el-button>
            <span v-permission="'external:reset:token'">
              <el-divider direction="vertical" />
            </span>
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link" v-permission="'external:delete' && 'external:open:model'">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item >
                <el-button v-permission="'external:delete'" type="text" icon="el-icon-delete" @click="deleteOpenModel(scope.row)">删除</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                 <el-button v-permission="'external:open:model'" type="text" icon="el-icon-key" @click="apiOpenModel(scope.row)">API授权</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </template>
      </el-table-column>
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


    <!-- 新增或修改授权信息 -->
    <el-dialog :visible.sync="updateVisible" :title="title" center>
      <el-form ref="updateForm" :rules="formRules" :model="updateForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="appId" prop="appId">
              <el-input v-model="updateForm.appId" :disabled="updateForm.id != null" placeholder="appId<必填>" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12"/>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input
                v-model="updateForm.remark"
                :autosize="{minRows:4,maxRows:6}"
                type="textarea"
                style="width: 100%;"
                prop="remark"
                placeholder="备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-permission="'external:update'" size="mini" icon="el-icon-check" @click="updateOrAdd">确认</el-button>
        <el-button type="info" size="mini" icon="el-icon-close" @click="updateVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- API授权信息  -->
    <el-dialog :visible.sync="apiVisible" title="API授权信息" center width="65%" top="2vh">
      <!-- <List-selected id="selectedList" ref="sysApiDataList" descName="已选API列表"></List-selected> -->
      <ApiManage :external-app-id="selectExternalAppId" :visible="apiVisible"/>
    </el-dialog>
  </div>
</template>

<script>
import { getPage, deleteItem, update, add, resetToken } from '@/api/sysManagement/externalAppApi'
import ListSelected from '@/views/sysManagement/apiManagement/component/selectApi'
import ApiManage from '@/views/sysManagement/externalAppManagerment/apiManage.vue'
import * as constants from '@/utils/constant.js'

export default {
  name: 'ExternalAppManagement',
  components: {
    ApiManage,
    ListSelected
  },
  data() {
    return {
      title: "新增信息",
      tableLoading: false,
      dataList: [],
      updateVisible: false,
      updateForm: {
        id: null,
        appId: null,
        remark: null
      },
      filterForm: {
        appId: null,
        remark: null
      },
      pageParam: {
        pageSizes: constants.pageSizes,
        pageSize: 10,
        currentPageUser: 1,
        total: 0
      },
      formRules: {
        appId: [
          { required: true, message: 'AppId不能为空！', trigger: 'blur' }
        ]
      },
      selectExternalAppId: null,
      apiVisible: false
    }
  },

  watch: {
    updateVisible(newValue) {
      if (!newValue) {
        this.updateForm = {
          id: null,
          name: null,
          description: null
        }
        this.$refs.updateForm.clearValidate()
      }
    }
  },
  /**
   * 初始化mounted钩子函数
   */
  mounted() {
    this.loadList()
  },
  /**
   * 自定义方法
   */
  methods: {
    /**
     * 重置查询信息
     */
    reset(){
      this.filterForm.appId = null
      this.filterForm.remark = null
      this.loadList();
    },
    /**
     * 加载数据列表
     */
    loadList() {
      this.tableLoading = true
      const query = {
        pageNum: this.pageParam.currentPage,
        pageSize: this.pageParam.pageSize,
        appId: this.filterForm.appId,
        remark: this.filterForm.remark
      }
      getPage(query).then(res => {
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

    updateOrAddOpenModel(row,type) {
      if(type === 'update'){
        this.updateForm = {
          ...row
        }
        this.title = "修改信息";
      }else {
        this.title = "新增信息";
      }
       this.updateVisible = true
    },

    /**
     * 删除提醒
     */
    deleteOpenModel(row) {
      const text = "确认删除<<font color='blue'>" + row.appId + '</font>>吗？'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'comfirm-dialog-btn-cancel',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.deleteItem(row)
      }).catch((error) => {
        console.log(error)
      })
    },
    deleteItem(row) {
      deleteItem(row.id).then(res => {
        this.$message({
          message: res.data.errorMsg,
          type: res.data.errorCode === '000000' ? 'success' : 'error',
          center: true,
          showIcon: true,
          showClose: true
        })
        if (res.data.errorCode === '000000') {
          this.loadList()
        }
      })
    },

    updateOrAdd() {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          const data = this.updateForm
          if (data.id == null) {
            add(data).then(res => {
              this.$message({
                message: res.data.errorMsg,
                type: res.data.errorCode === '000000' ? 'success' : 'error',
                center: true,
                showIcon: true,
                showClose: true
              })
              if (res.data.errorCode === '000000') {
                this.updateVisible = false
                this.loadList()
              }
            })
          } else {
            update(data).then(res => {
              this.$message({
                message: res.data.errorMsg,
                type: res.data.errorCode === '000000' ? 'success' : 'error',
                center: true,
                showIcon: true,
                showClose: true
              })
              if (res.data.errorCode === '000000') {
                this.updateVisible = false
                this.loadList()
              }
            })
          }
        }
      })
    },

    /**
     * 重置提醒
     */
    resetTokenOpenModel(row) {
      const text = "确认重置<<font color='blue'>" + row.appId + '</font>>的token吗？'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'comfirm-dialog-btn-cancel',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.resetToken(row)
      }).catch((error) => {
        console.log(error)
      })
    },
    resetToken(row) {
      resetToken(row.id).then(res => {
        this.$message({
          message: res.data.errorMsg,
          type: res.data.errorCode === '000000' ? 'success' : 'error',
          center: true,
          showIcon: true,
          showClose: true
        })
        if (res.data.errorCode === '000000') {
          this.loadList()
        }
      })
    },
    /**
     * 分页功能 - 检测当前页变化
     */
    currentPageChange(val) {
      this.pageParam.currentPage = val
      this.loadList()
    },
    /**
     * 分页功能 - 检测PageSize变化
     */
    pageSizeChange(val) {
      this.pageParam.pageSize = val
      this.loadList()
    },

    /**
     * 打开api模态框
     */
    apiOpenModel(row) {
      this.selectExternalAppId = row.id
      this.apiVisible = true
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
