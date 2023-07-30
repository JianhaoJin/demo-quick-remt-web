<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose"
    title="汇出汇款申请"
    v-bind="$attrs"
    :visible.sync="visible"
    v-on="$listeners"
    :fullscreen="true"
  >
    <span slot="title">
      <div class="dialog-title"><span>汇出汇款申请</span></div>
    </span>
    <el-form
      ref="formModel"
      :model="formModel_Data"
      :rules="formModel_Rules"
      :disabled="formModel.disabled"
      label-width="180px"
      label-position="right"
    >
      <el-row :gutter="15">
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col :span="8" :offset="8">
              <span>&nbsp;</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.orderNo.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="关联订单" prop="orderNo">
                <el-input
                  v-model="formModel_Data.orderNo"
                  placeholder="请输入关联订单"
                  show-word-limit
                  :disabled="formModel_Control.orderNo.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-button
                type="text"
                :disabled="formModel_Control.searchOrOrderButton.disabled"
                @click.native="searchOrOrder"
                >订单选择</el-button
              >
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.remtType.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="汇款类型" prop="remtType">
                <el-radio-group
                  v-model="formModel_Data.remtType"
                  :disabled="formModel_Control.remtType.disabled"
                >
                  <el-radio
                    v-for="(item, index) in formModel_Control_remtTypeOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>


        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.payerName.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="汇款人名称" prop="payerName">
                <el-input
                  v-model="formModel_Data.payerName"
                  placeholder="请输入汇款人名称"
                  show-word-limit
                  :disabled="formModel_Control.payerName.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.remtCcy.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="币种" prop="remtCcy">
                <mercurySelect
                  v-model="formModel_Data.remtCcy"
                  :url="'/dict-item/REMT_REMT_CCY'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_REMT_CCY'"
                  :disabled="formModel_Control.remtCcy.disabled"
                  placeholder="币种"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.remtAmt.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="汇款金额" prop="remtAmt">
                <bussiness-amt
                  :disable="formModel_Control.remtAmt.disabled"
                  :value="formModel_Data.remtAmt"
                  :precision="precision"
                  v-model="formModel_Data.remtAmt"
                  @inputmoney="inputmoney"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.fundSource.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="汇款人账号" prop="fundSource">
                <mercurySelect
                  v-model="formModel_Data.fundSource"
                  :disabled="formModel_Control.fundSource.disabled"
                  :url="'/dict-item/REMT_FUND_FROM'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_FUND_FROM'"
                  placeholder="汇款人账号"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.transCode.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="交易编码" prop="transCode">
                <mercurySelect
                  :disabled="formModel_Control.transCode.disabled"
                  v-model="formModel_Data.transCode"
                  :url="'/dict-item/REMT_REMT_TX_CODE_OUT'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_REMT_TX_CODE_OUT'"
                  placeholder="交易编码"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24" style="width: 100%">
            <el-row :gutter="15">
              <el-col
                v-if="formModel_Control.goodsServices.isShow"
                :span="8"
                :offset="7"
              >
                <el-form-item label="货物/服务" prop="goodsServices">
                  <el-input
                    v-model="formModel_Data.goodsServices"
                    placeholder="请输入货物/服务"
                    show-word-limit
                    :disabled="formModel_Control.goodsServices.disabled"
                    clearable
                    :style="{ width: '100%' }"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.imType.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="业务类型" prop="imType">
                <mercurySelect
                  v-model="formModel_Data.imType"
                  :disabled="formModel_Control.imType.disabled"
                  :url="'/dict-item/REMT_IM_TYPE'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_IM_TYPE'"
                  placeholder="业务类型"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.recvrAccNo.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款人账号" prop="recvrAccNo">
                <el-input
                  v-model="formModel_Data.recvrAccNo"
                  placeholder="请输入收款人账号"
                  show-word-limit
                  :disabled="formModel_Control.recvrAccNo.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-button
                type="text"
                :disabled="formModel_Control.searchRecvrMngButton.disabled"
                @click.native="searchRecvrMng"
                >收款人名册</el-button
              >
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.recvrName.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款人名称" prop="recvrName">
                <el-input
                  v-model="formModel_Data.recvrName"
                  placeholder="请输入收款人名称"
                  show-word-limit
                  :disabled="formModel_Control.recvrName.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.recvrAddr.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款人地址" prop="recvrAddr">
                <el-input
                  v-model="formModel_Data.recvrAddr"
                  placeholder="请输入收款人地址"
                  show-word-limit
                  :disabled="formModel_Control.recvrAddr.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.country.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款人常驻国家(地区)" prop="country">
                <mercurySelect
                  v-model="formModel_Data.country"
                  :disabled="formModel_Control.country.disabled"
                  :url="'/dict-item/REMT_REMT_CNT'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_REMT_CNT'"
                  placeholder="收款人常驻国家(地区)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.useAgentFlg.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="是否使用代理行" prop="useAgentFlg">
                <el-radio-group
                  v-model="formModel_Data.useAgentFlg"
                  :disabled="formModel_Control.useAgentFlg.disabled"
                >
                  <el-radio
                    v-for="(item,
                    index) in formModel_Control_useAgentFlgOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.remtRoute.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="汇款途径" prop="remtRoute">
                <mercurySelect
                  v-model="formModel_Data.remtRoute"
                  :disabled="formModel_Control.remtRoute.disabled"
                  :url="'/dict-item/REMT_REMT_ROUT'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_REMT_ROUT'"
                  placeholder="汇款途径"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.agentBic.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="代理银行代码" prop="agentBic">
                <el-input
                  v-model="formModel_Data.agentBic"
                  placeholder="请输入代理银行代码"
                  show-word-limit
                  :disabled="formModel_Control.agentBic.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-button
                :disabled="formModel_Control.bicMngAagentButton.disabled"
                type="text"
                @click.native="searchBicMng('agent')"
                >查询收款行</el-button
              >
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.agentName.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="代理银行名称" prop="agentName">
                <el-input
                  v-model="formModel_Data.agentName"
                  placeholder="请输入代理银行名称"
                  show-word-limit
                  :disabled="formModel_Control.agentName.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.agentAccNo.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款银行在其代理行账号" prop="agentAccNo">
                <el-input
                  v-model="formModel_Data.agentAccNo"
                  placeholder="请输入收款银行在其代理行账号"
                  show-word-limit
                  :disabled="formModel_Control.agentAccNo.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.clsFlag.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款人开户银行代码类型" prop="clsFlag">
                <mercurySelect
                  v-model="formModel_Data.clsFlag"
                  :disabled="formModel_Control.clsFlag.disabled"
                  :url="'/dict-item/REMT_CLS_FLAG'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_CLS_FLAG'"
                  placeholder="收款人开户银行代码类型"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.recvrOpenBk.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款人开户银行代码" prop="recvrOpenBk">
                <el-input
                  v-model="formModel_Data.recvrOpenBk"
                  placeholder="请输入收款人开户银行代码"
                  show-word-limit
                  :disabled="formModel_Control.recvrOpenBk.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-button
                type="text"
                :disabled="
                  formModel_Control.bicMngAagentOpenAccountButton.disabled
                "
                @click.native="searchBicMng('openAccount')"
                >查询收款行</el-button
              >
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.recvrOpenBknm.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="收款人开户银行名称" prop="recvrOpenBknm">
                <el-input
                  v-model="formModel_Data.recvrOpenBknm"
                  placeholder="请输入收款人开户银行名称"
                  show-word-limit
                  :disabled="formModel_Control.recvrOpenBknm.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.payProp.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="资金性质" prop="payProp">
                <mercurySelect
                  v-model="formModel_Data.payProp"
                  :disabled="formModel_Control.payProp.disabled"
                  :url="'/dict-item/REMT_PAY_PROP'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_PAY_PROP'"
                  placeholder="资金性质"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.baosuiPay.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="是否保税货物项下贷款" prop="baosuiPay">
                <el-radio-group
                  v-model="formModel_Data.baosuiPay"
                  :disabled="formModel_Control.baosuiPay.disabled"
                >
                  <el-radio
                    v-for="(item, index) in formModel_Control_baosuiPayOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.invoices.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="发票号" prop="invoices">
                <el-input
                  v-model="formModel_Data.invoices"
                  placeholder="请输入发票号"
                  show-word-limit
                  :disabled="formModel_Control.invoices.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-button
                type="text"
                :disabled="formModel_Control.addContractsInvoiceButton.disabled"
                @click.native="addContracts('invoice')"
                >添加发票号</el-button
              >
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.contracts.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="合同号" prop="contracts">
                <el-input
                  v-model="formModel_Data.contracts"
                  placeholder="请输入合同号"
                  show-word-limit
                  :disabled="formModel_Control.contracts.disabled"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-button
                type="text"
                :disabled="
                  formModel_Control.addContractsContractButton.disabled
                "
                @click.native="addContracts('contract')"
                >添加合同号</el-button
              >
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col v-if="formModel_Control.feeBy.isShow" :span="8" :offset="7">
              <el-form-item label="费用承担方" prop="feeBy">
                <mercurySelect
                  v-model="formModel_Data.feeBy"
                  :disabled="formModel_Control.feeBy.disabled"
                  :url="'/dict-item/REMT_FEE_BY'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_FEE_BY'"
                  placeholder="费用承担方"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.feeAcc.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="费用账号" prop="feeAcc">
                <mercurySelect
                  v-model="formModel_Data.feeAcc"
                  :disabled="formModel_Control.feeAcc.disabled"
                  :url="'/dict-item/REMT_FUND_FROM'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_FUND_FROM'"
                  placeholder="费用账号"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.feeAccCcy.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="费用币种" prop="feeAccCcy">
                <mercurySelect
                  v-model="formModel_Data.feeAccCcy"
                  :url="'/dict-item/REMT_REMT_CCY'"
                  :fileType="{ label: 'name', value: 'code' }"
                  :dicttypeid="'REMT_REMT_CCY'"
                  :disabled="formModel_Control.feeAccCcy.disabled"
                  placeholder="请输入费用币种"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.fullFlag.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="是否全额到账" prop="fullFlag">
                <el-radio-group
                  v-model="formModel_Data.fullFlag"
                  :disabled="formModel_Control.fullFlag.disabled"
                >
                  <el-radio
                    v-for="(item,
                    index) in formModel_Control_useAgentFlgOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.remtRemark.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="汇款附言" prop="remtRemark">
                <el-input
                  v-model="formModel_Data.remtRemark"
                  type="textarea"
                  placeholder="请输入汇款附言"
                  show-word-limit
                  :disabled="formModel_Control.remtRemark.disabled"
                  :autosize="{ minRows: 4, maxRows: 4 }"
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" style="width: 100%">
          <el-row :gutter="15">
            <el-col
              v-if="formModel_Control.fileUpLoad.isShow"
              :span="8"
              :offset="7"
            >
              <el-form-item label="附件上传" prop="fileUpLoad">
                <el-upload
                  ref="fileUpLoad"
                  action=""
                  :http-request="httpRequest"
                  :on-preview="handlePreview"
                  :on-change="handleChange"
                  :before-upload="beforeUpload"
                  :auto-upload="true"
                  multiple
                  :limit="5"
                  accept="*/*"
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                >
                  <el-button
                    size="small"
                    type="primary"
                    v-permission="'orOpenApply:upload'"
                    :disabled="formModel_Control.clickUploadButton.disabled"
                    >点击上传</el-button
                  >
                  <div slot="tip">支持单个文件10M,最多50M</div>
                  <!-- <el-progress class="progress" :stroke-width="5" :percentage="percentage"></el-progress> -->
                  <div slot="file" slot-scope="{ file }">
                    <i class="el-icon-paperclip"></i>
                    <span class="file-name">{{ file.name }}</span>
                    <i
                      v-if="file.status === 'success'"
                      class="el-icon-success"
                    ></i>
                    <i
                      v-if="['ready', 'uploading'].indexOf(file.status) !== -1"
                      class="el-icon-question"
                    ></i>
                    <i
                      v-if="['failed', 'error'].indexOf(file.status) !== -1"
                      class="el-icon-error"
                    ></i>
                    <span calss="file-actions" class="el-file-button">
                      <el-button
                        type="text"
                        :disabled="formModel_Control.clickUploadButton.disabled"
                        v-if="
                          ['ready', 'uploading'].indexOf(file.status) === -1
                        "
                        size="mini"
                        @click.prevent.stop="confirmHandleRemove(file)"
                        ><span :class="deleteFileClass"
                          >删除</span
                        ></el-button
                      >
                      <el-button
                        type="text"
                        :disabled="formModel_Control.clickUploadButton.disabled"
                        v-if="['failed', 'error'].indexOf(file.status) !== -1"
                        size="mini"
                        @click.prevent.stop="reHttpRequest(file)"
                        >重新上传</el-button
                      >
                    </span>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <recvr-mng-dialog
      v-if="recvrMngDialogVisible"
      ref="recvrMngDialog"
      @closeRecvrMngDialog="closeRecvrMngDialog"
    />
    <or-order-dialog
      v-if="orOrderDialogVisible"
      ref="orOrderDialog"
      @closeOrOrderDialog="closeOrOrderDialog"
    />
    <add-contracts
      v-if="addContractsDialogVisible"
      ref="addContracts"
      @closeAddContractsDialog="closeAddContractsDialog"
    />
    <bic-mng-dialog
      v-if="bicMngDialogVisible"
      ref="bicMngDialog"
      @closeBicMngDialog="closeBicMngDialog"
    />
    <span slot="footer">
      <button-group
        v-if="visible"
        @closeTab="closeTab"
        v-on="$listeners"
        :operationButton="rowData.remtStatus"
        :reqType="reqType"
        :afterFromData="formModel_Data"
      />
    </span>
  </el-dialog>
</template>
<script>
import mercurySelect from "@/components/MercurySelect";
import { checkDictItemCode } from "@/api/sysManagement/sysDictItemApi";
import BussinessAmt from "@/components/BussinessAmt";
import * as unifyTradeApi from "@/api/sysManagement/unifyTradeApi";
import { fileUp,deleteUpFile } from "@/api/sysManagement/fileUpDownApi.js";
import util from "@/utils/common.js";
import ButtonGroup from "../buttonGroup";
import RecvrMngDialog from "../recvrMng/recvrMngDialog";
import OrOrderDialog from "../orOrder/orOrderDialog";
import AddContracts from "@/components/AddContracts";
import BicMngDialog from "../bicQry/bicMngDialog";
import { toFormAmt } from "@/utils/validate.js";
import vue from "@/main";

export default {
  components: {
    mercurySelect,
    BussinessAmt,
    ButtonGroup,
    RecvrMngDialog,
    OrOrderDialog,
    AddContracts,
    BicMngDialog,
  },
  props: [],
  data() {
    return {
      precision: 2, // 精度
      fileList: [],
      deleteFileClass:'el-file-button-delete',
      visible: false,
      addContractsDialogVisible: false,
      operationButton: undefined,
      reqType: undefined,
      isWatch: true,
      formDataList: ["formModel"],
      activeFormTab: "formModel",
      formModel: {
        isShow: true,
        disabled: false,
      },
      recvrMngDialogVisible: false,
      orOrderDialogVisible: false,
      bicMngDialogVisible: false,
      recvrMngData:{},
      orOrderData:{},
      rowData: {},
      formModel_Data: {
        orderNo: undefined,
        remtType: undefined,
        payerName: undefined,
        remtCcy: undefined,
        remtAmt: undefined,
        fundSource: undefined,
        transCode: undefined,
        imType: undefined,
        goodsServices:undefined,
        recvrAccNo: undefined,
        recvrName: undefined,
        recvrAddr: undefined,
        country: undefined,
        useAgentFlg: "N",
        remtRoute: undefined,
        agentBic: undefined,
        agentName: undefined,
        agentAccNo: undefined,
        recvrOpenBk: undefined,
        recvrOpenBknm: undefined,
        clsFlag: undefined,
        payProp: undefined,
        baosuiPay: "0",
        invoices: undefined,
        contracts: undefined,
        feeBy: undefined,
        feeAcc: undefined,
        feeAccCcy: undefined,
        fullFlag:undefined,
        remtRemark: undefined,
        fileUpLoad: null,
      },
      formModel_Control: {
        orderNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        remtType: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        payerName: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        remtCcy: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        remtAmt: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        fundSource: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        transCode: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        imType: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        goodsServices: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        recvrAccNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrName: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrAddr: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        country: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        useAgentFlg: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        remtRoute: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        agentBic: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        agentName: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        agentAccNo: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        recvrOpenBk: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        recvrOpenBknm: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        clsFlag: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        payProp: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        baosuiPay: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        invoices: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        contracts: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        feeBy: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        feeAcc: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        feeAccCcy: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        fullFlag: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        remtRemark: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        fileUpLoad: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        field177: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
          url: undefined,
        },
        field178: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
          url: undefined,
        },
        searchOrOrderButton: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        searchRecvrMngButton: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        bicMngAagentButton: {
          isShowType: "v-if",
          isShow: true,
          disabled: true,
        },
        bicMngAagentOpenAccountButton: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        addContractsInvoiceButton: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        addContractsContractButton: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
        clickUploadButton: {
          isShowType: "v-if",
          isShow: true,
          disabled: false,
        },
      },
      formModel_Rules: {
        orderNo: [
          {
            required: true,
            message: "请输入关联订单",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入关联订单",
            trigger: "change",
          },
        ],
        remtType: [
          {
            required: true,
            message: "请输入汇款类型",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入汇款类型",
            trigger: "change",
          },
        ],
        payerName: [
          {
            required: true,
            message: "请输入汇款人名称",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入汇款人名称",
            trigger: "change",
          },
        ],
        remtCcy: [
          {
            required: true,
            message: "请输入币种",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入币种",
            trigger: "change",
          },
        ],
        remtAmt: [
          {
            required: true,
            message: "请输入汇款金额",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入汇款金额",
            trigger: "change",
          },
        ],
        fundSource: [
          {
            required: true,
            message: "请输入汇款人账号",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入汇款人账号",
            trigger: "change",
          },
        ],
        transCode: [
          {
            required: true,
            message: "请输入交易编码",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入交易编码",
            trigger: "change",
          },
        ],
        imType: [
          {
            required: true,
            message: "请输入业务类型",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入业务类型",
            trigger: "change",
          },
        ],
        goodsServices: [
          {
            required: false,
            message: "请输入货物/服务",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入货物/服务",
            trigger: "change",
          },
        ],
        recvrAccNo: [
          {
            required: true,
            message: "请输入收款人账号",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入收款人账号",
            trigger: "change",
          },
        ],
        recvrName: [
          {
            required: true,
            message: "请输入收款人名称",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入收款人名称",
            trigger: "change",
          },
        ],
        recvrAddr: [
          {
            required: false,
            message: "请输入收款人地址",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入收款人地址",
            trigger: "change",
          },
        ],
        country: [
          {
            required: true,
            message: "请输入收款人常驻国家(地区)",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入收款人常驻国家(地区)",
            trigger: "change",
          },
        ],
        useAgentFlg: [
          {
            required: false,
            message: "请输入是否使用代理行",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入是否使用代理行",
            trigger: "change",
          },
        ],
        remtRoute: [
          {
            required: true,
            message: "请输入汇款途径",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入汇款途径",
            trigger: "change",
          },
        ],
        agentBic: [
          {
            required: false,
            message: "请输入代理银行代码",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入代理银行代码",
            trigger: "change",
          },
        ],
        agentName: [
          {
            required: false,
            message: "请输入代理银行名称",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入代理银行名称",
            trigger: "change",
          },
        ],
        agentAccNo: [
          {
            required: false,
            message: "请输入收款银行在其代理行账号",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入收款银行在其代理行账号",
            trigger: "change",
          },
        ],
        recvrOpenBk: [
          {
            required: true,
            message: "请输入收款人开户银行代码",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入收款人开户银行代码",
            trigger: "change",
          },
        ],
        recvrOpenBknm: [
          {
            required: true,
            message: "请输入收款人开户银行名称",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入收款人开户银行名称",
            trigger: "change",
          },
        ],
        clsFlag: [
          {
            required: true,
            message: "请输入收款人开户银行代码类型",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入收款人开户银行代码类型",
            trigger: "change",
          },
        ],
        payProp: [
          {
            required: false,
            message: "请输入资金性质",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入资金性质",
            trigger: "change",
          },
        ],
        baosuiPay: [
          {
            required: true,
            message: "请输入是否保税货物项下贷款",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入是否保税货物项下贷款",
            trigger: "change",
          },
        ],
        invoices: [
          {
            required: false,
            message: "请输入发票号",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入发票号",
            trigger: "change",
          },
        ],
        contracts: [
          {
            required: false,
            message: "请输入合同号",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入合同号",
            trigger: "change",
          },
        ],
        feeBy: [
          {
            required: true,
            message: "请输入费用承担方",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入费用承担方",
            trigger: "change",
          },
        ],
        feeAcc: [
          {
            required: false,
            message: "请输入费用账号",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入费用账号",
            trigger: "change",
          },
        ],
        feeAccCcy: [
          {
            required: false,
            message: "请输入费用币种",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入费用币种",
            trigger: "change",
          },
        ],
        fullFlag: [
          {
            required: false,
            message: "请选择是否全额到账",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入是否全额到账",
            trigger: "change",
          },
        ],
        remtRemark: [
          {
            required: false,
            message: "请输入汇款附言",
            trigger: "blur",
          },
          {
            required: false,
            message: "请输入汇款附言",
            trigger: "change",
          },
        ],
      },
      fileUpLoadAction: "https://jsonplaceholder.typicode.com/posts/",
      formModel_Control_remtTypeOptions: [],
      formModel_Control_payerNameOptions: [
        {
          label: "xx公司",
          value: 1,
        },
        {
          label: "zz公司",
          value: 2,
        },
      ],
      formModel_Control_remtCcyOptions: [
        {
          label: "USD",
          value: 1,
        },
        {
          label: "CNY",
          value: 2,
        },
      ],
      formModel_Control_fundSourceOptions: [
        {
          label: "123456",
          value: 1,
        },
        {
          label: "789101",
          value: 2,
        },
      ],
      formModel_Control_transCodeOptions: [
        {
          label: "10086",
          value: 1,
        },
        {
          label: "20086",
          value: 2,
        },
      ],
      formModel_Control_imTypeOptions: [
        {
          label: "swift",
          value: 1,
        },
        {
          label: "境内外币？",
          value: 2,
        },
      ],
      formModel_Control_useAgentFlgOptions: [],
      formModel_Control_baosuiPayOptions: [],
      formModel_Control_feeByOptions: [],
    };
  },
  computed: {},
  watch: {
    "formModel_Data.remtCcy":{
      handler(val) {
        if(val==='JPY'){
          this.precision = 0
        }else{
          this.precision = 2
        }
        this.formModel_Data.remtAmt = toFormAmt(this.formModel_Data.remtAmt,this.precision)
      }
    },
    "formModel_Data.useAgentFlg": {
      handler(val) {
        if (!this.isWatch) {
          return;
        }
        if (val === "Y") {
          this.formModel_Control.agentBic.disabled = false;
          this.formModel_Control.agentName.disabled = false;
          this.formModel_Control.agentAccNo.disabled = false;
          this.formModel_Control.bicMngAagentButton.disabled = false;
          this.formModel_Rules.agentBic[0].required = true;
          this.formModel_Rules.agentBic[1].required = true;
          this.formModel_Rules.agentName[0].required = true;
          this.formModel_Rules.agentName[1].required = true;
          this.formModel_Rules.agentAccNo[0].required = false;
          this.formModel_Rules.agentAccNo[1].required = false;
        } else {
          this.formModel_Control.agentBic.disabled = true;
          this.formModel_Control.agentName.disabled = true;
          this.formModel_Control.agentAccNo.disabled = true;
          this.formModel_Control.bicMngAagentButton.disabled = true;

          this.formModel_Rules.agentBic[0].required = false;
          this.formModel_Rules.agentBic[1].required = false;
          this.formModel_Rules.agentName[0].required = false;
          this.formModel_Rules.agentName[1].required = false;
          this.formModel_Rules.agentAccNo[0].required = false;
          this.formModel_Rules.agentAccNo[1].required = false;
          this.formModel_Data.agentBic = undefined;
          this.formModel_Data.agentName = undefined;
          this.formModel_Data.agentAccNo = undefined;
          this.$refs['formModel'].clearValidate(['agentBic'])
          this.$refs['formModel'].clearValidate(['agentName'])
          this.$refs['formModel'].clearValidate(['agentAccNo'])
        }
      },
    },
    "formModel_Data.feeBy": {
      handler(val) {
        if (!this.isWatch) {
          return;
        }
        if (val != "BEN") {
          this.formModel_Control.feeAcc.disabled = false;
          this.formModel_Control.feeAccCcy.disabled = false;

          this.formModel_Rules.feeAcc[0].required = true;
          this.formModel_Rules.feeAcc[1].required = true;
          this.formModel_Rules.feeAccCcy[0].required = true;
          this.formModel_Rules.feeAccCcy[1].required = true;
        } else {
          this.formModel_Control.feeAcc.disabled = true;
          this.formModel_Control.feeAccCcy.disabled = true;

          this.formModel_Rules.feeAcc[0].required = false;
          this.formModel_Rules.feeAcc[1].required = false;
          this.formModel_Rules.feeAccCcy[0].required = false;
          this.formModel_Rules.feeAccCcy[1].required = false;

          this.formModel_Data.feeAcc = undefined;
          this.formModel_Data.feeAccCcy = undefined;
        }
      },
    },
    "formModel_Data.transCode": {
      handler(val) {
        if (!this.isWatch) {
          return;
        }
        if(val==null || val == undefined){
          return
        }
        if(val.startsWith('1')){
          this.formModel_Control.goodsServices.disabled = false
          this.formModel_Rules.goodsServices[0].required = true
          this.formModel_Rules.goodsServices[1].required = true
          if(this.formModel_Data.goodsServices===null
          || this.formModel_Data.goodsServices===undefined
          || this.formModel_Data.goodsServices===''){
            this.formModel_Data.goodsServices = this.orOrderData.goodsServices
          }
        }else{
          this.formModel_Control.goodsServices.disabled = true
          this.formModel_Rules.goodsServices[0].required = false
          this.formModel_Rules.goodsServices[1].required = false
          this.formModel_Data.goodsServices = undefined
          this.$refs['formModel'].clearValidate(['goodsServices'])
        }
      },
    },
    "formModel_Data.feeBy": {
      handler(val) {
        if (!this.isWatch) {
          return;
        }
        this.fullFlagContorl()
      },
    },
    "formModel_Data.remtType": {
      handler(val) {
        if (!this.isWatch) {
          return;
        }
        if (val === "1") {
          this.formModel_Rules.payProp[0].required = true
          this.formModel_Rules.payProp[1].required = true
          this.formModel_Control.payProp.isShow = true
        }else {
          this.formModel_Rules.payProp[0].required = false
          this.formModel_Rules.payProp[1].required = false
          this.formModel_Control.payProp.isShow =  false;
        }

      this.fullFlagContorl()
      },
    },
    "formModel_Data.clsFlag": {
      handler(val) {
        if (!this.isWatch) {
          return;
        }
        if(val === '1'){
          this.formModel_Control.bicMngAagentOpenAccountButton.disabled = false
        }else{
          this.formModel_Control.bicMngAagentOpenAccountButton.disabled = true
        }
      },
    },

  },
  created() {},
  mounted() {
    const _this = this;
    //汇款类型
    checkDictItemCode("REMT_REMT_TYPE").then((response) => {
      if (response.data.errorCode === "000000") {
        response.data.data.forEach((element) => {
          _this.formModel_Control_remtTypeOptions.push({
            label: element.name,
            value: element.code,
          });
        });
      } else {
        _this.$message({
          message: "获取字典数据失败：" + response.data.message,
          type: "error",
        });
      }
    });
    //是否使用代理行
    checkDictItemCode("REMT_USE_AGENT_FLG").then((response) => {
      if (response.data.errorCode === "000000") {
        response.data.data.forEach((element) => {
          _this.formModel_Control_useAgentFlgOptions.push({
            label: element.name,
            value: element.code,
          });
        });
      } else {
        _this.$message({
          message: "获取字典数据失败：" + response.data.message,
          type: "error",
        });
      }
    });

    //是否保税货物项下货款
    checkDictItemCode("REMT_BAOSUI_PAY").then((response) => {
      if (response.data.errorCode === "000000") {
        response.data.data.forEach((element) => {
          _this.formModel_Control_baosuiPayOptions.push({
            label: element.name,
            value: element.code,
          });
        });
      } else {
        _this.$message({
          message: "获取字典数据失败：" + response.data.message,
          type: "error",
        });
      }
    });
  },
  methods: {
    validate(callback) {
      console.log("父类的验证");
      this.$refs["formModel"].validate((valid,object) => {
        if(!valid){
            let str = []
            for(let key in object){
              object[key].map(item => {
                  str.push(item.message)
              })
            }
            this.$message.error(str.join(', '))
        }else{
          callback(valid);
        }
      });
    },
    fullFlagContorl(){
      let feeBy = this.formModel_Data.feeBy
        let remtType = this.formModel_Data.remtType
        if(feeBy==='OUR' && remtType==='2'){
          this.formModel_Control.fullFlag.disabled = false
          this.formModel_Rules.fullFlag[0].required = true
          this.formModel_Rules.fullFlag[1].required = true
        }else{
          this.formModel_Control.fullFlag.disabled = true
          this.formModel_Rules.fullFlag[0].required = false
          this.formModel_Rules.fullFlag[1].required = false
          this.formModel_Data.fullFlag = 'N'
        }
    },
    // 金额币种
    inputmoney(value) {
      this.formModel_Data.remtAmt = value;
    },
    reHttpRequest(file) {
      let param = {};
      param.file = file.raw;
      this.httpRequest(param);
    },
    async httpRequest(param) {

      vue.$set(param.file, "status", "uploading");
      // param.file.status = 'uploading'
      let formData = new FormData();
      formData.append("file", param.file);
      formData.append("mainId", this.formModel_Data.id);
      await fileUp(formData)
        .then((res) => {
          if (res.data.errorCode === "000000") {
            this.$message({
              showClose: true,
              showIcon: true,
              center: true,
              message: res.data.errorMsg,
              type: "success",
            });
            vue.$set(param.file, "status", "success");
            // param.file.status='success'
          } else if (res.data.errorMsg.includes("已上传过，不需重复上传")) {
            vue.$set(param.file, "status", "repeat");
          } else {
            vue.$set(param.file, "status", "failed");
            // param.file.status='failed'
          }
        })
        .catch((e) => {
          this.$message.error("失败");
          vue.$set(param.file, "status", "failed");
          // param.file.status='failed'
        });
    },
    async handleRemove(file, fileList) {
      console.log("handleRemove", file, fileList);
      let data = {
        mainId: this.formModel_Data.id,
        uploadFilename: file.name,
      };
      await deleteUpFile(data)
        .then((res) => {
          if (res.data.errorCode === "000000") {
            this.fileList = fileList.filter((item) => {
              return item.uid != file.uid;
            });
            this.$message({
              showClose: true,
              showIcon: true,
              center: true,
              message: res.data.errorMsg,
              type: "success",
            });
          }else{
            this.$message.error("删除失败,原因：",res.data.errorMsg);
          }
        })
        .catch((e) => {
          this.$message.error("删除失败");
        });
    },
    handleChange(file, fileList) {
      let status = file.raw.status;
      if (status === undefined) {
        file.status = "uploading";
      } else if (status === "repeat") {
        file.status = "failed";
        fileList = fileList.filter((item) => {
          return item.uid != file.uid;
        });
      } else {
        file.status = file.raw.status;
      }
      this.fileList=fileList
      console.log("handleChange", file, fileList);
    },
    handlePreview(file) {
      console.log("handleChange", file);
      //未处理可以下载看看
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    confirmHandleRemove(file) {
      console.log("confirmHandleRemove", file);
      this.$confirm(`确定移除 ${file.name}？`)
        .then((_) => {
          this.handleRemove(file, this.fileList);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    beforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 <= 10;
      if (!isRightSize) {
        this.$message.error("文件大小超过 10MB");
      }
      return isRightSize;
    },
    init(reqType) {
      this.visible = true;
      this.deleteFileClass = 'el-file-button-delete'
      this.reqType = reqType;
      let data = {
        functionId: "orOpenApply",
        operationButton: "INIT",
      };
      unifyTradeApi
        .saveUnifyTrade(data)
        .then((res) => {
          if (res.data.errorCode === "000000") {
            this.formModel_Data.id = res.data.data.id;
            this.formModel_Data.fullFlag = "N"
            this.formModel_Data.baosuiPay = "0";
            this.formModel_Data.useAgentFlg = "N";
            this.formModel_Data.remtRoute = "01";
          }
        })
        .catch((e) => {
          this.$message.error("失败");
        });
    },
    async update(reqType, row) {
      debugger
      this.visible = true;
      this.isWatch = false;
      this.reqType = reqType;
      this.rowData = row;
      this.formModelDataIsDisable(row.remtStatus);
      let data = {
        functionId: "orOpenApply",
        operationButton: "INIT",
        mainId: row.id,
        lockFlg: this.reqType === "query" ? "n" : "y",
        status: row.remtStatus,
      };
      await unifyTradeApi
        .saveUnifyTrade(data)
        .then((res) => {
          if (res.data.errorCode === "000000") {
            this.formModel_Data = res.data.data;
            this.buildFileList(res.data.data.uploadFiles)
            this.deleteFileClass = 'el-file-button-delete-defort'
            this.$message({
              showClose: true,
              showIcon: true,
              center: true,
              message: res.data.errorMsg,
              type: "success",
            });
          }
        })
        .catch((e) => {
          this.$message.error("失败");
        });
    },
    buildFileList(updateFiles){
      this.fileList = []
      if(updateFiles!=null && updateFiles!=undefined && updateFiles!=""){
        updateFiles.forEach(item=>{
          this.fileList.push({'name':item,'status':'success'})
        })
      }
    },
    formModelDataIsDisable(operationButton) {
      if (operationButton !== "SAVE" && operationButton !== "REJECT") {
        util.requireForm([this.formModel_Rules]);
        util.disableForm([this.formModel_Control]);
      }
    },
    closeTab(val) {
      console.log("接收到的值", val);
      this.visible = val;
      //参数回传父页面 - 刷新父页面
      //this.$emit("closeDetailModel");

      if (this.reqType && this.reqType === "query") {
        //查询模式下不需解锁，且不需刷新父页面数据
        var unlockFlg = "n";
        var refreshFlg = "n";
        //关闭当前页面
        this.visible = false;
        //参数回传父页面
        this.$emit("closeDetailModel", unlockFlg, refreshFlg);
      } else {
        var unlockFlg = "y";
        var refreshFlg = "n";
        if(this.reqType === "init"){
          unlockFlg = "n";
          refreshFlg = "y";
        }

        //关闭当前页面
        this.visible = false;
        //参数回传父页面
        this.$emit("closeDetailModel", unlockFlg, refreshFlg);
      }
    },
    handleClose(done) {
      //this.$confirm("确认关闭？")
      //  .then((_) => {
      //    this.visible = false;
      //    done();
      //  })
      //  .catch((_) => {});
      if (!this.reqType || this.reqType !== "query") {
        this.$confirm("确认关闭？")
          .then((_) => {
            this.closeTab(true);
          })
          .catch((_) => {});
      }else{
        this.closeTab(true);
      }
    },
    //收款人名册查询
    searchRecvrMng() {
      this.recvrMngDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.recvrMngDialog.init(
          this.formModel_Data.recvrAccNo,
          this.formModel_Data.recvrName,
          this.formModel_Data.country
        );
      });
    },
    //接收选择的收款人名册数据
    closeRecvrMngDialog(currRow) {
      this.recvrMngDialogVisible = false;
      this.recvrMngData = currRow;
      this.formModel_Data.recvrAccNo = currRow.recvrAccNo;
      this.formModel_Data.recvrName = currRow.recvrName;
      this.formModel_Data.recvrAddr = currRow.recvrAddr;
      this.formModel_Data.country = currRow.country;
      this.formModel_Data.agentBic = currRow.agentBic;
      this.formModel_Data.agentName = currRow.agentName;
      this.formModel_Data.agentAccNo = currRow.agentAccNo;
      this.formModel_Data.recvrOpenBk = currRow.recvrOpenBk;
      this.formModel_Data.recvrOpenBknm = currRow.recvrOpenBknm;
      this.formModel_Data.useAgentFlg = currRow.useAgentFlg;
    },

    //订单选择
    searchOrOrder() {
      this.orOrderDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.orOrderDialog.init(
          this.formModel_Data.orderNo,
          this.formModel_Data.payerName
        );
      });
    },
    //接收选择的订单选择数据
    closeOrOrderDialog(currRow) {

      this.orOrderDialogVisible = false;
      this.orOrderData = currRow;
      this.formModel_Data.orderNo = currRow.orderNo;
      this.formModel_Data.payerName = currRow.payerName;
      this.formModel_Data.remtCcy = currRow.payCcy;
      this.formModel_Data.remtAmt = currRow.orderAmt;
      this.formModel_Data.contracts = currRow.contracts;
      this.formModel_Data.invoices = currRow.invoices;
      this.formModel_Data.recvrName = currRow.recvrName;
    },

    //查询收款行
    searchBicMng(type) {
      this.bicMngDialogVisible = true;
      var bankCode;
      var institutionName;

      if ("agent" == type) {
        bankCode = this.formModel_Data.agentBic;
        institutionName = this.formModel_Data.agentName;
      } else if ("openAccount" == type) {
        bankCode = this.formModel_Data.recvrOpenBk;
        institutionName = this.formModel_Data.recvrOpenBknm;
      }
      this.$nextTick(() => {
        this.$refs.bicMngDialog.init(type, bankCode, institutionName);
      });
    },
    //接收选择的查询收款行数据
    closeBicMngDialog(type, bankCode, institutionName) {
      this.bicMngDialogVisible = false;
      if ("agent" == type) {
        this.formModel_Data.agentBic = bankCode;
        this.formModel_Data.agentName = institutionName;
      } else if ("openAccount" == type) {
        this.formModel_Data.recvrOpenBk = bankCode;
        this.formModel_Data.recvrOpenBknm = institutionName;
      }
    },

    //合同号添加
    addContracts(type) {
      this.addContractsDialogVisible = true;
      this.$nextTick(() => {
        var value;
        if ("contract" == type) {
          value = this.formModel_Data.contracts;
        } else if ("invoice" == type) {
          value = this.formModel_Data.invoices;
        }
        this.$refs.addContracts.init(value, type);
      });
    },
    closeAddContractsDialog(contractString, type) {
      if ("contract" == type) {
        this.formModel_Data.contracts = contractString;
      } else if ("invoice" == type) {
        this.formModel_Data.invoices = contractString;
      }
      this.addContractsDialogVisible = false;
    },
  },
};
</script>
<style scoped>
>>> .el-dialog__body {
  padding: 1px 20px;
}
>>> .el-dialog__header {
  background: white;
}
.dialog-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
>>> .el-dialog__footer {
  text-align: center;
}
.el-file-button {
  float: right;
}
.el-file-button-delete {
  color: red;
}
.el-file-button-delete-defort {
  color: black;
}
</style>
