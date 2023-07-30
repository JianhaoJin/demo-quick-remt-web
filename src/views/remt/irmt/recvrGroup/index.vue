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
                v-if="formModel_Control.expiryDate.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="生效日期" prop="expiryDate">
                  <el-date-picker
                    type="daterange"
                    v-model="formModel_Data.expiryDate"
                    format="yyyy-MM-dd"
                    value-format="yyyyMMdd"
                    :style="{ width: '100%' }"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    range-separator="至"
                    clearable
                    :disabled="formModel_Control.expiryDate.disabled"
                  ></el-date-picker>
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
                v-if="formModel_Control.groupNo.isShow"
                :span="8"
                :offset="8"
              >
                <!--<el-form-item label="组别" prop="groupNo">
                  <el-input
                    v-model="formModel_Data.groupNo"
                    placeholder="请输入组别"
                    show-word-limit
                    :disabled="formModel_Control.groupNo.disabled"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>-->
                <el-form-item label="组别" prop="groupNo">
                <template >
                  <el-select v-model="formModel_Data.groupNo" placeholder="请选择组别" style="width: 100%" clearable>
                    <el-option
                      v-for="item in groupNoOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>
                </template>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col :span="2" :offset="8">
                <el-form-item>
                  <el-button
                    v-permission="'irGroup:add'"
                    round
                    @click.native="formModel_btnAddClickHandler"
                    >新增申请</el-button
                  >
                </el-form-item>
              </el-col>
              <el-col :span="2" :offset="0">
                <el-form-item>
                  <el-button
                    type="primary"
                    round
                    :style="{ width: '100px' }"
                    icon="el-icon-refresh"
                    @click.native="reset"
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
    <ir-group-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"  @closeDetailModel="detailsModelClose"/>
  </div>
</template>

<script>
import { pageList,add } from "@/api/remt/irGroupApi";
import * as constants from "@/utils/constant.js";
import { checkDictItemCode } from "@/api/sysManagement/sysDictItemApi";
import IrGroupAddOrUpdate from "./irGroupAddOrUpdate";
import util from "@/utils/common.js";
import AmtRange from "@/components/AmtRange";
import mercurySelect from "@/components/MercurySelect";
 import vue from "@/main";
export default {
  name: "irGroup",
  components: { mercurySelect,IrGroupAddOrUpdate, AmtRange},
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
        functionId: "irGroup",
        //交易名称
        functionName: "收汇分组管理",
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
      groupNoOptions : [],
      groupNoMap :{},
      //当前收汇分组管理页面数据定义
      formDataList: ["formModel"],
      activeFormTab: "formModel",
      formModel: {
        isShow: true,
        disabled: false,
      },
      //查询字段定义
      formModel_Data: {
        expiryDate: null, 
        payerName: undefined,
        groupNo: undefined,
        groupNo: undefined,
        endDate: undefined,
        startDate: undefined,
      },
      formModel_Control: {
        expiryDate: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        groupNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        payerName: {
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
        expiryDate: [],
        groupNo: [],
        payerName: [],
        groupNo: [],
      },
      //表格表头
      tableHeader: [
        {
          label: "组别",
          prop: "groupNo",
          width: "70px",
          formatter: (_, column, cellValue, index) => {
            return this.groupNoFormat(cellValue);
          },
        },
        {
          label: "汇款人",
          prop: "payerName",
          width: "70px",
        },
        {
          label: "生效日期",
          prop: "expiryDate",
          width: "70px",
          formatter: (_, column, expiryDate, index) => {
              return this.expiryDateFormat(expiryDate);
            },
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: "70px",
          formatter: (_, column, createTime, index) => {
              return this.createTimeDateFormat(createTime);
            },
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
    "formModel_Data.expiryDate": {
      handler(val) {
        if (val === "" || val === null || val == undefined) {
          this.formModel_Data.startDate = undefined;
          this.formModel_Data.endDate = undefined;
          return;
        }
        this.formModel_Data.startDate = val[0];
        this.formModel_Data.endDate = val[1];
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
        this.groupNoOptions = response.data.data.filter(item => item.name.startsWith("汇入"));
      }
    });

    this.init();
    this.getPageList();
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
      this.formModel_Data.expiryDate = [startStr, endStr];
      this.formModel_Data.startDate = startStr;
      this.formModel_Data.endDate = endStr;
    },

      expiryDateFormat(key) {
        var year = key.substring(0,4);
        var month = key.substring(4,6);
        var day = key.substring(6,8);
        return year+"/"+month+"/"+day;
      },
      createTimeDateFormat(key) {
        return key.toString();
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

      formModel_btnAddClickHandler() {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.addInit("add");
        });

      },
      reset(){
        this.$refs['formModel'].resetFields()
        this.init();
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
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.addOrUpdate(row,this.txCom.operationButton);
        });
      },


      /**
       * 关闭详情模态框
       */
      detailsModelClose() {
        this.addOrUpdateVisible = false;
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
