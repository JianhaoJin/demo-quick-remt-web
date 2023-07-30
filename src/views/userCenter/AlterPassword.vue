<template>
  <div class="app-container">
    <el-form ref="passwordForm" :model="passwordForm" :rules="rules" label-width="120px" label-position="right">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          v-model="passwordForm.oldPassword"
          type="password"
          placeholder="请输入原密码"
          clearable
          maxlength="20"
          style="width: 500px;"/>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="passwordForm.newPassword"
          type="password"
          placeholder="请输入新密码"
          clearable
          maxlength="20"
          style="width: 500px;"/>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input
          v-model="passwordForm.confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
          clearable
          auto-complete="off"
          maxlength="20"
          style="width: 500px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </div>
  </div>
</template>

<script>
const Qs = require('qs')
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
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { validator: validateNewPassword }
        ],
        confirmPassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: validatePriority }
        ]
      }
    }
  },
  methods: {
    handleConfirm() {
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          // submit
          const data = {
            oldPassword: b64_md5(this.passwordForm.oldPassword),
            newPassword: b64_md5(this.passwordForm.newPassword),
            plainPassword: this.passwordForm.newPassword
          }
          // operatorApi.modifyPassword(Qs.stringify(data)).then(res => {
          //   if (res.data.code === 200) {
          //     this.$message({
          //       type: 'success',
          //       message: res.data.message
          //     })
          //     this.mdVisable = false
          //     this.passwordForm.oldPassword = ''
          //     this.passwordForm.newPassword = ''
          //     this.passwordForm.confirmPassword = ''
          //     this.logout()
          //   } else {
          //     this.$message({
          //       type: 'error',
          //       message: res.data.message
          //     })
          //   }
          // }).catch(err => {
          //   console.log(err)
          // })
        }
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        // this.$router.push({ path: '/login'}) // do not use it before bug fixed
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    handleCancel() {
      this.mdVisable = false
      this.$refs['passwordForm'].resetFields()
      this.$refs['passwordForm'].clearValidate()
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
</style>

