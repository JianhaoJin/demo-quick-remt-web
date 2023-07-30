<template>
  <div id="depManage" class="app-container">
    <div>
      <!-- Table Filter -->
      <div class="filter-container">
        <el-form ref="filterForm" :model="filterForm" :inline="true">
          <el-form-item prop="code" label="部门代码(十位):">
            <el-input
              v-model="filterForm.code"
              placeholder="部门代码"
              clearable
              style="width: 130px;"
              class="filter-item"
              size="mini"
              @keyup.enter.native="getDepList()"/>
          </el-form-item>
          <el-form-item prop="name" label="部门名称:">
            <el-input
              v-model="filterForm.name"
              placeholder="部门名称"
              clearable
              style="width: 130px;"
              class="filter-item"
              size="mini"
              @keyup.enter.native="getDepList()"
            />
          </el-form-item>
          <el-form-item prop="isDisabled" label="是否有效:">
            <el-select v-model="filterForm.isDisabled" @change="disabledChagne" style="width:120px;" size="mini">
              <el-option label="有效" value="0"></el-option>
              <el-option label="无效" value="1"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item>
             <el-button
             type="primary"
             style="margin-left: 10px;"
             icon="el-icon-search"
             @click="getDepList()"
             size="mini">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- Table -->
      <el-table
        v-loading="tableLoading"
        ref="deptListTable"
        :header-cell-style="{background: 'rgb(222, 223, 224)'}"
        :data="depList"
        border
        highlight-current-row
        height="calc(100vh - 365px)"
        style="width: 100%"
        @row-dblclick="dblClick" >
        <el-table-column type="selection" align="center" width="55"/>
        <el-table-column min-width="100" label="部门代码(十位)" align="center" prop="code"/>
        <el-table-column min-width="200" label="部门名称" align="center" prop="location"/>
        <el-table-column :formatter="deptLevelFormatter" min-width="100" label="部门级别" align="center" prop="grade"/>
        <el-table-column min-width="200" label="上级部门" align="center" prop="parentName"/>
        <el-table-column min-width="80" label="部门负责人" align="center" prop="director"/>
        <el-table-column min-width="80" label="是否有效" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isDisabled === '0'">有效</el-tag>
            <el-tag type="info" v-if="scope.row.isDisabled === '1'">无效</el-tag>
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
        <el-button class="add-btn"  v-permission="'org:dept:add'" icon="el-icon-plus" type="primary" size="mini" @click="openAddModel">新增</el-button>
        <el-button class="add-btn"  v-permission="'org:dept:update'" icon="el-icon-edit" type="primary" size="mini" @click="openUpdateModel">编辑</el-button>
        <el-button class="add-btn" v-if="!showDelDisabledButtion && depList && depList.length != 0"  v-permission="'dict:item:delete'" icon="el-icon-delete" type="danger" size="mini" @click="setUpDeptDisable">设为失效</el-button>
        <el-button class="add-btn" v-if="showDelDisabledButtion && depList && depList.length != 0" 
        v-permission="'dict:item:delete'" icon="el-icon-delete" type="danger" size="mini" @click="handleDelete">删除</el-button>
      </el-form>
    </div>



    <!-- 打开新增部门模态框 -->
    <el-dialog title="新增部门" 
     :close-on-click-modal="false" 
     :show-close="false" 
     :visible.sync="addDeptDialog" 
     center 
     width="60%">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="140px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门编码（十位）" prop="code">
              <el-input
                v-model="addForm.code"
                placeholder="请输入部门编码"
                clearable
                maxlength="10"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="float:right">
            <el-form-item label="部门名称" prop="location">
              <el-input
                v-model="addForm.location"
                placeholder="请输入部门名称"
                maxlength="20"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级部门" prop="parentName">
              <el-dialog
                :close-on-click-modal="false"
                :modal="false"
                :visible.sync="parentDepIdDialog"
                width="70%"
                center
                title="选择上级部门">
                <DepSearchDialog ref="depViewData" :org-id="org.orgId" :parent-dialog-visible="parentDepIdDialog" @chargeChange="parentDepChangeEvent"/>
              </el-dialog>
              <el-button class="choice-button" @click="openSelectDeptModel">{{ !addForm.parentName ? "点击选择上级部门": addForm.parentName }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门级别" prop="grade">
              <mercurySelect v-model="addForm.grade" 
                :url="'/dict-item/COMM_DEPGRADE'" 
                :fileType="{label:'name',value:'code'}"
                :dicttypeid="'COMM_DEPGRADE'" placeholder="部门级别"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <!-- userId -->
            <el-form-item label="部门负责人" prop="director">
              <el-dialog
                :close-on-click-modal="false"
                :modal="false"
                :visible.sync="depChargeIdDialog"
                width="70%"
                center
                title="选择部门负责人">
                <EmployeeSearchDialog :org-id="org.orgId" @onUserSelect="confirmUserInfo"/>
              </el-dialog>
              <el-button class="choice-button" @click="openReportModel">{{ addForm.depChargeName || "点击选择部门负责人" }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属机构" prop="orgName">
              <el-input
                v-model="addForm.orgName"
                readonly
                placeholder="所属机构"
                maxlength="20"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input v-model="addForm.remark" :rows="5" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="addConfirm">保存</el-button>
        <el-button type="info" size="mini" icon="el-icon-circle-close" @click="addDeptDialog = false">取消</el-button>
      </div>
    </el-dialog>


    <!-- 打开编辑部门模态框 -->
    <el-dialog title="编辑部门" 
     :close-on-click-modal="false" 
     :show-close="false" 
     :visible.sync="updateDeptDialog" 
     center 
     width="60%">
      <el-form ref="updateForm" :model="updateForm" :rules="addFormRules" label-width="140px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门编码（十位）" prop="code">
              <el-input
                v-model="updateForm.code"
                placeholder="请输入部门编码"
                clearable
                maxlength="10"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="float:right">
            <el-form-item label="部门名称" prop="location">
              <el-input
                v-model="updateForm.location"
                placeholder="请输入部门名称"
                maxlength="20"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级部门" prop="parentName">
              <el-dialog
                :close-on-click-modal="false"
                :modal="false"
                :visible.sync="parentDepIdDialog"
                width="70%"
                center
                title="选择上级部门">
                <DepSearchDialog ref="depViewData" :org-id="org.orgId" :parent-dialog-visible="parentDepIdDialog" @chargeChange="parentDepChangeEvent"/>
              </el-dialog>
              <el-button v-if="!updateForm.parentName" class="choice-button" @click="openSelectDeptModel">点击选择上级部门</el-button>
              <el-button v-else style="width: 100%; text-align: left;overflow-x: hidden;">{{ updateForm.parentName }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门级别" prop="grade">
              <mercurySelect v-model="updateForm.grade" 
                :url="'/dict-item/COMM_DEPGRADE'" 
                :fileType="{label:'name',value:'code'}"
                :dicttypeid="'COMM_DEPGRADE'" placeholder="部门级别"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <!-- userId -->
            <el-form-item label="部门负责人" prop="director">
              <el-dialog
                :close-on-click-modal="false"
                :modal="false"
                :visible.sync="depChargeIdDialog"
                width="70%"
                center
                title="选择部门负责人">
                <EmployeeSearchDialog :org-id="org.orgId" @onUserSelect="confirmUserInfo"/>
              </el-dialog>
              <el-button v-if="!updateForm.depChargeName" class="choice-button" @click="openReportModel">点击选择部门负责人</el-button>
              <el-button v-else style="width: 100%; text-align: left;overflow-x: hidden;">{{ updateForm.depChargeName }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属机构" prop="orgName">
              <el-input
                v-model="updateForm.orgName"
                readonly
                placeholder="所属机构"
                maxlength="20"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <!-- userId -->
            <el-form-item label="是否有效" prop="isDisabled">
              <el-select v-model="updateForm.isDisabled" style="width:100%;">
                <el-option label="有效" value="0"></el-option>
                <el-option label="无效" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input v-model="updateForm.remark" :rows="5" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="updateConfirm">保存</el-button>
        <el-button type="info" size="mini" icon="el-icon-circle-close" @click="updateDeptDialog = false">取消</el-button>
      </div>
    </el-dialog>


    <el-dialog
      :close-on-click-modal="false"
      :modal="false"
      :visible.sync="parentDepIdDialog"
      width="70%"
      center
      title="选择上级部门">
      <DepSearchDialog ref="depViewData" :org-id="org.orgId" :parent-dialog-visible="parentDepIdDialog" @chargeChange="parentDepChangeEvent"/>
    </el-dialog>

  </div>
</template>

<script>
import { createDept, modifyDept, deleteDep, fetchDepList,setUpDeptDisable } from '@/api/sysManagement/orgManagement/sysDepartmentApi'
import DepSearchDialog from '@/views/sysManagement/components/depSearchDialog'
import * as Constant from '@/utils/constant.js'
import {checkDictItemCode} from '@/api/sysManagement/sysDictItemApi'
import mercurySelect from '@/components/MercurySelect'
import EmployeeSearchDialog from '@/views/sysManagement/components/employeeSearchDialog'

export default {
  name: 'DepManagement',
  components: {
    DepSearchDialog,
    EmployeeSearchDialog,
    mercurySelect
  },
  props: {
    org: {
      type: Object,
      default: function() {
        return { 
          orgId: '',
          orgName: org.location 
        }
      }
    },
    show: {
      type: Boolean,
      default: false
    }},
  data() {
    return {
      depList: [], // 部门列表
      tableLoading: false,
      currentPage: 1, // 当前页
      total: 0, // 总数
      pageSizes: Constant.pageSizes,
      pageSize: 10, // 每页数量,
      showDelDisabledButtion: false,
      //过滤条件表格
      filterForm: {
        code: '',
        name: '',
        isDisabled: '0'
      }, 
      deptData: {},
      dicts: {},
      options: [],
      addDeptDialog: false,
      updateDeptDialog: false,
      query: {},
      addForm: {
        id: '',
        displayCode: '', // 4位编码
        location: '',
        parentName: '',
        parentId: '',
        grade: '',
        depShowId: '',
        remark: '',
        code: '', // 10位代码
        director: '',
        parentLevel: '', // 上级部门的级别
        orgName: '',
        depChargeName: '',
        isDisabled: ''
      },
      updateForm: {
        id: '',
        displayCode: '', // 4位编码
        location: '',
        parentName: '',
        parentId: '',
        grade: '',
        depShowId: '',
        remark: '',
        code: '', // 10位代码
        director: '',
        parentLevel: '', // 上级部门的级别
        orgName: '',
        depChargeName: '',
        isDisabled: ''
      },
      addFormRules: {
        // 10位部门代码验证
        code: [
          { required: true, min: 10, max: 10, message: '请输入10位部门编码', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '请选择部门级别', trigger: 'blur' }
        ]
      },
      roleIdDialog: false,
      depChargeIdDialog: false, // 选择部门负责人dialog同步标志量
      parentDepIdDialog: false, // 上级部门负责人dialog同步标志量
      depData: [],
      depProp: {
        children: 'children',
        label: 'deptName'
      },
      parentName: '选择上级部门'
    }
  },
  
  computed: {
    orgId: function() {
      return this.org.id
    }
  },

  /**
   * 监听orgId变化
   */
  watch: {
    orgId(val) {
      this.getDepList()
    }
  },

  /**
   * 初始化钩子函数
   */
  mounted() {
    this.getDepList();
    checkDictItemCode('COMM_DEPGRADE').then(res=>{
      res.data.data.forEach(element=>{
        this.dicts[element.code] = element.name
      })
    })
  },

  /**
   * 自定义方法列表
   */
  methods: {

    /**
     * 获取分页部门列表
     */
    getDepList() {
      this.tableLoading = true
      const query = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        code: this.filterForm.code,
        location: this.filterForm.name,
        isDisabled: this.filterForm.isDisabled,
        orgId: this.org.orgId
      }
      if(this.filterForm.isDisabled === '0'){
        this.showDelDisabledButtion = false
      }else {
        this.showDelDisabledButtion = true
      }
      fetchDepList(query).then(res => {
         this.tableLoading = false
        if (res.data.errorCode === "000000") {
          this.depList = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.$message({
            message: '获取部门数据失败！',
            type: 'error'
          })
        }
      }).catch(error => {
          console.log(error)
        })
    },


    /**
     * 失效状态的变更事件
     */
    disabledChagne(val){
      this.getDepList();
    },


    /**
     * 表格点击事件
     */
    dblClick(row, evenet) {
      this.deptData.deptId = row.depId
    },


    /**
     * 打开新增部门模态框
     */
    openAddModel() {
      this.addDeptDialog = true
      this.addForm.orgName = this.org.orgName
    },

    
    /**
     * 打开上级部门模态框
     */
    openSelectDeptModel() {
      this.parentDepIdDialog = true
    },
    
    
    /**
     * 打开编辑模态框
     */
    openUpdateModel() {
      var items = this.$refs.deptListTable.selection
      //每次打开前先清空
      this.updateForm = {}
      if (items.length <= 0) {
        this.$message({
          message: '请选择一条信息！',
          type: 'error'
        })
        return
      }
      if (items.length > 1) {
        this.$message({
          message: '只可选择一条信息！',
          type: 'error'
        })
        return
      }
      const item = items[0]
      this.updateDeptDialog = true
      var updateData = JSON.stringify(item);
      this.updateForm = JSON.parse(updateData);
      this.updateForm.orgName = this.org.orgName
    },


     /**
     * 将所选机构设为失效
     */
    setUpDeptDisable(){
      var selections = this.$refs.deptListTable.selection
      if (selections.length <= 0) {
        this.$message({
          message: '请选择部门信息！',
          type: 'warning'
        })
        return
      }
      const text = "确认将所选的<<font color='blue'>" + selections.length + '</font>>条部门信息设置为失效状态吗？'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
          let ids = []
          selections.forEach(item => {
            ids.push(item.id)
          })
          setUpDeptDisable(ids).then(res => {
            this.$message({
              center: true,
              showClose: true,
              showIcon: true,
              message: res.data.errorMsg,
              type: res.data.errorCode  === "000000" ? 'success' : 'error'
            })
            if (res.data.errorCode  === "000000") {
               this.getDepList()
            } 
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {})
    },


    /**
     * 处理删除
     */
    handleDelete() {
      var selections = this.$refs.deptListTable.selection
      if (selections.length <= 0) {
        this.$message({
          message: '请选择部门信息！',
          type: 'warning'
        })
        return
      }
      const text = "确认删除选中的<<font color='blue'>" + selections.length + '</font>>个部门？ 删除后将不可恢复！'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
          let ids = []
          selections.forEach(item => {
            ids.push(item.id)
          })
          deleteDep(ids).then(res => {
            this.$message({
              center: true,
              showClose: true,
              showIcon: true,
              message: res.data.errorMsg,
              type: res.data.errorCode  === "000000" ? 'success' : 'error'
            })
            if (res.data.errorCode  === "000000") {
               this.getDepList()
            } 
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {})
    },


    /**
     * 获取部门级别
     */
    deptLevelFormatter(row) {
      return this.dicts[row.grade]
    },


    /**
     * 确认保存
     */
     addConfirm() {
      // 表单校验
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.submit()
        }
      })
    },


    /**
     * 确认编辑
     */
    updateConfirm(){
      this.$refs['updateForm'].validate(valid => {
        if (valid) {
          modifyDept(this.updateForm).then(res => {
            if (res.data.errorCode === '000000') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              //重新获取新的部门数据，数据初始化
              this.updateDeptDialog = false
              this.getDepList()
            } else {
              this.$message({
                message: res.data.errorMsg,
                type: 'error'
              })
            }
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },


    /**
     * 点击打开部门负责人模态框
     */
    openReportModel() {
      this.depChargeIdDialog = true
    },
    

    /**
     * 获取参数
     */
    parentDepChangeEvent: function(dept) {
      const parentId = dept.id
      if (!parentId) {
        return false
      }
      this.addForm.parentName = dept.location
      this.parentName = this.addForm.location
        ? this.addForm.parentName
        : '请选择上级部门'
      this.addForm.parentId = parentId || ''
      this.parentDepIdDialog = false
    },



    /**
     * 确认选择的部门负责人
     */
    confirmUserInfo(userInfo) {
      const id = userInfo.id
      if (!id) {
        return false
      }
      const name = userInfo.name
      this.addForm.depChargeName = name || '请选择部门负责人'
      this.addForm.director = id || ''
      this.depChargeIdDialog = false
    },

    /**
     * 提交信息
     */
    submit() {
      this.addForm.orgId = this.org.orgId;
      createDept(this.addForm).then(res => {
          if (res.data.errorCode === '000000') {
             this.$message({
              message: '部门创建成功',
              type: 'success'
            })
            //重新获取新的部门数据，数据初始化
            this.addDeptDialog = false
            this.$refs.addForm.clearValidate()
            this.getDepList()
          } else {
            this.$message({
              message: res.data.errorMsg,
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
      this.getDepList()
    },

    /**
     * 分页功能 - 检测PageSize变化
     */
    pageSizeChange(val) {
      this.pageSize = val
      this.getDepList()
    },

  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .el-table--medium td {
    padding: 5px 0;
  }
  .el-tag {
    margin: 0 3px 0 0;
  }
  .el-dialog__body {
    height: 400px;
    overflow-y: scroll;
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

  .popoverDiv {
    text-align: right;
    margin: 0;
  }
}
 .choice-button {
    width: 100%;
    text-align: left;
    overflow-x: hidden;
  }
</style>
