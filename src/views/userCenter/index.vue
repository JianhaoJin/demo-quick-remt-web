<template>
  <div class="app-container">
    <el-tabs tab-position="left">
      <el-tab-pane label="安全设置">
        <h2>安全设置</h2>
        <div class="row">
          <div class="meta">
            <p class="title">账户密码</p>
            <p class="desc">设置高强度密码防止账号被他们使用</p>
          </div>
          <div class="action">
            <el-button type="text" @click="mdVisable = true">修改</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="预留"><h2>预留</h2></el-tab-pane>
    </el-tabs>

    <!-- dialog -->
    <el-dialog :visible.sync="mdVisable" title="修改密码">
      <el-form ref="passwordForm" :model="passwordForm" :rules="rules" label-width="120px" label-position="right">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            :type="oldPasswordType"
            placeholder="请输入原密码"
            clearable
            maxlength="20"
            style="width: 80%;"/>
          <span class="show-pwd" @click="showPwd('old')">
            <svg-icon icon-class='eye'></svg-icon>
          </span>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            :type="newPasswordType"
            placeholder="请输入新密码"
            clearable
            maxlength="20"
            style="width: 80%;"/>
          <span class="show-pwd" @click="showPwd('new')">
            <svg-icon icon-class='eye'></svg-icon>
          </span>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            :type="confirmPasswordType"
            placeholder="请再次输入新密码"
            clearable
            auto-complete="off"
            maxlength="20"
            style="width: 80%;"/>
          <span class="show-pwd" @click="showPwd('con')">
            <svg-icon icon-class='eye'></svg-icon>
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const Qs = require('qs')
import { changePwd } from '@/api/sysManagement/sysUserApi'
import { b64_md5 } from '@/utils/md5'

export default {
  data() {
    const validatePriority = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('密码不相同'))
      } else if (value === this.passwordForm.oldPassword) {
        callback(new Error('新密码与原密码相同'))
      } else if (value.length < 8) {
        callback(new Error('密码长度应为8位及以上'))
      } else if (!/^(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$)\S+$/.test(value)) {
        callback(new Error('密码必须包含两种以上字符'))
      } else {
        callback()
      }
    }
    const validateNewPassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码长度应为8位及以上'))
      } else if (!/^(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$)\S+$/.test(value)) {
        callback(new Error('密码必须包含两种以上字符'))
      } else {
        callback()
      }
    }
    return {
      mdVisable: false,
      oldPasswordType : 'password',
      newPasswordType : 'password',
      confirmPasswordType : 'password',
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '原密码不能为空!', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空!', trigger: 'blur' },
          { validator: validateNewPassword }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空!', trigger: 'blur' },
          { validator: validatePriority }
        ]
      }
    }
  },
  methods: {

    /**
     * 修改密码提交
     */
    handleConfirm() {
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          const data = {
            oldPassword: b64_md5(this.passwordForm.oldPassword),
            newPassword: b64_md5(this.passwordForm.newPassword),
            plainPassword: b64_md5(this.passwordForm.newPassword)
          }
          changePwd(data).then(res => {
            if(res.data.errorCode === '000000'){
              this.$notify({
                title: '提示',
                type : 'success',
                duration : 0,
                message: res.data.errorMsg + '您必须重新登录。'
              });
              this.mdVisable = false
              this.handleCancel();
              this.logout();
            }
            if(res.data.errorCode != '000000'){
              this.$message({
                message: res.data.errorMsg,
                type: 'error'
              });
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },

    /**
     * 清除表单项
     */
    handleCancel() {
      this.mdVisable = false
      this.$refs['passwordForm'].resetFields()
      this.$refs['passwordForm'].clearValidate()
    },

     /**
     * 退出登录
     */
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()
      })
    },

    /**
     * password密码框显隐
     */
    showPwd(type){  
      if('old' === type){
        this.oldPasswordType = (this.oldPasswordType === 'password' ? '' : 'password');
      }else if('new' === type){
        this.newPasswordType = (this.newPasswordType === 'password' ? '' : 'password');
      }else if('con' === type){
        this.confirmPasswordType = (this.confirmPasswordType === 'password' ? '' : 'password');
      }
    }

  }
}
</script>
<style scoped>
h2 {
  margin: 0;
  color: #262626;
}
.row {
  /* width: 800px; */
  height: 80px;
  border-bottom: 1px solid #e8e8e8;
  overflow: hidden;
}
.row .meta {
  float: left;
  width: 600px;
}
.row .meta .title {
  font-size: 16px;
  font-weight: bold;
  color: #595959;
  margin: 16px 0 5px 0;
}
.row .meta .desc {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}
.row .action {
  float: left;
  height: 80px;
  width: 100px;
}
.row .action button {
  margin: 22px 0;
}
.show-pwd{
  position:absolute;
  right:24%;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
</style>

