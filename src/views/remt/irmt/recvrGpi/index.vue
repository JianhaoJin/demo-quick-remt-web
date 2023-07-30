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
                <el-form-item label="汇款日期" prop="sendDtRange">
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
            <el-row :gutter="25">
              <el-col
                v-if="formModel_Control.ccy.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="币种" prop="ccy">
                  <!--
                  <mercurySelect
                    v-model="formModel_Data.ccy"
                    :url="'/dict-item/REMT_REMT_CCY'"
                    :fileType="{ label: 'name', value: 'code' }"
                    :dicttypeid="'REMT_REMT_CCY'"
                    :disabled="formModel_Control.ccy.disabled"
                    placeholder="请选择币种"
                  />
                  -->
                  <el-select v-model="formModel_Data.ccy" placeholder="请选择收款币别">
                    <el-option
                      v-for="item in currencys"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
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
          <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col
                v-if="formModel_Control.recvrNm.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="汇款人" prop="recvrNm">
                  <el-input
                    v-model="formModel_Data.recvrNm"
                    placeholder="请输入汇款人"
                    show-word-limit
                    :disabled="formModel_Control.recvrNm.disabled"
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
                v-if="formModel_Control.recvrAcc.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="收款人账号" prop="recvrAcc">
                  <el-input
                    v-model="formModel_Data.recvrAcc"
                    placeholder="请输入收款人账号"
                    show-word-limit
                    :disabled="formModel_Control.recvrAcc.disabled"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" style="width: 100%">
            <el-row :gutter="25">
              <el-col
                v-if="formModel_Control.transactionStatus.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="当前状态" prop="transactionStatus">
                  <!--
                  <mercurySelect
                    v-model="formModel_Data.transactionStatus"
                    :url="'/dict-item/REMT_GPI_PAY_STATUS'"
                    :fileType="{ label: 'name', value: 'code' }"
                    :dicttypeid="'REMT_GPI_PAY_STATUS'"
                    :disabled="formModel_Control.transactionStatus.disabled"
                    placeholder="请选择当前状态"
                  />
                  -->
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
            </el-row>
         </el-col>
          <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col :span="2" :offset="9">
                <el-form-item>
                  <el-button
                    type="primary"
                    round
                    :style="{ width: '100px' }"
                    icon="el-icon-refresh"
                    @click="reset"
                    >重置</el-button
                  >
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
      highlight-current-row
      height="calc(100vh - 550px)"
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
      <el-table-column align="center" min-width="70" label="GPI明细">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-more"
            @click="openDetailsModel(scope.row)"
            >查看</el-button
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
    <ir-open-detail v-if="irOpenDetailVisible" ref="irOpenDetail"  @closeDetailModel="detailsModelClose"/>
  </div>
</template>

<script>
import { pageList } from "@/api/remt/irOpenGpiApi.js";
import * as constants from "@/utils/constant.js";
import IrOpenDetail from "./irOpenGpiDetail";
import util from "@/utils/common.js";
import AmtRange from "@/components/AmtRange";
import mercurySelect from "@/components/MercurySelect";
import { checkDictItemCode } from "@/api/sysManagement/sysDictItemApi";
export default {
  name: "irOpenGpi",
  components: { mercurySelect,AmtRange,IrOpenDetail },
  data() {
    return {
      currencys: util.defaultCurrencys(),
 //   gpiStatus:[{value:"G000",lable:"转汇行已中转"},
//{value:"ACCC",lable:"转汇行已入账"},
//{value:"RJCT",lable:"已退款"},
//{value:"G0002",lable:"处理中"},
//{value:"XXXX", lable:"其它"}
 //   ],
    gpiStatus:util.defaultGpiStatus(),
      // 前台公共数据定义：
      txCom: {
        //操作按钮 init-页面初始化, add-新增, mod-修改, del-删除, qry-查询, submit-经办提交, accept-复核提交, reject-驳回
        operationButton: "",
        //主表ID
        mainId: "",
        //交易码
        functionId: "irOpenGpi",
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
      //gpiStatusMap: {G000:"转汇行已中转",ACCC:"转汇行已入账",RJCT:"已退款",G0002:"处理中",G0003:"处理中",G0004:"处理中",XXXX:"其它"},
      gpiStatusMap: util.defaultMap("GpiStatus"),
      ccyMap: util.defaultMap("Currencys"),
      //当前在途收款GPI查询页面数据定义
      formDataList: ["formModel"],
      activeFormTab: "formModel",
      formModel: {
        isShow: true,
        disabled: false,
      },
      //查询字段定义
      formModel_Data: {
        sendDtRange: null,
        ccy: undefined,
        remtAmtRange: [],
        recvrAcc: undefined,
        transactionStatus: undefined,
        recvrNm: undefined,
        startDate: undefined,
        endDate: undefined,
        startAmt: undefined,
        endAmt: undefined,
      },
      formModel_Control: {
        sendDtRange: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        ccy: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        remtAmtRange: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrAcc: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        transactionStatus: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrNm: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
      },
      formModel_Rules: {
        sendDtRange: [],
        ccy: [],
        remtAmtRange: [],
        recvrAcc: [],
        transactionStatus: [],
        recvrNm: [],
        recvrName: [],
      },
      //表格表头
      tableHeader: [
        {
          label: "GPI跟踪号",
          prop: "uetr",
          width: "70px",
        },
        {
          label: "汇款日期",
          prop: "transDate",
          width: "70px",
          formatter: (_, column, cellValue, index) => {
              return this.dateFormat(cellValue);
            },
        },
        {
          label: "汇款币种",
          prop: "remitCurCode",
          width: "70px",
          formatter: (_, column, cellValue, index) => {
              return this.ccyFormat(cellValue);
            },
        },
        {
          label: "汇款金额",
          prop: "amt",
          width: "70px",
        },
        {
          label: "汇款人",
          prop: "payName",
          width: "70px",
        },
        {
          label: "交易状态",
          prop: "status",
          width: "70px",
          formatter: (_, column, cellValue, index) => {
              return this.gpiStatusFormat(cellValue);
          },
        },
      ],
      queryList: [],
      //表格加载状态
      listLoading: false,
      //GPI详情页面按钮
      irOpenDetailVisible: false,
    };
  },
  watch: {
    "formModel_Data.sendDtRange": {
      handler(val) {
        console.log("sendDtRange", val);
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
        this.formModel_Data.startAmt = val[0];
        this.formModel_Data.endAmt = val[1];
      },
    },
  },
  created() {},
  /**
   * mounted钩子函数，用于初始化数据
   */
  async mounted() {
    /*
    await checkDictItemCode("REMT_GPI_PAY_STATUS").then((response) => {
      if (response.data.errorCode === "000000") {
        response.data.data.forEach((element) => {
          this.gpiStatusMap[element.code] = element.name;
        });
      } else {
        this.$message({
          message: "获取字典数据失败：" + response.data.message,
          type: "error",
        });
      }
    });
     await checkDictItemCode("REMT_REMT_CCY").then((response) => {
      if (response.data.errorCode === "000000") {
        response.data.data.forEach((element) => {
          this.ccyMap[element.code] = element.name;
        });
      } else {
        this.$message({
          message: "获取字典数据失败：" + response.data.message,
          type: "error",
        });
      }
    });
    */
    this.init();
    //this.getPageList();
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
      this.formModel_Data.remtAmtRange = [0.00,999999999.00];
      this.formModel_Data.startDate = startStr;
      this.formModel_Data.endDate = endStr;
      this.formModel_Data.startAmt = 0.00;
      this.formModel_Data.endAmt = 999999999.00;

    },
    dateFormat(key){
      var year = key.substring(0,4);
      var month = key.substring(4,6);
      var day = key.substring(6,8);
      return year+"/"+month+"/"+day;
    },
    ccyFormat(key){
      return this.ccyMap[key];
    },
    gpiStatusFormat(key) {
      return this.gpiStatusMap[key];
    },
    remtAmtInput(userInputForm) {
      this.formModel_Data.remtAmtRange = userInputForm;
    },
    getPageList() {
      this.listLoading = true;
      let data={
        appKey: "",
        beginAmt: this.formModel_Data.startAmt,
        endAmt: this.formModel_Data.endAmt ,
        beginDate: this.formModel_Data.startDate,
        endDate: this.formModel_Data.endDate,
        currentPage: this.txCom.currentPage,
        corpCode:util.parseERPParam("corpCode"),
        custId: util.parseERPParam("custId"),
        pageSize: this.txCom.pageSize,
        remitCurCode: this.formModel_Data.ccy,
        payName: this.formModel_Data.recvrNm,
        rcvAcc:this.formModel_Data.recvrAcc,
        status: this.formModel_Data.transactionStatus
      };
      pageList(data).then(
        (res) => {
          console.log(res, 'res');
          this.listLoading = false;
          if (res.data.retCode === "0000") {
            this.queryList = res.data.data.list;
            this.txCom.total = parseInt(res.data.data.totalPage);
          } else {
            this.$message({
              center: true,
              showClose: true,
              showIcon: true,
              message: res.data.retMsg,
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
     * 重置
     */
    reset(){
      this.$refs['formModel'].resetFields()
      this.init();
      },
    /**
     * 打开详情模态框
     */
    openDetailsModel(row) {
      this.irOpenDetailVisible = true;
      this.$nextTick(() => {
        this.$refs.irOpenDetail.findById(row);
      });
    },
    /**
     * 关闭详情模态框
     */
    detailsModelClose() {
      this.irOpenDetailVisible = false;
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
