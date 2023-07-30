<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    title="银行信息查询"
    v-bind="$attrs"
    :visible.sync="visible"
    v-on="$listeners"
    width="80%"
  >
    <span slot="title">
      <div class="g-bt">银行信息查询</div>
    </span>
    <bic-mng-qry
      ref="bicMngDialog"
      @closeBicMngDialog="closeBicMngDialog"
    />
      <span slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="warning" @click.native="confirmRecvr">确认</el-button> 
    </span>
  </el-dialog>

</template>
<script>
import BicMngQry from "./index";
export default {
  components: { BicMngQry },
  props: [],
  data() {
    return {
      visible: false,
      type:null,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //开窗页面传递页面上输入的银行代码和名称到银行信息列表页面中 - 作查询条件
    init(type,bankCode,institutionName) {
      this.visible = true;
      this.type = type;
      this.$nextTick(() => {
        this.$refs.bicMngDialog.dialogInit(bankCode,institutionName);
      });
    },
    //确认按钮 - 调用银行信息列表页面中的数据返回方法 且 关闭弹窗 - 调用双击方法
    confirmRecvr() {
      this.$refs.bicMngDialog.returnDataForDialog()
      this.visible = false
    },
    //接收供应商列表页面发出的事件请求，向开窗页面转发事件请求 - 接收选择的收款人名册数据
    closeBicMngDialog(bankCode,institutionName){
      this.$emit('closeBicMngDialog',this.type, bankCode, institutionName)
      this.visible = false
    },
  },
};
</script>
<style scoped>
>>> .el-dialog__body {
  padding:1px 20px;
}
</style>
