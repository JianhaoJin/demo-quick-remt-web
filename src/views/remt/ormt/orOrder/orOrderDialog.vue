<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    title="订单查询"
    v-bind="$attrs"
    :visible.sync="visible"
    v-on="$listeners"
    width="80%"
  >
    <span slot="title">
      <div class="g-bt">订单查询</div>
    </span>
    <or-order-qry
      ref="orOrderDialog"
      @closeOrOrderDialog="closeOrOrderDialog"
    />
    <span slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="warning" @click.native="confirmOrder">确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import OrOrderQry from "./index";
export default {
  components: { OrOrderQry },
  props: [],
  data() {
    return {
      visible: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //开窗页面传递页面上输入的订单号到订单列表页面中 - 作查询条件
    init(orderNo, payerName) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.orOrderDialog.dialogInit(orderNo, payerName);
      });
    },
    //确认按钮 - 调用订单列表页面中的数据返回方法 且 关闭弹窗 - 调用双击方法
    confirmOrder() {
      this.$refs.orOrderDialog.returnDataForDialog();
      this.visible = false;
    },
    //接收订单列表页面发出的事件请求，向开窗页面转发事件请求 - 接收选择的订单数据
    closeOrOrderDialog(currRow) {
      this.$emit(
        "closeOrOrderDialog",
        currRow
      );
      this.visible = false;
    },
  },
};
</script>
<style scoped>
>>> .el-dialog__body {
  padding: 1px 20px;
}
</style>
