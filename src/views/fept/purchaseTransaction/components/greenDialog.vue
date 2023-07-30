<template>
  <el-dialog title="入口选择" :visible.sync="dialogTableVisible">
    <div class="contentTop">您即将操作T0购汇业务，请确认好真实性审核资料，以避免真实性不通过带来可能的汇兑损失</div>
    <el-table :data="gridData" max-height="350"  @selection-change="greenTableSelect" v-loading="listLoading">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column property="contractNo" label="合同编号" align="center" />
      <el-table-column property="totalGhAmt" label="购汇额度" align="center">
        <template slot-scope="scope">{{numFormat(scope.row.totalGhAmt)}}</template>
      </el-table-column>
      <el-table-column property="doneGhAmt" label="购汇金额" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.doneGhAmt"
            :disabled="getRowsSelection(scope.row)"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            @blur="moneyBlur($event,'doneGhAmt')"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div class="contentBottom">
      购汇金额合计：
      <span>{{numFormat(greenTotalAmt)}}</span>
    </div>
    <div slot="footer">
      <el-button class="btn" @click="confirm(0)">取消</el-button>
      <el-button class="btn orange" type="primary" @click="confirm(1)" :disabled="!greenTableSelections.length">下一步</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { greenBenefit } from '@/api/sysManagement/dkDemoApi'; //引入后端接口api
export default {
    name: 'greenDialog',
    data() {
        return {
            listLoading: false,
            // 绿色通道入口选择弹窗
            dialogTableVisible: true,
            // 绿色通道弹窗表格数据
            gridData: [],
            // 绿色通道弹窗购汇金额合计
            greenTotalAmt: 0,
            // 绿色通道弹窗当前选中的合同编号
            greenTableSelections: [],
        }
    },
    created() {
        this.getGreen()
    },
    methods: {
        // 查询绿色通道
        getGreen() {
            this.listLoading = true
            const params = {
                acct: '',
                ccy: '',
                channel: 'YQ',
                contractNo: '',
                kernelCredNo: '14452403-0',
                kernelCredType: '6',
                kernelNo: '0000005332',
                gwFlwNo: (new Date().getTime() + '').slice(5,13), //前台流水号
            }
            greenBenefit(params).then(res => {
                this.listLoading = false
                if(res.data.returnCode === '000000') {
                    this.gridData = res.data.conList
                }else {
                    this.$message.error(res.data.returnMsg)
                }
            })
        },
        // 增加千分符
        numFormat(num) {
            if(num === null || num === undefined || isNaN(num)) return 0;
            num = Number(num).toFixed(2);
            var res = num.toString().replace(/\d+/, function(n) { // 先提取整数部分
                return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) {
                    return $1 + ','
                })
            })
            return res
        },
        // 绿色通道弹窗复选框选择
        greenTableSelect(row) {
            this.greenTableSelections = row
            this.greenTotalAmt = row.reduce((pre,next) => {
                return Number(pre) + Number(next.doneGhAmt)
            },0.00)
        },
        // 控制表格购汇金额输入框是否禁用
        getRowsSelection(row) {
            let selected = this.greenTableSelections.length && this.greenTableSelections.indexOf(row) !== -1
            return !selected
        },
        // 绿色通道入口选择弹窗的下一步与取消
        // flag = 0 时，用户点击取消按钮
        // flag = 1 时，用户点击下一步按钮
        confirm(flag) {
            if (!flag) {
                this.$emit('dialogClose','否')
                return;
            }else {
                const contractList  = this.greenTableSelections.map((item) => {
                    return {
                      acct: item.ghOthAcct, //外币账号
                      buyAmt: item.doneGhAmt, //购汇金额
                      ccy: item.ghCcy, //交易币种
                      contractId: item.contractNo, //合同编号
                      limitId: item.serialNo, //额度ID
                      subAcct: '' //外币子账号
                    }
                  })
                this.$emit('dialogClose',contractList)
            }
        },
        // 主币种金额输入框
        moneyBlur(e,prop) {
            const val = e.target.value
            // 绿色通道弹窗购汇金额
            e.target.value = this.numFormat(val)
            this.greenTotalAmt = this.greenTableSelections.reduce((pre,next) => {
                return Number(pre) + Number(next.doneGhAmt)
            },0.00)
        },
    }
};
</script>

<style lang="scss" scoped>
// dialog样式修改
/deep/.el-dialog {
  border-radius: 6px;
  .el-dialog__header {
    // background: linear-gradient(to right, #fd9853 0%, #fdb54f 100%);
    background: #fff;
    padding: 6px;
    height: 36px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    .el-dialog__title {
      font-size: 14px;
      // color: #fff;
    }
    .el-dialog__headerbtn {
      top: 10px;
    }
  }
  .el-dialog__footer {
    text-align: center;
  }
  .el-table .el-input__inner {
    height: 28px;
    width: 150px;
  }
  .contentTop,
  .contentBottom {
    font-size: 15px;
    color: #000;
    font-weight: 800;
  }
  .contentTop {
    text-align: center;
  }
  .contentBottom {
    text-align: right;
  }
}
.btn {
    width: 100px;
    border-radius: 20px;
    border: 1px solid #ff6b20;
    color: #ff6f20;
    &:hover {
      background-color: #ff6f2024;
    }
  }
  .orange {
    background: #ff6b20;
    color: #fff;
    &:hover {
      background-color: #f35905;
    }
  }
</style>