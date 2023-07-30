<template>
  <div class="json-editor">
    <el-select @change="changeTheme" v-model="theme" class="select-class" placeholder="切换主题">
      <el-option label="darcula" value="darcula"></el-option>
      <el-option label="eclipse" value="eclipse"></el-option>
      <el-option label="blackboard" value="blackboard"></el-option>
      <el-option label="idea" value="idea"></el-option>
    </el-select>
    <textarea v-model="value" ref="textarea"/>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
// 编辑器主题风格(依赖下有多种，可自由引入)
import 'codemirror/theme/darcula.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/theme/blackboard.css'
import 'codemirror/theme/idea.css'
//编辑器组件可适配的文件类型(依赖下有多种，可自由引入)
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/mode/properties/properties.js'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/mode/textile/textile.js'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/mode/vue/vue.js'

export default {
  name: 'codeEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value'],
  data(){
    return {
      //默认主题
      theme:"darcula",
      //编辑器高亮适配类型
      codeType:{
        "xml":"xml",
        "java":"text/x-java",
        "yml":"text/x-yaml",
        "properties":"text/x-properties",
        "sql":"text/x-sql",
        "txt":"text/x-textile",
        'md':'text/markdown',
        "bat":"text/x-sh",
        "vue":"text/x-vue"
      }
    }
  },
  watch:{
    value(value) {
      this.codeEditor.setValue(value);
    }
  },
  mounted() {
    //默认高亮Java
    this.codeEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode:"text/x-java",
      gutters: ['CodeMirror-lint-markers'],
      theme: this.theme,
      lint: true,
      //只读
      readOnly:true
    })
  },
  methods:{
    //切换编辑器适配类型
    changeMode(type){
      if(!type){
        this.codeEditor.setOption("mode","text/x-sh");
        return;
      }
      if(this.codeType[type]){
        this.codeEditor.setOption("mode",this.codeType[type]);
      }else{
        this.codeEditor.setOption("mode","text/x-sh");
      }
    },
    //切换主题风格
    changeTheme(val){
      this.codeEditor.setOption("theme",val);
    }
  }
}
</script>

<style scoped>
.json-editor{
  height: 100%;
  position: relative;
}
.json-editor >>> .CodeMirror {
  height: 100%;
}
.json-editor >>> .CodeMirror-scroll{
  min-height: 300px;
}
.json-editor >>> .cm-s-rubyblue span.cm-string {
  color: #F08047;
}
.select-class{
  position: absolute;
  right: 17px;
  z-index: 99999;
  width: 100px;
}
</style>
