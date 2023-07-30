<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    title="添加发票"
    v-bind="$attrs"
    :before-close="handleClose"
    :visible.sync="visible"
    v-on="$listeners"
    width="30%"
  >
    <span slot="title">
      <div class="g-bt">{{ spans }}</div>
    </span>
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="100px"
      class="demo-dynamic"
    >
      <el-form-item
        v-for="(contract, index) in dynamicValidateForm.contracts"
        :label="showLabel(index)"
        :key="contract.key"
        :prop="'contracts.' + index + '.value'"
      >
        <el-input style="width:80%" v-model="contract.value"></el-input
        ><el-button style="width:20%" type="text" @click.prevent="removeContract(contract)"
      >删除</el-button
      >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')"
        >提交</el-button
        >
        <el-button @click="addContract">新增{{ spans }}</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        dynamicValidateForm: {
          contracts: [
            {
              value: "",
            },
          ],
        },
        visible: false,
        type: null,
        spans: undefined,
      };
    },
    computed: {},
    methods: {
      showLabel(index) {
        var sum = index + 1;
        return this.spans + sum;
      },
      //添加合同号和发票号页面初始化
      init(contractParam, type) {
        this.type = type;
        this.visible = true;

        if ("contract" == type) {
          this.spans = "合同号";
        } else if ("invoice" == type) {
          this.spans = "发票号";
        }

        if (contractParam != "" && contractParam != undefined) {
          var contractsList = [];
          let split = contractParam.split(",");

          for (let i = 0; i < split.length; i++) {
            var contractsMap = {};
            const splitElement = split[i];
            contractsMap.value = splitElement;
            contractsMap.key = Date.now() + i;
            contractsList.push(contractsMap);
          }
          this.dynamicValidateForm.contracts = contractsList;
        } else {
          // this.addContract();
        }
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var contractlist = [];
            var contracts = this.dynamicValidateForm.contracts;
            for (const contract1 of contracts) {
              var contractValue = contract1.value;
              if (contractValue != "" && contractValue != undefined) {
                contractlist.push(contractValue);
              }
            }
            //参数回传父页面 - 刷新父页面
            this.$emit(
              "closeAddContractsDialog",
              contractlist.toString(),
              this.type
            );
            this.visible = false;
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      removeContract(item) {
        var index = this.dynamicValidateForm.contracts.indexOf(item);
        if (index !== -1) {
          this.dynamicValidateForm.contracts.splice(index, 1);
        }
      },
      addContract() {
        let length = this.dynamicValidateForm.contracts.length;
        if (length == 10) {
          return;
        }
        this.dynamicValidateForm.contracts.push({
          value: "",
          key: Date.now(),
        });
      },
      handleClose() {
        this.$confirm("确认关闭？")
          .then((_) => {
            this.visible = false;
            //参数回传父页面 - 刷新父页面
            this.$emit("closeAddContractsDialog");
          })
          .catch((_) => {});
      },
    },
  };
</script>
