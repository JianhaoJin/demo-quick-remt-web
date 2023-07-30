<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose"
    title="核销操作页面"
    v-bind="$attrs"
    :visible.sync="visible"
    v-on="$listeners"
    :fullscreen="true"
  >
    <span slot="title">
      <div class="dialog-title"><span>核销操作页面</span></div>
    </span>
    <el-form
      ref="formModel"
      :model="formModel_Data"
      :rules="formModel_Rules"
      :disabled="formModel.disabled"
      label-width="90px"
      label-position="right"
    >
      <el-row :gutter="15">
        <el-col :span="24" style="width: 49%">
          <el-row>
            <el-col
              v-if="formModel_Control.refNo.isShow"
              :span="12"
              :offset="0"
            >
              <el-form-item label="业务编号" prop="refNo">
                <el-input
                  v-model="formModel_Data.refNo"
                  placeholder="请输入业务编号"
                  show-word-limit
                  :disabled="formModel_Control.refNo.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              v-if="formModel_Control.remtAmtRange.isShow"
              :span="12"
              :offset="0"
            >
              <el-form-item label="金额" prop="remtAmtRange">
                <!-- <el-input
                  v-model="formModel_Data.remtAmtRange"
                  placeholder="请输入金额"
                  show-word-limit
                  :disabled="formModel_Control.remtAmtRange.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input> -->
                <amt-range
                  v-model="formModel_Data.remtAmtRange"
                  @input="remtAmtInput"
                >
                </amt-range>
              </el-form-item>
            </el-col>
            <el-col
              v-if="formModel_Control.debtorNm.isShow"
              :span="12"
              :offset="0"
            >
              <el-form-item label="汇款人" prop="debtorNm">
                <el-input
                  v-model="formModel_Data.debtorNm"
                  placeholder="请输入汇款人"
                  show-word-limit
                  :disabled="formModel_Control.debtorNm.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              v-if="formModel_Control.txDtRange.isShow"
              :span="12"
              :offset="0"
            >
              <el-form-item label="交易日期" prop="txDtRange">
                <el-date-picker
                  type="daterange"
                  v-model="formModel_Data.txDtRange"
                  format="yyyy-MM-dd"
                  value-format="yyyyMMdd"
                  :style="{ width: '100%' }"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至"
                  clearable
                  :disabled="formModel_Control.txDtRange.disabled"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" :offset="10">
              <el-form-item>
                <el-button
                  type="primary"
                  round
                  :style="{ width: '100px' }"
                  icon="el-icon-refresh"
                  @click="resetLeftQuery"
                >重置</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="2" :offset="2">
              <el-form-item>
                <el-button
                  type="warning"
                  round
                  :style="{ width: '100px' }"
                  @click="irOpenQrysearch"
                  >查询</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>

          <el-table
            ref="leftList_searchResult"
            v-loading="leftListLoading"
            :data="leftList"
            border
            fit
            highlight-current-row
            style="width: 100%"
            :header-cell-style="{ background: 'rgb(255, 248, 220)' }"
            height="calc(100vh - 500px)"
            @row-click="leftListRowClickChange"
            @cell-dblclick="leftTableDbEdit"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              align="center"
              label="业务编号"
              prop="refNo"
              width="120"
            />
            <el-table-column align="center" label="币种金额" width="100">
              <template slot-scope="{ row }">
                <span>{{ row.remtCcy + row.remtAmt }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in leftTableHeader"
              :key="index"
              align="center"
              :show-overflow-tooltip="true"
              :prop="item.prop"
              :min-width="item.width"
              :label="item.label"
              :formatter="item.formatter"
            />

            <el-table-column
              min-width="100px"
              align="center"
              label="本次核销金额"
              prop="currWriteOffAmt"
            >
              <template slot-scope="{ row }">
                <template v-if="row.currWriteOffAmtEdit">
                  <el-input
                    @keyup.enter.native="currWriteOffAmtChange(row)"
                    @change="currWriteOffAmtChange(row)"
                    v-model="row.currWriteOffAmt"
                    class="edit-input"
                    size="small"
                  />
                </template>
                <span style="color: red" v-else>{{ row.currWriteOffAmt }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- Pagination -->
          <div class="pagination-container">
            <el-pagination
              :current-page.sync="irOpenQryTxCom.currentPage"
              :page-size="irOpenQryTxCom.pageSize"
              :page-sizes="irOpenQryTxCom.pageSizes"
              :total="irOpenQryTxCom.total"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="irOpenQryCurrentPageChange"
              @size-change="irOpenQryPageSizeChange"
            />
          </div>
        </el-col>
        <el-col :span="24" style="width: 2%; height: 200px">
          <el-divider direction="vertical" />
        </el-col>
        <el-col :span="24" style="width: 49%">
          <el-row>
            <el-col
              v-if="formModel_Control.orderNo.isShow"
              :span="12"
              :offset="0"
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
            <el-col
              v-if="formModel_Control.beRecvAmtRange.isShow"
              :span="12"
              :offset="0"
            >
              <el-form-item label="金额" prop="beRecvAmtRange">
                <amt-range
                  v-model="formModel_Data.beRecvAmtRange"
                  @input="beRecvAmtRangeInput"
                >
                </amt-range>
              </el-form-item>
            </el-col>
            <el-col
              v-if="formModel_Control.payerName.isShow"
              :span="12"
              :offset="0"
            >
              <el-form-item label="采购商" prop="payerName">
                <el-input
                  v-model="formModel_Data.payerName"
                  placeholder="请输入采购商"
                  show-word-limit
                  :disabled="formModel_Control.payerName.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              v-if="formModel_Control.orderQryDtRange.isShow"
              :span="12"
              :offset="0"
            >
              <el-form-item label="应收日期" prop="orderQryDtRange">
                <el-date-picker
                  type="daterange"
                  v-model="formModel_Data.orderQryDtRange"
                  format="yyyy-MM-dd"
                  value-format="yyyyMMdd"
                  :style="{ width: '100%' }"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至"
                  clearable
                  :disabled="formModel_Control.orderQryDtRange.disabled"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" :offset="10">
              <el-form-item>
                <el-button
                  type="primary"
                  round
                  :style="{ width: '100px' }"
                  icon="el-icon-refresh"
                  @click="resetRightQuery"
                >重置</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="2" :offset="2">
              <el-form-item>
                <el-button
                  type="warning"
                  round
                  :style="{ width: '100px' }"
                  @click="irOrderSearch"
                  >查询</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-table
            ref="rightList_searchResult"
            v-loading="rightListLoading"
            :data="rightList"
            border
            fit
            highlight-current-row
            style="width: 100%"
            :header-cell-style="{ background: 'rgb(255, 248, 220)' }"
            height="calc(100vh - 500px)"
            @row-click="rightListRowClickChange"
            @cell-dblclick="rightTableDbEdit"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              align="center"
              label="订单号"
              prop="orderNo"
              width="120"
            />
            <el-table-column align="center" label="订单金额" width="100">
              <template slot-scope="{ row }">
                <span>{{ row.recvCcy + row.orderAmt }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in rightTableHeader"
              :key="index"
              align="center"
              :show-overflow-tooltip="true"
              :prop="item.prop"
              :min-width="item.width"
              :label="item.label"
              :formatter="item.formatter"
            />

            <el-table-column
              min-width="100px"
              align="center"
              label="本次收款金额"
              prop="currRecvAmt"
            >
              <template slot-scope="{ row }">
                <template v-if="row.currRecvAmtEdit">
                  <el-input
                    @keyup.enter.native="currRecvAmtChange(row)"
                    @change="currRecvAmtChange(row)"
                    v-model="row.currRecvAmt"
                    class="edit-input"
                    size="small"
                  />
                </template>
                <span style="color: red" v-else>{{ row.currRecvAmt }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- Pagination -->
          <div class="pagination-container">
            <el-pagination
              :current-page.sync="irOrderTxCom.currentPage"
              :page-size="irOrderTxCom.pageSize"
              :page-sizes="irOrderTxCom.pageSizes"
              :total="irOrderTxCom.total"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="irOrderCurrentPageChange"
              @size-change="irOrderPageSizeChange"
            />
          </div>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button
        v-loading="confirmWriteOfftLoading"
        type="warning"
        @click.native="confirmWriteOff"
        >确认核销</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import vue from "@/main";
import * as irOpenQryApi from "@/api/remt/irOpenQryApi";
import * as irOrderApi from "@/api/remt/irOrderApi";
import util from "@/utils/common.js";
import * as constants from "@/utils/constant.js";
import AmtRange from "@/components/AmtRange";
import { toFormAmt } from "@/utils/validate.js";
export default {
  components: { AmtRange, toFormAmt },
  props: [],
  data() {
    return {
      visible: false,
      // 前台公共数据定义：
      irOpenQryTxCom: {
        //操作按钮 init-页面初始化, add-新增, mod-修改, del-删除, qry-查询, submit-经办提交, accept-复核提交, reject-驳回
        operationButton: "",
        //主表ID
        mainId: "",
        //交易码
        functionId: "irOpenQry",
        //交易名称
        functionName: "汇入汇款查询",
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
      // 前台公共数据定义：
      irOrderTxCom: {
        //操作按钮 init-页面初始化, add-新增, mod-修改, del-删除, qry-查询, submit-经办提交, accept-复核提交, reject-驳回
        operationButton: "",
        //主表ID
        mainId: "",
        //交易码
        functionId: "irOrder",
        //交易名称
        functionName: "应付订单查询",
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
      leftList: [],
      leftListLoading: false,
      rightList: [],
      rightListLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
      },
      confirmWriteOfftLoading: false,
      //表格表头
      leftTableHeader: [
        {
          label: "汇款人",
          prop: "debtorNm",
          width: "100px",
        },
        {
          label: "收款人",
          prop: "recvrNm",
          width: "100px",
        },
        {
          label: "交易日期",
          prop: "txDt",
          width: "100px",
        },
        {
          label: "附言",
          prop: "remtRemark",
          width: "100px",
        },
        {
          label: "待核销金额",
          prop: "beWriteOffAmt",
          width: "100px",
        },
      ],
      rightTableHeader: [
        {
          label: "收款人",
          prop: "recvrName",
          width: "100px",
        },
        {
          label: "采购商",
          prop: "payerName",
          width: "100px",
        },
        {
          label: "应收日期",
          prop: "recvDate",
          width: "100px",
        },
        {
          label: "待收款金额",
          prop: "beRecvAmt",
          width: "100px",
        },
      ],
      formDataList: ["formModel"],
      activeFormTab: "formModel",
      formModel: {
        isShow: true,
        disabled: false,
      },
      formModel_Data: {
        refNo: undefined,
        remtAmtRange: undefined,
        debtorNm: undefined,
        txDtRange: null,
        orderNo: undefined,
        beRecvAmtRange: undefined,
        payerName: undefined,
        orderQryDtRange: null,
        txDtSt: undefined,
        txDtEd: undefined,
        remtAmtSt: undefined,
        remtAmtEd: undefined,
        beRecvAmtSt: undefined,
        beRecvAmtEd: undefined,
      },
      formModel_Control: {
        refNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        remtAmtRange: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        debtorNm: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        txDtRange: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        orderNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        beRecvAmtRange: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        payerName: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        orderQryDtRange: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
      },
      formModel_Rules: {
        refNo: [],
        remtAmtRange: [],
        debtorNm: [],
        txDtRange: [],
        orderNo: [],
        beRecvAmtRange: [],
        payerName: [],
        orderQryDtRange: [],
      },
    };
  },
  computed: {},
  watch: {
    "formModel_Data.txDtRange": {
      handler(val) {
        console.log("txDtRange", val);
        if (val === "" || val === null || val == undefined) {
          this.formModel_Data.txDtSt = undefined;
          this.formModel_Data.txDtEd = undefined;
          return;
        }
        this.formModel_Data.txDtSt = val[0];
        this.formModel_Data.txDtEd = val[1];
      },
    },
    "formModel_Data.orderQryDtRange": {
      handler(val) {
        console.log("orderQryDtRange", val);
        if (val === "" || val === null || val == undefined) {
          this.formModel_Data.startDate = undefined;
          this.formModel_Data.endDate = undefined;
          return;
        }
        this.formModel_Data.startDate = val[0];
        this.formModel_Data.endDate = val[1];
      },
    },

    "formModel_Data.remtAmtRange": {
      handler(val) {
        console.log("remtAmtRange", val);
        this.formModel_Data.remtAmtSt = val[0];
        this.formModel_Data.remtAmtEd = val[1];
      },
    },
    "formModel_Data.beRecvAmtRange": {
      handler(val) {
        console.log("beRecvAmtRange", val);
        this.formModel_Data.beRecvAmtSt = val[0];
        this.formModel_Data.beRecvAmtEd = val[1];
      },
    },
  },
  created() {},
  mounted() {},
  methods: {
    initLeftFromData() {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      let endStr = util.timestampToTime(end, "yyyyMMdd");
      let startStr = util.timestampToTime(start, "yyyyMMdd");
      this.formModel_Data.txDtRange = [startStr, endStr];
      this.formModel_Data.remtAmtRange = [0.00,999999999.00];
    },
    initRightFromData() {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      let endStr = util.timestampToTime(end, "yyyyMMdd");
      let startStr = util.timestampToTime(start, "yyyyMMdd");
      this.formModel_Data.orderQryDtRange = [startStr, endStr];
      this.formModel_Data.beRecvAmtRange = [0.00,999999999.00];
    },

    init(reqType, row) {
      this.initLeftFromData();
      this.initRightFromData();
      this.visible = true;
      this.formModel_Data.refNo = row.refNo;
      this.formModel_Data.debtorNm = row.debtorNm;
      this.irOpenQrysearch();
      this.formModel_Data.payerName = row.debtorNm;
      this.irOrderSearch();
    },
    irOpenQrysearch() {
      this.leftListLoading = true;
      irOpenQryApi
        .pageList(Object.assign({}, this.irOpenQryTxCom, this.formModel_Data))
        .then((res) => {
          this.leftListLoading = false;
          if (res.data.errorCode === "000000") {
            this.leftList = res.data.data.records;
            this.leftList.forEach((item) => {
              let precision = 2;
              if (item.remtCcy === "JPY") {
                precision = 0;
              }
              vue.$set(
                item,
                "currWriteOffAmt",
                toFormAmt(item.beWriteOffAmt, precision)
              );
            });
            this.irOpenQryTxCom.total = res.data.data.total;
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
    irOrderSearch() {
      this.rightListLoading = true;
      irOrderApi
        .pageList(Object.assign({}, this.irOrderTxCom, this.formModel_Data))
        .then((res) => {
          this.rightListLoading = false;
          if (res.data.errorCode === "000000") {
            this.rightList = res.data.data.records;
            this.rightList.forEach((item) => {
              let precision = 2;
              if (item.recvCcy === "JPY") {
                precision = 0;
              }
              vue.$set(
                item,
                "currRecvAmt",
                toFormAmt(item.beRecvAmt, precision)
              );
            });
            this.irOrderTxCom.total = res.data.data.total;
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
    remtAmtInput(userInputForm) {
      this.formModel_Data.remtAmtRange = userInputForm;
    },
    beRecvAmtRangeInput(userInputForm) {
      this.formModel_Data.beRecvAmtRange = userInputForm;
    },
    leftTableDbEdit(row, column, cell, event) {
      let property = column.property;
      if (property == "currWriteOffAmt") {
        vue.$set(row, "currWriteOffAmtEdit", !row.currWriteOffAmtEdit);
      }
    },
    rightTableDbEdit(row, column, cell, event) {
      let property = column.property;
      if (property == "currRecvAmt") {
        vue.$set(row, "currRecvAmtEdit", !row.currRecvAmtEdit);
      }
    },
    currWriteOffAmtChange(row) {
      console.log("currWriteOffAmtChange", row);
      let precision = 2;
      if (row.remtCcy === "JPY") {
        precision = 0;
      }
      vue.$set(
        row,
        "currWriteOffAmt",
        toFormAmt(row.currWriteOffAmt, precision)
      );
      vue.$set(row, "currWriteOffAmtEdit", false);
    },
    currRecvAmtChange(row) {
      console.log("currRecvAmtChange", row);
      let precision = 2;
      if (row.recvCcy === "JPY") {
        precision = 0;
      }
      vue.$set(row, "currRecvAmt", toFormAmt(row.currRecvAmt, precision));
      vue.$set(row, "currRecvAmtEdit", false);
    },
    /**
     * 当前页码发生变化的事件
     */
    irOpenQryCurrentPageChange() {
      this.irOpenQrysearch();
    },

    /**
     * 页码总数发生变化的事件
     */
    irOpenQryPageSizeChange() {
      this.irOpenQrysearch();
    },
    /**
     * 当前页码发生变化的事件
     */
    irOrderCurrentPageChange() {
      this.irOrderSearch();
    },

    /**
     * 页码总数发生变化的事件
     */
    irOrderPageSizeChange() {
      this.irOrderSearch();
    },
    //确认按钮
    confirmWriteOff() {
      let irOpenList = this.$refs.leftList_searchResult.selection;
      let irOrderList = this.$refs.rightList_searchResult.selection;
      let param = {
        irOpenList,
        irOrderList,
      };
      this.confirmWriteOfftLoading = true;
      irOpenQryApi.writeOffProc(param).then((res) => {
        this.confirmWriteOfftLoading = false;
        if (res.data.errorCode === "000000") {
          this.$message({
            showClose: true,
            showIcon: true,
            center: true,
            message: "核销成功!",
            type: "success",
          });
          this.visible = false;
        }
      });
    },
    leftListRowClickChange(row, column) {
      console.log("row...", row, column);
      // this.formModel_Control.searchResult.currentRow = row
      let property = column.property;
      if (property == "currWriteOffAmt" && row.currWriteOffAmtEdit) {
        this.$refs.leftList_searchResult.toggleRowSelection(row, true);
      } else {
        this.$refs.leftList_searchResult.toggleRowSelection(row);
      }

      console.log(
        "this.$refs.leftList_searchResult...",
        this.$refs.leftList_searchResult.selection
      );
    },
    rightListRowClickChange(row, column) {
      console.log("row...", row, column);
      // this.formModel_Control.searchResult.currentRow = row
      let property = column.property;
      if (property == "currRecvAmt" && row.currRecvAmtEdit) {
        this.$refs.rightList_searchResult.toggleRowSelection(row, true);
      } else {
        this.$refs.rightList_searchResult.toggleRowSelection(row);
      }

      console.log(
        "this.$refs.rightList_searchResult...",
        this.$refs.rightList_searchResult.selection
      );
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.visible = false;
          done();
        })
        .catch((_) => {});
    },
    resetLeftQuery(){
      this.formModel_Data.refNo = undefined;
      this.formModel_Data.debtorNm = undefined;
      this.formModel_Data.debtorNm = undefined;
      this.initLeftFromData();
    },
    resetRightQuery(){
      this.formModel_Data.orderNo = undefined;
      this.formModel_Data.payerName = undefined;
      this.initRightFromData();
    }
  },
};
</script>
<style scoped>
.el-form--inline .el-form-item {
  margin: 0 10px 0 0;
}
.app-container .el-table--medium td {
  padding: 5px 0;
}
.app-container .el-tag {
  margin: 0 3px 0 0;
}
.app-container .el-dialog__body {
  height: 400px;
  overflow-y: scroll;
}
.popoverDiv {
  text-align: right;
  margin: 0;
}
.app-container .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  padding: 0px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-height: calc(100% - 30px);
  height: 500px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-divider--vertical {
  display: inline-block;
  width: 1px;
  height: 45em;
  margin: 0 8px;
  vertical-align: middle;
  position: relative;
}
.edit-input >>> .el-input__inner {
  color: red;
  text-align: center;
}
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
