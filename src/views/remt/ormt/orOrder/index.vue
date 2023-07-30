<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
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
                v-if="formModel_Control.payDate.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="应付日期：" prop="payDate">
                  <el-date-picker
                    type="daterange"
                    v-model="formModel_Data.payDate"
                    format="yyyy-MM-dd"
                    value-format="yyyyMMdd"
                    :style="{ width: '100%' }"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    range-separator="至"
                    clearable
                    :disabled="formModel_Control.payDate.disabled"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col
                v-if="formModel_Control.bePaidAmt.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="待支付金额：" prop="bePaidAmt">
                  <amt-range
                    v-model="formModel_Data.bePaidAmt"
                    @input="bePaidAmtInput"
                    @changefrom="changefrom"
                  >
                  </amt-range>
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
                <el-form-item label="汇款人：" prop="payerName">
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
                v-if="formModel_Control.recvrName.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="供应商：" prop="recvrName">
                  <el-input
                    v-model="formModel_Data.recvrName"
                    placeholder="请输入供应商"
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
                v-if="formModel_Control.orderNo.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="订单号：" prop="orderNo">
                  <el-input
                    v-model="formModel_Data.orderNo"
                    placeholder="请输入供应商订单号"
                    show-word-limit
                    :disabled="formModel_Control.orderNo.disabled"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col
                v-if="formModel_Control.payStatus.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="支付状态：" prop="payStatus">
                  <mercurySelect
                    v-model="formModel_Data.payStatus"
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
            <el-row :gutter="15">
              <el-col
                v-if="!txCom.dialogFlg"
                :span="2"
                :offset="txCom.dialogFlg ? 0 : 8"
              >
                <el-form-item>
                  <el-button
                    round
                    @click.native="formModel_addOrderClickHandler"
                    v-permission="'orOrder:add'"
                    >新增订单</el-button
                  >
                </el-form-item>
              </el-col>

              <el-col :span="2"
                :offset="txCom.dialogFlg ? 10 : 0">
                <el-form-item>
                  <el-button
                    type="primary"
                    round
                    :style="{ width: '100px' }"
                    icon="el-icon-refresh"
                    @click="resetFilterQuery"
                  >重置</el-button>
                </el-form-item>
              </el-col>

              <el-col :span="2" 
                :offset="txCom.dialogFlg ? 0 : 0">
                <el-form-item>
                  <el-button
                    type="warning"
                    round
                    :style="{ width: '100px' }"
                    @click.native="formModel_field142ClickHandler"
                    >查询</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      :header-cell-style="{ background: 'rgb(255, 248, 220)' }"
      v-loading="listLoading"
      :data="queryList"
      border
      @row-click="getCurrentRow"
      @row-dblclick="returnDataForDialog"
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
    <div class="pagination-container">
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
    </div>

    <or-order-delete-or-update
      v-if="deleteOrUpdateVisible"
      ref="deleteOrUpdate"
      @closeDetailModel="detailsModelClose"
    />
    <or-order-add
      v-if="addVisible"
      ref="orderAdd"
      @closeDetailModel="detailsModelClose"
    />
  </div>
</template>
<script>
import mercurySelect from "@/components/MercurySelect";
import OrOrderDeleteOrUpdate from "./orOrderDeleteOrUpdate";
import OrOrderAdd from "./orOrderAdd";
import { checkDictItemCode } from "@/api/sysManagement/sysDictItemApi";
import { pageList, add } from "@/api/remt/orOrderApi";
import AmtRange from "@/components/AmtRange";
import * as Constant from "@/utils/constant.js";
import util from "@/utils/common.js";
import vue from "@/main";

export default {
  name: "orOrder",
  components: {
    mercurySelect,
    OrOrderDeleteOrUpdate,
    OrOrderAdd,
    AmtRange,
  },
  props: [],
  data() {
    return {
      // 前台公共数据定义：
      txCom: {
        //操作按钮 init-页面初始化, add-新增, mod-修改, del-删除, qry-查询, submit-经办提交, accept-复核提交, reject-驳回
        operationButton: "",
        //主表ID
        mainId: "",
        //交易码
        functionId: "orOpenOrder",
        //交易名称
        functionName: "应付订单管理",
        //当前页码
        currentPage: 1,
        //每页笔数
        pageSize: 10,
        //总页数
        pageSizes: Constant.pageSizes,
        //总笔数
        total: 0,
        //弹窗标志
        dialogFlg: false,
        //动态高度
        pageHeight: "calc(100vh - 550px)",
        //当前行数据
        currRow: [],
      },
      payStatusMap: {},
      formDataList: ["formModel"],
      activeFormTab: "formModel",
      formModel: {
        isShow: true,
        disabled: false,
      },
      formModel_Data: {
        payDate: [],
        bePaidAmt: [],
        recvrName: undefined,
        orderNo: undefined,
        payStatus: undefined,
        payDateSt: undefined,
        payDateEd: undefined,
        bePaidSt: undefined,
        bePaidEd: undefined,
      },
      formModel_Control: {
        payDate: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        bePaidAmt: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
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
        orderNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        payStatus: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        addOrder: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
          url: undefined,
        },
        field142: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
          url: undefined,
        },
        batchImport: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
          url: undefined,
        },
        batchExport: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
          url: undefined,
        },
      },

      tableHeader: [
        {
          prop: "orderNo",
          label: "订单号",
          width: 120,
        },
        {
          prop: "payerName",
          label: "汇款人",
          width: 120,
        },
        {
          prop: "recvrName",
          label: "供应商",
          width: 120,
        },
        {
          prop: "payCcy",
          label: "应付币种",
          width: 120,
        },
        {
          prop: "orderAmt",
          label: "订单金额",
          width: 120,
        },
        {
          prop: "payDate",
          label: "应付日期",
          width: 120,
          formatter: (_, column, cellValue, index) => {
            return this.payDateFormat(cellValue);
          },
        },
        {
          prop: "paidAmt",
          label: "已支付金额",
          width: 120,
        },
        {
          prop: "bePaidAmt",
          label: "待支付金额",
          width: 120,
        },
        {
          prop: "payStatus",
          label: "支付状态",
          width: 120,
          formatter: (_, column, cellValue, index) => {
            return this.payStatusFormat(cellValue);
          },
        },
        {
          prop: "createTime",
          label: "创建时间",
          width: 150,
        },
      ],
      queryList: [],
      formModel_Rules: {
        payDate: [],
        bePaidAmt: [],
        payerName: [],
        recvrName: [],
        orderNo: [],
        payStatus: [],
      },
      //表格加载状态
      listLoading: false,
      //新增应付订单管理删除修改页面按钮
      deleteOrUpdateVisible: "",
      addVisible: "",
    };
  },
  computed: {},
  watch: {
    "formModel_Data.payDate": {
      handler(val) {
        console.log("payDate", val);
        if (val === "" || val === null || val == undefined) {
          this.formModel_Data.payDateSt = undefined;
          this.formModel_Data.payDateEd = undefined;
          return;
        }
        this.formModel_Data.payDateSt = val[0];
        this.formModel_Data.payDateEd = val[1];
      },
    },

    "formModel_Data.bePaidAmt": {
      handler(val) {
        console.log("bePaidAmt", val);
        if (val === "" || val === null || val == undefined) {
          this.formModel_Data.bePaidSt = undefined;
          this.formModel_Data.bePaidEd = undefined;
          return;
        }
        this.formModel_Data.bePaidSt = val[0];
        this.formModel_Data.bePaidEd = val[1];
      },
    },
  },
  created() {},
  async mounted() {
    await checkDictItemCode("REMT_PAY_STATUS").then((response) => {
      if (response.data.errorCode === "000000") {
        response.data.data.forEach((element) => {
          this.payStatusMap[element.code] = element.name;
        });
      }
    });
    this.init();
    this.getPageList();
  },
  methods: {
    init() {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      let endStr = util.timestampToTime(end, "yyyyMMdd");
      let startStr = util.timestampToTime(start, "yyyyMMdd");
      this.formModel_Data.payDate = [startStr, endStr];
      this.formModel_Data.bePaidAmt = [0.00,999999999.00];
      this.formModel_Data.payDateSt = startStr;
      this.formModel_Data.payDateEd = endStr;
      this.formModel_Data.bePaidSt = 0.00;
      this.formModel_Data.bePaidEd = 999999999.00;
    },
    payStatusFormat(key) {
      return this.payStatusMap[key];
    },
    payDateFormat(key) {
      return key.substring(0,10);
    },
    bePaidAmtInput(userInputForm) {
      this.formModel_Data.bePaidAmt = userInputForm;
    },
    changefrom(userInputTo) {
      this.formModel_Data.bePaidAmt = userInputTo;
    },

    getPageList() {
      this.listLoading = true;
      pageList(Object.assign({}, this.txCom, this.formModel_Data)).then(
        (res) => {
          this.listLoading = false;
          if (res.data.errorCode === "000000") {
            this.queryList = res.data.data.records;
            this.txCom.total = res.data.data.total;
          } else {
            this.$message({
              center: true,
              showClose: true,
              showIcon: true,
              message: res.data.errMsg,
              type: "error",
            });
          }
        }
      );
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

    formModel_addOrderClickHandler() {
      this.addVisible = true;
      this.$nextTick(() => {
        this.$refs.orderAdd.init("add");
      });
    },
    formModel_field142ClickHandler() {
      this.txCom.currentPage = 1;
      this.getPageList();
    },
    dbClickHandler(row) {
      this.formModel_field170ClickHandler(row);
    },
    formModel_field170ClickHandler(row) {
      this.deleteOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.deleteOrUpdate.init("deleteOrUpdate", row);
      });
    },


    //重置
    resetFilterQuery(){
      this.$refs['formModel'].resetFields()
      this.init();
    },


    /**
     * 关闭详情模态框
     */
    detailsModelClose() {
      this.deleteOrUpdateVisible = false;
      this.addVisible = false;
      this.getPageList();
    },

    /**
     * 表格单击时取表格当前行数据
     */
    getCurrentRow(row) {
      if (row) {
        this.txCom.currRow = row;
      }
    },
    /**
     * 表格双击时返回当前数据给父页面
     */
    returnDataForDialog(row) {
      if (!this.txCom.currRow) {
        this.$message({
          center: true,
          showClose: true,
          showIcon: true,
          message: "请选择订单数据!",
          type: "error",
        });
        return;
      }
      if (this.txCom.dialogFlg) {
        //弹窗
        this.$emit(
          "closeOrOrderDialog",
          this.txCom.currRow);
      } else {
        //双击打开修改和删除页面
        this.dbClickHandler(row);
      }
    },

    //新增初始化 - 父页面调用传值
    dialogInit(orderNo, payerName) {
      this.txCom.operationButton = "qry";
      this.txCom.dialogFlg = true;
      this.txCom.pageHeight = "calc(100vh - 500px)";
      this.formModel_Data.orderNo = orderNo;
      vue.$set(this.formModel_Data, "payerName", payerName);
      this.getPageList();
    },
  },
};
</script>
<style scoped>
</style>
