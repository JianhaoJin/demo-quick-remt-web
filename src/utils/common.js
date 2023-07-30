/**
 * 一些通用的工具函数
 *
 */
import vue from '@/main'
import { Base64 } from 'js-base64';

/**
 * 将时间戳格式化为字符串
 * @param  {Number} timestamp 时间戳
 * @param  {String} fmt       可选目标格式
 * @return {String}           格式化后的日期时间
 * @example fmt = "yyyy年MM月dd日 hh:mm:ss.S" 输出: 2018年06月07日 10:41:08.133
 * @example fmt = "yyyy-MM-dd hh:mm:ss" 输出: 2018-06-07 10:41:08
 * @example fmt = "yy-MM-dd hh:mm:ss" 输出: 18-06-07 10:41:08
 * @example fmt = "yy-M-d hh:mm:ss" 输出: 18-6-7 10:41:08
 */
export const timestampToTime = (timestamp, fmt = 'yyyy-MM-dd hh:mm:ss') => {
  const date = new Date(timestamp)
  const o = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S+': date.getMilliseconds()
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      if (k === 'y+') {
        fmt = fmt.replace(RegExp.$1, ('' + o[k]).substr(4 - RegExp.$1.length))
      } else if (k === 'S+') {
        let lens = RegExp.$1.length
        lens = lens === 1 ? 3 : lens
        fmt = fmt.replace(
          RegExp.$1,
          ('00' + o[k]).substr(('' + o[k]).length - 1, lens)
        )
      } else {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
  }
  return fmt
}

// 将日期转换成时间戳
export const timeToTimestamp = date => {
  const datetime = new Date(date)
  return datetime.getTime()
}

// 获取星期几
export const dateToWeek = data => {
  const dateArray = data.split('-')
  const res = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2])
  return '星期' + '日一二三四五六'.charAt(res.getDay())
}

// encode object to query string
export const serialize = (obj = {}) => {
  const str = []
  for (const p in obj) {
    str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`)
  }
  return str.join('&')
}

/**
 * 填充参数 ，方法的功能有：
 * 	1、覆盖target的属性。
 * 	2、val当对应的属性为空时则该属性不被赋值。
 * 	3、当val存在target不存在的属性时不进行赋值。
 *  4、返回的target不为新对象是target对象本身。
 * @param target 目标对象，被赋值的对象
 * @param val 用于赋值的对象
 *
 */
export const fillObject = (target, val) => {
  if (typeof val === 'object') {
    for (const key in target) {
      if (typeof val[key] !== 'undefined') {
        target[key] = val[key]
      }
    }
  }

  return target
}

/**
 * 获取数据类型
 * @param  {any} data 要判断类型的数据
 * @return {string}      返回数据类型，首字母大写
 *
 */
export const dataTypeof = data => {
  const type = Object.prototype.toString.call(data)
  return type.match(/ (.*)\]/)[1]
}

/**
 * 获取当前url参数
 * @param {string} name 参数，名获取字段值
 */
export function getQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg) // search,查询？后面的参数，并匹配正则
  if (r != null) {
    return decodeURI(r[2])
  }
  return null
}

/**
 * 获取当前url参数,转为对象
 */
export function getQueryObj() {
  const urlSerach = window.location.search

  if (!urlSerach) {
    return null
  }
  const params = urlSerach.split('?')[1].split('&')
  const obj = {}
  params.map(o => {
    obj[o.split('=')[0]] = o.split('=')[1]
  })
  return obj
}
/**
 * 过滤对象中值为空的属性，返回新的对象
 * @params {Object} obj 参数
 */
export function filterParams(obj) {
  const _newObj = {}
  for (const key in obj) {
    // 如果对象属性的值不为空，保存该属性
    if (
      (obj[key] === 0 || obj[key]) &&
      obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== ''
    ) {
      // 记录属性
      _newObj[key] = obj[key]
    }
  }
  // 返回新对象
  return _newObj
}

/**
 * 加载 script 文件
 * 可指定在某个元素内加载，默认为head
 * 可传入css选择器或者dom节点
 * @param src
 */
export const loadScript = (src, el = 'head') => {
  let addSign = true
  const scripts = document.getElementsByTagName('script')
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i] && scripts[i].src && scripts[i].src.indexOf(src) !== -1) {
      addSign = false
    }
  }
  if (addSign) {
    const $script = document.createElement('script')
    $script.setAttribute('type', 'text/javascript')
    $script.setAttribute('src', src)
    if (el instanceof Element) {
      el.appendChild($script)
    } else {
      try {
        document.querySelector(el).appendChild($script)
      } catch (e) {
        throw new Error('loadScript 选择器未查找到相关DOM')
      }
    }
    return $script
  }
}

/**
 * 加载 css 文件
 * 可指定在某个元素内加载，默认为head
 * 可传入css选择器或者dom节点
 */
export const loadStyle = (href, el = 'head') => {
  let addSign = true
  const links = document.getElementsByTagName('link')
  for (let i = 0; i < links.length; i++) {
    if (links[i] && links[i].href && links[i].href.indexOf(href) !== -1) {
      addSign = false
    }
  }
  if (addSign) {
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', href)
    if (el instanceof Element) {
      el.prepend(link)
    } else {
      try {
        document.querySelector(el).prepend(link)
      } catch (error) {
        throw new Error('loadStyle 选择器未查找到相关DOM ')
      }
    }
    return link
  }
}

/**
 * JSON对象深拷贝
 * @param {obj} obj 拷贝目标对象
 */
export function deepClone(obj) {
  const type = Object.prototype.toString.call(obj) // 通过原型对象获取对象类型
  let newObj
  if (type === '[object Array]') {
    // 数组
    newObj = []
    if (obj.length > 0) {
      for (let i = 0; i < obj.length; i++) {
        newObj.push(this.deepClone(obj[i]))
      }
    }
  } else if (type === '[object Object]') {
    // 对象
    newObj = {}
    for (const i in obj) {
      newObj[i] = this.deepClone(obj[i])
    }
  } else {
    // 基本类型和方法可以直接赋值
    newObj = obj
  }
  return newObj
}

/**
 * 对数组对象按照对象的某个属性进行排序
 * @param {string} field 对象的属性名
 * @param {string} type 升序(asc)或降序(desc)
 */
export function sortBy(type, field) {
  if (type === 'asc') {
    return function(a, b) {
      return a[field] - b[field]
    }
  } else {
    return function(a, b) {
      return b[field] - a[field]
    }
  }
}

/**
 * 获取某天的某个具体时间点的时间戳
 * @param date  时间对象
 * @param TimeArray 数字array [时，分， 秒，毫秒]
 */
export const getDetailTime = (date, timeArray) => {
  return new Date(date).setHours(
    timeArray[0],
    timeArray[1],
    timeArray[2],
    timeArray[3]
  )
}

/**
 * 获取今天前后的时间戳
 * @param dateCount  几天（-7：七天前，7：七天后，0 今天）
 * @param isZero 是否需要0点，默认为false(不需要)
 */
export const getRangeDay = (dayCount, isZero = false) => {
  const now = isZero ? new Date().setHours(0, 0, 0, 0) : new Date()
  if (dayCount || parseInt(dayCount) === 0) {
    return now.getTime() + 1000 * 60 * 60 * 24 * dayCount
  }
  return null
}

/**
 * 计算时间间隔，yyyy-MM-dd
 *
 */
export function dateDiff(sDate1, sDate2) {
  sDate1 = sDate1.replace(/-/g, '/')
  sDate2 = sDate2.replace(/-/g, '/')

  if (sDate1 >= sDate2) {
    var temp = sDate2
    sDate2 = sDate1
    sDate1 = temp
  }

  if (sDate1 === sDate2) {
    return '未间隔'
  }

  var diff =
    new Date(Date.parse(sDate2.split('.')[0])).getTime() -
    new Date(Date.parse(sDate1.split('.')[0])).getTime()
  var days = Math.floor(diff / (24 * 3600 * 1000))
  var diff1 = diff % (24 * 3600 * 1000)
  var hours = Math.floor(diff1 / (3600 * 1000))
  var diff2 = diff1 % (3600 * 1000)
  var minutes = Math.floor(diff2 / (60 * 1000))
  var diff3 = diff2 % (60 * 1000)
  var seconds = Math.round(diff3 / 1000)

  return (
    (days ? days + '天' : '') +
    (hours ? hours + '小时' : '') +
    (minutes ? minutes + '分钟' : '') +
    (seconds ? seconds + '秒' : '')
  )
}

/**
 * 字符串进行加密
 * @param code 要加密的字符串
 */
export const compileStr = code => {
  var c = String.fromCharCode(code.charCodeAt(0) + code.length)
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1))
  }
  return escape(window.escape(c).replace(/%/g, '%25'))
}

/**
 * 字符串进行解密
 * @param code 要解密的字符串
 */
export const uncompileStr = code => {
  code = window.unescape(code.replace(/%25/g, '%'))
  var c = String.fromCharCode(code.charCodeAt(0) - code.length)
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1))
  }
  return c
}

/**
 * 直接将url的字符串进行解密
 * @param code 要解密的字符串
 */
export const urlUncompileStr = code => {
  code = getQueryString(code)
  if (code) {
    code = window.unescape(code.replace(/%25/g, '%'))
    var c = String.fromCharCode(code.charCodeAt(0) - code.length)
    for (var i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1))
    }
    return c
  }
}
/**
 * 字符串转大写:
 * @param  {String} str 字符串
 * @return: {String}
 */
export const toUpperCase = str => {
  return typeof str === 'string' ? str.toUpperCase() : str
}
/**
 * 字符串yyyyMMdd转日期格式yyyy-MM-dd:
 */
export function stringToDate(str) {
  return str.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
}
/**
 * 日期格式yyyy-MM-dd转 字符串yyyyMMdd：
 */
export function dateToString(date) {
  return date.replace(/\-/g, '')
}
/**
 * 日期yyyyMMdd输出日期差值
 */
export function stringDateDiff(time1, time2) {
  time1 = stringToDate(time1)
  time2 = stringToDate(time2)
  time1 = Date.parse(new Date(time1))
  time2 = Date.parse(new Date(time2))
  const diff = Math.abs(parseInt((time1 - time2) / 1000 / 3600 / 24))
  return diff
}

/**
 * 下划线字符串转驼峰:
 * @param  {String} str 字符串
 * @return: {String}
 */
export const toHump = str => {
  return str.toLowerCase().replace(/\_(\w)/g, function(all, letter) {
    return letter.toUpperCase()
  })
}

/**
 * 下划线字符串对象转驼峰:
 * @param  {String} obj 字符串
 * @return: {String}
 */
export const toHumpObj = obj => {
  const newObj = {}
  for (var key in obj) {
    newObj[toHump(key)] = obj[key]
  }
  return newObj
}
// 日期加上天数生成新日期(yyyyMMdd)：
export function calDate(time, days) {
  const newTime = time.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
  const dateTemp = newTime.split('-')
  const nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0])
  const diff = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000)
  const rDate = new Date(diff)
  const year = rDate.getFullYear()
  let month = rDate.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let date = rDate.getDate()
  if (date < 10) {
    date = '0' + date
  }
  return (year + '' + month + '' + date)
}

export function formCheck(this_, formName, tabName) {
  // 设置单个表单的校验规则，最后输入当前tab页的页名
  var promise = []
  let mark = false
  const check = (item) => item === true
  for (let i = 0; i < formName.length; i++) {
    promise[i] = formName[i].validate().catch(() => { return Promise.resolve(tabName[i]) })
  }
  return Promise.all(promise).then((res) => {
    for (let i = 0; i < res.length; i++) {
      if (res[i] !== true) {
        // 这里的activeFormTab的值代表当前tab页，依据el-tab修改
        this_.activeFormTab = res[i]
        // 以下两行定位到未填写的表单位置
        const isError = document.getElementsByClassName('is-error')
        isError[0].querySelector('input').focus()
        this_.$alert('表单必填内容请补充完整', '提交失败', {
          confirmButtonText: '确定',
          callback: action => {
            this_.$message({
              message: `action: ${action}`,
              type: 'warning'
            })
          }
        })
        break
      }
    }
    if (res.every(check) === true) {
      mark = true
    } else {
      mark = false
    }
    return mark
  })
}

export const isFieldEmpty = field => {
  return (
    field === null ||
    field === "" ||
    field === undefined ||
    (Array.isArray(field) && field.length === 0) ||
    (typeof field === "object" && Object.keys(field).length === 0)
  ); //{}
};
export function getMessageAndLogIdByMessage (msg) {
  //后端约定好，双竖线分割 logId||message
  if (msg) {
    let index = msg.indexOf("||")
    if (index > 0) {
      return {
        logId: msg.substring(0, index),
        message: msg.substring(index + 2)
      }
    } else {
      return {
        logId: "",
        message: msg
      }
    }
  } else {
    return {
      logId: "",
      message: ""
    }
  }
}

// 4*35 的 swift报文格式
export function formatSwiftStr(str,lineNum,columnsNum){
  var strTmp = "";
  var strRet = "";
  if(str.length > columnsNum){
    strRet = str.substring(0,columnsNum);
    strTmp = str.substring(columnsNum,str.length);
  }else{
    return str;
  }
  while (strTmp.length > columnsNum){
    strRet = strRet + "\n" + strTmp.substring(0,columnsNum);
    strTmp = strTmp.substring(columnsNum,strTmp.length);
  }
  if(strTmp.length > 0){
    strRet = strRet + "\n" + strTmp.substring(0,columnsNum);
  }
  return strRet;
}

/**
 * 表单非必输方法
 * @param  {Arr} formArr 表单对象型数组
 * @param  {Boolean}
 */
export const requireForm = (formArr, isEable = false) => {
  for (let i = 0; i < formArr.length; i++) {
    for (var key in formArr[i]) {
      formArr[i][key][0].required = isEable;
      vue.$set(formArr[i][key][0],"message","")
    }
  }
};

/**
 * 根据路径截取字符串
 */
export function GetQueryString(url,name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let search = url !=null ? url : ''
  let r = search.substr(1).match(reg);
  if (r != null) {
      return window.unescape(r[2]);
  } else {
      return null;
  }
};
/**
 * 表单禁止方法
 * @param  {Arr} formArr 表单对象型数组
 * @param  {Boolean}
 */
export const disableForm = (formArr, disable = true) => {
  for (let i = 0; i < formArr.length; i++) {
    for (var key in formArr[i]) {
      console.log("key",key)
      var form = formArr[i]
      console.log("formArr[i]",form)
      console.log(" formArr[i].key", formArr[i][key])
      formArr[i][key].disabled = disable;
    }
  }
}

/**
 * 解析erp跳转携带参数
 * @param {*} pkey 
 * @returns 
 */
export function parseERPParam(pkey){
  if(localStorage.getItem(pkey)){
    return Base64.decode(localStorage.getItem(pkey)).split("").reverse().join("");
  }
  else{
    return "";
  }
};

/**
 * 
 * @returns 页面币别列表
 */
export function  defaultCurrencys(){
  return [{value:"CNY", label:"人民币"},
{value:"USD", label:"美元"},
{value:"AUD", label:"澳元"},
{value:"EUR", label:"欧元"},
{value:"JPY", label:"日元"},
{value:"GBP", label:"英镑"},
{value:"HKD", label:"港币"},
{value:"SGD", label:"新加坡元"},
{value:"CAD", label:"加拿大元"},
{value:"CHF", label:"瑞士法郎"}
    ]
  }

  export function defaultGpiStatus(){
    return [{value:"01", label:"汇款行已汇出"}, 
    {value:"02", label:"中转行已中转"}, 
    {value:"03", label:"中转行处理中"}, 
    {value:"04", label:"中转行已退回"}, 
    {value:"05", label:"收款行处理中"},
    {value:"06", label:"收款行已入账"}]
  }

  export function defaultMap(key){
    var devMap = {};
    var srcList = [];
    switch(key){
      case "Currencys":
        srcList = this.defaultCurrencys();
        break;
      case "GpiStatus":
        srcList = this.defaultGpiStatus();
        break;
      default:break;
    }

    srcList.forEach((element) => {
      devMap[element.value] = element.label;
    });
    return devMap;
  }

export default {
  formCheck,
  calDate,
  timestampToTime,
  timeToTimestamp,
  serialize,
  fillObject,
  dataTypeof,
  getQueryString,
  filterParams,
  loadScript,
  loadStyle,
  deepClone,
  sortBy,
  getRangeDay,
  getDetailTime,
  getQueryObj,
  dateDiff,
  compileStr,
  uncompileStr,
  urlUncompileStr,
  toUpperCase,
  stringToDate,
  dateToString,
  stringDateDiff,
  toHump,
  toHumpObj,
  isFieldEmpty,
  requireForm,
  disableForm,
  getMessageAndLogIdByMessage,
  formatSwiftStr,
  GetQueryString,
  parseERPParam,
  defaultCurrencys,
  defaultGpiStatus,
  defaultMap
}
