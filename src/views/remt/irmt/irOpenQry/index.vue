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
                <el-form-item label="交易日期" prop="sendDtRange">
                  <el-date-picker
                    type="daterange"
                    v-model="formModel_Data.sendDtRange"
                    format="yyyy-MM-dd"
                    value-format="yyyyMMdd"
                    :style="{ width: '100%' }"
                    start-placeholder="交易开始日期"
                    end-placeholder="交易结束日期"
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
                v-if="formModel_Control.remtCcy.isShow"
                :span="8"
                :offset="8"
              >
              <!--
              
                  <mercurySelect
                    v-model="formModel_Data.remtCcy"
                    :url="'/dict-item/REMT_REMT_CCY'"
                    :fileType="{ label: 'name', value: 'code' }"
                    :dicttypeid="'REMT_REMT_CCY'"
                    placeholder="请选择收款币别"
                  />
              
                -->
                <el-form-item label="收款币别" prop="remtCcy">
                  <el-select v-model="formModel_Data.remtCcy" placeholder="请选择收款币别">
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
                <el-form-item label="收款金额" prop="remtAmtRange">
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
                  v-if="formModel_Control.debtorNm.isShow"
                  :span="8"
                  :offset="8"
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
              </el-row>
            </el-col>
            <el-col :span="24" style="width: 100%">
              <el-row :gutter="15">
                <el-col
                  v-if="formModel_Control.recvrNm.isShow"
                  :span="8"
                  :offset="8"
                >
                  <el-form-item label="收款人" prop="recvrNm">
                    <el-input
                      v-model="formModel_Data.recvrNm"
                      placeholder="请输入收款人"
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
                      :disabled="formModel_Control.debtorNm.disabled"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                    <!--
                    <mercurySelect
                      v-model="formModel_Data.recvrAcc"
                      :url="'/dict-item/REMT_IR_RECVR_ACC'"
                      :fileType="{ label: 'name', value: 'code' }"
                      :dicttypeid="'REMT_IR_RECVR_ACC'"
                      placeholder="请选择收款人账号"
                    />
                    -->
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>

            <el-col :span="24" style="width: 100%">
              <el-row :gutter="15">
                <el-col
                  v-if="formModel_Control.refNo.isShow"
                  :span="8"
                  :offset="8"
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
              </el-row>
            </el-col>

            <el-col :span="24" style="width: 100%">
              <el-row :gutter="15">
                <el-col
                  v-if="formModel_Control.remtRemark.isShow"
                  :span="8"
                  :offset="8"
                >
                  <el-form-item label="交易附言" prop="remtRemark">
                    <el-input
                      v-model="formModel_Data.remtRemark"
                      placeholder="请输入交易附言"
                      show-word-limit
                      :disabled="formModel_Control.remtRemark.disabled"
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
              <el-col :span="2" :offset="9">
                <el-form-item>
                  <el-button
                    type="primary"
                    round
                    :style="{ width: '100px' }"
                    icon="el-icon-refresh"
                    @click="resetFilterQuery"
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
              <el-col :span="2" :offset="0">
                <el-form-item>
                  <el-button
                    type="text"
                    :style="{ width: '100px' }"
                    @click="expandMore = !expandMore"
                    >{{ expandMore ? "收起" : "展开" }}</el-button
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
      <el-table-column align="center" min-width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="receiptModel(scope.row)"
            :loading="scope.row.receiptLoading"
            icon="el-icon-edit"
            :style="{ width: '50px', marginLeft: '0px' }"
            >回单</el-button
          >
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="messageModel(scope.row)"
            :style="{ width: '50px', marginLeft: '0px' }"
            :loading="scope.row.messageLoading"
            >报文</el-button
          >
          <el-popover placement="top" width="100" trigger="click">
            <el-button
              type="text"
              @click="openWriteOffPage(scope.row)"
              icon="el-icon-edit"
              :style="{ width: '50px', marginLeft: '0px' }"
              >核销</el-button
            >
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="openClaimMngPage(scope.row)"
              :style="{ width: '50px', marginLeft: '0px' }"
              >认领</el-button
            >
            <el-button
              icon="el-icon-more"
              type="text"
              :style="{ width: '20px', marginLeft: '0px' }"
              slot="reference"
            />
          </el-popover>
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
    <!-- <write-off
      v-if="writeOffMngVisible"
      ref="writeOffMng"
      @closeDetailModel="writeOffMngClose"
    />
    <claim-mng
      v-if="claimMngVisible"
      ref="claimMng"
      @closeDetailModel="claimMngClose"
    /> -->
  </div>
</template>

<script>
import mercurySelect from "@/components/MercurySelect";
import vue from "@/main";
import { pageList } from "@/api/remt/irOpenQryApi";
import * as constants from "@/utils/constant.js";
import util from "@/utils/common.js";
import AmtRange from "@/components/AmtRange";
import { checkDictItemCode } from "@/api/sysManagement/sysDictItemApi";
import { downLoad,receiptDownLoad } from "@/api/sysManagement/fileUpDownApi.js";
import WriteOff from "./writeOff";
import ClaimMng from "./claimMng";

export default {
  name: "irOpenQry",
  components: {
    mercurySelect,
    AmtRange,
    WriteOff,
    ClaimMng,
  },
  data() {
    
    return {
      currencys: util.defaultCurrencys(),

      // 前台公共数据定义：
      txCom: {
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
      /**
       * 表格翻译对象
       */
      remtStatusMap: {},
      expandMore: false,
      //当前汇入汇款申请页面数据定义
      formDataList: ["formModel"],
      activeFormTab: "formModel",
      formModel: {
        isShow: true,
        disabled: false,
      },

      //查询字段定义
      formModel_Data: {
        sendDtRange: [],
        remtAmtRange: [],
        debtorNm: undefined,
        recvrNm: undefined,
        recvrAcc: undefined,
        refNo: undefined,
        remtRemark: undefined,
        txDtSt: undefined,
        txDtEd: undefined,
        remtCcy: undefined,
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
        remtCcy: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        debtorNm: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrNm: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrAcc: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        refNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        remtRemark: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
      },
      formModel_Rules: {
        sendDtRange: [],
        remtAmtRange: [],
        debtorNm: [],
        recvrNm: [],
        recvrAcc: [],
        refNo: [],
        remtRemark: [],
      },
      //表格表头
      tableHeader: [
        {
          label: "业务编号",
          prop: "refNo",
          width: "80px",
        },
        {
          label: "汇款币别",
          prop: "remitCurCode",
          width: "50px",
        },
        {
          label: "汇款金额",
          prop: "amt",
          width: "70px",
        },
        {
          label: "汇款人",
          prop: "payName",
          width: "100px",
        },
        {
          label: "收款人",
          prop: "rcvName",
          width: "100px",
        },
        {
          label: "收款账号",
          prop: "rcvAcc",
          width: "100px",
        },
        {
          label: "交易附言",
          prop: "postscript",
          width: "130px",
        },

        {
          label: "分组",
          prop: "groupNo",
          width: "80px",
          formatter: (_, column, cellValue, index) => {
            return this.groupNoFormat(cellValue);
          },
        },
        {
          label: "交易日期",
          prop: "transactionDate",
          width: "80px",
        },
      ],
      queryList: [],
      groupNoMap: {},
      //表格加载状态
      listLoading: false,
      //核销页面按钮
      writeOffMngVisible: false,
      //认领页面按钮
      claimMngVisible: false,
    };
  },
  watch: {
    "formModel_Data.sendDtRange": {
      handler(val) {
        //console.log("sendDtRange", val);
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
        //console.log("remtAmtRange", val);
        if (!val) {
          this.formModel_Data.remtAmtSt = undefined;
          this.formModel_Data.remtAmtEd = undefined;
          return;
        }
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
    console.log(this.$route.query, " this.$route.params");

    // await checkDictItemCode("REMT_SUPPLIER_GROUP").then((response) => {
    //   if (response.data.errorCode === "000000") {
    //     response.data.data.forEach((element) => {
    //       this.groupNoMap[element.code] = element.name;
    //     });
    //   }
    // });
     this.init();
    // this.getPageList();
  },

  /**
   * 自定义方法列表
   */
  methods: {
    groupNoFormat(key) {
      return this.groupNoMap[key];
    },

    init() {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      let endStr = util.timestampToTime(end, "yyyyMMdd");
      let startStr = util.timestampToTime(start, "yyyyMMdd");
      this.formModel_Data.sendDtRange = [startStr, endStr];
      this.formModel_Data.remtAmtRange = [0.0, 999999999.0];
      this.formModel_Data.txDtSt = startStr;
      this.formModel_Data.txDtEd = endStr;
      this.formModel_Data.remtAmtSt = 0.0;
      this.formModel_Data.remtAmtEd = 999999999.0;
    },
    remtAmtInput(userInputForm) {
      this.formModel_Data.remtAmtRange = userInputForm;
    },
    getPageList() {
      this.listLoading = true;

      pageList({
        beginDate: this.formModel_Data.txDtSt,
        endDate: this.formModel_Data.txDtEd,
        currentPage: this.txCom.currentPage,
        corpCode:util.parseERPParam("corpCode"),
        custId: util.parseERPParam("custId"),
        pageSize: this.txCom.pageSize,
        rcvAcc: this.formModel_Data.recvrAcc,
        beginAmt: this.formModel_Data.beginAmt,
        endAmt: this.formModel_Data.endAmt,
        payName: this.formModel_Data.debtorNm,
        productID: "tmsForex",
        serviceID: "inwardRemittanceQuery",
        remitCurCode: this.formModel_Data.remtCcy
      }).then((retd) => {
        console.log(retd, 'retd');
        this.listLoading = false;
        if(retd.data.retCode == "0000"){
          this.queryList = retd.data.data.list;
          this.txCom.total = retd.data.totalPage;
        }
        else{
          this.$message({
               center: true,
               showClose: true,
               showIcon: true,
                message: retd.data.retMsg,
              type: "error",
             });
        }
      
      });
      // pageList(Object.assign({}, this.txCom, this.formModel_Data)).then(
      //   (res) => {
      //     this.listLoading = false;
      //     if (res.data.errorCode === "000000") {
      //       this.queryList = res.data.data.records;
      //       this.txCom.total = res.data.data.total;
      //     } else {
      //       this.$message({
      //         center: true,
      //         showClose: true,
      //         showIcon: true,
      //         message: res.data.errMsg,
      //         type: "error",
      //       });
      //     }
      //   }
      // );
    },

    /**
     * 搜索
     */
    search() {
      this.txCom.currentPage = 1;
      this.getPageList();
    },
    /**
     * 打开核销处理页面
     */
    openWriteOffPage(row) {
      this.writeOffMngVisible = true;
      this.$nextTick(() => {
        this.$refs.writeOffMng.init("init", row);
      });
    },
    /**
     * 关闭核销处理页面
     */
    writeOffMngClose() {
      this.writeOffMngVisible = false;
      this.getPageList();
    },
    /**
     * 打开认领处理页面
     */
    openClaimMngPage(row) {
      this.claimMngVisible = true;
      this.$nextTick(() => {
        this.$refs.claimMng.update("update", row);
      });
    },
    /**
     * 关闭认领处理页面
     */
    claimMngClose() {
      this.claimMngVisible = false;
      this.getPageList();
    },

    /**
     * 回单模态框
     */
    receiptModel(row) {
      this.$confirm("确认回单？")
        .then((_) => {
          let data = {
            corpCode:util.parseERPParam("corpCode"),
            custId: util.parseERPParam("custId"),
            downContent: "1",//下载内容 1(回单) 2(报文)
            serialNo: row.refNo,
            tradeType: "1"//交易类型 0 (T/T 汇款) 1(汇入汇款)
          };

          receiptDownLoad(data).then(Res =>{
            if(Res.data.retCode == "0000"){
              let downLoadNo = Res.data.data.downLoadNo;
              vue.$set(row, "receiptLoading", true);
              downLoad({downLoadNo:downLoadNo}).then((res) => {
                const blob = new Blob([res.data]);
                const fileName = res.headers["content-disposition"]
                  .split(";")[1]
                  .split("fileName=")[1];
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.style.display = "none";
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                vue.$set(row, "receiptLoading", false);
              })
              .catch((e) => {
                this.$message.error("失败");
                vue.$set(row, "receiptLoading", false);
              });
            }
            else{
              this.$message({
               center: true,
               showClose: true,
               showIcon: true,
               message: Res.data.retMsg,
               type: "error",
              });
            }
          })
         
        })
        .catch((_) => {});
    },

    /**
     * 报文模态框
     */
    messageModel(row) {
      this.$confirm("确认报文？")
        .then((_) => {
          let data = {
            corpCode:util.parseERPParam("corpCode"),
            custId: util.parseERPParam("custId"),
            downContent: "2",//下载内容 1(回单) 2(报文)
            serialNo: row.refNo,
            tradeType: "1"//交易类型 0 (T/T 汇款) 1(汇入汇款)
          };
          receiptDownLoad(data).then(Res =>{
            if(Res.data.retCode == "0000"){
              let downLoadNo = Res.data.data.downLoadNo;
              vue.$set(row, "messageLoading", true);
              downLoad({downLoadNo:downLoadNo}).then((res) => {
                const blob = new Blob([res.data]);
                const fileName = res.headers["content-disposition"]
                  .split(";")[1]
                  .split("fileName=")[1];
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.style.display = "none";
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                vue.$set(row, "messageLoading", false);
              })
              .catch((e) => {
                this.$message.error("失败");
                vue.$set(row, "messageLoading", false);
              });
            }
            else{
              this.$message({
               center: true,
               showClose: true,
               showIcon: true,
               message: Res.data.retMsg,
               type: "error",
              });
            }
          })
         
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
    //重置
    resetFilterQuery() {
      this.$refs["formModel"].resetFields();
      this.init();
    },
  },
};
</script>

