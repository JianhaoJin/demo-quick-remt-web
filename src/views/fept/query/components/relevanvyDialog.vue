<template>
  <el-dialog title="交割关联" width="830px" :visible.sync="dialogTableVisible">
    <div class="table_top">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <el-table v-loading="listLoading" :data="gridData" :header-cell-style="{ background: 'rgb(255, 248, 220)' }"  border max-height="350">
      <el-table-column property="bizNo" label="付汇编号" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.bizNo"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column property="bizCcy" label="交割币种" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.bizCcy">
            <el-option label="USD" value="USD"></el-option>
            <el-option label="EUR" value="EUR"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column property="bizAmt" label="交割金额" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.bizAmt"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column property="bizRemark" label="备注" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.bizRemark"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="del(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button class="btn" @click="confirm(0)">取消</el-button>
      <el-button class="btn orange" type="primary" @click="confirm(1)">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { quataAssociation } from '@/api/sysManagement/dkDemoApi'; //引入后端接口api
export default {
    name: 'greenDialog',
    data() {
        return {
            listLoading: false,
            // 绿色通道入口选择弹窗
            dialogTableVisible: true,
            // 绿色通道弹窗表格数据
            gridData: [
              {
                bizNo: '',
                bizCcy: '',
                bizAmt: '',
                bizRemark: ''
              }
            ],
        }
    },
    props: {
      curRow: {
        type: Object,
        default: {}
      }
    },
    created() {},
    methods: {
        // 绿色通道入口选择弹窗的下一步与取消
        // flag = 0 时，用户点击取消按钮
        // flag = 1 时，用户点击确认按钮
        confirm(flag) {
            if (!flag) {
                this.$emit('dialogClose','否')
                return;
            }else {
                // 开启loading
                this.listLoading = true
                let params = {
                    cifNo: '0000005332', //客户号(根据实际需求进行更改)
                    bizNo: this.curRow.bsnNo, //代客业务编号
                    tradeNo: this.curRow.txnId, //代客交易编号
                    payList: this.gridData
                }
                quataAssociation(params).then(res => {
                    // 关闭loading
                    this.listLoading = false
                    if(res.data.returnCode === '000000') {
                      //向父组件触发dialogClose方法
                      this.$emit('dialogClose',this.gridData)
                      this.$message.success(res.data.returnMsg)
                    }else {
                      this.$message.error(res.data.returnMsg);
                    }
                })
                
            }
        },
        //新增信息
        add() {
          //通过push方法 向表格新增数据信息
          this.gridData.push({
            bizNo: '',
            bizCcy: '',
            bizAmt: '',
            bizRemark: ''
          })
        },
        // 删除方法
        del(index) {
          // 通过获取用户点击的下标 删除表格数据
          this.gridData.splice(index,1)
        }
    }
};
</script>

<style lang="scss" scoped>
// dialog样式修改
/deep/.el-dialog {
  border-radius: 6px;
  .el-dialog__header {
    background: #fff;
    padding: 6px;
    height: 36px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    .el-dialog__title {
      font-size: 18px;
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
.table_top {
  margin-bottom: 10px;
}
</style>