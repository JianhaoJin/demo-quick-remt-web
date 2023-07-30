<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose"
    title="汇入认领"
    v-bind="$attrs"
    :visible.sync="visible"
    v-on="$listeners"
    :fullscreen="true"
  >
    <span slot="title">
      <div class="dialog-title"><span>汇入认领</span></div>
    </span>
    <el-form
      ref="formModel"
      :model="formModel_Data"
      :rules="formModel_Rules"
      :disabled="formModel.disabled"
      label-width="120px"
      label-position="right"
    >
      <el-col :span="24" style="width: 100%">
        <el-row :gutter="15">
          <el-col v-if="formModel_Control.refNo.isShow" :span="8" :offset="8">
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
            v-if="formModel_Control.remtAmtRange.isShow"
            :span="8"
            :offset="8"
          >
            <el-form-item label="金额" prop="remtAmtRange">
              <!-- <el-input-number v-model="formModel_Data.remtAmtRange" :controls='false' placeholder="收款金额"
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
            v-if="formModel_Control.groupNo.isShow"
            :span="8"
            :offset="8"
          >
            <el-form-item label="分组：" prop="groupNo">
              <mercurySelect
                v-model="formModel_Data.groupNo"
                :url="'/dict-item/REMT_SUPPLIER_GROUP'"
                :fileType="{ label: 'name', value: 'code' }"
                :dicttypeid="'REMT_SUPPLIER_GROUP'"
                placeholder="请选择分组"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="24" style="width: 100%">
        <el-row :gutter="15">
          <el-col :span="2" :offset="8">
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
          <el-col :span="2">
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
      <!--<el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col :span="2" :offset="12">
                <el-form-item>
                  <el-button
                    type="warning"
                    round
                    :style="{ width: '100px' }"
                    @click="commitSave"
                  >保存</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>-->
    </el-form>

    <el-table
      ref="list_searchResult"
      :header-cell-style="{ background: 'rgb(255, 248, 220)' }"
      v-loading="listLoading"
      :data="queryList"
      border
      highlight-current-row
      height="calc(100vh - 550px)"
      @cell-dblclick="cellEdit"
      @row-click="rowClickChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        align="center"
        label="业务编号"
        prop="refNo"
        width="130"
      />
      <el-table-column align="center" label="币种金额" width="130">
        <template slot-scope="{ row }">
          <span>{{ row.remtCcy + row.remtAmt }}</span>
        </template>
      </el-table-column>
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

      <el-table-column
        min-width="100px"
        align="center"
        label="认领"
        prop="groupNo"
      >
        <template slot-scope="{ row }">

          <template v-if="row.currGroupNoEdit">
            <el-select
              @visible-change="currGroupNoEditChange(row,$event)"
              v-model="row.groupNo" placeholder="请选择认领状态">
              <el-option
                v-for="item in groupList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>

          <span style="color: red" v-else>{{groupNoMap[row.groupNo] }}</span>
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
    <span slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="warning" @click.native="commitSave">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import vue from "@/main";
import mercurySelect from "@/components/MercurySelect";
import { pageList, selectById, claimProc } from "@/api/remt/irOpenQryApi";
import * as constants from "@/utils/constant.js";
  import util from "@/utils/common.js";
import AmtRange from "@/components/AmtRange";
import user from "@/store/modules/user.js";
import { checkDictItemCode } from "@/api/sysManagement/sysDictItemApi";

export default {
  components: {
    mercurySelect,
    AmtRange,
  },
  data() {
    return {
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
      groupNoMap: {},
      groupNo: undefined,
      groupList: [],
      //当前汇入汇款申请页面数据定义
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
        debtorNm: undefined,
        groupNo: undefined,
        refNo: undefined,
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
        refNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        groupNo: {
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
        refNo: [],
      },
      //表格表头
      tableHeader: [
        {
          label: "汇款人",
          prop: "debtorNm",
          width: "130px",
        },
        {
          label: "收款人",
          prop: "recvrNm",
          width: "130px",
        },
        {
          label: "交易日期",
          prop: "txDt",
          width: "80px",
        },
        {
          label: "交易附言",
          prop: "remtRemark",
          width: "130px",
        },
        /* {
          label: "认领",
          prop: "groupNo",
          width: "70px",
        },*/
      ],
      queryList: [],
      //表格加载状态
      listLoading: false,
      visible: false,
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
    await checkDictItemCode("REMT_SUPPLIER_GROUP").then((response) => {
      if (response.data.errorCode === "000000") {
        response.data.data.forEach((element) => {
          this.groupNoMap[element.code] = element.name;
        });
      }
    });
    let groupEmpty = {};
    groupEmpty.value = "99";
    groupEmpty.label = "待分组";
    this.groupList.push(groupEmpty);
    let userGroupNo = user.state.userGroupNo;
    let stringGroupNo = userGroupNo.split(",");
    for (const groupNo of stringGroupNo) {
      let groupMap = {};
      groupMap.value = groupNo;
      groupMap.label = this.groupNoMap[groupNo];
      if (groupMap.label.startsWith("汇入")){
      this.groupList.push(groupMap);
      }
    }
    this.init();
    await this.getPageList();
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
      this.formModel_Data.txDtSt = startStr;
      this.formModel_Data.txDtEd = endStr;
      this.formModel_Data.remtAmtSt = 0.00;
      this.formModel_Data.remtAmtEd = 999999999.00;

    },

    update(operationButton, row) {
      this.visible = true;
      this.txCom.operationButton = operationButton;
      this.formModel_Data.refNo = row.refNo;
      this.getPageList();
    },

    remtAmtInput(userInputForm) {
      this.formModel_Data.remtAmtRange = userInputForm;
    },

    async getPageList() {
      this.listLoading = true;
      await pageList(Object.assign({}, this.txCom, this.formModel_Data)).then(
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
     * 保存
     */
    commitSave() {
      let irOpenList = this.$refs.list_searchResult.selection;
      const param = {
        irOpenList
      };
      this.$confirm("确认修改保存？")
        .then((_) => {
          claimProc(param)
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

    cellEdit(row, column, cell, event) {
      let property = column.property;
      if (property == "groupNo") {
        vue.$set(row, "currGroupNoEdit", !row.currGroupNoEdit);
      }
    },
    rowClickChange(row,column){
      console.log("row...", row,column);
      // this.formModel_Control.searchResult.currentRow = row
      let property = column.property;
      if (property == "groupNo" && row.currGroupNoEdit) {
        this.$refs.list_searchResult.toggleRowSelection(row,true);
      }else{
        this.$refs.list_searchResult.toggleRowSelection(row);
      }
    },

    currGroupNoEditChange(row,event) {
      console.log("currGroupNoEdit", row);
      if(!event){
        vue.$set(row, "currGroupNoEdit", false);
      }
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

    resetFilterQuery(){
      this.$refs['formModel'].resetFields()
      this.init();
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
