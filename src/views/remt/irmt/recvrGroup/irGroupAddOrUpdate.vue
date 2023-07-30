<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose"
    title="收汇分组管理新增"
    v-bind="$attrs"
    :visible.sync="visible"
    v-on="$listeners"
    :fullscreen="true"
  >
    <span slot="title">
      <div class="dialog-title"><span>收汇分组管理新增</span></div>
    </span>

    <el-form
      ref="formModel"
      :model="formModel_Data"
      :rules="formModel_Rules"
      :disabled="formModel.disabled"
      label-width="120px"
      label-position="right"
    >
      <el-row :gutter="0">
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.payerName.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="汇款人" prop="payerName">
                <el-input
                  v-model="formModel_Data.payerName"
                  placeholder="请输入汇款人"
                  show-word-limit
                  :disabled="formModel_Control.payerName.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.groupNo.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="组别" prop="groupNo">
                <template >
                  <el-select v-model="formModel_Data.groupNo" placeholder="请选择组别" style="width: 100%" clearable>
                    <el-option
                      v-for="item in groupNoOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row>
            <el-col
              v-if="formModel_Control.expiryDate.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="生效日期" prop="expiryDate">
                <el-date-picker
                  v-model="formModel_Data.expiryDate"
                  format="yyyy-MM-dd"
                  value-format="yyyyMMdd"
                  :style="{ width: '100%' }"
                  placeholder="请选择生效日期"
                  clearable
                  :disabled="formModel_Control.expiryDate.disabled"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <add-contracts
      v-if="addContractsDialogVisible"
      ref="addContracts"
      @closeAddContractsDialog="closeAddContractsDialog"
    />
    <span slot="footer">
      <el-tooltip
        v-if="saveButton"
        class="item"
        effect="dark"
        content="保存"
        placement="bottom-end"
      >
        <el-button
          v-permission="'irOrder:update'"
          type="primary"
          icon="el-icon-document"
          @click="commitSave"
          round
          >保存</el-button
        >
      </el-tooltip>

      <el-tooltip
        v-if="delButton"
        class="item"
        effect="dark"
        content="删除"
        placement="bottom-end"
      >
        <el-button
          v-permission="'irOrder:delete'"
          type="danger"
          icon="el-icon-delete"
          @click="commitDel"
          round
          >删除</el-button
        >
      </el-tooltip>

      <el-tooltip
        class="item"
        effect="dark"
        content="返回"
        placement="bottom-end"
      >
        <el-button type="info" icon="el-icon-close" @click="handleClose" round
          >返回</el-button
        >
      </el-tooltip>
    </span>
  </el-dialog>
</template>
<script>
import mercurySelect from "@/components/MercurySelect";
import { details, update, deleteInfo,add } from "@/api/remt/irGroupApi";
import BussinessAmt from "@/components/BussinessAmt";
import AddContracts from "@/components/AddContracts";
import { checkDictItemCode } from "@/api/sysManagement/sysDictItemApi";
export default {
  components: { mercurySelect, BussinessAmt, AddContracts },
  props: [],
  data() {
    return {
      txCom: {
        //操作按钮 init-页面初始化, add-新增, mod-修改, del-删除, qry-查询, submit-经办提交, accept-复核提交, reject-驳回
        operationButton: "",
        //主表ID
        mainId: "",
        //交易码
        functionId: "irGroup",
        //交易名称
        functionName: "收汇分组管理",
        //当前页码
        currentPage: 1,
        //每页笔数
        pageSize: 10,
        //总页数
        pageSizes: 0,
        //总笔数
        total: 0,
        //当前行数据
        currRow: [],
      },
      saveButton: true,
      delButton: true,
      precision: 2, // 精度
      visible: false,
      addContractsDialogVisible: false,
      operationType: "dialog",
      groupNoOptions : [],
      formDataList: ["formModel"],
      activeFormTab: "formModel",
      formModel: {
        isShow: true,
        disabled: false,
      },
      formModel_Data: {
        payerName: undefined,
        groupNo: undefined,
        expiryDate: undefined,
        goodsServices: undefined,
        payCcy: undefined,
        orderAmt: undefined,
        payDate: null,
        paidAmt: undefined,
        bePaidAmt: undefined,
        payStatus: "0",
        contracts: undefined,
        invoices: undefined,
      },
      formModel_Control: {
        payerName: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        groupNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        expiryDate: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        goodsServices: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        return: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
          url: undefined,
        },
      },
      formModel_Rules: {
        payerName: [
          {
            required: true,
            message: "请输入汇款人",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入汇款人",
            trigger: "change",
          },
        ],
        groupNo: [
          {
            required: true,
            message: "请输入组别",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入组别",
            trigger: "change",
          },
        ],
        expiryDate: [
          {
            required: true,
            message: "请输入生效日期",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入生效日期",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  async mounted() {
    await checkDictItemCode("REMT_SUPPLIER_GROUP").then((response) => {
      if (response.data.errorCode === "000000") {
        this.groupNoOptions = response.data.data.filter(item => item.name.startsWith("汇入"));
      }
    });
  },
  methods: {
    commitSave() {
      this.$refs["formModel"].validate((valid) => {
        if (valid) {
          this.commitSaveProc();
        }
      });
    },

    commitSaveProc() {
      if (this.txCom.operationButton && this.txCom.operationButton === "add") {
        this.$confirm("确认新增保存？")
          .then((_) => {
            add(this.formModel_Data)
              .then((res) => {
                if (res.data.errorCode === "000000") {
                  this.$message({
                    showClose: true,
                    showIcon: true,
                    center: true,
                    message: "新增收汇分组管理数据成功!",
                    type: "success",
                  });
                  //参数回传父页面 - 刷新父页面
                  this.$emit("closeDetailModel");
                  this.visible = false;
                }
              })
              .catch((e) => {
                this.$message.error("新增收汇分组管理数据失败!");
              });
          })
          .catch((_) => {});
      }else if (
        this.txCom.operationButton &&
        this.txCom.operationButton === "mod"
      ) {
        this.$confirm("确认修改保存？")
          .then((_) => {
            update(this.formModel_Data)
              .then((res) => {
                if (res.data.errorCode === "000000") {
                  this.$message({
                    showClose: true,
                    showIcon: true,
                    center: true,
                    message: res.data.errorMsg,
                    type: "success",
                  });
                  this.$emit("closeDetailModel");
                  this.visible = false;
                }
              })
              .catch((e) => {
                this.$message.error("失败");
              });
          })
          .catch((_) => {});
      }
    },
    commitDel() {
      this.$confirm("确认删除？")
        .then((_) => {
          deleteInfo(this.formModel_Data.id)
            .then((res) => {
              if (res.data.errorCode === "000000") {
                //this.formModel_Data = res.data.data
                this.$message({
                  showClose: true,
                  showIcon: true,
                  center: true,
                  message: res.data.errorMsg,
                  type: "success",
                });
                //参数回传父页面 - 刷新父页面
                this.$emit("closeDetailModel");
                this.visible = false;
              }
            })
            .catch((e) => {
              this.$message.error("失败");
            });
        })
        .catch((_) => {});
    },
    addInit(operationButton) {
      this.visible = true;
      this.saveButton = true;
      this.delButton = false;
      this.txCom.operationButton = operationButton;
    },

    addOrUpdate(row,operationButton) {
      this.visible = true;
      this.saveButton = true;
      this.delButton = true;
      this.isAddWatch = false;
      this.txCom.operationButton = operationButton;

      details(Object.assign({}, this.txCom, row)).then((res) => {
        if (res.data.errorCode === "000000") {
          this.formModel_Data = res.data.data;
        } else {
          this.$message({
            center: true,
            showClose: true,
            showIcon: true,
            message: res.data.errMsg,
            type: "error",
          });
        }
      });
    },

    handleClose() {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.visible = false;
          //参数回传父页面 - 刷新父页面
          this.$emit("closeDetailModel");
        })
        .catch((_) => {});
    },
  },
};
</script>
<style scoped>
>>> .el-dialog__body {
  padding: 1px 20px;
}
>>> .el-dialog__header {
  background: white;
}
.dialog-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
>>> .el-dialog__footer {
  text-align: center;
}
</style>
