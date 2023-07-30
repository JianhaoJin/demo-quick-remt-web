<template>
  <div class="app-container">
    <!-- newUserForm -->
    <el-form
      ref="newForm"
      :model="newForm"
      :rules="newFormRules"
      label-width="140px"
      label-position="right">
      <el-row>
        <el-col :span="12">
          <el-form-item label="员工工号" prop="empBadge">
            <el-input
              :disabled="editType == 1"
              v-model="newForm.empBadge"
              placeholder="请输入员工工号"
              clearable
              maxlength="15"
              @blur="recheckEmpBadge" 
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="员工姓名" prop="empName">
            <el-input
              v-model="newForm.empName"
              :disabled="disabled"
              placeholder="员工姓名"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="newForm.gender" placeholder="选择性别" style="width:100%">
              <el-option label="女" value="1"></el-option>
              <el-option label="男" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生日" prop="birthDay">
            <template >
              <div class="block">
                <el-date-picker
                  v-model="newForm.birthDay"
                  type="date"
                  placeholder="选择日期" 
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  style="width:100%">
                </el-date-picker>
              </div>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属机构" prop="orgName">
            <el-input
              placeholder="请输入内容"
              v-model="newForm.orgName"
              :disabled="true">
            </el-input>
            
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="depId">
            <el-dialog
              :close-on-click-modal="true"
              :modal="false"
              :visible.sync="depIdDialog"
              width="70%"
              center
              title="选择部门">
              <DepSearchDialog ref="depTableData" :org-id="newForm.orgId" :parent-dialog-visible="depIdDialog" @chargeChange="selectedDep"/>
            </el-dialog>
            <el-button class="choice-button" @click="opdep">{{ depName == "" ? "请选择部门" : depName }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="所属岗位" prop="jobId">
            <el-dialog
              :close-on-click-modal="true"
              :modal="false"
              :visible.sync="jobIdDialog"
              width="70%"
              center
              title="选择岗位">
              <JobSearchDialog ref="jobTableData" :dept-id="newForm.depId" :parent-dialogvisible="jobIdDialog" @selectedJob="selectedJob"/>
            </el-dialog>
            <el-button class="choice-button" @click="opJob">{{ jobName == "" ? "请选择岗位" : jobName }}</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属条线" prop="boardLine">
            <el-input placeholder="请输入内容" v-model="boardLineName"> </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="职务" prop="headShip">
            
            <template >
              <el-select v-model="newForm.headShip" placeholder="选择职务" style="width:100%">
                  <el-option v-for="item in dictentryList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                  </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级领导" prop="reportTo">
            <el-dialog
              :close-on-click-modal="true"
              :modal="false"
              :visible.sync="reportToDialog"
              width="70%"
              center
              title="选择上级领导" >
              <EmployeeSearchDialog :org-id="newForm.orgId" @onUserSelect="confirmUserInfo"/>
            </el-dialog>
            <el-button
              class="choice-button"
              @click="opReport"
            >{{ newForm.reportToName || "请选择上级领导" }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="员工编制" prop="empAuth">
           
            <template >
              <el-select v-model="newForm.empAuth" placeholder="选择编制" style="width:100%">
                  <el-option v-for="item in empAuthList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                  </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编制属性" prop="authProperty">
            <template >
              <el-select v-model="newForm.authProperty" placeholder="选择编制属性" style="width:100%">
                  <el-option v-for="item in authPropertyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                  </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系手机" prop="mobileTelephone">
            <el-input
              v-model="newForm.mobileTelephone"
              :disabled="disabled"
              placeholder="联系手机"
              maxlength="11"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="empStatus">
            <template >
              <el-select v-model="newForm.empStatus" placeholder="选择状态" style="width:100%">
                <el-option label="在职" value="0"></el-option>
                <el-option label="离职" value="1"></el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="newForm.remark" :disabled="disabled" :rows="5" type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { createEmployee, modifyEmployee, isBadgeExist } from '@/api/sysManagement/orgManagement/sysEmployeeApi'
import { fetchOrgTree } from '@/api/sysManagement/orgManagement/sysOrganizationApi'
import treeSelect from '@/components/TreeSelect'
import EmployeeSearchDialog from '@/views/sysManagement/components/employeeSearchDialog'
import DepSearchDialog from '@/views/sysManagement/components/depSearchDialog'
import JobSearchDialog from '@/views/sysManagement/components/jobSearchDialog'
import {checkDictItemCode} from '@/api/sysManagement/sysDictItemApi'
const Qs = require('qs')
export default {
  components: {
    EmployeeSearchDialog,
    DepSearchDialog,
    JobSearchDialog,
    treeSelect
  },
  data() {
    const validatorEmpBadge = (rule, value, callback) => {
      if (value) {
        if (this.newForm.empName) {
          callback()
        } else if (this.some) {
          callback(new Error('该工号已存在！'))
        }
      } else {
        this.newForm.empName = ''
        callback(new Error('请输入员工工号'))
      }
    }
    const validatorEmpName = (rule, value, callback) => {
      if (value) {
        if (this.newForm.empName) {
          callback()
        }
      } else {
        this.newForm.empName = ''
        callback(new Error('请输入员工姓名'))
      }
    }
    const validatorBoardLine = (rule, value, callback) => {
      if (value) {
        if (this.newForm.boardLine) {
          callback()
        }
      } else {
        this.newForm.boardLine = ''
        callback(new Error('请输入所属条线'))
      }
    }
    const validatorMobileTelephone = (rule, value, callback) => {
      var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (value) {
        if (!reg_tel.test(value)) {
          callback(new Error('请输入正确手机号码'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      editType: 0, // 0新建 1修改
      newForm: {
        empBadge: '',
        empName: '',
        orgId: '',
        mobileTelephone: '',
        reportTo: '',
        headShip: '',
        boardLine: '',
        jobId: '',
        depId: '',
        orgName: '',
        depName: '',
        jobName: '',
        remark: '',
        reportToName: '',
        empStatus: null,
        gender:'',
        id:'',
        birthDay:null,
        empAuth:'',
        authProperty:''
      },
      some: false,
      disabled: false,
      newFormRules: {
        empBadge: [
          { required: true, validator: validatorEmpBadge, trigger: 'blur' }
        ],
        empName: [
          { required: true, validator: validatorEmpName, trigger: 'blur' }
        ],
        empStatus: [
          { required: true, message: '请选择员工状态', trigger: 'blur' }
        ],
        boardLine: [
          { required: true, validator: validatorBoardLine, trigger: 'blur' }
        ],
        mobileTelephone:[
          {validator:validatorMobileTelephone,trigger:'blur'}
        ]
      },
      reportToDialog: false,
      roleIdDialog: false,
      orgIdDialog: false,
      depIdDialog: false,
      jobIdDialog: false,
      roleProp: {
        children: 'children',
        label: 'roleName'
      },
      orgProp: {
        children: 'children',
        label: 'orgName'
      },
      depProp: {
        children: 'children',
        label: 'depName'
      },
      roleName: '请选择角色',
      orgName: '请选择机构',
      depName: '请选择部门',
      jobName: '请选择岗位',
      orgTreeData: [],
      orgTreeProp: {
        children: 'children',
        label: 'location'
      },
      boardLineName:'',
      dictentryList:[],
      empAuthList:[],
      authPropertyList:[]
    }
  },
  created() {

    /**
     * 职务
     */
    checkDictItemCode('COMM_HEADSHIP' ).then(response => {
      if (response.data.errorCode === '000000') {
        response.data.data.forEach(element => {
          const ele = {}
          ele.value = element.code
          ele.label = element.name
          this.dictentryList.push(ele)
        })
      } else {
        this.$message({
          message: '获取字典数据失败：' + response.data.errorMsg,
          type: 'error'
        })
      }
    })
    /**
     * 员工编制
     */
    checkDictItemCode('COMM_EMPAUTH' ).then(response => {
      if (response.data.errorCode === '000000') {
        response.data.data.forEach(element => {
          const ele = {}
          ele.value = element.code
          ele.label = element.name
          this.empAuthList.push(ele)
        }) 
      } else {
        this.$message({
          message: '获取字典数据失败：' + response.data.errorMsg,
          type: 'error'
        })
      }
    })
    /**
     * 编制属性
     */
    checkDictItemCode('COMM_AUTHPROPERTY' ).then(response => {
      if (response.data.errorCode === '000000') {
        response.data.data.forEach(element => {
          const ele = {}
          ele.value = element.code
          ele.label = element.name
          this.authPropertyList.push(ele)
        })  
      } else {
        this.$message({
          message: '获取字典数据失败：' + response.data.errorMsg,
          type: 'error'
        })
      }
    })
  },
  methods: {
    
    opReport() {
      this.reportToDialog = true
    },
    opdep() {
      
      if (this.newForm.orgId) {

        this.depIdDialog = true
      } else {
        this.$message({
          message: '请先选择所属机构',
          type: 'error'
        })
      }
    },
    opJob() {
      if (this.newForm.depId) {
        this.jobIdDialog = true
      } else {
        this.$message({
          message: '请先选择所属部门',
          type: 'error'
        })
      }
    },
    init(type, id, name, query) {
      
      this.editType = type
      this.newForm.orgId = id
      this.newForm.orgName = name
      if (!name) {
        this.newForm.orgName = '宁波银行'
      }
     
      // 编辑类型
      if (query) {
        // this.orgName = this.newForm.orgName
        if (this.editType === 1) {
          // 反显赋值
          this.newForm.id = query.id
          this.newForm.empName = query.empName
          this.newForm.empBadge = query.empBadge
          this.depName = query.depName
          this.newForm.gender = query.gender
          this.newForm.birthDay= query.birthDay
          this.newForm.mobileTelephone = query.mobileTelephone
          this.newForm.reportTo = query.reportTo
          this.newForm.headShip = query.headShip
          this.newForm.boardLine = query.boardLine
          this.newForm.jobId = query.jobId
          this.newForm.jobName = query.jobName
          this.jobName = query.jobName
          this.newForm.depId = query.depId
          this.newForm.depName = query.depName
          this.newForm.remark = query.remark
          this.newForm.reportToName = query.reportToName
          this.newForm.empStatus = query.empStatus
          this.newForm.empAuth = query.empAuth
          this.newForm.authProperty = query.authProperty
          this.boardLineName = query.boardLineName
        }
      } 
    },
    onOrgSelected(data) {
      
      if (this.newForm.orgId !== data.orgId) {
        this.newForm.depId = ''
        this.depName = ''
        this.newForm.jobId = ''
        this.jobName = ''
      }
    },
    selectedDep(data) {
      if (this.newForm.depId !== this.$refs.depTableData.depData.depId) {
        const deptId = this.$refs.depTableData.depData.depId
        this.depIdDialog = false
        this.newForm.depId = deptId || ''
        this.depName = data.location
        this.newForm.jobId = ''
        this.jobName = ''
      }
    },
    selectedJob(data) {
      const jobId = this.$refs.jobTableData.jobData.jobId
      this.newForm.jobId = jobId || ''
      this.jobIdDialog = false
      this.jobName = data.location
      this.newForm.boardLine = data.boardLine
      this.boardLineName = this.$refs.jobTableData.jobData.boardLineName
    },
    confirmUserInfo(userInfo) {
      const empId = userInfo.id
      if (empId === '') {
        return false
      }
      this.newForm.reportToName = userInfo.name || '请选择机构负责人'
      this.newForm.reportTo = empId || ''
      this.reportToDialog = false
    },
    /**
     * 处理提交按钮
     */
    clearvalid() {
      this.$refs.newForm.clearValidate()
    },
    handleConfirm() {
      // 表单校验
      this.$refs['newForm'].validate(valid => {
        if (valid) {
          if (!this.newForm.orgId) {
            this.$message({
              message: '请选择所属机构',
              type: 'warning'
            })
            return false
          } else {
            if (this.editType === 0) {
              this.submit()
            } else if (this.editType === 1) {
              this.modify()
            }
          }
        }
      })
    },
    /**
     * 提交信息
     */
    submit() {
      var _this = this
      const newFormFormat = {
        name:this.newForm.empName,
        jobNumber:this.newForm.empBadge,
        compId:this.newForm.orgId,
        deptId:this.newForm.depId,
        jobId:this.newForm.jobId,
        headShip:this.newForm.headShip,
        empStatus:this.newForm.empStatus,
        boardLine:this.newForm.boardLine,
        superior:this.newForm.reportTo,
        empAuth:this.newForm.empAuth,
        authProperty:this.newForm.authProperty,
        mobiletelPhone:this.newForm.mobileTelephone,
        remark:this.newForm.remark,
        updateFlag:'1',
        gender:this.newForm.gender,
        birthDay:Date.parse(this.newForm.birthDay)
      }
      
      createEmployee(newFormFormat)
        .then(res => {
          console.log(res)
          if (res.data.errorCode === "000000") {
            _this.$emit('saveSuccess')
            this.$message({
              message: '员工创建成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.errorMsg,
              type: 'error'
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    /**
     * 修改信息
     */
    modify() {
      var _this = this
      const newFormFormat = {
        id:this.newForm.id,
        name:this.newForm.empName,
        jobNumber:this.newForm.empBadge,
        compId:this.newForm.orgId,
        deptId:this.newForm.depId,
        jobId:this.newForm.jobId,
        headShip:this.newForm.headShip,
        empStatus:this.newForm.empStatus,
        boardLine:this.newForm.boardLine,
        superior:this.newForm.reportTo,
        empAuth:this.newForm.empAuth,
        authProperty:this.newForm.authProperty,
        mobiletelPhone:this.newForm.mobileTelephone,
        remark:this.newForm.remark,
        updateFlag:'2',
        gender:this.newForm.gender,
        birthDay:Date.parse(this.newForm.birthDay)
      }
      this.newForm.userState = 0

      modifyEmployee(newFormFormat)
        .then(res => {
          if (res.data.errorCode === "000000") {
            _this.$emit('saveSuccess')
            this.$message({
              message: '员工修改成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.errorMsg,
              type: 'error'
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    /**
     * 核查员工ID是否有效
     */
    recheckEmpBadge() {
      this.some = false
      this.newForm.empName = ''
      if (this.newForm.empBadge) {
        isBadgeExist(this.newForm.empBadge).then(response => {
          
          if (response.data.errorCode != '000000') {
            this.some = true
            this.disabled = true
          } else {
            this.disabled = false
          }
          this.$refs.newForm.validateField('empBadge')
        })
      }
    },
    reset() {
      this.jobName = '请选择岗位'
      this.depName = '请选择部门'
      this.newForm = {
        empBadge: '',
        empName: '',
        orgId: '',
        mobileTelephone: '',
        reportTo: '',
        headShip: '',
        boardLine: '',
        jobId: '',
        depId: '',
        orgName: '',
        depName: '',
        jobName: '',
        remark: '',
        reportToName: '',
        empStatus: null,
        gender:'',
        id:'',
        birthDay:null,
        empAuth:'',
        authProperty:''
      }
    },
    
  }
}
</script>
<style scoped>
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
.choice-button {
  width: 100%;
  text-align: left;
  overflow-x: hidden;
}
</style>
