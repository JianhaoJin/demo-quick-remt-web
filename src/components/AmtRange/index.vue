<template>
  <div>
    <div class="input-number-range" > 
      <div class="flex">
        <div class="from">
          <el-input ref="input_from" v-model="userInputForm" placeholder="最小金额"  class="min_style"        
            @change="handleInputChangeFrom">
          </el-input>
        </div>

        <div class="center">
          <span>至</span>
        </div>

        <div class="to">
          <el-input ref="input_to" v-model="userInputTo" placeholder="最大金额"  class="max_style"
            @change="handleInputChangeTo">
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template> 
<script>
import { toFormAmt } from "@/utils/validate.js";
export default {
  name: 'AmtRange',
  props: {
    value: { required: true },
    precision: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      userInputForm: null,
      userInputTo: null
    }
  },
  watch: {
    value: {
      immediate: true,
      deep:true,
      handler(value) {
        if (value instanceof Array && this.precision !== undefined) {
          this.userInputForm = toFormAmt(value[0],this.precision)
          this.userInputTo = toFormAmt(value[1],this.precision)
        }
      }
    }
  },
  methods: {
    // 根据精度保留数字
    toPrecision(num, precision) {
      if (precision === undefined) precision = 2
      return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)).toFixed(2)
    },
    // from输入框change事件 
    handleInputChangeFrom(value) { // 如果是非数字空返回null
      if (isNaN(value) || value === '') {
        this.userInputForm=null
        this.$emit('input', [null, this.userInputTo])
        return
      }
      // 初始化数字精度 
      this.userInputForm = this.toPrecision(value)
      // 如果from > to 将from值替换成to
      if (typeof this.userInputTo === 'string') {this.userInputForm = parseFloat(this.userInputForm) <= parseFloat(this.userInputTo) ? this.userInputForm : this.userInputTo }
      this.$emit('input', [this.userInputForm, this.userInputTo])
    },
    // to输入框change事件 
    handleInputChangeTo(value) { // 如果是非数字空返回null
      if (isNaN(value) || value === '') {
        this.userInputTo=null
        this.$emit('input', [this.userInputForm,null])
        return
      }
      // 初始化数字精度
      this.userInputTo = this.toPrecision(value)
      if (typeof this.userInputForm === 'string') { this.userInputTo = parseFloat(this.userInputTo) >= parseFloat(this.userInputForm) ? this.userInputTo : this.userInputForm }
      this.$emit('input', [this.userInputForm, this.userInputTo])
    },
  }
}
</script>
<style lang="scss" scoped>
// 取消element原有的input框样式 
::v-deep .el-input--mini,
::v-deep .el-input__inner {
  border: 0px;
  margin: 0;
  text-align: center;
  background-color: transparent;
}
::v-deep  .max_style .el-input__inner {
    width: 100%;
    padding: 0px;
}

::v-deep  .min_style .el-input__inner {
    width: 100%;
    padding: 0px;
}
.input-number-range {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.flex {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: center;

  .from {
    width: 45%;
    padding: 0 0 0 5%;
  }
  .to{
    width: 40%;
    padding: 0;
  }
  .center {
    width: 4%;
    text-align: center;
    margin-top: 1px;
  }
}

</style>
