<template>
  <div class="box" :style="{height:screenHeight - 134 + 'px'}">
    <el-row>
      <el-col :span="scale" :style="{height:screenHeight - 134 + 'px'}" class="left">
        <slot name="leftSlot"></slot>
      </el-col>
      <el-col :span="1" :style="{height:screenHeight - 134 + 'px'}" class="resize"></el-col>
      <el-col :span="23-scale" :style="{height:screenHeight - 134 + 'px'}" class="mid">
        <slot style="background-color:black" name="midSlot"></slot>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    scale: {
      type: Number,
      default() {
        return 3;
      }
    }
  },
  data() {
    return {
      screenWidth: document.body.clientWidth,
      screenHeight: document.body.clientHeight
    };
  },
  mounted() {
    // 监听box变化，修改内容区宽度，防止侧边菜单缩放，展开导致内容区下坠
    let elementsd = require("element-resize-detector");
    let eld = elementsd();
    var _this = this;
    eld.listenTo(document.getElementsByClassName("box")[0], function(el) {
      document.getElementsByClassName("mid")[0].style.width =
        el.clientWidth -
        document.getElementsByClassName("left")[0].clientWidth -
        40 +
        "px";
    });
    //初始化推拉事件
    this.dragControllerDiv();
    const that = this;
    // 监听窗体大小变化，重置内容区，避免窗体变化导致内容区下坠
    window.onresize = () => {
      return (() => {
        that.screenHeight = document.body.clientHeight;
        that.screenWidth = document.body.clientWidth;
        document.getElementsByClassName("left")[0].style.width =
          that.screenWidth * (that.scale / 24) + "px";
        document.getElementsByClassName("mid")[0].style.width =
          that.screenWidth * ((23 - this.scale) / 24) + "px";
      })();
    };
  },
  watch: {},
  methods: {
    // 推拉
    dragControllerDiv() {
      var resize = document.getElementsByClassName("resize");
      var left = document.getElementsByClassName("left");
      var mid = document.getElementsByClassName("mid");
      var box = document.getElementsByClassName("box");
      var _this = this;
      for (let i = 0; i < resize.length; i++) {
        //鼠标按下事件
        resize[i].onmousedown = function(e) {
          var startX = e.clientX;
          resize[i].left = resize[i].offsetLeft;
          document.onmousemove = function(e) {
            var endX = e.clientX;
            var moveLen = resize[i].left + (endX - startX);
            var maxT = box[i].clientWidth;
            if (moveLen < _this.screenWidth * (_this.scale / 24)) {
              moveLen = _this.screenWidth * (_this.scale / 24);
            }
            if (moveLen > maxT - 300) {
              moveLen = maxT - 300;
            }
            resize[i].style.left = moveLen;
            for (let j = 0; j < left.length; j++) {
              left[j].style.width = moveLen + "px";
              mid[j].style.width = box[i].clientWidth - moveLen - 40 + "px";
            }
            document.onmouseup = function() {
              document.onmousemove = null;
              document.onmouseup = null;
              resize[i].releaseCapture && resize[i].releaseCapture();
            };
            resize[i].setCapture && resize[i].setCapture();
            return false;
          };
        };
      }
    }
  }
};
</script>
<style scoped>
.box {
  overflow: hidden;
  width: 100%;
}

.left {
  background: #ffffff;
  float: left;
  overflow-y: auto;
  overflow-x: hidden
}

.resize {
  cursor: col-resize;
  float: left;
  background-color: rgb(173, 163, 163);
  border-radius: 3px;
  width: 2px;
  background-size: cover;
  background-position: center;
  z-index: 200;
  margin-right: 10px;
}

.mid {
  float: left;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
