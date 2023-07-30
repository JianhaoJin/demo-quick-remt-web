<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose"
    title="在途收款GPI明细"
    v-bind="$attrs"
    :visible.sync="visible"
    v-on="$listeners"
    :fullscreen="true"
  >
    <span slot="title">
      <div class="dialog-title"><span>在途收款GPI明细</span></div>
    </span>

    <el-form
        v-loading="listLoading"
        ref="formModel"
        :model="formModel_Data"
        :rules="formModel_Rules"
        :disabled="formModel.disabled"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="15">
          <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col
                v-if="formModel_Control.uetr.isShow"
                :span="8"
                :offset="3">
                <el-form-item label="GPI追踪号" prop="uetr">
                  <el-input
                    v-model="formModel_Data.uetr"
                    placeholder="GPI追踪号"
                    show-word-limit
                    :disabled="formModel_Control.uetr.disabled"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col
                v-if="formModel_Control.creditorName.isShow"
                :span="8"
                :offset="1">
                <el-form-item label="客户名称" prop="creditorName">
                  <el-input
                    v-model="formModel_Data.creditorName"
                    placeholder="客户名称"
                    show-word-limit
                    :disabled="formModel_Control.creditorName.disabled"
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
                v-if="formModel_Control.transactionStatus.isShow"
                :span="8"
                :offset="3"
              >
                <el-form-item label="交易状态" prop="transactionStatus">
                  <el-select v-model="formModel_Data.transactionStatus" placeholder="请选择当前状态">
                    <el-option
                      v-for="item in gpiStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                v-if="formModel_Control.crtDt.isShow"
                :span="8"
                :offset="1">
                <el-form-item label="汇款日期" prop="crtDt">
                  <el-date-picker
                    v-model="formModel_Data.crtDt"
                    format="yyyy-MM-dd"
                    value-format="yyyyMMdd"
                    :style="{ width: '100%' }"
                    placeholder="汇款日期"
                    clearable
                    :disabled="formModel_Control.crtDt.disabled"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" style="width: 100%">
            <el-row :gutter="25">
              <el-col
                v-if="formModel_Control.confirmedCurrency.isShow"
                :span="8"
                :offset="3">
                <el-form-item label="汇款币种" prop="confirmedCurrency">
                  <el-select v-model="formModel_Data.confirmedCurrency" placeholder="请选择收款币别">
                    <el-option
                      v-for="item in currencys"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                v-if="formModel_Control.confirmedAmount.isShow"
                :span="8"
                :offset="1">
                <el-form-item label="汇款金额" prop="confirmedAmount">
                  <bussiness-amt
                    :disable="formModel_Control.confirmedAmount.disabled"
                    :value="formModel_Data.confirmedAmount"
                    :precision="precision"
                    v-model="formModel_Data.confirmedAmount"
                    @inputmoney="inputmoney"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" style="width: 100%">
            <el-row :gutter="25">
              <el-col
                v-if="formModel_Control.instructedCurrency.isShow"
                :span="8"
                :offset="3">
                <el-form-item label="原始币种" prop="instructedCurrency">
                  <el-select v-model="formModel_Data.instructedCurrency" placeholder="请选择收款币别">
                    <el-option
                      v-for="item in currencys"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                v-if="formModel_Control.instructedAmount.isShow"
                :span="8"
                :offset="1">
                <el-form-item label="原始金额" prop="instructedAmount">
                  <bussiness-amt
                    :disable="formModel_Control.instructedAmount.disabled"
                    :value="formModel_Data.instructedAmount"
                    :precision="precision"
                    v-model="formModel_Data.instructedAmount"
                    @inputmoney="inputmoney"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col
                v-if="formModel_Control.debtorName.isShow"
                :span="8"
                :offset="3">
                <el-form-item label="汇款人名称" prop="debtorName">
                    <el-input
                      v-model="formModel_Data.debtorName"
                      placeholder="汇款人名称"
                      show-word-limit
                      :disabled="formModel_Control.debtorName.disabled"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                </el-form-item>
              </el-col>
              <el-col
                v-if="formModel_Control.country.isShow"
                :span="8"
                :offset="1">
                <el-form-item label="汇款国家/地区" prop="country">
                  <el-input
                    v-model="formModel_Data.country"
                    placeholder="汇款国家/地区"
                    show-word-limit
                    :disabled="formModel_Control.country.disabled"
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
                v-if="formModel_Control.creditorAccountIdentification.isShow"
                :span="8"
                :offset="3"
              >
                <el-form-item label="汇入账号" prop="creditorAccountIdentification">
                  <el-input
                    v-model="formModel_Data.creditorAccountIdentification"
                    placeholder="汇入账号"
                    show-word-limit
                    :disabled="formModel_Control.creditorAccountIdentification.disabled"
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
      <el-table
      :header-cell-style="{ background: 'rgb(255, 248, 220)' }"
      v-loading="listLoading"
      :data="queryList"
      border
      highlight-current-row
      height="calc(100vh - 550px)"
    >
      <el-table-column
        v-for="(th, key) in tableHeader"
        :show-overflow-tooltip="true"
        :fixed="key < 0"
        :key="key"
        :prop="th.prop"
        :formatter="th.formatter"
        :label="th.label"
        :min-width="th.width"
      ></el-table-column>
    </el-table>

    <!-- Pagination -->
    <!-- <div class="pagination-container">
      <el-pagination
        :current-page.sync="txCom.currentPage"
        :page-size="txCom.pageSize"
        :total="txCom.total"
        :page-sizes="txCom.pageSizes"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="currentPageChange"
        @size-change="pageSizeChange"
      />
    </div> -->
    <add-contracts
      v-if="addContractsDialogVisible"
      ref="addContracts"
      @closeAddContractsDialog="closeAddContractsDialog"
    />
    <span slot="footer">
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
import { checkDictItemCode } from "@/api/sysManagement/sysDictItemApi";
import BussinessAmt from "@/components/BussinessAmt";
import AddContracts from "@/components/AddContracts";
import * as constants from "@/utils/constant.js";
import { details } from "@/api/remt/irOpenGpiApi.js";
import util from "@/utils/common.js";
export default {
  components: { mercurySelect, BussinessAmt, AddContracts },
  props: [],
  data() {
    return {
      currencys: util.defaultCurrencys(),
      gpiStatus:util.defaultGpiStatus(),
      txCom: {
        //操作按钮 init-页面初始化, add-新增, mod-修改, del-删除, qry-查询, submit-经办提交, accept-复核提交, reject-驳回
        operationButton: "",
        //主表ID
        mainId: "",
        //交易码
        functionId: "irGroup",
        //交易名称
        functionName: "在途收款GPI查询",
        //当前页码
        currentPage: 1,
        //每页笔数
        pageSize: 10,
        //总页数
        pageSizes: constants.pageSizes,
        //总笔数
        total: 0,
        //当前行数据
        currRow: [],
      },
      /**
       * 表格翻译对象
       */
      statusMap: util.defaultMap("GpiStatus"),
      ccyMap: util.defaultMap("Currencys"),
      saveButton: true,
      delButton: true,
      precision: 2, // 精度
      visible: false,
      addContractsDialogVisible: false,
      operationType: "dialog",
      formDataList: ["formModel"],
      activeFormTab: "formModel",
      formModel: {
        isShow: true,
        disabled: false,
      },
      formModel_Data: {
        uetr: null,
        creditorName: undefined,
        transactionStatus: undefined,
        crtDt: undefined,
        debtorName: undefined,
        instructedCurrency: undefined,
        instructedAmount: undefined,
        creditorAccountIdentification: undefined,
        confirmedCurrency: undefined,
        confirmedAmount: undefined,
        country: undefined,
      },
      formModel_Control: {
        uetr: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
          },
          creditorName: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
          },
          transactionStatus: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
          },
          crtDt: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
          },
          debtorName: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
          },
          instructedCurrency: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
          },
          instructedAmount: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
          },
          creditorAccountIdentification: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
          },
          confirmedCurrency: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
          },
          confirmedAmount: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
          },
          country: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
          },
      },
      tableHeader: [
          {
            prop: "bankSwiftCode",
            label: "银行BIC",
            width: 120,
          },
          {
            prop: "bankType",
            label: "银行类型",
            width: 120,
          },
          {
            prop: "creditorName",
            label: "收款人名称",
            width: 120,
          },

          {
            prop: "status",
            label: "处理状态",
            width: 120,
            formatter: (_, column, cellValue, index) => {
              return this.statusFormat(cellValue);
            },
          },
          {
            prop: "confirmedTime",
            label: "处理时间",
            width: 120,
            formatter: (_, column, cellValue, index) => {
              return this.dateFormat(cellValue);
            },
          },
          {
            prop: "chargeCurCode",
            label: "手续费币种",
            width: 120,
            formatter: (_, column, cellValue, index) => {
              return this.ccyFormat(cellValue);
            },
          },
          {
            prop: "chargeAmt",
            label: "手续费金额",
            width: 120,
          },
        ],
      queryList: [],
      //表格加载状态
      listLoading: false,
      formModel_Rules: {
        uetr: [],
        creditorName: [],
        transactionStatus: [],
        crtDt: [],
        debtorName: [],
        instructedCurrency: [],
        instructedAmount: [],
        creditorAccountIdentification: [],
        confirmedCurrency: [],
        confirmedAmount: [],
        country: [],
      },  
    };
  },
  computed: {},
  watch: {},
  created() {},
  /**
   * mounted钩子函数，用于初始化数据
   */
  async mounted() {
    
  },
  methods: {
    statusFormat(key) {
      return this.statusMap[key];
    },
    ccyFormat(key){
      return this.ccyMap[key];
    },
    dateFormat(key){
      console.log("key:"+key);
      if(key != "" && key != undefined){
        var year = key.substring(0,4);
        var month = key.substring(4,6);
        var day = key.substring(6,8);
        var hour = key.substring(8,10);
        var min = key.substring(10,11);
        var second = key.substring(11,13);
        return year+"-"+month+"-"+day+" "+hour+":"+min+":"+second;
        return key.toString();
      }
    },
    // 金额币种
    inputmoney(value) {
      this.formModel_Data.remtAmt = value;
    },
    async findById(row){
      this.visible = true;
      this.listLoading = true;
      let data ={appKey: "",
        corpCode:util.parseERPParam("corpCode"),
        custId: util.parseERPParam("custId"),
        uetr: row.uetr
      }
      await details(data).then((res) => {
        console.log(res,'res');
        this.listLoading = false;
        if (res.data.retCode === "0000") {

          this.formModel_Data.uetr= res.data.data.uetr;
          this.formModel_Data.creditorName= res.data.data.rcvName;
          this.formModel_Data.transactionStatus= res.data.data.status;
          this.formModel_Data.crtDt= res.data.data.transDate;
          this.formModel_Data.debtorName= res.data.data.payName;
          this.formModel_Data.instructedCurrency= res.data.data.instructedCurCode;
          this.formModel_Data.instructedAmount= res.data.data.instructedAmt;
          this.formModel_Data.creditorAccountIdentification= res.data.data.rcvAcc;
          this.formModel_Data.confirmedCurrency= res.data.data.remitCur;
          this.formModel_Data.confirmedAmount= res.data.data.amt;
          this.formModel_Data.country= res.data.data.country;

          this.queryList = res.data.data.paymentEvent;
          for(var inx = 0; inx < this.queryList.length; inx++){
            this.queryList[inx].creditorName=res.data.data.rcvName;
          }
        } else {
          this.$message({
            center: true,
            showClose: true,
            showIcon: true,
            message: res.data.retMsg,
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
    /**
       * 当前页码发生变化的事件
       */
      currentPageChange() {
        this.getPageList();
      },

      /**
       * 页码总数发生变化的事件
       */
      pageSizeChange() {
        this.getPageList();
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
