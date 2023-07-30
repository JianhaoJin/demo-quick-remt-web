<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose"
    title="应收订单管理明细"
    v-bind="$attrs"
    :visible.sync="visible"
    v-on="$listeners"
    :fullscreen="true"
  >
    <span slot="title">
      <div class="dialog-title"><span>应收订单管理明细</span></div>
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
              v-if="formModel_Control.orderNo.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="订单号" prop="orderNo">
                <el-input
                  v-model="formModel_Data.orderNo"
                  placeholder="请输入订单号"
                  show-word-limit
                  :disabled="formModel_Control.orderNo.disabled"
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
              <el-form-item label="收款人" prop="recvrName">
                <el-input
                  v-model="formModel_Data.recvrName"
                  placeholder="请输入收款人"
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
              v-if="formModel_Control.payerName.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="采购商名称" prop="payerName">
                <el-input
                  v-model="formModel_Data.payerName"
                  placeholder="请输入采购商名称"
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
              v-if="formModel_Control.recvCcy.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="应收币种" prop="recvCcy">
                <mercurySelect
                  v-model="formModel_Data.recvCcy"
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
                  :value="formModel_Data.orderAmt"
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
              v-if="formModel_Control.recvDate.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="应收日期" prop="recvDate">
                <el-date-picker
                  v-model="formModel_Data.recvDate"
                  format="yyyyMMdd"
                  value-format="yyyyMMdd"
                  :style="{ width: '100%' }"
                  placeholder="请选择应收日期"
                  clearable
                  :disabled="formModel_Control.recvDate.disabled"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row>
            <el-col
              v-if="formModel_Control.recvedAmt.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="已收款金额" prop="recvedAmt">
                <bussiness-amt
                  :disable="formModel_Control.recvedAmt.disabled"
                  :value="formModel_Data.recvedAmt"
                  :precision="precision"
                  v-model="formModel_Data.recvedAmt"
                  @inputmoney="inputmoneyRecvedAmt"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row>
            <el-col
              v-if="formModel_Control.beRecvAmt.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="待收款金额" prop="beRecvAmt">
                <bussiness-amt
                  :disable="formModel_Control.beRecvAmt.disabled"
                  :value="formModel_Data.beRecvAmt"
                  :precision="precision"
                  v-model="formModel_Data.beRecvAmt"
                  @inputmoney="inputmoneyBeRecvAmt"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row>
            <el-col
              v-if="formModel_Control.recvStatus.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="收款状态" prop="recvStatus">
                <mercurySelect
                  v-model="formModel_Data.recvStatus"
                  :disabled="formModel_Control.recvStatus.disabled"
                  :url="'/dict-item/REMT_RECV_STATUS'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_RECV_STATUS'"
                  placeholder="请选择收款状态"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.recvRate.isShow"
              :span="8"
              :offset="8"
            >
              <el-form-item label="收款进度" prop="recvRate">
                <el-input
                  v-model="formModel_Data.recvRate"
                  placeholder="请输入收款进度"
                  show-word-limit
                  :disabled="formModel_Control.recvRate.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" :offset="0">
              <el-button
                type="text"
              >%</el-button
              >
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
import { details, update, deleteInfo,add } from "@/api/remt/irOrderApi";
import BussinessAmt from "@/components/BussinessAmt";
import AddContracts from "@/components/AddContracts";
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
      saveButton: true,
      delButton: true,
      precision: 2, // 精度
      visible: false,
      isAddWatch: true,
      addContractsDialogVisible: false,
      formDataList: ["formModel"],
      activeFormTab: "formModel",
      formModel: {
        isShow: true,
        disabled: false,
      },
      formModel_Data: {
        orderNo: "",
        recvrName: undefined,
        payerName: undefined,
        goodsServices: undefined,
        recvCcy: undefined,
        orderAmt: undefined,
        recvDate: null,
        recvedAmt: undefined,
        beRecvAmt: undefined,
        recvStatus: undefined,
        recvRate: undefined,
        contracts: undefined,
        invoices: undefined,
      },
      formModel_Control: {
        orderNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        recvrName: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        payerName: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },

        goodsServices: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvCcy: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        orderAmt: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvDate: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvedAmt: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        beRecvAmt: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvStatus: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvRate: {
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
        field192: {
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
        orderNo: [],
        recvrName: [
          {
            required: true,
            message: "请输入收款人",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入收款人",
            trigger: "change",
          },
        ],
        payerName: [
          {
            required: true,
            message: "请输入采购商名称",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入采购商名称",
            trigger: "change",
          },
        ],

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
        recvCcy: [
          {
            required: true,
            message: "请输入应收币种",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入应收币种",
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
        recvDate: [
          {
            required: true,
            message: "请输入应收日期",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入应收日期",
            trigger: "change",
          },
        ],
        recvedAmt: [
          {
            required: true,
            message: "请输入已收款金额",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入已收款金额",
            trigger: "change",
          },
        ],
        beRecvAmt: [
          {
            required: true,
            message: "请输入待收款金额",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入待收款金额",
            trigger: "change",
          },
        ],
        recvStatus: [
          {
            required: true,
            message: "请输入收款状态",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入收款状态",
            trigger: "change",
          },
        ],
        recvRate: [
          {
            required: false,
            message: "请输入收款进度",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入收款进度",
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

        if (!this.isAddWatch) {
          if (nVal) {
            var orderAmt = nVal;
            var recvedAmt = this.formModel_Data.recvedAmt;
            var recvRate = (recvedAmt/orderAmt).toFixed(2) * 100;
            this.formModel_Data.recvRate = recvRate;
          }
        }else {
          if (nVal) {
            this.formModel_Data.beRecvAmt = nVal;
            this.formModel_Data.recvedAmt = 0;
          }
        }

      },
      deep: true,
    },
    "formModel_Data.recvedAmt": {
      handler(nVal, oVal) {
       /* debugger
        if (this.isAddWatch) {
          return;
        }*/
        // 联动规则nVal:新值,oVal:旧值
        if (oVal === undefined && nVal === undefined) return;
        if (nVal) {
          var recvedAmt = nVal;
         var orderAmt = this.formModel_Data.orderAmt;
          var recvRate = (recvedAmt/orderAmt).toFixed(2) * 100;
          this.formModel_Data.recvRate = recvRate;

        }
      },
      deep: true,
    },

  },
  created() {},
  mounted() {},
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
                    message: "新增应收订单管理数据成功!",
                    type: "success",
                  });
                  //参数回传父页面 - 刷新父页面
                  this.$emit("closeDetailModel");
                  this.visible = false;
                }
              })
              .catch((e) => {
                this.$message.error("新增应收订单管理数据失败!");
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
    // 金额币种
    inputmoneyOrderAmt(value) {
      this.formModel_Data.orderAmt = value;
    },
    inputmoneyRecvedAmt(value) {
      this.formModel_Data.recvedAmt = value;
    },
    inputmoneyBeRecvAmt(value) {
      this.formModel_Data.beRecvAmt = value;
    },
    addInit(operationButton) {
      this.visible = true;
      this.saveButton = true;
      this.delButton = false;
      this.txCom.operationButton = operationButton;
      this.formModel_Control.beRecvAmt.disabled = true;
      this.formModel_Control.recvedAmt.disabled = true;
      this.formModel_Control.recvStatus.disabled = true;
      this.formModel_Data.recvStatus = "0";
      this.formModel_Data.recvRate = "0";
    },

    deleteOrUpdate(row,operationButton) {
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
