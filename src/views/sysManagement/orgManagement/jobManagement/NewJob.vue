<template>
  <div class="app-container">
    <!-- newUserForm -->
    <el-form
      ref="jobData"
      :model="jobData"
      :rules="newFormRules"
      label-width="140px"
      label-position="right"
    >
      <el-row>
        <el-col :span="12">
          <!-- 4位码 -->
          <el-form-item label="岗位编码" prop="jobCode">
            <el-input
              v-model="jobData.jobCode"
              :disabled="editType==1"
              placeholder="请输入岗位编码"
              clearable
              maxlength="10"
              @blur="reCheckJobCode"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位名称" prop="jobName">
            <el-input
              v-model="jobData.jobName"
              placeholder="请输入岗位名称"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属机构" prop="orgName">
            <el-input
              v-model="jobData.orgName"
              :disabled="true"
              clearable
              maxlength="10"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="deptName">
            <el-dialog
              :close-on-click-modal="false"
              :modal="false"
              :visible.sync="parentDepIdDialog"
              width="70%"
              center
              title="选择所属部门">
              <DepSearchDialog 
               ref="depViewData" 
               :org-id="jobData.orgId" 
               :parent-dialog-visible="parentDepIdDialog" 
               @chargeChange="parentDepChangeEvent"/>
            </el-dialog>
            <el-button
              class="choice-button"
              @click="depNameClick"
            >{{ jobData.depName == "" || jobData.depName == undefined ? "请选择部门" : jobData.depName }}</el-button>
          </el-form-item>
        </el-col>

        
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- userId -->
          <el-form-item label="所属条线" prop="boardLine">
            <template >
              <el-select v-model="jobData.boardLine" placeholder="选择条线" style="width:100%">
                  <el-option v-for="item in boardLineList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" >
                  </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12"/>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="jobData.remark" :rows="5" type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { addJob, updateJob, isJobCodeExist } from '@/api/sysManagement/orgManagement/sysJobApi'
import DepSearchDialog from '@/views/sysManagement/components/depSearchDialog'
import {checkDictItemCode} from '@/api/sysManagement/sysDictItemApi'
export default {
  components: {
    DepSearchDialog
  },
  data() {
    // 10位代码
    const validatorJobCode = (rule, value, callback) => {
      if (value) {
        if (this.some === -1) {
          callback(new Error('该岗位代码已存在！'))
        }
      } else {
        callback(new Error('请输入岗位代码！'))
      }
      callback()
    }
    const validatorJobName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入岗位名称！'))
      } else {
        callback()
      }
    }
    const validatorBoardLine = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择条线！'))
      } else {
        callback()
      }
    }
    return {
      editType: 0,
      parentDepIdDialog: false,
      jobData: {},
      some: 0, // 0：正常,-1:字段已存在,-2:字段不符合规则
      newFormRules: {
        // 10位机构代码验证
        jobCode: [
          { required: true, validator: validatorJobCode, trigger: 'blur' }
        ],
        jobName: [
          { required: true, validator: validatorJobName, trigger: 'blur' }
        ],
        boardLine: [
          { required: true, validator: validatorBoardLine, trigger: 'blur' }
        ]
      },
      boardLineList:[]
    }
  },
  created() {
    /**
     * 业务条线
     */
    checkDictItemCode('COMM_BOARDLINE' ).then(response => {
      if (response.data.errorCode === '000000') {
        response.data.data.forEach(element => {
          const ele = {}
          ele.value = element.code
          ele.label = element.name
          this.boardLineList.push(ele)
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
    depNameClick() {
      this.parentDepIdDialog = true
    },

    parentDepChangeEvent(dept) {
      this.jobData.depName = dept.location
      this.jobData.depId = this.$refs.depViewData.depData.depId
      this.parentDepIdDialog = false
    },

    returnBack() {
      // this.$store.dispatch('delView', this.$route)
      // this.$route.back(-1)
    },

    submit() {
      if (!this.jobData.depId) {
        this.$message({
          message: '所属部门不能为空',
          type: 'error'
        })
        return
      }
      var _this = this
      this.$refs.jobData.validate(valid => {
        if (valid) {
          if (_this.editType === 1) {
            _this.jobData.location = _this.jobData.jobName
            updateJob(_this.jobData).then(res => {
              if (res.data.errorCode === '000000') {
                _this.$emit('onSaveSuccess')
                _this.$message({
                  message: '岗位修改成功',
                  type: 'success'
                })
              } else {
                _this.$message({
                  message: '岗位修改失败',
                  type: 'failed'
                })
              }
            })
          } else {
            _this.jobData.code = _this.jobData.jobCode
            _this.jobData.location = _this.jobData.jobName
            _this.jobData.updateFlag = '1'
            addJob(_this.jobData).then(res => {
              if (res.data.errorCode === '000000') {
                _this.$emit('onSaveSuccess')
                _this.$message({
                  message: '岗位新增成功',
                  type: 'success'
                })
              } else {
                _this.$message({
                  message: res.data.errorMsg,
                  type: 'failed'
                })
              }
            })
          }
        } else {
          return false
        }
      })
    },
    clearvalid() {
      this.$refs.jobData.clearValidate()
    },

    reCheckJobCode() {
      this.some = 0
      if (this.jobData.jobCode) {
        isJobCodeExist(this.jobData.jobCode).then(response => {
          if (response.data.errorCode != '000000') {
            this.some = -1
          } else {
            this.some = 0
          }
          this.$refs.jobData.validateField('jobCode')
        })
      }
    },
    init(val, val2) {
      this.jobData = val
      this.editType = val2
    },
    reset() {
      this.jobData = {
        jobCode: '',
        jobName: '',
        depId: '',
        depName: '',
        orgId: '',
        orgName: '',
        boardLine: '',
        remark: ''
      }
    }
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
.el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
.choice-button {
  width: 100%;
  text-align: left;
  overflow-x: hidden;
}
</style>

