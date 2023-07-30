<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        ref="formModel"
        :model="formModel_Data"
        :rules="formModel_Rules"
        :disabled="formModel.disabled"
        label-width="160px"
        label-position="right"
      >
        <el-row :gutter="15">
          <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col
                v-if="formModel_Control.recvrShortNm.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="供应商简称" prop="recvrShortNm">
                  <el-input
                    v-model="formModel_Data.recvrShortNm"
                    placeholder="请输入供应商简称"
                    show-word-limit
                    :disabled="formModel_Control.recvrShortNm.disabled"
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
                <el-form-item label="供应商组别" prop="groupNo">
                  <mercurySelect
                    v-model="formModel_Data.groupNo"
                    :url="'/dict-item/REMT_SUPPLIER_GROUP'"
                    :fileType="{ label: 'name', value: 'code' }"
                    :dicttypeid="'REMT_SUPPLIER_GROUP'"
                    placeholder="请选择供应商组别"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col
                v-if="formModel_Control.country.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="收款人常驻国家(地区)" prop="country">
                  <mercurySelect
                    v-model="formModel_Data.country"
                    :url="'/dict-item/REMT_REMT_CNT'"
                    :fileType="{ label: 'name', value: 'code' }"
                    :dicttypeid="'REMT_REMT_CNT'"
                    placeholder="请选择收款人常驻国家(地区)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col
                v-if="formModel_Control.recvrAccNo.isShow"
                :span="8"
                :offset="8"
              >
                <el-form-item label="收款人账号" prop="recvrAccNo">
                  <el-input
                    v-model="formModel_Data.recvrAccNo"
                    placeholder="请输入收款人账号"
                    show-word-limit
                    :disabled="formModel_Control.recvrAccNo.disabled"
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
                <el-form-item label="收款人名称" prop="recvrName">
                  <el-input
                    v-model="formModel_Data.recvrName"
                    placeholder="请输入收款人名称"
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
                v-if="!txCom.dialogFlg"
                :span="2"
                :offset="txCom.dialogFlg ? 0 : 8"
              >
                <el-form-item>
                  <el-button
                    round
                    :style="{ width: '100px' }"
                    v-permission="'recvrMng:add'"
                    @click.native="formModel_btnAddClickHandler"
                  >新增</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="2"
                :offset="txCom.dialogFlg ? 9 : 0">
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
                    @click="search"
                  >查询</el-button>
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
      :data="formDataList"
      @row-click="getCurrentRow"
      @row-dblclick="returnDataForDialog"
      border
      highlight-current-row
      :height="txCom.pageHeight"
    >
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="index"
        align="center"
        :show-overflow-tooltip="true"
        :prop="item.prop"
        :min-width="item.width"
        :formatter="item.formatter"
        :label="item.label"
      />
      <el-table-column
        v-if="!txCom.dialogFlg"
        align="center"
        min-width="98"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="'recrMng:update'"
            type="text"
            @click="openUpdateModel(scope.row)"
            icon="el-icon-edit"
            >修改</el-button
          >
          <el-button
            type="text"
            icon="el-icon-more"
            @click="openDetailsModel(scope.row)"
            >查询</el-button
          >
        </template>
      </el-table-column>
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
    <recvr-dtl-add-or-update
      v-if="addOrUpdateVisible"
      ref="recvrAddOrUpdate"
      @closeDetailModel="detailsModelClose"
    />
  </div>
</template>

<script>
import { pageList, selectByIdObj, unlockById } from "@/api/remt/recvrMngApi";
import * as constants from "@/utils/constant.js";
import mercurySelect from "@/components/MercurySelect";
import RecvrDtlAddOrUpdate from "./recvrDtlAddOrUpdate";
import { checkDictItemCode } from "@/api/sysManagement/sysDictItemApi";

export default {
  components: { RecvrDtlAddOrUpdate, mercurySelect },
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
        pageSizes: constants.pageSizes,
        //总笔数
        total: 0,
        //弹窗标志
        dialogFlg: false,
        //动态高度
        pageHeight: "calc(100vh - 550px)",
        //当前行数据
        currRow: [],
      },
      //当前汇出汇款申请页面数据定义
      formDataList: [],
      //清单加载状态
      listLoading: false,
      //新增汇款申请页面按钮
      addOrUpdateVisible: "",
      //表格码值
      countryMap: {},
      groupNoMap: {},

      formModel: {
        isShow: true,
        disabled: false,
      },
      //查询字段定义
      formModel_Data: {
        recvrShortNm: null,
        groupNo: undefined,
        country: undefined,
        recvrAccNo: undefined,
        recvrName: undefined,
      },
      formModel_Control: {
        recvrShortNm: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        groupNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        country: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrAccNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrName: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
      },
      formModel_Rules: {
        recvrShortNm: [],
        groupNo: [],
        country: [],
        recvrAccNo: [],
        recvrName: [],
      },
      //表格表头
      tableHeader: [
        {
          label: "供应商简称",
          prop: "recvrShortNm",
          width: "150px",
        },
        {
          label: "组别",
          prop: "groupNo",
          width: "90px",
          formatter: (_, column, cellValue, index) => {
            return this.groupNoFormat(cellValue);
          },
        },
        { label: "收款人名称", prop: "recvrName", width: "180px" },
        { label: "收款人账号", prop: "recvrAccNo", width: "120px" },
        { label: "收款银行代码", prop: "recvrOpenBk", width: "100px" },
        {
          label: "常驻国家",
          prop: "country",
          width: "80px",
          formatter: (_, column, cellValue, index) => {
            return this.countryFormat(cellValue);
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: "110px",
          formatter: (_, column, cellValue, index) => {
            return this.createTimeFormat(cellValue);
          },
        },
      ],
    };
  },

  /**
   * mounted钩子函数，用于初始化数据
   */
  async mounted() {
    await checkDictItemCode("REMT_SUPPLIER_GROUP").then((response) => {
      if (response.data.errorCode === "000000") {
        response.data.data.forEach((element) => {
          this.groupNoMap[element.code] = element.name;
        });
      } else {
        this.$message({
          message: "获取业务组别字典数据失败：" + response.data.message,
          type: "error",
        });
      }
    });
    await checkDictItemCode("REMT_REMT_CNT").then((response) => {
      if (response.data.errorCode === "000000") {
        response.data.data.forEach((element) => {
          this.countryMap[element.code] = element.name;
        });
      } else {
        this.$message({
          message: "获取业务国别字典数据失败：" + response.data.message,
          type: "error",
        });
      }
    });
    this.getPageList();
  },

  /**
   * 自定义方法列表
   */
  methods: {
    //表格中取组别码值
    groupNoFormat(key) {
      return this.groupNoMap[key];
    },
    //表格中取国别码值
    countryFormat(key) {
      return this.countryMap[key];
    },
    //表格中的创建日期
    createTimeFormat(val){
      return val.toString();
    },
    //新增按钮
    formModel_btnAddClickHandler() {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.recvrAddOrUpdate.addInit("add");
      });
    },
    //修改或查询时，打开明细页面
    formModel_btnModOrQryClickHandler(row) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.recvrAddOrUpdate.modOrQry(row, this.txCom.operationButton);
      });
    },
    //查询
    getPageList() {
      this.listLoading = true;
      const params = Object.assign({}, this.formModel_Data, this.txCom);

      pageList(params).then((res) => {
        this.listLoading = false;

        if (res.data.errorCode === "000000") {
          this.formDataList = res.data.data.records;
          this.txCom.total = res.data.data.total;
        } else {
          this.$message({
            center: true,
            showClose: true,
            showIcon: true,
            message: res.data.data.errMsg,
            type: "error",
          });
        }
      });
    },

    /**
     * 搜索
     */
    search() {
      this.txCom.currentPage = 1;
      this.getPageList();
    },

    /**
     * 打开修改概述模态框
     */
    openUpdateModel(row) {
      //当前行数据
      this.txCom.currRow = row;
      //点击修改
      this.txCom.operationButton = "mod";

      //加锁判断且取回单笔数据，成功则显示明细页面，否则提示错误信息
      const params = {
        id: row.id,
        functionId: this.txCom.functionId,
        operationButton: this.txCom.operationButton,
      };

      selectByIdObj(params).then((res) => {
        this.listLoading = false;
        if (res.data.errorCode === "000000") {
          //打开明细页面
          this.formModel_btnModOrQryClickHandler(res.data.data);
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

    /**
     * 打开详情模态框
     */
    openDetailsModel(row) {
      //当前行数据
      this.txCom.currRow = row;
      //点击查询
      this.txCom.operationButton = "qry";

      //加锁判断且取回单笔数据，成功则显示明细页面，否则提示错误信息
      const params = {
        id: row.id,
        functionId: this.txCom.functionId,
        operationButton: this.txCom.operationButton,
      };

      selectByIdObj(params).then((res) => {
        this.listLoading = false;
        if (res.data.errorCode === "000000") {
          //打开明细页面
          this.formModel_btnModOrQryClickHandler(res.data.data);
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

    /**
     * 关闭详情模态框
     */
    detailsModelClose(unlockFlg, refreshFlg) {
      this.addOrUpdateVisible = false;
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

    /**
     * 当前页码发生变化的事件
     */
    currentPageChange(val) {
      this.txCom.currentPage = val;
      this.getPageList();
    },

    /**
     * 每页笔数发生变化的事件
     */
    pageSizeChange(val) {
      this.pageSize = val;
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
    returnDataForDialog() {
      if (!this.txCom.currRow) {
        this.$message({
          center: true,
          showClose: true,
          showIcon: true,
          message: "请选择供应商明细数据!",
          type: "error",
        });
        return;
      }
      if (this.txCom.dialogFlg) {
        //弹窗
        this.$emit(
          "closeRecvrMngDialog",
          this.txCom.currRow
        );
      } else {
        //维护-查询
        this.openDetailsModel(this.txCom.currRow);
      }
    },
    //新增初始化 - 父页面调用传值
    dialogInit(recvrAccNo, recvrName, country) {
      this.txCom.operationButton = "qry";
      this.txCom.dialogFlg = true;
      this.txCom.pageHeight = "calc(100vh - 500px)";
      this.formModel_Data.recvrAccNo = recvrAccNo;
      this.formModel_Data.recvrName = recvrName;
      this.formModel_Data.country = country;
      this.getPageList();
    },
    //重置
    resetFilterQuery(){
      this.formModel_Data = {};
    },
  },
};
</script>

