<template>
  <section class="app-main">
    <!-- <transition name="fade-transform" mode="out-in">

    </transition> -->
    <keep-alive :include="cachedViews">
      <router-view :key="key"/>
    </keep-alive>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  computed: {
    ...mapGetters(['cachedViews']),
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
  .app-main {
    /*84 = navbar + tags-view = 60 + 40 */
    min-height: calc(100vh - 100px);
    width: 100%;
    /* position: relative; */
    overflow: hidden;
    background-color: #f0f2f5;
  }
</style>

