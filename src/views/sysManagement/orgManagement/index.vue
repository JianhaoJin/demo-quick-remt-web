<template>
  <div class="app-container">
    <DragLayout >
      <template slot="leftSlot">
        <div class="dev-type-main-left">
          <div v-show="showRightMenu">
            <el-menu
              id="menu"
              class="right-menu"
              @select="menuSelect">
              <el-menu-item
                index="1"
                class="menu-item">
                <span slot="title">新增下级机构</span>
              </el-menu-item>
              <el-menu-item
                index="2"
                class="menu-item">
                <span slot="title">编辑当前机构</span>
              </el-menu-item>
              <el-menu-item
                index="3"
                class="menu-item">
                <span slot="title">失效当前机构</span>
              </el-menu-item>
            </el-menu>
          </div>
        </div>
        <el-input
          v-model="filterText"
          size="mini"
          class="filterInputClass"
          clearable
          placeholder="输入关键词过滤"/>
        <el-tree
          ref="tree2"
          :data="branchData"
          :props="branchProp"
          :default-expanded-keys="treeKeyArr"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          :highlight-current="true"
          class="common-tree"
          check-strictly
          node-key="id"
          @node-contextmenu="rightClick"
          @node-click="nodeClick">
          <span slot-scope="{node,data}" class="cutstom-tree-node">
            <span v-if="data.children.length > 0">
              <i class="fa fa-folder-o" aria-hidden="true"/>
            </span>
            <span v-else>
              <i class="fa fa-file-text-o" aria-hidden="true"/>
            </span>
            <span style="font-size:15px">{{ node.label }}</span>
          </span>
        </el-tree>
      </template>

      <template slot="midSlot">
        <div>
          <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane
             v-if="showOrgTab"
            :key="'orgTab'"
            label="下级机构"
            name="orgTab">
              <div style="background: yellow; display: inline">
                <OrgList ref="orgManageTab" :org="orgData" v-if="isOrgTab"/>
              </div>
            </el-tab-pane>

            <el-tab-pane
            :key="'depTab'"
            label="下级部门"
            name="depTab">
            <div style="background: yellow; display: inline">
              <DepManagement ref="depManageTab" :org="orgData" v-if="isDepTab" />
            </div>
            </el-tab-pane>

            <el-tab-pane
              :key="'jobTab'"
              label="下级岗位"
              name="jobTab">
              <div style="background: yellow; display: inline">
                <JobManagement ref="jobManageTab" :org="orgData" v-if="isJobTab"/>
              </div>
            </el-tab-pane>
          
            <el-tab-pane
              :key="'employeeTab'"
              label="人员管理"
              name="employeeTab">
                <div style="background: yellow; display: inline">
                  <EmployeeManagement ref="employeeTab" :org="orgData" v-if="isDisEmployeeTab"/>
                </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </DragLayout>


    <!-- 新增机构 -->
    <el-dialog :close-on-click-modal="true"  title="新增机构" :visible.sync="addVisible" center width="60%">
      <el-form
        ref="newForm"
        :model="newForm"
        :rules="formRules"
        label-width="140px"
        label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构代码" prop="code">
              <el-input v-model="newForm.code"  placeholder="机构代码(十位)"  maxlength="10"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构名称" prop="location">
              <el-input v-model="newForm.location" placeholder="机构名称" maxlength="20"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="所属上级机构" prop="parentName">
              <el-input v-model="newForm.parentName" :readonly="true" placeholder="所属上级机构" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构级别" prop="grade">
              <el-select style="width:100%" v-model="newForm.grade">
                <el-option v-for="item in gradeList"
                :key="item.id" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="机构负责人" prop="chargeName">
              <el-tooltip effect="light" content="点击选择机构负责人" placement="top">
                <el-input v-model="newForm.chargeName"  placeholder="机构负责人" maxlength="20" @focus="orgChargeNameDialog = true"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="分管领导" prop="directorName">
              <el-tooltip effect="light" content="点击选择机构分管领导" placement="top">
                <el-input v-model="newForm.directorName"  placeholder="分管领导" maxlength="20" @focus="orgDirectorNameDialog = true"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="机构四位码" prop="displayCode">
              <el-input v-model="newForm.displayCode" placeholder="机构四位码" maxlength="4"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input v-model="newForm.remark" :rows="5" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="mini"
          @click="saveForm">保存</el-button>
        <el-button
          type="info"
          size="mini"
          @click="addVisible= false">取消</el-button>
      </div>
    </el-dialog>

     <!-- 修改机构 -->
    <el-dialog :close-on-click-modal="true"  title="修改机构" :visible.sync="updateVisible" center width="60%">
      <el-form
        ref="updateForm"
        :model="updateForm"
        :rules="formRules"
        label-width="140px"
        label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构代码" prop="code">
              <el-input v-model="updateForm.code"  placeholder="机构代码(十位)"  maxlength="10"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构名称" prop="location">
              <el-input v-model="updateForm.location" placeholder="机构名称" maxlength="20"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="所属上级机构" prop="parentName">
              <el-input v-model="updateForm.parentName" :readonly="true" placeholder="所属上级机构" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构级别" prop="grade">
              <el-select style="width:100%" v-model="updateForm.grade">
                <el-option v-for="item in gradeList"
                :key="item.id" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="机构负责人" prop="chargeName">
              <el-tooltip effect="light" content="点击选择机构负责人" placement="top">
                <el-input v-model="updateForm.chargeName"  placeholder="机构负责人" maxlength="20" @focus="orgChargeNameDialog = true"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="分管领导" prop="directorName">
              <el-tooltip effect="light" content="点击选择机构分管领导" placement="top">
                <el-input v-model="updateForm.directorName"  placeholder="分管领导" maxlength="20" @focus="orgDirectorNameDialog = true"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="是否有效" prop="isDisabled">
              <el-select v-model="updateForm.isDisabled" clearable >
                <el-option label="有效" value="0"></el-option>
                <el-option label="失效" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构四位码" prop="displayCode">
              <el-input v-model="updateForm.displayCode" placeholder="机构四位码" maxlength="4"/>
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
        <el-button
          type="primary"
          size="mini"
          @click="modifyForm">保存</el-button>
        <el-button
          type="info"
          size="mini"
          @click="updateVisible= false">取消</el-button>
      </div>
    </el-dialog>


    <!-- 选择机构负责人模态框 -->
    <el-dialog
      :close-on-click-modal="true"
      :modal="true"
      :visible.sync="orgChargeNameDialog"
      style="height: 800px"
      top="2vh"
      class="chargeClass"
      title="选择机构负责人">
      <EmployeeSearchDialog :org-id="this.orgData.orgId" @onUserSelect="confirmUserInfo"/>
    </el-dialog>

    <!-- 选择机构分管领导模态框 -->
    <el-dialog
      :close-on-click-modal="true"
      :modal="true"
      :visible.sync="orgDirectorNameDialog"
      style="height: 800px"
      top="2vh"
      class="chargeClass"
      title="选择机构分管领导">
      <EmployeeSearchDialog :org-id="this.orgData.orgId" @onUserSelect="confirmDirectorInfo"/>
    </el-dialog>


  </div>
</template>

<script>
import { fetchOrgTree, deleteOrg } from '@/api/sysManagement/orgManagement/sysOrganizationApi'
import DragLayout from '@/components/DragLayout'
import OrgList from '@/views/sysManagement/orgManagement/orgList'
import DepManagement from '@/views/sysManagement/orgManagement/depManagement'
import EmployeeManagement from '@/views/sysManagement/orgManagement/employeeManagement'
import JobManagement from '@/views/sysManagement/orgManagement/jobManagement'
import { createOrg, modifyOrg, checkOrgCode } from '@/api/sysManagement/orgManagement/sysOrganizationApi'
import EmployeeSearchDialog from '@/views/sysManagement/components/employeeSearchDialog'
import {checkDictItemCode} from '@/api/sysManagement/sysDictItemApi'

const defaultBranchName = '宁波银行';
const defaultBranCode = '9999999999';

export default {
  name: 'OrgManagement',
  components: {
    OrgList,
    DepManagement,
    JobManagement,
    EmployeeManagement,
    DragLayout,
    EmployeeSearchDialog
  },
  data() {

    /**
     * 校验机构代码 10 位编码值
     */
    const validatorOrgCode = (rule, value, callback) => {
      if(!value){
        return callback(new Error("机构编码不能为空！"))
      }
      if(value.length < 10){
        return callback(new Error("机构编码不合法必须为10位！"))
      }
      var data = {}
      if(this.type === 'add'){
        data.id = null
        data.code = this.newForm.code
      }else if(this.type === 'update'){
        data.id = this.updateForm.id
        data.code = this.updateForm.code
      }
      checkOrgCode(data).then(res =>{
        if(res.data.errorCode != '000000'){
          return callback(new Error(res.data.errorMsg))
        }else {
          return callback()
        }
      })
    }
    return {
      type:'add',
      addVisible: false,
      updateVisible: false,
      filterText: '',
      activeName: 'orgTab',
      showOrgTab: true,
      isOrgTab: false,
      isEmployeeTab: false,
      isDepTab: false,
      isDisEmployeeTab: false,
      isJobTab: false,
      showRightMenu: false,
      nodeLevel: '1',
      orgData: {
        orgId: '',
        orgCode: '',
        orgLevel: 1,
        orgName: '',
        orgDisplayCode: '',
        orgChargeId: '',
        orgChargeName: '',
        displayCode: '',
        parentId: '',
        parentName: '',
        orgShowId: '',
        remark: ''
      },
      newForm: {
        displayCode: '', // 4位编码
        location: '',
        parentName: '',
        parentId: '',
        grade: '',
        director : '',
        directorName : '',
        charge: "",
        chargeName: '',
        isDisabled : '',
        code: '', // 10位代码
        remark: ''
      },
      updateForm:{},
      gradeList: [],
      branchIdFilter: false,
      branchData: [],
      branchProp: {
        children: 'children',
        label: 'location'
      },
      roleIdFilterName: '角色名称',
      branchFilterName: '机构名称',
      treeKeyArr: [],
      istop: true,
      currentClickNodeId: '',
      currentClickNodeCode: '',
      currentClickNodeData: null,
      orgChargeNameDialog: false,
      orgDirectorNameDialog: false,
      some: 0,  // 0：正常,-1:字段不符合规则
      formRules: {
        code: [
          { required: true, validator: validatorOrgCode, trigger: 'blur' }
        ],
        location: [
          { required: true, message: "机构名称不能为空！", trigger: 'blur' }
        ],
        grade: [
          { required: true, message: "机构级别不能为空！", trigger: 'blur' }
        ]
      },
    }
  },
  
  /**
   * 监听搜索过滤器
   */
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  /**
   * 初始化钩子函数created
   */
  created() {
    this.getBranch()
  },

  /**
   * 初始化钩子函数mounted
   */
  mounted() {
    this.gradeDataList()
  },

  /**
   * 自定义方法列表
   */
  methods: {

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
     * 获取机构数据
     */
    getBranch() {
      const _this = this
      fetchOrgTree().then(res => {
        if (res.data.errorCode === '000000') {
            _this.branchData = [];
            _this.branchData.push(res.data.data)
            _this.orgData.orgId = res.data.data.id
            _this.orgData.orgCode = res.data.data.code
            _this.orgData.orgName = res.data.data.location
            _this.activeName = 'orgTab'
            const tab = {}
            tab.name = 'orgTab'
            _this.tabClick(tab)
            _this.currentClickNodeCode = _this.branchData[0].code
            _this.currentClickNodeData = _this.branchData[0]
            // 设置默认展开节点
            _this.branchData.forEach(m => {
              _this.treeKeyArr.push(m.id)
          })
          if (_this.branchData.length > 0) {
            _this.$nextTick(() => {
              _this.$refs.tree2.setCurrentKey(_this.branchData[0].id)
            })
          }
        } else {
          _this.$message({
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
     * 保存机构
     */
    saveForm(){
      this.$refs['newForm'].validate(valid => {
        if (valid) {
          var data = this.newForm;
          createOrg(data).then(res => {
            this.$message({
              center: true,
              showClose: true,
              showIcon: true,
              message: res.data.errorMsg,
              type: res.data.errorCode === '000000' ? 'success' : 'error'
            })
            if (res.data.errorCode === '000000') {
              this.getBranch()
              this.$refs.newForm.resetFields();
              this.addVisible = false
            } 
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },

    /**
     * 修改机构
     */
    modifyForm(){
      this.$refs['updateForm'].validate(valid => {
        if (valid) {
          var data = this.updateForm
          modifyOrg(data).then(res => {
            this.$message({
              center: true,
              showClose: true,
              showIcon: true,
              message: res.data.errorMsg,
              type: res.data.errorCode === '000000' ? 'success' : 'error'
            })
            if (res.data.errorCode === '000000') {
              this.getBranch()
              this.updateVisible = false
            } 
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },


    /**
     * 搜索
     */
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.location.indexOf(value) !== -1
    },


    /**
     * tab的点击事件
     */
    tabClick(tab) {
      if (tab.name === 'orgTab') {
        this.isOrgTab = true;
        this.isDisEmployeeTab = false;
        this.isDepTab = false;
        this.isJobTab = false;
        this.activeName = 'orgTab';
      } else if (tab.name === 'employeeTab') {
        this.isDisEmployeeTab = true;
        this.isOrgTab = false;
        this.isDepTab = false;
        this.isJobTab = false;
        this.activeName = 'employeeTab';
      } else if (tab.name === 'depTab') {
        var a = this.orgData;
        this.isDepTab = true;
        this.isDisEmployeeTab = false;
        this.isOrgTab = false;
        this.isJobTab = false;
        this.activeName = 'depTab';
      } else if (tab.name === 'jobTab') {
        this.isJobTab = true;
        this.isDepTab = false;
        this.isDisEmployeeTab = false;
        this.isOrgTab = false;
        this.activeName = 'jobTab';
      }
    },

    /**
     * 点击节点事件
     */
    nodeClick(data) {
      //如果没有子节点，那么隐藏下级机构
      if(this.activeName === 'orgTab'){
        if(!data.children || data.children.length === 0){
          this.isOrgTab = false;
          this.showOrgTab = false;
          this.isDepTab = true;
          this.activeName = 'depTab';
        }
      }
      this.currentClickNodeData = data;
      this.currentClickNodeId = data.code;
      this.orgData = data;
      this.orgData.orgId = data.id
      this.orgData.orgCode = data.code
      this.orgData.orgName = data.location
      this.showOrgTab = true;
    },


    /**
     * 左击事件
     */
    rightClick(event, data, node, obj) {
      this.orgData = data;
      this.showRightMenu = false
      this.showRightMenu = true
      const menu = document.querySelector('#menu')
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetTop = this.$el.getBoundingClientRect().top
      menu.style.left = event.clientX - offsetLeft + 'px' // + 200; // 15: margin right
      let top = event.clientY - offsetTop + 10
      if (top > this.$el.clientHeight - 155) {
        top = this.$el.clientHeight - 155
      }
      menu.style.top = top + 'px'
      // 给整个document添加监听鼠标事件,点击任务位置执行closeRightMenu方法,及时将菜单关闭
      document.addEventListener('click', this.closeRightMenu)
      console.log('right_click', node)
    },


    /**
     * 关闭菜单
     */
    closeRightMenu() {
      this.showRightMenu = false
      document.removeEventListener('click', this.closeRightMenu)
    },


    /**
     * 菜单右键选择
     */
    menuSelect(index) {
      // 新建
      if (index === '1') {
        this.openAddModel()
      } else if (index === '2') {
        // 修改
        this.opemUpdateModel()
      } else if (index === '3') {
        // 删除
        this.handleDelete()
      }
    },


    /**
     * 创建新的机构
     */
    openAddModel() {
      this.addVisible = true
      this.type = 'add'
      this.newForm.parentId = this.orgData.id,
      this.newForm.parentName = this.orgData.location

    },


    /**
     * 编辑机构
     */
    opemUpdateModel() {
      this.updateVisible = true
      var data = JSON.stringify(this.orgData)
      this.updateForm = JSON.parse(data)
      this.type = 'update'
    },


    /**
     * 确认选择的机构负责人
     */
    confirmUserInfo(userInfo) {
      if(this.type === 'add'){
        this.newForm.charge = userInfo.eid
        this.newForm.chargeName = userInfo.name
      }else if(this.type === 'update'){
        this.updateForm.charge = userInfo.eid
        this.updateForm.chargeName = userInfo.name
      }
      this.orgChargeNameDialog = false
    },

    /**
     * 选择分管领导
     */
    confirmDirectorInfo(userInfo){
       if(this.type === 'add'){
        this.newForm.director = userInfo.eid
        this.newForm.directorName = userInfo.name
      }else if(this.type === 'update'){
        this.updateForm.director = userInfo.eid
        this.updateForm.directorName = userInfo.name
      }
      this.orgDirectorNameDialog = false
    },


    /**
     * 处理删除用户按钮
     */
    handleDelete() {
      var data = this.orgData
      let text = "确认删除机构<<font color='blue'>" + data.location + '</font>>吗？';
      if (data.children && data.children.length > 0) {
        text = "当前机构下有多个下级机构，失效后会将下级机构全部失效，确定要执行当前操作吗？";
      }
      this.$confirm(text, '提示', {
        type: 'warning',
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }) .then(() => {
          this.deleteOrg(data)
        }) .catch(() => { })
    },


    /**
     * 删除机构
     */
    deleteOrg(item) {
      deleteOrg(item.id).then(res => {
        if (res.data.errorCode === '000000') {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getBranch();
        } else {
          this.$message({
            message: res.data.erroMsg,
            type: 'error'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },

  }
}
</script>
<style lang="scss" scoped>
.dev-type-main-left {
  overflow: auto;
  padding: 5px;
  .right-menu {
    z-index: 100;
    position: absolute;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: white;
    .menu-item {
      //display block
      height: 25px;
      line-height: 20px;
      text-align: center;
      margin-top: 10px;
      font-size: 14px;
      width: 150px;
      color: #606266;
    }
  }
}

#depManage,
#disManage,
#empManage,
#jobManage,
#partManage,
#orgManage {
  margin-left: -15px;
  margin-top: -15px;
}

.common-tree {
  position: relative;
  top: 3%;
  padding: 9px;
  height: 90%;
}

.el-tree-node.is-checked > .el-tree-node__content {
  background-color: rgb(255, 255, 255);
  color: black;
}
.el-tree-node.is-current > .el-tree-node__content {
  background-color: rgb(255, 255, 255);
  color: #409eff;
}

.filterInputClass {
  width: 130px;
  position: absolute;
  margin-top: -5px;
  left: 15px;
  z-index: 2000;
}
</style>
