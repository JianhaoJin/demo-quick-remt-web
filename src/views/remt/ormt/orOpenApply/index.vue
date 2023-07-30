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
                v-if="formModel_Control.sendDtRange.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="申请日期" prop="sendDtRange">
                  <el-date-picker
                    type="daterange"
                    v-model="formModel_Data.sendDtRange"
                    format="yyyy-MM-dd"
                    value-format="yyyyMMdd"
                    :style="{ width: '100%' }"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    range-separator="至"
                    clearable
                    :disabled="formModel_Control.sendDtRange.disabled"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col
                v-if="formModel_Control.remtAmtRange.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="汇款金额" prop="remtAmtRange">
                  <!-- <el-input-number v-model="formModel_Data.remtAmtRange" :controls='false' placeholder="汇款金额"
                  :step='1' :precision='2' :disabled="formModel_Control.remtAmtRange.disabled">
                </el-input-number> -->
                  <amt-range
                    v-model="formModel_Data.remtAmtRange"
                    @input="remtAmtInput"
                  >
                  </amt-range>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <template v-if="expandMore">
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
          </template>
          <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col :span="2" :offset="8">
                <el-form-item>
                  <el-button
                    v-permission="'orOpenApply:add'"
                    round
                    :style="{ width: '100px' }"
                    @click.native="formModel_btnAddClickHandler"
                    >新增申请</el-button
                  >
                </el-form-item>
              </el-col>
              <el-col :span="2"
                :offset="0">
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
              <el-col :span="2" :offset="0">
                <el-form-item>
                  <el-button
                    type="warning"
                    round
                    :style="{ width: '100px' }"
                    @click="search"
                    >查询</el-button
                  >
                </el-form-item>
              </el-col>
              <el-col :span="2" :offset="0">
                <el-form-item>
                  <el-button
                    type="text"
                    :style="{ width: '100px' }"
                    @click="expandMore =!expandMore"
                    >{{expandMore?'收起':'展开'}}</el-button
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
      @row-click="getCurrentRow"
      border
      highlight-current-row
      height="calc(100vh - 500px)"
    >
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="index"
        align="center"
        :show-overflow-tooltip="true"
        :prop="item.prop"
        :min-width="item.width"
        :label="item.label"
        :formatter="item.formatter"
      />
      <el-table-column align="center" min-width="70" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="
              scope.row.remtStatus === 'SAVE' ||
              scope.row.remtStatus === 'REJECT'
            "
            v-permission="'orOpenApply:submit'"
            type="text"
            @click="openDetailsModel(scope.row)"
            icon="el-icon-edit"
            >经办</el-button
          >
          <el-button
            v-if="scope.row.remtStatus === 'ACCEPT'"
            v-permission="'orOpenApply:accept'"
            type="text"
            icon="el-icon-more"
            @click="openDetailsModel(scope.row)"
            >复核</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-container">
      <el-pagination
        :current-page.sync="txCom.currentPage"
        :page-size="txCom.pageSize"
        :page-sizes="txCom.pageSizes"
        :total="txCom.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="currentPageChange"
        @size-change="pageSizeChange"
      />
    </div>
    <or-open-apply-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"  @closeDetailModel="detailsModelClose"/>
  </div>
</template>

<script>
import { pageList } from "@/api/remt/OrOpenApplyApi";
import * as constants from "@/utils/constant.js";
import util from "@/utils/common.js";
import AmtRange from "@/components/AmtRange";
import OrOpenApplyAddOrUpdate from "./orOpenApplyAddOrUpdate";
import { checkDictItemCode } from "@/api/sysManagement/sysDictItemApi";
import { unlockById } from "@/api/remt/recvrMngApi";


export default {
  name: "orOpenApply",
  components: { OrOpenApplyAddOrUpdate, AmtRange },
  data() {
    return {
      // 前台公共数据定义：
      txCom: {
        //操作按钮 init-页面初始化, add-新增, mod-修改, del-删除, qry-查询, submit-经办提交, accept-复核提交, reject-驳回
        operationButton: "",
        //主表ID
        mainId: "",
        //交易码
        functionId: "orOpenApply",
        //交易名称
        functionName: "汇出汇款申请",
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
      remtStatusMap: {},
      expandMore:false,
      //当前汇出汇款申请页面数据定义
      formDataList: ["formModel"],
      activeFormTab: "formModel",
      formModel: {
        isShow: true,
        disabled: false,
      },
      //查询字段定义
      formModel_Data: {
        sendDtRange: null,
        remtAmtRange: [],
        payerName: undefined,
        recvrName: undefined,
        orderNo: undefined,
        txDtSt: undefined,
        txDtEd: undefined,
        remtAmtSt: undefined,
        remtAmtEd: undefined,
      },
      formModel_Control: {
        sendDtRange: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        remtAmtRange: {
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
      },
      formModel_Rules: {
        sendDtRange: [],
        remtAmtRange: [],
        payerName: [],
        recvrName: [],
        orderNo: [],
      },
      filterData: {
        module: "",
        requestType: "",
        methodName: "",
        url: "",
      },
      //表格表头
      tableHeader: [
        {
          label: "流水号",
          prop: "refNo",
          width: "70px",
        },
        {
          label: "汇款金额",
          prop: "remtAmt",
          width: "70px",
        },
        {
          label: "汇款人",
          prop: "payerName",
          width: "70px",
        },
        {
          label: "收款人",
          prop: "recvrName",
          width: "70px",
        },
        {
          label: "订单号",
          prop: "orderNo",
          width: "70px",
        },
        {
          label: "状态",
          prop: "remtStatus",
          width: "70px",
          formatter: (_, column, cellValue, index) => {
            return this.remtStatusFormat(cellValue);
          },
        },
        {
          label: "交易日期",
          prop: "txDt",
          width: "80px",
        },
      ],
      queryList: [],
      //表格加载状态
      listLoading: false,
      //新增汇款申请页面按钮
      addOrUpdateVisible: false,
    };
  },
  watch: {
    "formModel_Data.sendDtRange": {
      handler(val,nval) {
        debugger
        console.log("sendDtRange", val);
        if (val === "" || val === null || val == undefined) {
          this.formModel_Data.txDtSt = undefined;
          this.formModel_Data.txDtEd = undefined;
          return;
        }
        this.formModel_Data.txDtSt = val[0];
        this.formModel_Data.txDtEd = val[1];
      },
    },
    "formModel_Data.remtAmtRange": {
      handler(val) {
        console.log("remtAmtRange", val);
        this.formModel_Data.remtAmtSt = val[0];
        this.formModel_Data.remtAmtEd = val[1];
      },
    },
  },
  created() {},
  /**
   * mounted钩子函数，用于初始化数据
   */
  async mounted() {
    await checkDictItemCode("REMT_REMT_STATUS").then((response) => {
      if (response.data.errorCode === "000000") {
        response.data.data.forEach((element) => {
          this.remtStatusMap[element.code] = element.name;
        });
      } else {
        this.$message({
          message: "获取字典数据失败：" + response.data.message,
          type: "error",
        });
      }
    });

    this.init();
    this.getPageList();
  },

  /**
   * 自定义方法列表
   */
  methods: {
    init() {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      let endStr = util.timestampToTime(end, "yyyyMMdd");
      let startStr = util.timestampToTime(start, "yyyyMMdd");
      this.formModel_Data.sendDtRange = [startStr, endStr];
      this.formModel_Data.txDtSt = startStr;
      this.formModel_Data.txDtEd = endStr;
      this.formModel_Data.remtAmtRange = [0.00,999999999.00];
      this.formModel_Data.remtAmtSt = 0.00;
      this.formModel_Data.remtAmtEd = 999999999.00;
    },
    remtStatusFormat(key) {
      return this.remtStatusMap[key];
    },
    remtAmtInput(userInputForm) {
      this.formModel_Data.remtAmtRange = userInputForm;
    },
    formModel_btnAddClickHandler() {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init("init");
      });
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
     * 搜索
     */
    search() {
      this.txCom.currentPage = 1;
      this.getPageList();
    },
    /**
     * 打开详情模态框
     */
    openDetailsModel(row) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.update("update", row);
      });
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
     * 关闭详情模态框
     */
    detailsModelClose(unlockFlg, refreshFlg) {
      debugger
      this.addOrUpdateVisible = false;
      //this.getPageList();
      //修改时，需要解锁
      if (
        this.txCom.currRow &&
        this.txCom.currRow.id &&
        unlockFlg &&
        unlockFlg === "y"
      ) {
        unlockById(this.txCom.currRow.id).then((res) => {
          if (res.data.errorCode !== "000000") {
            this.$message({
              center: true,
              showClose: true,
              showIcon: true,
              message: res.data.errMsg,
              type: "error",
            });
          }
        });
      }

      //若明细页面点返回，则不刷新，否则需要重新查询当前页 - 刷新标志由明细页面返回
      if (refreshFlg && refreshFlg === "y") {
        this.getPageList();
      }
    },



    // /**
    //  * 修改api概述
    //  */
    // updateDesc() {
    //   var params = {
    //     id: this.updateData.id,
    //     descriptions: this.updateData.descriptions,
    //   };
    //   this.$refs["updateForm"].validate((valid) => {
    //     if (valid) {
    //       updateDesc(params).then((res) => {
    //         this.$message({
    //           center: true,
    //           showClose: true,
    //           showIcon: true,
    //           message: res.data.errorMsg,
    //           type: res.data.errorCode === "000000" ? "success" : "error",
    //         });
    //         if (res.data.errorCode === "000000") {
    //           this.updateVisible = false;
    //           this.search();
    //         }
    //       });
    //     }
    //   });
    // },

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
    //重置
    resetFilterQuery(){
      this.$refs['formModel'].resetFields()
      this.init();
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-container {
  position: relative;
  .add-btn {
    position: relative;
    top: 0px;
    right: -10px;
  }
}
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
</style>
