<template>
  <div>
    <el-popover placement="bottom-start" :width="width" v-model="isShowSelect" @hide="popverHide">
      <el-input placeholder="输入关键词过滤" clearable v-model="filterText"></el-input>

      <el-tree
        class="common-tree"
        :style="style"
        ref="tree"
        :data="data"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :show-checkbox="multiple"
        :check-strictly="checkStrictly"
        :node-key="nodeKey"
        :highlight-current="true"
        :expand-on-click-node="false"
        :check-on-click-node="multiple"
        @node-click="handlerNodeClick"
        @check-change="handlerCheckClick"
      >
        <span class="cutstom-tree-node" slot-scope="{node,data}">
          <span v-if="data.children && data.children.length > 0">
            <i class="fa fa-folder" aria-hidden="true"></i>
          </span>
          <span v-else>
            <i class="fa fa-file" aria-hidden="true"></i>
          </span>
          <span style="font-size:15px">{{node.label}}</span>
        </span>
      </el-tree>
      <el-select
        :style="selectStyle"
        slot="reference"
        ref="select"
        :multiple="multiple"
        v-model="selectedData"
        :clearable="clearable"
        :collapse-tags="collapseTags"
        @remove-tag="removeSelectedNodes"
        @click.native="showPop"
        @clear="removeSelectedNode"
        @change="changeSelectedNodes"
        class="tree-select"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: "treeSelect",
  props: {
    //   树结构数据
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    // 配置项，参考elementui-tree组件的props
    defaultProps: {
      type: Object,
      default() {
        return {};
      },
      required: true
    },
    // 选项框是否可清空
    clearable: {
      type: Boolean,
      default() {
        return true;
      }
    },
    // 节点唯一标识
    nodeKey: {
      type: String,
      default() {
        return "id";
      }
    },
    // 默认选中的节点，（传递多个默认选中第一条数据）
    checkedKeys: {
      type: Array,
      default() {
        return [];
      }
    },
    // 选择框宽度
    selectWidth: {
      type: Number,
      default() {
        return 180;
      }
    },
    // pop框宽度
    width: {
      type: Number,
      default() {
        return 300;
      }
    },
    // 配置是否开启多选
    multiple: {
      type: Boolean,
      default() {
        return false;
      }
    },
    // 多选是否将选中值按文字形式展示
    collapseTags: {
      type: Boolean,
      default() {
        return true;
      }
    },
    // 树开启多选的时候，是否遵守父子不互联的做法
    checkStrictly: {
      type: Boolean,
      dafault() {
        return false;
      }
    }
  },
  data() {
    return {
      // 控制展开pop
      isShowSelect: false,
      // select框内容
      options: [],
      // 节点选中值
      selectedData: [],
      style: "width:" + this.width + "px;",
      selectStyle: this.selectWidth == -1 ? "width:100%" : ("width:" + (this.selectWidth + 24) + "px;"),
      // 选中节点的code列表
      checkedIds: [],
      // 选中节点所绑定的对象列表
      checkedData: [],
      // tree组件过滤属性
      filterText: ""
    };
  },
  watch: {
    isShowSelect(val) {
      this.$refs.select.blur();
    },
    checkedKeys(val) {
      if (!val) {
        return;
      }
      this.checkedKeys = val;
      this.initCheckedData();
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.initCheckedData();
  },
  methods: {
    // 单选点击tree节点设置select
    setSelectOption(node) {
      if (!this.multiple) {
        let tmpMap = {};
        tmpMap.value = node.key;
        tmpMap.label = node.label;
        this.options = [];
        this.options.push(tmpMap);
        this.selectedData = node.key;
      }
    },
    // 单选，选中传进来的节点
    checkSelectedNode(checkedKeys) {
      if (!this.multiple) {
        var item = checkedKeys[0];
        this.$refs.tree.setCurrentKey(item);
        var node = this.$refs.tree.getNode(item);
        this.setSelectOption(node);
      }
    },
    // 多选，选中传进来的节点
    checkSelectedNodes(checkedKeys) {
      if (checkedKeys.length > 0) {
        this.$refs.tree.setCheckedKeys(checkedKeys);
      }
    },
    // 单选，清空选中
    clearSelectedNode() {
      if (!this.multiple) {
        this.selectedData = "";
        this.$refs.tree.setCurrentKey(null);
      }
    },
    // 多选，清空选中
    clearSelectedNodes() {
      if (this.getCheckedKeys) {
        this.getCheckedKeys.each(element => {
          this.$refs.tree.setChecked(element, false);
        });
      }
    },
    // 初始化，如果有值则勾选节点
    initCheckedData() {
      if (this.multiple) {
        if (this.checkedKeys.length > 0) {
          this.checkSelectedNodes(this.checkedKeys);
        } else {
          this.clearSelectedNodes();
        }
      } else {
        if (this.checkedKeys.length > 0) {
          this.checkSelectedNode(this.checkedKeys);
        } else {
          this.clearSelectedNode();
        }
      }
    },
    // 隐藏pop时触发
    popverHide() {
      if (this.multiple) {
        this.checkedIds = this.$refs.tree.getCheckedKeys();
        this.checkedData = this.$refs.tree.getCheckedNodes();
      } else {
        this.checkedIds = this.$refs.tree.getCurrentKey();
        this.checkedData = this.$refs.tree.getCurrentNode();
      }
      this.$emit("popverHide", this.checkedIds, this.checkedData);
    },
    // 单选，节点被点击时回调，返回被点击节点的数据
    handlerNodeClick(data, node) {
      if (!this.multiple) {
        this.setSelectOption(node);
        this.isShowSelect = !this.isShowSelect;
        this.publishCallBackEvents();
      }
    },
    // 单选，清空输入框的回调
    removeSelectedNode() {
      if (!this.multiple) {
        this.clearSelectedNode();
        this.publishCallBackEvents();
      }
    },
    // 多选，返回被点击的节点数据列表
    handlerCheckClick() {
      var checkedKeys = this.$refs.tree.getCheckedKeys();
      this.options = checkedKeys.map(item => {
        var node = this.$refs.tree.getNode(item);
        let tmpMap = {};
        tmpMap.value = node.key;
        tmpMap.label = node.label;
        return tmpMap;
      });
      this.selectedData = this.options.map(item => {
        return item.value;
      });
      this.publishCallBackEvents();
    },
    // 取消多选选项更新树
    removeSelectedNodes(val) {
      this.$refs.tree.setChecked(val, false);
      var node = this.$refs.tree.getNode(val);
      // 清除父节点时清空级联子节点
      if (!this.checkStrictly && node.childNodes.length > 0) {
        var list = [];
        this.treeToList(node, list);
        list.map(item => {
          if (item.childNodes.length <= 0) {
            this.$refs.tree.setChecked(item, false);
          }
        });
      }
      this.handlerCheckClick();
      this.publishCallBackEvents();
    },
    // 递归将树结构转换为列表
    treeToList(tree, list, parent) {
      if (tree instanceof Object && tree.childNodes) {
        list.push(tree);
        if (tree.childNodes) {
          this.treeToList(tree.childNodes, list);
        }
      }
      if (tree instanceof Array) {
        for (let node of tree) {
          list.push(node);
          if (node.childNodes) {
            this.treeToList(node.childNodes, list);
          }
        }
      }
    },
    // 多选
    changeSelectedNodes() {
      if (this.multiple && this.selectedData.length > 0) {
        this.clearSelectedNodes();
        this.publishCallBackEvents();
      }
    },
    // 打开pop
    showPop() {
      this.isShowSelect = !this.isShowSelect;
      this.$emit("openPopClick");
    },
    // 树节点过滤
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      if (this.defaultProps.label) {
        return data[this.defaultProps.label].indexOf(value) !== -1;
      }
    },
    // 发布回调事件
    publishCallBackEvents() {
      this.$emit("change", this.selectedData);
      this.$emit("update:selected", this.selectedData);
    }
  }
};
</script>
<style scope>
.common-tree {
  overflow: auto;
  position: relative;
  height: 280px;
}
</style>>
