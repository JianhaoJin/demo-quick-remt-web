<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">页面样式设置</h3>

      <div class="drawer-item">
        <!-- <span>更换导航栏颜色</span> -->
        <div style="margin-bottom: 12px;">更换导航栏颜色</div>
        <!-- <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" /> -->
        <div>
          <div>
             <div>幽默黑</div>
             <div class="blackClassDiv"><i class="el-icon-check"/></div>
              <div>天空蓝</div>
             <div class="blueClassDiv"></div>
              <div>优雅灰</div>
             <div class="grayClassDiv"></div>
          </div>
        </div>
      </div>

      <div class="drawer-item">
        <span>开启Tags-View</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <!-- <div class="drawer-item">
        <span>固定 Header</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div> -->

      <div class="drawer-item">
        <span>侧边栏logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

      <!-- <div class="drawer-item">
        <span>菜单支持拼音搜索</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div> -->

    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'

export default {
  components: { ThemePicker },
  data() {
    return {}
  },

  mounted() {
  },
  methods: {
    test(){
      alert(111)
    }
  },

  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    }
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}
.blackClassDiv{
  height: 50px;
  border-style: solid;
  border-width: 0.5px;
  background-color: #041b34;
  text-align: center;
  color: #fff;
  font-size: 20px;
  line-height: 50px;
}
.blueClassDiv{
  height: 50px;
  border-style: solid;
  border-width: 0.5px;
  display: flex;
  justify-content: center;
  background-color: #409EFF;
}
.grayClassDiv{
  height: 50px;
  border-style: solid;
  border-width: 0.5px;
  display: flex;
  justify-content: center;
  background-color: #304156;
}
</style>

