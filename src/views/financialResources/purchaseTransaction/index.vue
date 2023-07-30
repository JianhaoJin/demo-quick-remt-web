<template>
  <div class="content">
    <!-- 表单信息 -->
    <el-form ref="form" :model="form" label-width="170px" :rules="rules" v-loading="formLoading">
      <el-form-item label="货币对：">
        <el-select v-model="form.ccyPair" placeholder="----请选择----">
          <el-option label="USD/CNY" value="USD/CNY"></el-option>
          <el-option label="EUR/CNY" value="EUR/CNY"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易方向：">
        <el-input v-model="form.porsFront" readonly />
      </el-form-item>
      <el-form-item prop="priAmt">
        <span slot="label">
          主币种金额(
            <!-- 通过replace方法对货币对进行拆分 $1是值正则表达式中第一个小括号里面的内容 -->
          <span style="color: #006be3;">{{ form.ccyPair.replace(/([A-Z])[/][A-Z]+/g,'$1') }}</span>)：
        </span>
        <el-input
          v-model="form.priAmt"
          oninput="value=value.replace(/[^0-9.]/g,'')"
          @blur="moneyBlur($event,'priAmt')"
        />
      </el-form-item>
      <el-form-item prop="secAmt">
        <span slot="label">
          次币种金额(
            <!-- 通过replace方法对货币对进行拆分 $1是值正则表达式中第一个小括号里面的内容 -->
          <span style="color: #006be3;">{{ form.ccyPair.replace(/[A-Z]+[/]([A-Z])/g,'$1') }}</span>)：
        </span>
        <el-input
          v-model="form.secAmt"
          oninput="value=value.replace(/[^0-9.]/g,'')"
          @blur="moneyBlur($event,'secAmt')"
        />
      </el-form-item>
      <el-form-item prop="priAcct">
        <span slot="label">
          主币种账号(
            <!-- 通过replace方法对货币对进行拆分 $1是值正则表达式中第一个小括号里面的内容 -->
          <span style="color: #006be3;">{{ form.ccyPair.replace(/([A-Z])[/][A-Z]+/g,'$1') }}</span>)：
        </span>
        <el-input v-model="form.priAcct" />
      </el-form-item>
      <el-form-item prop="secAcct">
        <span slot="label">
          次币种账号(
            <!-- 通过replace方法对货币对进行拆分 $1是值正则表达式中第一个小括号里面的内容 -->
          <span style="color: #006be3;">{{ form.ccyPair.replace(/[A-Z]+[/]([A-Z])/g,'$1') }}</span>)：
        </span>
        <el-input v-model="form.secAcct" />
      </el-form-item>
      <el-form-item label="交割日：" prop="delDate">
        <el-date-picker
          v-model="form.delDate"
          type="date"
          disabled
          placeholder="选择日期"
          style="width: 180px;"
        />
      </el-form-item>
      <el-form-item label="期限：" prop="term">
        <el-select v-model="form.term" placeholder="----请选择----" @change="selectChange($event,'term')">
          <el-option label="T+0" value="T+0"></el-option>
          <el-option label="T+1" value="T+1"></el-option>
          <el-option label="T+2" value="T+2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="实时汇率：" style="padding-right: 20px;">
        <el-input v-model="form.frxRate" disabled style="width: 180px;" />
        <el-button type="text" icon="el-icon-refresh" class="refreshBtn" @click="getData">价格刷新</el-button>
      </el-form-item>
      <el-form-item label="容忍点差（BP）：" prop="tolSpread">
        <el-input v-model.number="form.tolSpread" />
      </el-form-item>
      <el-form-item label="担保收取方式：" prop="way">
        <el-select
          v-model="form.way"
          placeholder="----请选择----"
          @change="selectChange($event,'way')"
        >
          <el-option label="保证金" value="保证金"></el-option>
          <el-option label="金市通" value="金市通"></el-option>
          <el-option label="授信" value="授信"></el-option>
          <el-option label="保证金+授信" value="保证金+授信"></el-option>
        </el-select>
        <div v-if="form.way && !form.way.includes('保证金')" class="formItem_tip">
          <span>{{form.way === '金市通' ? '剩余交易量：' + numFormat( goldMarketDealAmt) : '最大授信余额：'+ numFormat(planCreditDealAmt)}}</span>
        </div>
      </el-form-item>
      <el-form-item label=" " label-width="50px">
        <div v-if="form.way">
          <el-checkbox v-if="form.way === '保证金'" v-model="form.isAllBail" >全额保证金：</el-checkbox>
          <span v-if="form.way === '金市通'">{{`应扣金市通交易量：${form.priAmt ? form.priAmt : 0.00} (美元)`}}</span>
          <span
            v-else
          >{{`应缴${form.way === '保证金' ? '保证金' : '担保'}金额：${form.isAllBail ? isAllBailAmt : numFormat(form.secAmt.replace(/,/g,'') * (form.cre / 100))} (人民币)`}}</span>
        </div>
      </el-form-item>
      <el-form-item v-if="form.way.includes('保证金')" label="保证金池账号：" prop="bailAcctNo">
        <el-select v-model="form.bailAcctNo" placeholder="----请选择----" @change="bailListChange">
          <el-option
            v-for="item in bailList"
            :key="item.bailAcctNo"
            :label="item.bailAcctNo"
            :value="item.bailAcctNo"
          />
        </el-select>
        <div v-if="form.way && form.way.includes('保证金') && form.bailAcctNo" class="formItem_tip">
          <span>{{'查询余额：'}}</span>
          <span>{{numFormat(bailAcctAmt)}}</span>
        </div>
      </el-form-item>
      <el-form-item v-if="form.way.includes('保证金')" label=" " />
      <el-form-item label="申报信息：" prop="decInfoCode">
        <el-select v-model="form.decInfoCode" placeholder="----请选择----">
          <el-option label="121010" value="121010"></el-option>
          <el-option label="222011" value="222011"></el-option>
          <el-option label="121020" value="121020"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button class="btn" @click="submit(0)">取消</el-button>
      <el-button class="btn" @click="submit(1)">提交</el-button>
    </div>
  </div>
</template>

<script>
import {
  usable2creCZ,
  quotedPriceCZ,
  purchasingCZ,
  otherClickTradeCZ,
  queryDeliveryDateCZ
} from "@/api/sysManagement/dkDemoApi"; //引入后端接口api
import { parseTime } from "@/utils/index"; // 引入parseTime公共方法用来处理时间格式
export default {
  name: "demo",
  components: {},
  data() {
    // 金额的校验规则
    const validateMoney = (rule, val, cb) => {
      if (!val) {
        cb(new Error("价格不能为空！"));
      } else if (val.indexOf(".") != -1 && val.split(".").length > 2) {
        cb(new Error("请输入正确格式的金额！")); // 防止输入多个小数点
      } else {
        cb();
      }
    };
    return {
      // 表单数据
      form: {
        ccyPair: "USD/CNY",
        porsFront: "购汇",
        pors: "B",
        term: "T+0",
        decInfoCode: "121010",
        delDate: parseTime(new Date(), "{yyyy}-{mm}-{dd}"),
        frxRate: "",
        way: "",
        priAcct: "40012025000016725",//主币种账号(根据实际需求进行更改)
        secAcct: "40010122000156763",//次币种账号(根据实际需求进行更改)
        priAmt: "",
        secAmt: "",
        gwFlwNo: (new Date().getTime() + "").slice(5, 13) //前台流水号
      },
      // 固定参数
      ops: {
        bizNode: "04001", //业务发起网点
        bizType: "10", //产品类型
        custId: "0000112058", //客户号(根据实际需求进行更改)
        dueDate: parseTime(new Date(), "{yyyy}-{mm}-{dd}"), //到期日（getDate方法中会通过接口进行获取）
        netProNo: "121010", //网点协议编号(根据实际需求进行更改)
        quoteId: "6.8", // 报价id
        rate: "6.8", //报价
        validTime: parseTime(new Date(), "{yyyy}-{mm}-{dd}") //报价截止日期
      },
      // 表单校验
      rules: {
        tolSpread: [
          {
            type: "number",
            required: true,
            message: "容忍点差必须为整数",
            trigger: "change"
          }
        ],
        priAmt: [
          {
            type: "string",
            required: true,
            trigger: "blur",
            validator: validateMoney
          }
        ],
        secAmt: [
          {
            type: "string",
            required: true,
            trigger: "blur",
            validator: validateMoney
          }
        ],
        priAcct: [
          {
            type: "string",
            required: true,
            message: "请输入主币种账号",
            trigger: "blur"
          }
        ],
        secAcct: [
          {
            type: "string",
            required: true,
            message: "请输入次币种账号",
            trigger: "blur"
          }
        ],
        date: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        term: [{ required: true, message: "请选择期限", trigger: "change" }],
        way: [
          { required: true, message: "请选择担保收取方式", trigger: "change" }
        ],
        decInfoCode: [
          { required: true, message: "请选择申报信息", trigger: "change" }
        ],
        bailAcctNo: [
          { required: true, message: "请选择保证金池账号", trigger: "change" }
        ]
      },
      bailList: [], //保证金列表
      bailAcctAmt: 0.0, // 当前保证金账号余额
      goldMarketList: [], //金市通列表
      goldMarketDealAmt: 0.0, //金市通余额
      planCreditList: [], //类授信列表
      planCreditDealAmt: 0.0, //授信余额
      formLoading: false, //表单加载状态
      baseCcy: "", //基准币种
    };
  },
  created() {
    // 调用后台接口 获取数据
    this.getDate()
    this.getData();
    this.getAllList();
  },
  computed: {
    isAllBailAmt() {
      // 勾选全额保证金标记时 需要将实时汇率加上容忍点差 再去计算保证金
      return this.numFormat(this.form.priAmt.replace(/,/g,'') * (+this.form.frxRate + this.form.tolSpread / 10000))
    }
  },
  methods: {
    // select的change方法
    // e：当前选中项的value
    // col：当前select输入框绑定的变量名称
    selectChange(e, col) {
      // 担保方式
      if (e === "保证金+授信" && col === "way") {
        const bailAmtFront = (
          this.form.secAmt.replace(/,/g, "") *
          (this.form.cre / 100)
        ).toFixed(2);
        if (+this.planCreditDealAmt > +bailAmtFront)
          this.$confirm(
            "可使用授信额度大于应缴担保金额，无需另外缴纳保证金，将自动切换担保收取方式为授信",
            "系统提示",
            {
              confirmButtonText: "确定",
              type: "warning"
            }
          )
            .then(() => {
              this.form.way = "授信";
            })
            .catch(() => {
              this.form.way = "授信";
            });
      }
      //期限
      if(col === 'term') {
        this.getDate(true)
      }
    },
    // 查询可用的担保信息以及CRE信息
    getAllList() {
      let params = {
        ...this.ops,
        ...this.form
      };
      usable2creCZ(params).then(res => {
        if (res.data.returnCode === "0000") {
          this.form.cre = res.data.cre;
          this.bailList = res.data.bailList;
          this.goldMarketList = res.data.goldMarketList;
          this.goldMarketDealAmt = res.data.goldMarketList.length
            ? res.data.goldMarketList[0].goldMarketDealAmt
            : 0.0;
          this.planCreditList = res.data.planCreditList;
          this.planCreditDealAmt = res.data.planCreditList.length
            ? res.data.planCreditList[0].planCreditDealAmt
            : 0.0;
        }
      });
    },
    // 查询银企外汇
    getData() {
      let params = {
        ...this.ops,
        ...this.form,
        pors: "B",
        term: 'TOD'
      };
      this.formLoading= true
      quotedPriceCZ(params).then(res => {
        this.formLoading = false
        if (res.data.returnCode === "0000") {
          this.form.frxRate = res.data.quoteVal;
          // 实时汇率刷新得话 需要重新计算次币种价格
          if(this.form.secAmt && this.form.priAmt) {
              // 使用replace方法删除金额中的千分符
              let priAmtTemp = this.form.priAmt.replace(/,/g, "")
              //使用+号隐式转换为Number类型
              this.form.secAmt = this.numFormat(+priAmtTemp * +this.form.frxRate);
          }
        } else {
          this.$message.error(res.data.returnMsg);
        }
      });
    },
    //查询到期日
    getDate(isApi) {
      let params = {
        ccyPair: this.form.ccyPair, //货币对
        custId: '0000112058', //核心客户号(根据实际需求进行更改)
        tradeDate: parseTime(new Date(), "{yyyy}-{mm}-{dd}"), //交易日
        tradeType: this.form.term, //交易类型
        corpCode: '1000'
      }
      this.formLoading = true
      queryDeliveryDateCZ(params).then(res => {
        this.formLoading = false
        if(res.data.returnCode === '0000') {
          this.ops.dueDate = res.data.delDate
          this.form.delDate = res.data.delDate
          if(isApi) {
            this.getData();
            this.getAllList();
          }
        }
      })
    },
    // 表单提交方法
    submit(flag) {
      if (!flag) {
        // 点击取消 重置表单内容
        return this.$refs.form.resetFields();
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formLoading = true;
          let params = {
            ...this.form,
            baseCcy: this.baseCcy, //基准币种
            begDate: this.ops.dueDate, //开始日期
            branchNo: "03101", //机构代码(根据实际需求进行更改)
            bsnTp: "SPOT", //机构类型
            channelSeqNo: "SGjx3ww74cfe", //业务流水号(根据实际需求进行更改)
            channelType: "YQ", //渠道类型
            cifName: "144524030", //客户名称(根据实际需求进行更改)
            custId: "0000112058", //客户号(根据实际需求进行更改)
            clickTradeMold: "00", //点击购汇成交模式
            couponNo: "1", //优惠券券编号
            couponVer: "1", //优惠券版本
            cre: this.form.cre,
            dirUseCoupon: "", //直接使用优惠券
            endDate: this.ops.dueDate, //结束日期
            fax: "", //传真
            frxAprNo: "", //外汇审批编号
            isAllBail: this.form.isAllBail ? "1" : "", // 全额保证金标识
            isDhy: "", //是否代汇盈客户
            isUseCoupon: "N", //是否使用优惠券
            linkman: "", //单位联系人
            phone: "13116611265", //联系电话
            priSubAcct: "", //主币种账户子账号
            secSubAcct: "", //次币种账户子账号
            tradeDate: this.ops.dueDate, //交易日期
            tradeType: this.form.term, //交易类型
            pors: "B", //买卖标志
            bailList: [], //保证金列表
            contractList: [], //购汇合同
            creditList: [], //授信列表
            goldMktList: [], //金市通列表
            tolSpread: this.form.tolSpread.toString(),
            priAmt: this.form.priAmt.replace(/,/g, ""), //删除主币种金额的千分符
            secAmt: this.form.secAmt.replace(/,/g, ""), //删除次币种金额的千分符
            gwFlwNo: (new Date().getTime() + "").slice(5, 13), //前台流水号
            serialNo: (new Date().getTime() + "").slice(5, 13), //交易流水号
          };
          // 如果担保方式选择 保证金 则需要添加参数 bailList
          // 如果担保方式选择 金市通 则需要添加参数 goldMktList
          // 如果担保方式选择 授信 则需要添加参数 creditList
          // 如果担保方式选择 保证金+授信 则需要添加参数 bailList和creditList
          let bailAmtFront = this.formatFloat(
            this.form.secAmt.replace(/,/g, "") * ((this.form.cre / 100)),2);
          // 如果当前勾选了全额保证金 则需要使用保证金计算属性重新赋值
          if(this.form.isAllBail) {
            bailAmtFront = this.isAllBailAmt
          } 
          switch (params.way) {
            case "保证金":
              params.bailList = this.bailList.filter(v => {
                if (v.bailAcctNo === this.form.bailAcctNo) {
                  (v.interestType = "10"), //计息方式
                    (v.needSettAmt = ""); //结算账户扣款金额
                  v.settAcct = ""; //结算账号
                  v.settSubAcct = ""; //结算账号子账号
                  v.subAccount = "000001"; //保证金池子账号
                  v.grntAmt = bailAmtFront;
                  return v;
                }
              });
              break;
            case "金市通":
              params.goldMktList = this.goldMarketList.filter((v,index) => {
                if(index === 0) {
                  v.grntAmt = this.form.priAmt.replace(/,/g, "");
                  return v;
                }
              });
              break;
            case "授信":
              params.creditList = [
                {
                  ...this.planCreditList[0],
                  grntAmt: bailAmtFront
                }
              ];
              break;
            case "保证金+授信":
              // 如果是保证金+授信，则先使用授信额度，授信额度不足的部分 再使用保证金账户进行缴纳
              if (+this.planCreditDealAmt < +bailAmtFront) {
                params.creditList = [
                  {
                    ...this.planCreditList[0],
                    grntAmt: this.planCreditDealAmt
                  }
                ];
              }
              params.bailList = this.bailList.filter(v => {
                if (v.bailAcctNo === this.form.bailAcctNo) {
                  (v.interestType = "10"), //计息方式
                    (v.needSettAmt = ""); //结算账户扣款金额
                  v.settAcct = ""; //结算账号
                  v.settSubAcct = ""; //结算账号子账号
                  v.subAccount = "000001"; //保证金池子账号(根据实际需求进行更改)
                  v.grntAmt = (bailAmtFront - this.planCreditDealAmt).toFixed(
                    2
                  );
                  return v;
                }
              });
              break;
            // default:
              // throw new Error("submit error");
          }
          if(this.form.term != 'T+0') {
            let obj = {
              isAudited: 'N', //是否落地
              isDhy: 'N', //是否代汇盈客户
              isInterBank: 'N', //是否跨行转账
              isSettle: 'N', //意愿结汇标识
              isUseCoupon: 'N', //是否使用优惠券
              custName: '1', //客户名称
              bizType:　'SPOT', //业务类型
              imgUrl: '', //影像资料URL
              // bail: params.bailList, //非t0保证金
              // planCredit: params.creditList, //非t0授信
              // goldMarket: params.goldMktList, //非t0金市通
              couponNo: '',
              couponVer: '',
              payImgNo: '',
              setType: '',
              setUse: '',
              endDate: this.ops.dueDate,
              dueDate: this.ops.dueDate,
              channelSeqNo: '20221209000001032602',
              branchNo: '04001',
              custName: '1'
            }
            params = {...params,...obj}
          }
          // func: purchasing t0点击成交和 otherClickTradeCZ 非t0点击成交的方法
          // funcIndex: 通过用户选择的期限来决定要使用哪一个方法进行提交
          const func = [purchasingCZ,otherClickTradeCZ],
          funcIndex = this.form.term === 'T+0' ? 0 : 1
          func[funcIndex](params).then(res => {
            this.formLoading = false;
            if (res.data.returnCode === "0000") {
              this.$refs.form.resetFields();
              this.getAllList()
              this.$message.success(res.data.returnMsg);
            } else {
              this.$message.error(res.data.returnMsg);
            }
          });
        }
      });
    },
    // 主币种金额输入框
    moneyBlur(e, prop) {
      const val = e.target.value;
      if (prop === "priAmt") {
        // 主币种金额
        this.form.priAmt = this.numFormat(val);
        this.form.secAmt = this.numFormat(val * this.form.frxRate);
        this.baseCcy = "1";
      }
      if (prop === "secAmt") {
        //次币种金额
        this.form.secAmt = this.numFormat(val);
        this.form.priAmt = this.numFormat(val / this.form.frxRate);
        this.baseCcy = "2";
      }
    },
    // 增加千分符
    numFormat(num) {
      if (num === null || num === undefined || isNaN(num)) return 0;
      num = this.formatFloat(num,2)
      var res = num.toString().replace(/\d+/, function(n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) {
          return $1 + ",";
        });
      });
      return res;
    },
    // 保证金池账号选择
    bailListChange(val) {
      this.bailAcctAmt = this.bailList.find(
        v => v.bailAcctNo === val
      ).bailAcctAmt;
    },
    // 解决js运算浮点数问题
    formatFloat(f,digit) {
      let m = Math.pow(10,digit) //获取10的digit次方
      return (Math.round(f * m,10) / m).toString()
    }
  }
};
</script>

<style lang="scss" scoped>
// 自定义样式
.content {
  width: 100%;
  min-height: calc(100vh - 100px);
  background: #fff;
  .refreshBtn {
    width: 80px;
    padding: 6px;
    font-size: 12px;
  }
  .footer {
    height: 50px;
    text-align: center;
    line-height: 50px;
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
  .formItem_tip {
    font-size: 12px;
    line-height: 12px;
    color: #4794eb;
  }
}
// 表单样式
/deep/.el-form {
  width: 930px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  .el-input__inner {
    width: 180px;
    height: 36px;
    line-height: 36px;
  }
  .el-form-item {
    min-width: 465px;
    height: 55px;
    margin: 0px;
    padding: 10px;
  }
  .el-checkbox__inner {
    width: 20px;
    height: 20px;
    &::after {
      height: 10px;
      width: 6px;
    }
  }
  .el-checkbox__label {
    color: #000;
  }
  .el-input.is-disabled .el-input__inner {
    color: #545454;
  }
}
// 表格样式
/deep/.el-table {
  width: 950px;
  margin: 15px auto;
  th {
    background: #fff8ee;
    color: #000;
  }
  th,
  td {
    padding: 5px 0;
  }
}
// 修改输入框placeholder字体颜色
/deep/.el-input__inner,
.el-date-editor .el-range-input {
  color: #000;
  &::placeholder {
    color: #000;
  }
  &::-webkit-input-placeholder {
    color: #000; // 适配谷歌
  }
  &:-moz-placeholder {
    color: #000; // 适配 4 to 18 火狐
  }
  &::-moz-placeholder {
    color: #000; // 适配 19+ 火狐
  }
  &:-ms-input-placeholder {
    color: #000; // 适配ie10+
  }
}
</style>