## 写在前面
此组件仅提供一个创建TreeSelect的解决思路

## 组件位置： @components\TreeSelect

## 引入方式   import treeSelect from "@/components/TreeSelect";

## 使用方式   注册treeSelect到模板中，例如：
## export default {
##  components: {  
##      treeSelect
##  }
标题
----------
----------
## props说明
参数                  说明                      类型          
data                 展示数据                    Array       树形结构对象
defaultProps         配置项                      object
clearable            配置选项框是否可清空         Boolean
nodeKey              节点唯一标识的属性           String      默认是对象 id
checkedKeys          默认勾选的节点               Array       ele-tree key数组
selectWidth          选择框宽度                  Number      默认180
width                pop框宽度                   Number      默认300
selected.sync        自动绑定父组件属性值     
multiple             是否开启多选                Boolean         默认false,不开启
collapseTags         多选是否将选中值按文字形式展示   Bolean    默认false
checkStrictly        树节点选择状态时，是否严格父子不互联   Boolean  默认false

##事件
change            节点单击时回调              回调一个参数，节点绑定的value（code）值,多选情况下为数组
openPopClick      pop框打开时回调             无回调参数
popverHide        pop框关闭时回调             回调两个参数，1.选定的节点value（code）数组，2.选定节点所绑定的对象数组

