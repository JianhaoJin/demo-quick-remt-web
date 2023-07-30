<template>
  <div class="boxer">
    <ul class="circles">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <div class="box1">
      <div class="middle1">
        <div class="middle_left">
          <div
            style="
              vertical-align: middle;
              padding: 20px 20px;
              font-size: 24px;
              letter-spacing: 5px;
            "
          >
            <img
              style="display: inline-block; vertical-align: middle"
              width="10%"
              src="./../../assets/logo.png"
            />
            <span style="display: inline-block; vertical-align: middle">{{
              systemNameLoginPage
            }}</span>
          </div>
        </div>
        <div class="middle_right">
          <div class="form-box">
            <h2 class="h2-logo-name">欢迎登录</h2>
            <el-form :model="loginForm" :rules="rules" ref="ruleForm">
              <!-- 用户名 -->
              <div
                class="form-group"
                @keyup.enter="handleLogin"
                style="margin-bottom: 8px"
              >
                <div
                  class="form-control"
                  style="padding-left: 0; border-bottom: none"
                >
                  <el-form-item prop="username">
                    <el-input
                      v-model="loginForm.username"
                      placeholder="请输入您的用户名"
                      class="validateInput"
                      style="width: 100%; margin-right: 5px"
                    >
                      <i
                        slot="prefix"
                        class="el-icon-user focus-icon input-icon-login"
                        style="padding-top: 10px"
                      ></i>
                    </el-input>
                  </el-form-item>
                </div>
              </div>

              <!-- 密码 -->
              <div
                class="form-group"
                @keyup.enter="handleLogin"
                style="margin-bottom: 8px"
              >
                <div
                  class="form-control"
                  style="padding-left: 0; border-bottom: none"
                >
                  <el-form-item prop="unlockPassword">
                    <el-input
                      v-model="loginForm.unlockPassword"
                      placeholder="请输入您的密码"
                      type="password"
                      class="validateInput"
                      style="width: 100%; margin-right: 5px"
                    >
                      <i
                        slot="prefix"
                        class="el-icon-lock focus-icon input-icon-login"
                        style="padding-top: 10px"
                      ></i>
                    </el-input>
                  </el-form-item>
                </div>
              </div>

              <!-- 验证码 -->
              <div
                v-if="validatedCodeSwitch"
                @keyup.enter="handleLogin"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <div
                  class="form-control"
                  style="padding-left: 0; border-bottom: none"
                >
                  <el-form-item prop="validatedCode">
                    <el-input
                      v-model="loginForm.validatedCode"
                      placeholder="请输入验证码"
                      class="validateInput"
                      style="width: 225px; margin-right: 5px"
                    >
                      <svg-icon
                        slot="prefix"
                        icon-class="安全"
                        class="el-input__icon input-icon-login"
                      ></svg-icon>
                    </el-input>
                    <div class="login-code">
                      <img
                        :src="validatedCodeResponse.imageUrl"
                        @click="getValidatedCode"
                        class="login-code-img"
                      />
                    </div>
                  </el-form-item>
                </div>
              </div>
              <el-button
                :loading="loading"
                type="primary"
                class="login-buttion"
                @click.native.prevent="handleLogin"
                >{{ $t("login.logIn") }}</el-button
              >
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getValidatedCode } from "@/api/sysManagement/loginApi";
import { b64_md5 } from "@/utils/md5";
import setting from "@/settings";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        unlockPassword: "",
        validatedKey: "",
        validatedCode: "",
      },
      //系统登录首页名称，如需修改，请到项目根目录setting.js中修改
      systemNameLoginPage: setting.systemNameLoginPage,
      //是否启用验证码，如需修改，请到项目根目录setting.js中关闭或开启
      validatedCodeSwitch: setting.validatedCodeSwitch,
      redirect: undefined,
      validatedCodeResponse: {
        imageUrl: "",
        uuid: "",
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: "用户名不能为空!", trigger: "blur" },
        ],
        unlockPassword: [
          { required: true, message: "密码不能为空!", trigger: "blur" },
        ],
        validatedCode: [
          { required: true, message: "验证码不能为空!", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },

  /**
   * 钩子函数mounted
   */
  mounted() {
    console.log("mounted");
    if (this.validatedCodeSwitch) {
      this.getValidatedCode();
    }
  },
  created() {
    console.log("created");
  },
  /**
   * 自定义方式列表
   */
  methods: {
    /**
     * 获取验证码
     */
    getValidatedCode() {
      getValidatedCode().then((res) => {
        if (res.data.errorCode === "000000") {
          this.validatedCodeResponse = res.data.data;
          this.loginForm.validatedKey = this.validatedCodeResponse.uuid;
        } else {
          this.$message({
            center: true,
            showClose: true,
            showIcon: true,
            message: res.data.errorMsg,
            type: "error",
          });
        }
      });
    },

    /**
     * 登录按钮
     */
    handleLogin() {
        console.log('登录')
      this.loading = true;
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          //密码加密
          this.loginForm.password = b64_md5(
            JSON.parse(JSON.stringify(this.loginForm.unlockPassword))
          );
          console.log(this.loginForm,'this.loginForm')
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then((response) => {
              if (response.data.errorCode != "000000") {
                this.$message({
                  center: true,
                  showClose: true,
                  showIcon: true,
                  message: response.data.errorMsg,
                  type: "error",
                });
                loading.close();
                this.loading = false;
                return;
              }
              loading.close();
              this.loading = false;
              this.$router.push({ path: "/" });
            })
            .catch((error) => {
              loading.close();
              this.loading = false;
            });
        } else {
          loading.close();
          this.loading = false;
          return false;
        }
      });
    },
  },
};
</script>
<style scoped lang='scss'>
/*---------------------------------------------*/
@import "./css/index.css";
@import "./css/style.css";

.login-code {
  width: 23%;
  height: 38px;
  float: right;
  margin-top: -0px;
  margin-right: 20px;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.login-code-img {
  height: 38px;
}
.validateInput /deep/ input {
  border: none;
  border-bottom: 1px solid #f2f2f2;
}
</style>
