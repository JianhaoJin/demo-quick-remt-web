<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose"
    title="应付订单管理新增"
    v-bind="$attrs"
    :visible.sync="visible"
    v-on="$listeners"
    :fullscreen="true"
  >
    <span slot="title">
      <div class="dialog-title"><span>应付订单管理新增</span></div>
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
              <el-form-item label="付款人" prop="payerName">
                <el-input
                  v-model="formModel_Data.payerName"
                  placeholder="请输入付款人"
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
              v-if="formModel_Control.recvrName.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="供应商名称" prop="recvrName">
                <el-input
                  v-model="formModel_Data.recvrName"
                  placeholder="请输入供应商名称"
                  show-word-limit
                  :disabled="formModel_Control.recvrName.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-button
                type="text"
                :disabled="formModel_Control.searchRecvrMngButton.disabled"
                @click.native="searchRecvrMng"
              >供应商选择</el-button
              >
            </el-col>

          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.recvrAddr.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="供应商地址" prop="recvrAddr">
                <el-input
                  v-model="formModel_Data.recvrAddr"
                  placeholder="请输入供应商地址"
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
              v-if="formModel_Control.goodsServices.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="货物/服务" prop="goodsServices">
                <el-input
                  v-model="formModel_Data.goodsServices"
                  placeholder="请输入货物/服务"
                  show-word-limit
                  :disabled="formModel_Control.goodsServices.disabled"
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
              v-if="formModel_Control.payCcy.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="应付币种" prop="payCcy">
                <mercurySelect
                  v-model="formModel_Data.payCcy"
                  :url="'/dict-item/REMT_REMT_CCY'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_REMT_CCY'"
                  placeholder="币种"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.orderAmt.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="订单金额" prop="orderAmt">
                <bussiness-amt
                  :precision="precision"
                  v-model="formModel_Data.orderAmt"
                  @inputmoney="inputmoneyOrderAmt"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row>
            <el-col
              v-if="formModel_Control.payDate.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="应付日期" prop="payDate">
                <el-date-picker
                  v-model="formModel_Data.payDate"
                  format="yyyyMMdd"
                  value-format="yyyyMMdd"
                  :style="{ width: '100%' }"
                  placeholder="请选择应付日期"
                  clearable
                  :disabled="formModel_Control.payDate.disabled"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row>
            <el-col
              v-if="formModel_Control.paidAmt.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="已支付金额" prop="paidAmt">
                <bussiness-amt
                  :disable="formModel_Control.paidAmt.disabled"
                  :precision="precision"
                  v-model="formModel_Data.paidAmt"
                  :value="formModel_Data.paidAmt"
                  @inputmoney="inputmoneyPaidAmt"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row>
            <el-col
              v-if="formModel_Control.bePaidAmt.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="待支付金额" prop="bePaidAmt">
                <bussiness-amt
                  :disable="formModel_Control.bePaidAmt.disabled"
                  :precision="precision"
                  v-model="formModel_Data.bePaidAmt"
                  :value="formModel_Data.bePaidAmt"
                  @inputmoney="inputmoneyBePaidAmt"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row>
            <el-col
              v-if="formModel_Control.payStatus.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="支付状态" prop="payStatus">
                <mercurySelect
                  v-model="formModel_Data.payStatus"
                  :disabled="formModel_Control.payStatus.disabled"
                  :url="'/dict-item/REMT_PAY_STATUS'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_PAY_STATUS'"
                  placeholder="请选择支付状态"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row>
            <el-col
              v-if="formModel_Control.contracts.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="合同号" prop="contracts">
                <el-input
                  v-model="formModel_Data.contracts"
                  placeholder="请输入合同号"
                  show-word-limit
                  :disabled="formModel_Control.contracts.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-button type="text" @click.native="addContracts('contract')"
                >添加合同号</el-button
              >
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row>
            <el-col
              v-if="formModel_Control.invoices.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="发票号" prop="invoices">
                <el-input
                  v-model="formModel_Data.invoices"
                  placeholder="请输入发票号"
                  show-word-limit
                  :disabled="formModel_Control.invoices.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-button type="text" @click.native="addContracts('invoice')"
                >添加发票号</el-button
              >
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
    <recvr-mng-dialog
      v-if="recvrMngDialogVisible"
      ref="recvrMngDialog"
      @closeRecvrMngDialog="closeRecvrMngDialog"
    />
    <span slot="footer">
      <el-tooltip
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
import { add } from "@/api/remt/orOrderApi";
import BussinessAmt from "@/components/BussinessAmt";
import AddContracts from "@/components/AddContracts";
import RecvrMngDialog from "../recvrMng/recvrMngDialog";
export default {
  components: { mercurySelect, BussinessAmt, AddContracts,RecvrMngDialog },
  props: [],
  data() {
    return {
      precision: 2, // 精度
      visible: false,
      addContractsDialogVisible: false,
      recvrMngDialogVisible: false,
      operationType: "dialog",
      operationButton: undefined,
      formDataList: ["formModel"],
      activeFormTab: "formModel",
      formModel: {
        isShow: true,
        disabled: false,
      },
      formModel_Data: {
        payerName: undefined,
        recvrName: undefined,
        recvrAddr: undefined,
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
        recvrName: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        searchRecvrMngButton: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrAddr: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        goodsServices: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        payCcy: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        orderAmt: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        payDate: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        paidAmt: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        bePaidAmt: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        payStatus: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        contracts: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        invoices: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        field193: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
          url: undefined,
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
            message: "请输入付款人",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入付款人",
            trigger: "change",
          },
        ],
        recvrName: [
          {
            required: true,
            message: "请输入供应商名称",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入供应商名称",
            trigger: "change",
          },
        ],
        recvrAddr: [],
        goodsServices: [
          {
            required: true,
            message: "请输入货物/服务",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入货物/服务",
            trigger: "change",
          },
        ],
        payCcy: [
          {
            required: true,
            message: "请输入应付币种",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入应付币种",
            trigger: "change",
          },
        ],
        orderAmt: [
          {
            required: true,
            message: "请输入订单金额",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入订单金额",
            trigger: "change",
          },
        ],
        payDate: [
          {
            required: true,
            message: "请输入应付日期",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入应付日期",
            trigger: "change",
          },
        ],
        paidAmt: [
          {
            required: false,
            message: "请输入已支付金额",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入已支付金额",
            trigger: "change",
          },
        ],
        bePaidAmt: [
          {
            required: false,
            message: "请输入待支付金额",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入待支付金额",
            trigger: "change",
          },
        ],
        payStatus: [
          {
            required: false,
            message: "请输入支付状态",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入支付状态",
            trigger: "change",
          },
        ],
        contracts: [],
        invoices: [],
      },
    };
  },
  computed: {},
  watch: {
    "formModel_Data.orderAmt": {
      handler(nVal, oVal) {
        // 联动规则nVal:新值,oVal:旧值
        if (oVal === undefined && nVal === undefined) return;
        if (nVal) {
          this.formModel_Data.bePaidAmt = nVal;
          this.formModel_Data.paidAmt = 0;
        }
      },
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    commitSave() {
      this.$confirm("确认新增？")
        .then((_) => {
          let data = {
            functionId: "orOpenOrder",
            operationButton: "add",
          };

          add(Object.assign({}, this.formModel_Data, data))
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
    },
    // 金额币种
    inputmoneyOrderAmt(value) {
      this.formModel_Data.orderAmt = value;
    },
    inputmoneyPaidAmt(value) {
      this.formModel_Data.paidAmt = value;
    },
    inputmoneyBePaidAmt(value) {
      this.formModel_Data.bePaidAmt = value;
    },

    init(operationButton) {
      console.log("this.feeShow", this.feeShow);
      this.visible = true;
      this.operationButton = operationButton;
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

    //供应商查询
    searchRecvrMng() {
      this.recvrMngDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.recvrMngDialog.init(
          "",
          this.formModel_Data.recvrName,
          ""
        );
      });
    },
//接收供应商查询数据
    closeRecvrMngDialog(
      currRow) {
      this.recvrMngDialogVisible = false;
      this.formModel_Data.recvrName = currRow.recvrName;
      this.formModel_Data.recvrAddr = currRow.recvrAddr;
    },

    //合同号添加
    addContracts(type) {
      this.addContractsDialogVisible = true;
      this.$nextTick(() => {
        var value;
        if ("contract" == type) {
          value = this.formModel_Data.contracts;
        } else if ("invoice" == type) {
          value = this.formModel_Data.invoices;
        }
        this.$refs.addContracts.init(value, type);
      });
    },

    closeAddContractsDialog(contractString, type) {
      if ("contract" == type) {
        this.formModel_Data.contracts = contractString;
      } else if ("invoice" == type) {
        this.formModel_Data.invoices = contractString;
      }
      this.addContractsDialogVisible = false;
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
