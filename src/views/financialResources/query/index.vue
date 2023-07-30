<template>
    <div class="app-container">
        <div class="filter-container">
            <!-- 查询表单 -->
            <el-form v-model="form" label-width="120px">
                <el-form-item label="交易日">
                    <el-date-picker
                        v-model="form.aplDtN"
                        type="daterange"
                        range-separator="至"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="交割日">
                    <el-date-picker
                        v-model="form.expDt"
                        type="daterange"
                        range-separator="至"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="交易状态">
                    <el-select v-model="form.tradeState" >
                        <el-option
                            v-for="item in txnStNOps" 
                            :key="item.label"
                            :label="item.label" 
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务品种">
                    <el-select v-model="form.bizName" >
                        <el-option
                            v-for="item in bsnNmOps" 
                            :key="item.label"
                            :label="item.label" 
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易渠道">
                    <el-select v-model="form.channelType" >
                        <el-option
                            v-for="item in channelTypeOps" 
                            :key="item.label"
                            :label="item.label" 
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="query_btn">
            <el-button round  @click="onReset">重置</el-button>
            <el-button round type="warning"  @click="getData(1)">查询</el-button>
        </div>
        <!-- 表格数据 -->
        <el-table 
            :data="tableData"
            v-loading="listLoading" 
            border 
            :header-cell-style="{ background: 'rgb(255, 248, 220)' }" highlight-current-row
            height="calc(100vh - 530px)"
        >
            <el-table-column 
                v-for="item in tableColumns"
                :key="item.label"
                :label="item.label" 
                :prop="item.col"
                :align="item.align"
            >
                <template  slot-scope="scope">
                    <span v-if="item.options">{{getLabelStr(scope.row[item.col],item.options)}}</span>
                    <span v-else-if="item.format">{{timeFormat(scope.row[item.col])}}</span>
                    <span v-else>{{scope.row[item.col]}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.bsnNm === 'SB'"
                            type="text"
                            @click="openUpdateModel(scope.row)"
                            icon="el-icon-edit"
                            >交割关联</el-button
                        >
                    </template>
            </el-table-column> -->
        </el-table>
        <div class="pagination-container">
            <!-- 分页组件 -->
            <Pagination
              :total="total"
              :page.sync="page.pageNum"
              :limit.sync="page.pageRowNum"
              @pagination="getData"
            />
        </div>
        <!-- 交割关联弹窗 -->
        <relevanvyDialog v-if="dialogVisible" :curRow="curRow" @dialogClose="dialogClose"/>
    </div>
    
</template>

<script>
import {
  queryTradeCZ,
} from "@/api/sysManagement/dkDemoApi"; //引入后端接口api
import Pagination from './components/Pagination.vue'
import { parseTime } from "@/utils/index"; // 引入parseTime公共方法用来处理时间格式
import relevanvyDialog from './components/relevanvyDialog.vue' //引入交割关联弹窗组件
export default {
    name: 'query',
    components: {
        Pagination,
        relevanvyDialog
    },
    data() {
        return {
            //表格每列的名称和字段
            tableColumns: [
                {
                    label: '业务编号',
                    col: 'bsnNo',
                    align: 'center'
                },{
                    label: '申请日',
                    col: 'aplDtN',
                    align: 'center'
                },{
                    label: '业务名称',
                    col: 'bsnNm',
                    align: 'center',
                    options: 'bsnNmOps'
                },{
                    label: '交易金额',
                    col: 'txnAmt',
                    align: 'center'
                },{
                    label: '汇率',
                    col: 'frxRate',
                    align: 'center'
                },{
                    label: '交割日',
                    col: 'expDt',
                    align: 'center',
                    format: 'date'
                },{
                    label: '交易状态',
                    col: 'txnStN',
                    align: 'center',
                    options: 'txnStNOps'
                },
            ],
            //表格数据
            tableData: [],
            // 分页参数
            page: {
                pageNum: 1,
                pageRowNum: 10
            },
            // 表格加载效果
            listLoading: false,
            // 总条数
            total: 0,
            // 表单数据
            form: {
                //申请日
                aplDtN:[parseTime(new Date(), "{yyyy}-{mm}-{dd}"),parseTime(new Date(), "{yyyy}-{mm}-{dd}")],
                //到期日
                expDt:[],
                //交易渠道
                channelType: 'ALL',
                // 业务品种
                bizName:'ALL'
            },
            //交易状态字典
            txnStNOps: [
                {
                    label: '新增（挂单已受理）',
                    value: '00'
                },{
                    label: '成交待确认（挂单已成功）',
                    value: '10'
                },{
                    label: '成交已确认',
                    value: '11'
                },{
                    label: '已终止',
                    value: '99'
                },{
                    label: '已否决',
                    value: '40'
                },{
                    label: '已取消',
                    value: '20'
                },{
                    label: '已删除',
                    value: '30'
                },{
                    label: '已撤销',
                    value: '50'
                },
            ],
            //业务品种字典
            bsnNmOps: [
                {
                    label: '全部',
                    value: 'ALL'
                },{
                    label: '即期全部',
                    value: 'SPOT'
                },{
                    label: '远期全部',
                    value: 'FWD'
                },{
                    label: '掉期全部',
                    value: 'SWAP'
                },{
                    label: '期权全部',
                    value: 'OPTION'
                },{
                    label: '即期结汇',
                    value: 'SS'
                },{
                    label: '即期购汇',
                    value: 'SB'
                },{
                    label: '即期外汇买卖',
                    value: 'SFX'
                },{
                    label: '远期结汇',
                    value: 'FS'
                },{
                    label: '远期购汇',
                    value: 'FB'
                },{
                    label: '远期外汇买卖',
                    value: 'FFX'
                },{
                    label: '加强型远期',
                    value: 'JQXYQ'
                },{
                    label: '加强型即期',
                    value: 'JQXJQ'
                },
            ],
            // 交易渠道字典
            channelTypeOps: [
                {
                    label: '全部',
                    value: 'ALL'
                },{
                    label: '柜面',
                    value: 'DK'
                },{
                    label: '网银',
                    value: 'NET-BANK'
                },
            ],
            //交割关联弹窗
            dialogVisible: false,
            // 点击的当前行数据
            curRow: {}
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 查询交易数据
        getData(page) {
            if(page === 1) this.page.pageNum = 1
            this.listLoading = true
            let params = {
                aplBegDate: this.form.aplDtN[0], // 申请日-开始
                aplEndDate: this.form.aplDtN[1], // 申请日-截止
                custId: '0000112058', //客户号
                dueDate: this.form.expDt[1], // 到期日-截止
                dueDates: this.form.expDt[0], // 到期日-开始
                ...this.page,
                ...this.form
            }
            queryTradeCZ(params).then(res => {
                this.listLoading = false
                console.log(res,'res');
                if(res.data.returnCode === '0000') {
                    this.tableData = res.data.bizList
                    this.total = +res.data.count
                }
            })
        },
        // 重置
        onReset() {
            this.form = {
            //   aplDtN:[],  
              aplDtN:[parseTime(new Date(), "{yyyy}-{mm}-{dd}"),parseTime(new Date(), "{yyyy}-{mm}-{dd}")],
              expDt:[],
              channelType: 'ALL',
              bizName:'ALL'  
            }
            this.getData(1)
        },
        // 转换码值
        getLabelStr(val,arr) {
            let obj = this[arr].find(item => val.includes(item.value))
            return obj ? obj.label : val
        },
        // 格式化时间
        timeFormat(time) {
            const regDate = /^(\d{4})(\d{2})(\d{2})$/
            return time.replace(regDate,'$1-$2-$3')
        },
        // 交割关联
        openUpdateModel(row) {
            this.dialogVisible = true
            this.curRow = row
        },
        // 子组件$emit的关闭弹窗的方法
        dialogClose(val) {
            if(val != '否') {
                this.dialogVisible = false
            }else {
                this.dialogVisible = false
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/.el-date-editor .el-range-separator {
    width: 10%;
}
.filter-container {
    display: flex;
    justify-content: center;
    .el-form {
        width: 500px;
        .el-select {
            width: 350px;
        }
    }
}
.query_btn {
    margin-bottom: 10px;
    text-align: center;
    .el-button {
        width: 100px;
    }
}
</style>