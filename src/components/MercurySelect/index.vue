<template>
  <div class="mercurySelect" >
    <el-select v-model="svalue" :placeholder="placeholder" :multiple="multiple" :disabled="disabled" clearable style="width:100%" filterable @change="change">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'MercurySelect',
  props: {
    url: {
      type: String,
      default: null
    }, // 导入的url地址
    metName: {
      type: String,
      default: null
    }, // 方法名
    dicttypeid: {
      type: String,
      default: null
    }, // 条件参数
    value: {
      type: [String, Array],
      default: null
    }, // 接受外部v-model传入的值   可能设置为单选或者多选
    fileType: {
      type: Object,
      default: null
    }, // 定义请求回来的json数据格式
    placeholder: {
      type: String,
      default: null
    },
    multiple: { // 是否多选，默认false，非必传。
      type: Boolean,
      default: false
    },
    disabled: { // 是否多选，默认false，非必传。
      type: Boolean,
      default: false
    },
    dictParams: {
      type: Object,
      default: null } // 接口其余请求参数的JSON串，非必传。
  },
  data() {
    return {
      options: [],
      svalue: [],
      requestParams: null
    }
  },
  watch: {
    // 判断下拉框的值是否有改变
    svalue(val, oldVal) {
      if (val !== oldVal) {
        this.$emit('input', this.svalue)
      }
    },
    dictParams() {
      this.requestParams = this.dictParams
    },
    value(svalue) { // 接受父组件的 v-mode 双向绑定
      this.svalue = svalue
    }
  },
  mounted() {
    // 初始话下拉框的值
    if (this.url !== undefined && this.url !== null) {
      request({
        url: this.url,
        method: 'get'
      }).then(response => {
        this.options = this._dataTransform(response.data.data)
      })
    } else {
      const dictParames = {
        dicttypeid: this.dicttypeid
      }
      if (this.dictParams !== undefined && this.dictParams !== null) {
        dictParames.status = this.dictParams.status
        dictParames.filter1 = this.dictParams.filter1
        dictParames.filter2 = this.dictParams.filter2
      }
      this.getDicts(dictParames).then(response => {
        this.options = this._dataTransform(response.data.results)
      })
    }
    if (this.svalue !== this.value) {
      this.svalue = this.value
    }
  },

  methods: {
    _dataTransform(data) {
      const _data = []
      for (let i = 0; i < data.length; i++) {
        _data[i] = {}
        if (this.fileType !== undefined && this.fileType !== null) {
          _data[i].label = data[i][this.fileType.label]
          _data[i].value = data[i][this.fileType.value]
        } else { // 不指定下拉框的label和value就用默认的
          _data[i].label = data[i].dictname
          _data[i].value = data[i].dictid
        }
      }
      return _data
    },

    reset() {
      if (this.multiple) {
        this.svalue = []
      } else {
        this.svalue = ''
      }
    },

    /**
		* 选择框change事件，将所选值和所选值所在的对象回传给父组件
		* @val {String} 当前选中值
		**/
    change(val) {
      let valueKey = 'value'
      if (this.optionKey) {
        valueKey = this.optionKey.value
      }
      if (this.multiple) {
        const valObjList = []
        val.forEach(element => {
          const valObj = this.options.find(itemO => itemO[valueKey] === element)
          valObjList.push(valObj)
        })
        this.$emit('input', val)
        this.$emit('change', val, valObjList)
        // this.$emit('change', val);
      } else {
        const valOption = this.options.filter(itemO => itemO[valueKey] === val)
        const [valObj] = valOption
        this.$emit('input', val)
        this.$emit('change', val, valObj)
      }
    }
  }
}
</script>

<style scoped>
</style>
