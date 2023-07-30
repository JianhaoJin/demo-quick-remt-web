<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose"
    title="供应商参数明细"
    v-bind="$attrs"
    :visible.sync="visible"
    v-on="$listeners"
    :fullscreen="true"
  >
    <span slot="title">
      <div class="dialog-title"><span>供应商参数明细</span></div>
    </span>
    <el-form
      ref="formModel"
      :model="formModel_Data"
      :rules="formModel_Rules"
      :disabled="formModel.disabled"
      label-width="180px"
      label-position="right"
    >
      <el-row :gutter="15">
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col :span="8" :offset="8">
              <span>&nbsp;</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.recvrShortNm.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="供应商简称" prop="recvrShortNm">
                <el-input
                  v-model="formModel_Data.recvrShortNm"
                  placeholder="请输入供应商简称"
                  show-word-limit
                  :disabled="formModel_Control.recvrShortNm.disabled"
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
              :offset="7"
            >
              <el-form-item label="供应商组别" prop="groupNo">
                <mercurySelect
                  v-model="formModel_Data.groupNo"
                  :url="'/dict-item/REMT_SUPPLIER_GROUP'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :disabled="formModel_Control.groupNo.disabled"
                  :dicttypeid="'REMT_SUPPLIER_GROUP'"
                  placeholder="请选择供应商组别"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.recvrOpenBk.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款人开户银行代码" prop="recvrOpenBk">
                <el-input
                  v-model="formModel_Data.recvrOpenBk"
                  placeholder="请输入收款人开户银行代码"
                  show-word-limit
                  :disabled="formModel_Control.recvrOpenBk.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-button
                type="text"
                :disabled="
                  formModel_Control.bicMngAagentOpenAccountButton.disabled
                "
                @click.native="searchBicMng('openAccount')"
                >查询收款行</el-button
              >
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.recvrOpenBknm.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款人开户银行名称" prop="recvrOpenBknm">
                <el-input
                  v-model="formModel_Data.recvrOpenBknm"
                  placeholder="请输入收款人开户银行名称"
                  show-word-limit
                  :disabled="formModel_Control.recvrOpenBknm.disabled"
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
              v-if="formModel_Control.recvrAccNo.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款人账号" prop="recvrAccNo">
                <el-input
                  v-model="formModel_Data.recvrAccNo"
                  placeholder="请输入收款人账号"
                  show-word-limit
                  :disabled="formModel_Control.recvrAccNo.disabled"
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
              v-if="formModel_Control.recvrName.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款人名称" prop="recvrName">
                <el-input
                  v-model="formModel_Data.recvrName"
                  placeholder="请输入收款人名称"
                  show-word-limit
                  :disabled="formModel_Control.recvrName.disabled"
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
              v-if="formModel_Control.recvrAddr.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款人地址" prop="recvrAddr">
                <el-input
                  v-model="formModel_Data.recvrAddr"
                  placeholder="请输入收款人地址"
                  show-word-limit
                  :disabled="formModel_Control.recvrAddr.disabled"
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
              v-if="formModel_Control.country.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款人常驻国家（地区）" prop="country">
                <mercurySelect
                  v-model="formModel_Data.country"
                  :url="'/dict-item/REMT_REMT_CNT'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :disabled="formModel_Control.country.disabled"
                  :dicttypeid="'REMT_REMT_CNT'"
                  placeholder="请选择国家（地区）"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.useAgentFlg.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="是否使用代理行" prop="useAgentFlg">
                <mercurySelect
                  v-model="formModel_Data.useAgentFlg"
                  :url="'/dict-item/REMT_USE_AGENT_FLG'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :disabled="formModel_Control.useAgentFlg.disabled"
                  :dicttypeid="'REMT_USE_AGENT_FLG'"
                  placeholder="请选择是否使用代理行"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.agentBic.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="代理行银行代码" prop="agentBic">
                <el-input
                  v-model="formModel_Data.agentBic"
                  placeholder="请输入代理行银行代码"
                  show-word-limit
                  :disabled="formModel_Control.agentBic.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-button
                :disabled="formModel_Control.bicMngAagentButton.disabled"
                type="text"
                @click.native="searchBicMng('agent')"
                >查询收款行</el-button
              >
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.agentName.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="代理行银行名称" prop="agentName">
                <el-input
                  v-model="formModel_Data.agentName"
                  placeholder="请输入代理行银行名称"
                  show-word-limit
                  :disabled="formModel_Control.agentName.disabled"
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
              v-if="formModel_Control.agentAccNo.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款银行在其代理行账号" prop="agentAccNo">
                <el-input
                  v-model="formModel_Data.agentAccNo"
                  placeholder="请输入收款银行在其代理行账号"
                  show-word-limit
                  :disabled="formModel_Control.agentAccNo.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        
      </el-row>
    </el-form>

    <bic-mng-dialog
      v-if="bicMngDialogVisible"
      ref="bicMngDialog"
      @closeBicMngDialog="closeBicMngDialog"
    />
    <span slot="footer">
      <!--
      <el-button :disabled="saveDisabled" @click="commitSave">保存</el-button>
      <el-button :disabled="delDisabled" type="warning" @click="commitDel">删除</el-button>
      <el-button type="warning" @click="handleClose">返回</el-button>
       -->
      <el-tooltip
        v-if="saveButton"
        class="item"
        effect="dark"
        content="保存"
        placement="bottom-end"
      >
        <el-button
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
        <el-button type="danger" icon="el-icon-delete" @click="commitDel" round
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
import BicMngDialog from "../bicQry/bicMngDialog";
import { deleteById, update, add } from "@/api/remt/recvrMngApi";
import util from "@/utils/common.js";

export default {
  components: { mercurySelect, BicMngDialog },
  props: [],
  data() {
    return {
      txCom: {
        //操作按钮 init-页面初始化, add-新增, mod-修改, del-删除, qry-查询, submit-经办提交, accept-复核提交, reject-驳回
        operationButton: "",
        //主表ID
        mainId: "",
        //交易码
        functionId: "recvrMng",
        //交易名称
        functionName: "供应商参数管理",
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
      visible: false,
      bicMngDialogVisible: false,
      saveButton: true,
      delButton: true,
      formDataList: [],
      formModel: {
        isShow: true,
        disabled: false,
      },
      formModel_Data: {
        id: undefined,
        recvrShortNm: undefined,
        groupNo: undefined,
        recvrAccNo: undefined,
        recvrName: undefined,
        recvrAddr: undefined,
        country: undefined,
        useAgentFlg: "N",
        agentBic: undefined,
        agentName: undefined,
        agentAccNo: undefined,
        recvrOpenBk: undefined,
        recvrOpenBknm: undefined,
        createUser: undefined,
        createTime: undefined,
        updateUser: undefined,
        updateTime: undefined,
      },
      formModel_Control: {
        recvrShortNm: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        groupNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrAccNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrName: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrAddr: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        country: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        useAgentFlg: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        agentBic: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        agentName: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        agentAccNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        recvrOpenBk: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrOpenBknm: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        createUser: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        createTime: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        updateUser: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        updateTime: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        bicMngAagentButton: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        bicMngAagentOpenAccountButton: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
      },
      formModel_Rules: {
        recvrShortNm: [
          {
            required: true,
            message: "请输入供应商简称",
            trigger: "blur",
          },
        ],
        groupNo: [
          {
            required: true,
            message: "请输入供应商组别",
            trigger: "blur",
          },
        ],
        recvrAccNo: [
          {
            required: true,
            message: "请输入收款人账号",
            trigger: "blur",
          },
        ],
        recvrName: [
          {
            required: true,
            message: "请输入收款人名称",
            trigger: "blur",
          },
        ],
        recvrAddr: [
          {
            required: false,
            message: "请输入收款人地址",
            trigger: "blur",
          },
        ],
        country: [
          {
            required: true,
            message: "请输入收款人常驻国家",
            trigger: "blur",
          },
        ],
        useAgentFlg: [
          {
            required: true,
            message: "请输入是否使用代理行",
            trigger: "blur",
          },
        ],
        agentBic: [
          {
            required: false,
            message: "请输入代理行银行代码",
            trigger: "blur",
          },
        ],
        agentName: [
          {
            required: false,
            message: "请输入代理行银行名称",
            trigger: "blur",
          },
        ],
        agentAccNo: [
          {
            required: false,
            message: "请输入收款银行在其代理行账号",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {
    "formModel_Data.useAgentFlg": {
      handler(nVal, oVal) {
        // 联动规则nVal:新值,oVal:旧值

        if (!oVal && !nVal) return;
        if (nVal && nVal === "Y") {
          this.formModel_Control.agentBic.disabled = false;
          this.formModel_Control.agentName.disabled = false;
          this.formModel_Control.agentAccNo.disabled = false;
          this.formModel_Rules.agentBic[0].required = true;
          this.formModel_Rules.agentName[0].required = true;
          this.formModel_Rules.agentAccNo[0].required = false;
          this.formModel_Control.bicMngAagentButton.disabled = false;
        } else {
          this.formModel_Control.agentBic.disabled = true;
          this.formModel_Control.agentName.disabled = true;
          this.formModel_Control.agentAccNo.disabled = true;
          this.formModel_Rules.agentBic[0].required = false;
          this.formModel_Rules.agentName[0].required = false;
          this.formModel_Rules.agentAccNo[0].required = false;
          this.formModel_Control.bicMngAagentButton.disabled = true;
          this.formModel_Data.agentBic = undefined;
          this.formModel_Data.agentName = undefined;
          this.formModel_Data.agentAccNo = undefined;
          this.$refs['formModel'].clearValidate(['agentBic'])
          this.$refs['formModel'].clearValidate(['agentName'])
          this.$refs['formModel'].clearValidate(['agentAccNo'])
        }
        if (this.txCom.operationButton && this.txCom.operationButton == "qry") {
          this.formModel_Control.agentBic.disabled = true;
          this.formModel_Control.agentName.disabled = true;
        }
      },
      deep: true,
    },
  },
  created() {},
  mounted() {
    const _this = this;
  },
  methods: {
    //保存提交 - 新增或修改
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
                    message: "新增供应商数据成功!",
                    type: "success",
                  });
                  //参数回传父页面 - 刷新父页面
                  this.$emit("closeDetailModel", "n", "y");
                  this.visible = false;
                }
              })
              .catch((e) => {
                this.$message.error("新增供应商数据失败!");
              });
          })
          .catch((_) => {});
      } else if (
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
                    message: "修改供应商数据成功!",
                    type: "success",
                  });

                  //参数回传父页面 - 刷新父页面
                  this.$emit("closeDetailModel", "n", "y");
                  this.visible = false;
                }
              })
              .catch((e) => {
                this.$message.error("修改供应商数据失败!");
              });
          })
          .catch((_) => {});
      } else {
        this.$message.error(
          "不可保存，当前操作[" + this.txCom.operationButton + "]非法!"
        );
      }
    },
    //删除提交处理
    commitDel() {
      this.$confirm("确认删除？")
        .then((_) => {
          deleteById(this.formModel_Data.id)
            .then((res) => {
              if (res.data.errorCode === "000000") {
                this.$message({
                  showClose: true,
                  showIcon: true,
                  center: true,
                  message: "删除供应商数据成功!",
                  type: "success",
                });
                //参数回传父页面 - 刷新父页面
                this.$emit("closeDetailModel", "n", "y");
                this.visible = false;
              }
            })
            .catch((e) => {
              this.$message.error("删除供应商数据失败!");
            });
        })
        .catch((_) => {});
    },

    //新增初始化 - 父页面调用传值
    addInit(operationButton) {
      this.visible = true;
      this.saveButton = true;
      this.delButton = false;
      this.txCom.operationButton = operationButton;
      //页面必输控制
      this.formModel_Data.useAgentFlg = "N";
    },
    //修改或查询 - 父页面调用传值
    modOrQry(row, operationButton) {
      this.visible = true;
      this.formModel_Data = row;
      this.txCom.operationButton = operationButton;
      //页面必输控制 - 查询时页面只读
      if (operationButton && operationButton === "qry") {
        this.saveButton = false;
        this.delButton = false;
        util.disableForm([this.formModel_Control]);
      } else {
        this.saveButton = true;
        this.delButton = true;
        this.formModel_Control.recvrShortNm.disabled = true;
      }
    },
    //点击关闭当前页面时处理
    handleClose() {
      if (this.txCom.operationButton && this.txCom.operationButton === "qry") {
        //查询模式下不需解锁，且不需刷新父页面数据
        var unlockFlg = "n";
        var refreshFlg = "n";
        //关闭当前页面
        this.visible = false;
        //参数回传父页面
        this.$emit("closeDetailModel", unlockFlg, refreshFlg);
      } else {
        this.$confirm("确认关闭？")
          .then((_) => {
            var unlockFlg = "y";
            var refreshFlg = "n";
            if (
              this.txCom.operationButton &&
              this.txCom.operationButton === "add"
            ) {
              //查询模式下不需解锁，且不需刷新父页面数据
              unlockFlg = "n";
            } else {
              //非查询模式下需解锁 且 需刷新父页面数据
              refreshFlg = "y";
            }
            //关闭当前页面
            this.visible = false;
            //参数回传父页面
            this.$emit("closeDetailModel", unlockFlg, refreshFlg);
          })
          .catch((_) => {});
      }
    },

    //查询收款行
    searchBicMng(type) {
      this.bicMngDialogVisible = true;
      var bankCode;
      var institutionName;

      if ("agent" == type) {
        bankCode = this.formModel_Data.agentBic;
        institutionName = this.formModel_Data.agentName;
      } else if ("openAccount" == type) {
        bankCode = this.formModel_Data.recvrOpenBk;
        institutionName = this.formModel_Data.recvrOpenBknm;
      }
      this.$nextTick(() => {
        this.$refs.bicMngDialog.init(type, bankCode, institutionName);
      });
    },
    //接收选择的查询收款行数据
    closeBicMngDialog(type, bankCode, institutionName) {
      this.bicMngDialogVisible = false;
      if ("agent" == type) {
        this.formModel_Data.agentBic = bankCode;
        this.formModel_Data.agentName = institutionName;
      } else if ("openAccount" == type) {
        this.formModel_Data.recvrOpenBk = bankCode;
        this.formModel_Data.recvrOpenBknm = institutionName;
      }
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
