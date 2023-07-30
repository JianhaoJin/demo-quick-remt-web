<template>
  <div :class="{ 'has-logo': showLogo }">
    <brand v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        unique-opened
      >
        <sidebar-item
          v-for="route in permission_routers"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import Brand from "../Sidebar/Brand";
import variables from "@/styles/variables.scss";

export default {
  data() {
    return {
      permission_routers: [
        {
          path: "",
          redirect: "irOpenQry",
          children: [
            {
              path: "irOpenQry",
              component: () => import("@/views/remt/irmt/irOpenQry/index"),
              name: "irOpenQry",
              meta: {
                title: "汇入汇款查询",
                icon: "component",
                noCache: false,
              },
            },
          ],
        },
        {
          path: "/recvrGpi",
          children: [
            {
              path: "recvrGpi",
              component: () => import("@/views/remt/irmt/recvrGpi/index"),
              name: "recvrGpi",
              meta: { title: "GPI查询", icon: "component", noCache: false },
            },
          ],
        },
      ],
    };
  },
  components: { SidebarItem, Brand },
  computed: {
    ...mapGetters([
      // 'permission_routers',
      "sidebar",
    ]),
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  }
};
</script>
