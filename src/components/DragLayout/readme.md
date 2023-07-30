## 写在前面
此组件仅提供一个创建dragLayout的解决思路
左右区域可通过中间分割线左右滑动，动态分配二者宽度，
基于vue,elementui,
element-resize-detector

## 组件位置： @components\dragLayout

## 引入方式   import dragLayout from "@/components/dragLayout";

## 使用方式   dragLayout
## export default {
##  components: {  
##      dragLayout
##  }
#<dragLayout>
#<template slot="leftSlot">
<!-- 放置左侧内容 -->
#</template>
#<template slot="midSlot">
<!-- 放置右侧内容 -->
#</template>
#</dragLayout>


标题
----------
----------
## props说明
参数                  说明                      类型          
  scale               展示数据                    number       左右比例（1:23）



