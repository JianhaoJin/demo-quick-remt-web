<template>
    <div>
    <!-- <brand :collapse="isCollapse"/> -->
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="horizontal"
      background-color="#041b34"
      text-color="#fff"
      active-text-color="#fff"
      unique-opened
    >
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Brand from '../Sidebar/Brand'

export default {
  components: { SidebarItem, Brand },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
