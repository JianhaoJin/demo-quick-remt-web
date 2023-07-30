<template>
  <div class="navbar">
    <!-- <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>-->
    <menu-trigger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/> 
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>

    <div class="right-menu">

      <!-- 搜索 -->
      <template v-if="device!=='mobile'">
        <div class="right-menu-item">
          <!-- <search id="header-search" class="header-search"/> -->
        </div>
      </template>

      <!-- 全屏 -->
      <template v-if="device!=='mobile'">
        <div class="right-menu-item">
          <error-log class="errLog-container"/>
          <el-tooltip content="全屏" effect="dark" placement="bottom">
            <screenfull class="screenfull"/>
          </el-tooltip>
        </div>
      </template>

      <!-- 消息 -->
      <div class="right-menu-item">
        <el-popover
          placement="bottom-end"
          trigger="click"
          content="text">
          <el-badge v-show="badgeNum != 0" slot="reference" :value="badgeNum" />
        </el-popover>
        <svg-icon icon-class="badge" />
      </div>

      <!-- 切换用户 -->
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <span>
          <svg-icon icon-class="switch-role" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(role) in roles" :key="role.roleId" >
            <span style="display:block;" >{{ role.name }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 用户 -->
      <el-dropdown class="right-menu-item" trigger="click">
        <div class="role-name">{{ name }}</div>
        <img src="@/assets/401_images/401.gif" class="avatar">
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              --<span class="expanded-click" @click="goHome">首页</span>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span class="expanded-click" @click="logout">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import MenuTrigger from '@/components/MenuTrigger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import store from '@/store'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    MenuTrigger,
    LangSelect,
    ThemePicker,
    Search
  },
  data() {
    return {
      roles: [],
      roleIdx: 0,
      badgeNum: 0
    }
  },
  created() {
    this.roles = store.getters.roles
    this.roleIdx = store.getters.roleIdx
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        // this.$router.push({ path: '/login'}) // do not use it before bug fixed
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    goHome() {
      this.$router.push('/')
    },
    // 切换角色
    changeRole(idx) {
      if (this.roleIdx === idx) return
      // 关闭所有打开的页面，回到首页
      this.$store.dispatch('delAllViews')
      this.$router.push('/')
      this.$store.dispatch('ChangeRole', idx).then(res => {
        this.roleIdx = idx
      }).catch(err => {})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    .hamburger-container {
      line-height: 50px;
      height: 50px;
      float: left;
      padding: 0 20px;
      &:hover{
        background-color: rgba(240, 240, 240, 0.2);
      }
    }
    .breadcrumb-container{
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .header-search{

    }
  }
  // new
  .right-menu {
    float: right;
    height: 100%;
    overflow: hidden;
  }
  .right-menu .right-menu-item {
    position: relative;
    cursor: pointer;
    padding: 0 6px;
    line-height: 50px;
    vertical-align: middle;
    display: inline-block;
    color: #5a5e66;
    outline: none;
    border: none;
  }
  .right-menu .right-menu-item:hover {
    background-color: rgba(240, 240, 240, .2);
  }
  .right-menu .right-menu-item .el-badge {
    position: absolute;
    top: -4px;
    right: -2px;
  }
  .right-menu .right-menu-item svg{
    width: 20px;
    height: 20px;
  }

  //
  .right-menu-item .avatar {
    float: left;
    width: 32px;
    height: 32px;
    margin: 7px 4px;
  }
  .right-menu-item .role-name {
    float: left;
    font-size: 14px;
    color: #595959;
  }
  .right-menu-item .screenful {
    padding: 20px 0;
  }
  .user-dropdown .el-dropdown-menu__item {
    padding: 0 50px;
  }
  .el-dropdown-menu--medium .el-dropdown-menu__item.el-dropdown-menu__item--divided:before {
    margin: 0 -50px;
  }

  .current_role {
    background-color: #ecf5ff;
    color: #66b1ff;
  }

  .expanded-click{
    display:block;
    margin:0 -50px;
    text-align:center;
  }
</style>
