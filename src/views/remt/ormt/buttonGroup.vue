<template>
  <div class="bottom">
    <el-tooltip
      v-if="saveButton"
      class="item"
      effect="dark"
      content="保存"
      placement="bottom-end"
    >
      <el-button
        type="success"
        icon="el-icon-document"
        :loading="saveLoading"
        :disabled="saveDisabled"
        @click="doSaveSubmit"
        round
        >保存</el-button
      >
    </el-tooltip>
    <el-tooltip
      v-if="sendButton"
      class="item"
      effect="dark"
      content="发起"
      placement="bottom-end"
    >
      <el-button
        type="success"
        icon="el-icon-s-promotion"
        round
        :loading="sendLoading"
        :disabled="sendDisabled"
        @click="doSendSubmit"
        >发起</el-button
      >
    </el-tooltip>
    <el-tooltip
      v-if="submitButton"
      class="item"
      effect="dark"
      content="复核通过"
      placement="bottom-end"
    >
      <el-button
        type="primary"
        icon="el-icon-s-promotion"
        round
        :loading="acceptLoading"
        :disabled="acceptDisabled"
        @click="doAccept"
        >复核通过</el-button
      >
    </el-tooltip>
    <el-tooltip
      v-if="rejectButton"
      class="item"
      effect="dark"
      content="驳回"
      placement="bottom-end"
    >
      <el-button
        type="warning"
        icon="el-icon-toilet-paper"
        @click="rollbackTask"
        round
        :loading="rollbackLoading"
        :disabled="rollbackDisabled"
        >驳回</el-button
      >
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      content="关闭"
      placement="bottom-end"
    >
      <el-button type="info" icon="el-icon-close" @click="confirmCloseTab" round
        >关闭</el-button
      >
    </el-tooltip>
  </div>
</template>
<script>
import * as unifyTradeApi from "@/api/sysManagement/unifyTradeApi";
export default {
  components: {},
  props: {
    operationButton: { type: String, default: "" },
    reqType: { type: String, default: "" }, // v-model绑定
    afterFromData: {},
  },
  data() {
    return {
      formModel_Data: {},
      //按钮组
      saveButton: true,
      sendButton: true,
      submitButton: true,
      rejectButton: true,
      //按钮状态
      sendLoading: false,
      saveLoading: false,
      acceptLoading: false,
      saveDisabled: false,
      acceptDisabled: false,
      sendDisabled: false,
      rollbackLoading: false,
      rollbackDisabled: false,
    };
  },
  computed: {},
  watch: {
    afterFromData: {
      handler(val) {
        console.log("存入值变化了", val);
        this.formModel_Data = val;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {
    console.log("this.$route", this.$route);
    if (this.reqType == "init") {
      this.pageInitButton();
    } else if (this.reqType == "update") {
      this.updateButtonShow();
    } else {
      this.pageQryButton();
    }
  },
  methods: {
    pageInitButton() {
      this.saveButton = true;
      this.sendButton = true;
      this.submitButton = false;
      this.rejectButton = false;
    },
    pageQryButton() {
      this.saveButton = false;
      this.sendButton = false;
      this.submitButton = false;
      this.rejectButton = false;
    },
    updateButtonShow() {
      if (
        this.operationButton === "SAVE" ||
        this.operationButton === "REJECT"
      ) {
        this.pageInitButton();
      } else if (this.operationButton === "ACCEPT") {
        this.saveButton = false;
        this.sendButton = false;
        this.submitButton = true;
        this.rejectButton = true;
      } else {
        this.pageQryButton();
      }
    },
    doAccept() {
      this.$parent.$parent.validate((valid) => {
        if (valid) {
          this.$confirm("您确定要复核吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.acceptConfirm();
            })
            .catch(() => {});
        }
      });
    },
    acceptConfirm() {
      console.log(" doAccept formModel_Data", this.formModel_Data);
      this.acceptLoading = true;
      this.acceptDisabled = true;
      this.rollbackDisabled = true;
      new Promise((resolve, reject) => {
        let data = {
          functionId: "orOpenApply",
          operationButton: "ACCEPT",
        };
        unifyTradeApi
          .saveUnifyTrade(Object.assign({}, this.formModel_Data, data))
          .then((res) => {
            if (res.data.errorCode === "000000") {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((e) => {
            reject(error);
          });
      })
        .then((res) => {
          console.log("返回信息：", res);
          this.$message({
            showClose: true,
            showIcon: true,
            center: true,
            message: "任务复核成功!",
            type: "success",
          });
          this.acceptLoading = false;
          this.closeTab();
        })
        .catch((err) => {
          this.acceptLoading = false;
          this.acceptDisabled = false;
          this.rollbackDisabled = false;
          this.$message({
            message: "系统异常，请稍后再试!" + err,
            type: "error",
          });
        });
    },
    doSaveSubmit() {
      this.$parent.$parent.validate((valid) => {
        if (valid) {
          this.$confirm("您确定要保存吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.saveConfirm();
            })
            .catch(() => {});
        }
      });
    },
    saveConfirm() {
      this.sendLoading = true;
      this.sendDisabled = true;
      this.saveDisabled = true;
      console.log("formModel_Data", this.formModel_Data);
      new Promise((resolve, reject) => {
        let data = {
          functionId: "orOpenApply",
          operationButton: "SAVE",
        };
        unifyTradeApi
          .saveUnifyTrade(Object.assign({}, this.formModel_Data, data))
          .then((res) => {
            if (res.data.errorCode === "000000") {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((e) => {
            reject(error);
          });
      })
        .then((res) => {
          console.log("返回信息：", res);
          this.$message({
            showClose: true,
            showIcon: true,
            center: true,
            message: "任务保存成功!",
            type: "success",
          });
          this.closeTab();
          this.saveDisabled = false;
        })
        .catch((err) => {
          this.sendLoading = false;
          this.sendDisabled = false;
          this.saveDisabled = false;
          this.$message({
            message: "系统异常，请稍后再试!" + err,
            type: "error",
          });
        });
    },
    doSendSubmit() {
      this.$parent.$parent.validate((valid) => {
        if (valid) {
          this.$confirm("您确定要发起吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.sendConfirm();
            })
            .catch(() => {});
        }
      });
    },
    sendConfirm() {
      this.sendLoading = true;
      this.sendDisabled = true;
      this.saveDisabled = true;
      console.log("formModel_Data", this.formModel_Data);
      new Promise((resolve, reject) => {
        let data = {
          functionId: "orOpenApply",
          operationButton: "SUBMIT",
        };
        unifyTradeApi
          .saveUnifyTrade(Object.assign({}, this.formModel_Data, data))
          .then((res) => {
            if (res.data.errorCode === "000000") {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((e) => {
            reject(error);
          });
      })
        .then((resp) => {
          console.log("返回信息：", resp);
          this.$message({
            showClose: true,
            showIcon: true,
            center: true,
            message: "任务提交成功!",
            type: "success",
          });
          this.sendLoading = false;
          this.closeTab();
        })
        .catch((err) => {
          this.sendLoading = false;
          this.sendDisabled = false;
          this.saveDisabled = false;
          this.$message({
            message: "系统异常，请稍后再试!" + err,
            type: "error",
          });
        });
    },
    confirmCloseTab() {
      this.$confirm("确认关闭？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.closeTab();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    closeTab() {
      this.$emit("closeTab", false);
    },
    /**
     * 驳回确定
     */
    sureBtn() {
      this.rollbackLoading = true;
      this.rollbackDisabled = true;
      this.acceptDisabled = true;
      console.log("formModel_Data", this.formModel_Data);
      new Promise((resolve, reject) => {
        let data = {
          functionId: "orOpenApply",
          operationButton: "REJECT",
        };
        unifyTradeApi
          .saveUnifyTrade(Object.assign({}, this.formModel_Data, data))
          .then((res) => {
            if (res.data.errorCode === "000000") {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((e) => {
            reject(error);
          });
      })
        .then((resp) => {
          console.log("返回信息：", resp);
          this.$message({
            showClose: true,
            showIcon: true,
            center: true,
            message: "任务驳回成功!",
            type: "success",
          });
          this.rollbackLoading = false;
          this.closeTab();
        })
        .catch((err) => {
          this.rollbackLoading = false;
          this.rollbackDisabled = false;
          this.acceptDisabled = false;
          this.$message({
            message: "系统异常，请稍后再试!" + err,
            type: "error",
          });
        });
    },
    rollbackTask(formName) {
      this.$parent.$parent.validate((valid) => {
        if (valid) {
          this.$confirm("您确定要驳回吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.sureBtn();
            })
            .catch(() => {});
        }
      });
    },
  },
};
</script>

<style >
.pagination {
  margin-top: 15px;
}
.formation-table {
  height: 300px;
  overflow: auto;
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-table .warning-row {
  background: oldlace;
}
</style>
