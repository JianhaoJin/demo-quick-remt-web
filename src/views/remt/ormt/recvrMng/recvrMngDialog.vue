<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    title="收款人名册查询"
    v-bind="$attrs"
    :visible.sync="visible"
    v-on="$listeners"
    width="80%"
  >
    <span slot="title">
      <div class="g-bt">收款人名册查询</div>
    </span>
    <recvr-mng-qry
      ref="recvrMngDialog"
      @closeRecvrMngDialog="closeRecvrMngDialog"
    />
    <span slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="warning" @click.native="confirmRecvr">确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import RecvrMngQry from "./index";
export default {
  components: { RecvrMngQry },
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
    //开窗页面传递页面上输入的收款人账号和名称到供应商列表页面中 - 作查询条件
    init(recvrAccNo, recvrName, country) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.recvrMngDialog.dialogInit(recvrAccNo, recvrName, country);
      });
    },
    //确认按钮 - 调用供应商列表页面中的数据返回方法 且 关闭弹窗 - 调用双击方法
    confirmRecvr() {
      this.$refs.recvrMngDialog.returnDataForDialog();
      this.visible = false;
    },
    //接收供应商列表页面发出的事件请求，向开窗页面转发事件请求 - 接收选择的收款人名册数据
    closeRecvrMngDialog(currRow) {
      this.$emit("closeRecvrMngDialog",currRow);
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
