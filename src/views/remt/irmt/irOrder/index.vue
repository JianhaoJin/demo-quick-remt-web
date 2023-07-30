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
                v-if="formModel_Control.recvDate.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="应收日期：" prop="recvDate">
                  <el-date-picker
                    type="daterange"
                    v-model="formModel_Data.recvDate"
                    format="yyyy-MM-dd"
                    value-format="yyyyMMdd"
                    :style="{ width: '100%' }"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    range-separator="至"
                    clearable
                    :disabled="formModel_Control.recvDate.disabled"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col
                v-if="formModel_Control.beRecvAmt.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="待收款金额：" prop="beRecvAmt">
                  <amt-range
                    v-model="formModel_Data.beRecvAmt"
                    @input="beRecvAmtInput"
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
                v-if="formModel_Control.recvrName.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="收款人：" prop="recvrName">
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
                <el-form-item label="采购商：" prop="payerName">
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
                    placeholder="请输入订单号"
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
                v-if="formModel_Control.recvRate.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="收款进度：" prop="orderNo">
                  <el-input
                    v-model="formModel_Data.recvRate"
                    placeholder="请输入收款进度"
                    show-word-limit
                    :disabled="formModel_Control.recvRate.disabled"
                    clearable
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
            <el-row :gutter="15">
              <el-col
                :span="2"
                :offset="8"
              >
                <el-form-item>
                  <el-button
                    round
                    @click.native="formModel_addOrderClickHandler"
                    v-permission="'irOrder:add'"
                  >新增订单</el-button
                  >
                </el-form-item>
              </el-col>

              <el-col :span="2">
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
      @row-dblclick="dbClickHandler"
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
        <el-table-column
          min-width="120px"
          align="center"
          label="收款进度"
          prop="recvRate"
        >
          <template slot-scope="{ row }">
            <template >
                <el-progress  :percentage="row.recvRate" :color="customColorMethod"></el-progress>
            </template>
          </template>
        </el-table-column>
        <el-table-column
              align="center"
              label="订单号"
              prop="createTime"
              width="160"
            />
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

    <ir-order-delete-or-update
      v-if="deleteOrUpdateVisible"
      ref="deleteOrUpdate"
      @closeDetailModel="detailsModelClose"
    />
  </div>
</template>
<script>
  import mercurySelect from "@/components/MercurySelect";
  import IrOrderDeleteOrUpdate from "./irOrderDeleteOrUpdate";
  import { checkDictItemCode } from "@/api/sysManagement/sysDictItemApi";
  import { pageList, add } from "@/api/remt/irOrderApi";
  import util from "@/utils/common.js";
  import AmtRange from "@/components/AmtRange";
  import * as Constant from "@/utils/constant.js";
  import vue from "@/main";
  export default {
    name: "irOrder",
    components: {
      mercurySelect,
      IrOrderDeleteOrUpdate,
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
          functionId: "irOpenOrder",
          //交易名称
          functionName: "应收订单管理",
          //当前页码
          currentPage: 1,
          //每页笔数
          pageSize: 10,
          //总页数
          pageSizes: Constant.pageSizes,
          //总笔数
          total: 0,
          //动态高度
          pageHeight: "calc(100vh - 550px)",
          //当前行数据
          currRow: [],
        },
        recvStatusMap: {},
        formDataList: ["formModel"],
        activeFormTab: "formModel",
        formModel: {
          isShow: true,
          disabled: false,
        },
        formModel_Data: {
          recvDate: null,
          beRecvAmt: [],
          payerName: undefined,
          orderNo: undefined,
          payStatus: undefined,
          recvRate: "",
          startDate: undefined,
          endDate: undefined,
          beRecvAmtSt: undefined,
          beRecvAmtEd: undefined,
        },
        formModel_Control: {
          recvDate: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
          },
          beRecvAmt: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
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
          orderNo: {
            isShowType: "v-if",
            isShow: true,
            disabled: false,
          },
          recvRate: {
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
        },

        tableHeader: [
          {
            prop: "orderNo",
            label: "订单号",
            width: 100,
          },
          {
            prop: "recvrName",
            label: "收款人",
            width: 100,
          },
          {
            prop: "payerName",
            label: "采购商",
            width: 100,
          },
          {
            prop: "recvCcy",
            label: "应收币种",
            width: 70,
          },
          {
            prop: "orderAmt",
            label: "订单金额",
            width: 100,
          },
          {
            prop: "recvDate",
            label: "应收日期",
            width: 80,
            formatter: (_, column, cellValue, index) => {
              return this.recvDateFormat(cellValue);
            },
          },
          {
            prop: "recvedAmt",
            label: "已收款金额",
            width: 100,
          },
          {
            prop: "beRecvAmt",
            label: "待收款金额",
            width: 100,
          },
          {
            prop: "recvStatus",
            label: "收款状态",
            width: 90,
            formatter: (_, column, cellValue, index) => {
              return this.recvStatusFormat(cellValue);
            },
          },
        ],
        queryList: [],
        formModel_Rules: {
          recvDate: [],
          beRecvAmt: [],
          recvrName: [],
          payerName: [],
          orderNo: [],
          recvStatus: [],
          recvRate: [],
        },
        //表格加载状态
        listLoading: false,
        //新增应付订单管理删除修改页面按钮
        deleteOrUpdateVisible: "",
      };
    },
    computed: {},
    watch: {
      "formModel_Data.recvDate": {
        handler(val) {
          console.log("recvDate", val);
          if (val === "" || val === null || val == undefined) {
            this.formModel_Data.startDate = undefined;
            this.formModel_Data.endDate = undefined;
            return;
          }
          this.formModel_Data.startDate = val[0];
          this.formModel_Data.endDate = val[1];
        },
      },

      "formModel_Data.beRecvAmt": {
        handler(val) {
          console.log("beRecvAmt", val);
          if (val === "" || val === null || val == undefined) {
            this.formModel_Data.beRecvAmtSt = undefined;
            this.formModel_Data.beRecvAmtEd = undefined;
            return;
          }
          this.formModel_Data.beRecvAmtSt = val[0];
          this.formModel_Data.beRecvAmtEd = val[1];
        },
      },
    },
    created() {},
    async mounted() {
      await checkDictItemCode("REMT_RECV_STATUS").then((response) => {
        if (response.data.errorCode === "000000") {
          response.data.data.forEach((element) => {
            this.recvStatusMap[element.code] = element.name;
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
        this.formModel_Data.recvDate = [startStr, endStr];
        this.formModel_Data.beRecvAmt = [0.00,999999999.00];
        this.formModel_Data.startDate = startStr;
        this.formModel_Data.endDate = endStr;
        this.formModel_Data.beRecvAmtSt = 0.00;
        this.formModel_Data.beRecvAmtEd = 999999999.00;
      },
      customColorMethod(percentage) {
        if (percentage < 30) {
          return '#909399';
        } else if (percentage < 70) {
          return '#e6a23c';
        } else {
          return '#67c23a';
        }
      },
      recvStatusFormat(key) {
        return this.recvStatusMap[key];
      },
      recvRateFormat(key) {
        return key + "%";
      },
      recvDateFormat(key) {
        return key.substring(0,10);
      },
      beRecvAmtInput(userInputForm) {
        this.formModel_Data.beRecvAmt = userInputForm;
      },
      changefrom(userInputTo) {
        this.formModel_Data.beRecvAmt = userInputTo;
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
        this.deleteOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.deleteOrUpdate.addInit("add");
        });

      },
      formModel_field142ClickHandler() {
        this.txCom.currentPage = 1;
        this.getPageList();
      },

      dbClickHandler(row) {
        //当前行数据
        this.txCom.currRow = row;
        //点击修改
        this.txCom.operationButton = "mod";
        this.deleteOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.deleteOrUpdate.deleteOrUpdate(row,this.txCom.operationButton);
        });
      },

      resetFilterQuery(){
        this.$refs['formModel'].resetFields()
        this.init();
      },
      /**
       * 关闭详情模态框
       */
      detailsModelClose() {
        this.deleteOrUpdateVisible = false;
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

    },
  };
</script>
<style scoped>
</style>
