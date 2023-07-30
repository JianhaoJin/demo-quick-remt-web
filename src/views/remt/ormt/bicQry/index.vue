<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="formModel" :model="formModel_Data" :rules="formModel_Rules" :disabled="formModel.disabled"
      label-width="160px" label-position="right">
      <el-row :gutter="15">
        <el-col :span="24" style="width:100%;">
          <el-row :gutter="15">
            <el-col v-if="formModel_Control.bankCode.isShow" :span="8" :offset="8">
              <el-form-item label="银行代码" prop="bankCode">
                <el-input v-model="formModel_Data.bankCode" 
                  placeholder="请输入银行代码" 
                  show-word-limit
                  :disabled="formModel_Control.bankCode.disabled" 
                  clearable 
                  :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        
        <el-col :span="24" style="width:100%;">
          <el-row :gutter="15">
            <el-col v-if="formModel_Control.institutionName.isShow" :span="8" :offset="8">
              <el-form-item label="银行名称" prop="institutionName">
                <el-input v-model="formModel_Data.institutionName" 
                  placeholder="请输入银行名称" 
                  show-word-limit
                  :disabled="formModel_Control.institutionName.disabled" 
                  clearable 
                  :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24" style="width:100%;">
          <el-row :gutter="15">
            <el-col v-if="formModel_Control.address.isShow" :span="8" :offset="8">
              <el-form-item label="银行地址" prop="address">
                <el-input v-model="formModel_Data.address" 
                  placeholder="请输入银行地址" 
                  show-word-limit
                  :disabled="formModel_Control.address.disabled" 
                  clearable 
                  :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        
        <el-col :span="24" style="width:100%;">
          <el-row :gutter="15">
            <el-col :span="2" :offset="9">
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
            <el-col  :span="2" :offset="0">
              <el-form-item>
                <el-button type="warning" 
                round
                :style="{ width: '100px' }"
                @click="search">查询</el-button>
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
      
      <el-table-column v-for="(item, index) in tableHeader"
                          :key="index"
                          align="center"
                          :show-overflow-tooltip="true"
                          :prop="item.prop"
                          :min-width="item.width"
                          :formatter="item.formatter"
                          :label="item.label"/>
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
     
  </div>

</template>

<script>
import {
  pageList,
} from "@/api/remt/bicMngApi";
import * as constants from "@/utils/constant.js";
import mercurySelect from "@/components/MercurySelect";

export default {

  components: { mercurySelect },
  data() {

    return {
      txCom: {
        //操作按钮 init-页面初始化, add-新增, mod-修改, del-删除, qry-查询, submit-经办提交, accept-复核提交, reject-驳回
        operationButton: "",
        //主表ID
        mainId: "",
        //交易码
        functionId: "bicMng",
        //交易名称
        functionName: "银行信息管理",
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

      formModel: {
        isShow: true,
        disabled: false
      },
      //查询字段定义
      formModel_Data: {
        bankCode: null,
        institutionName: undefined,
        address: undefined,
      },
      formModel_Control: {
        bankCode: {
          isShowType: 'v-if',
          isShow: true,
          disabled: false,
        },
        institutionName: {
          isShowType: 'v-if',
          isShow: true,
          disabled: false,
        },
        address: {
          isShowType: 'v-if',
          isShow: true,
          disabled: false,
        },
      },
      formModel_Rules: {
        bankCode: [],
        institutionName: [],
        address: [],
      },
      //表格表头
      tableHeader: [
        { label: '银行代码', prop: 'bicCode', width: '80px'},
        { label: '分支行', prop: 'branchCode', width: "70px"},
        { label: '银行机构名称', prop: 'institutionName', width: "220px" },
        { label: '分支行信息', prop: 'branchInfo', width: "160px" },
        { label: '国家名称', prop: 'countryName', width: "100px" },
        { label: '城市名', prop: 'cityHeading', width: "100px" },
        { label: '银行地址1', prop: 'address1', width: "120px"},
        { label: '银行地址2', prop: 'address2', width: "120px"},
        { label: '银行地址3', prop: 'address3', width: "120px"},
        { label: '银行地址4', prop: 'address4', width: "120px"},
      ],
      
    };
  },

  /**
   * mounted钩子函数，用于初始化数据
   */
  mounted() {
    this.getPageList();
  },

  /**
   * 自定义方法列表
   */
  methods: {
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
     getCurrentRow(row){
       if(row){
         this.txCom.currRow = row;
       }
     },
     /**
      * 表格双击时返回当前数据给父页面
      */
     returnDataForDialog(){
       if(!this.txCom.currRow){
         this.$message({
              center: true,
              showClose: true,
              showIcon: true,
              message: "请选择银行信息明细数据!",
              type: "error",
            });
          return;
       }
       if(this.txCom.dialogFlg){
         //弹窗
         this.$emit('closeBicMngDialog', this.txCom.currRow.bicCode+this.txCom.currRow.branchCode,this.txCom.currRow.institutionName)
       }
     },
     //新增初始化 - 父页面调用传值
    dialogInit(bankCode,institutionName) {
      this.txCom.operationButton = "qry";
      this.txCom.dialogFlg = true;
      this.txCom.pageHeight = "calc(100vh - 500px)";
      this.formModel_Data.bankCode = bankCode;
      this.formModel_Data.institutionName = institutionName;
      this.getPageList();
    },
    //重置
    resetFilterQuery(){
      this.formModel_Data = {};
    },
  },
};
</script>

