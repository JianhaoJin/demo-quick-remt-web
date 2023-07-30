<template>
  <el-input
    v-model="userInput"
    placeholder="请输入金额"
    :disabled="disable"
    @blur="handleInputChangeFrom"
  ></el-input>
</template>
<script>
export default {
  name: "BussinessAmt",
  props: {
    value: {
      required: false,
    },
    precision: {
      type: Number,
      default: 2,
    },
    disable: {
      type:Boolean,
      required: false,
    },
  },
  data() {
    return {
      userInput: null,
    };
  },
  watch: {
    value:{
      handler(nVal){
        this.toFormAmt(nVal)
      }
    },
  },
  methods: {
    // from输入框blur事件
    handleInputChangeFrom(e) {
      e = e || window.event;
      let value = e.target.value;
      console.log(e.target.value);
      if (isNaN(value) || value === "" || value < 0) {
        this.userInput = null;
        this.$emit("inputmoney", null);
        return;
      }
    this.toFormAmt(value)
    },
    toFormAmt(value){
      // 根据精度保留数字
      this.userInput = parseFloat(
        Math.round(value * Math.pow(10, this.precision)) /
          Math.pow(10, this.precision)
      ).toFixed(this.precision);
      this.$emit("inputmoney", this.userInput);
    }
  },
};
</script>
