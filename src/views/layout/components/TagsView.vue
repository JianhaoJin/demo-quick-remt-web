<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :class="isActive(tag)?'active':''"
        :to="tag.fullPath"
        :key="tag.path"
        tag="span"
        class="tags-view-item"
        @click.middle.native="closeSelectedTag(tag)"
        @contextmenu.prevent.native="openMenu(tag,$event)">
        {{ generateTitle(tag.title) }}
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"/>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane'
import { generateTitle } from '@/utils/i18n'

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    $route() {
      this.addViewTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.addViewTags()
  },
  methods: {
    generateTitle, // generateTitle by vue-i18n
    isActive(route) {
      return route.path === this.$route.path
    },
    // 添加访问的路由记录
    addViewTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el)

            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('updateVisitedView', this.$route)
            }

            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/')
    },
    openMenu(tag, e) {
      this.visible = true
      this.selectedTag = tag
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      this.left = e.clientX - offsetLeft + 15 // 15: margin right
      this.top = e.clientY
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tags-view-container {
    // height: 40px;
    // width: 100%;
    // background: #fff;
    // border-bottom: 1px solid #d8dce5;
    // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;

    .tags-view-wrapper {
      .tags-view-item {
        display: inline-block;
        // position: relative;
        // height: 36px;
        height: 26px;
        // padding: 0 28px 0 16px;
        padding: 0 8px;
        margin: 4px 0 0 5px;
        // margin-top: 4px;
        // line-height: 36px;
        line-height: 26px;
        font-size: 12px;
        // font-weight: bold;
        color: #8c8c8c;
        background: #fff;
        border: 1px solid #d8dce5;
        cursor: pointer;
        .el-icon-close {
          // display: none;
          // position: absolute;
          // right: 5px;
          // top: 10px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          text-align: center;
          transition: all .3s cubic-bezier(.645, .045, .355, 1);
          transform-origin: 100% 50%;
        }
        // &:hover {
        //   color: #1890ff;
        //   background-color: #e6f7ff;
        //   .el-icon-close {
        //     display: block;
        //     color: #1890ff;
        //     font-weight: bolder;
        //   }
        // }
        // .el-icon-close {
        //     width: 16px;
        //   height: 16px;
        //   vertical-align: 2px;
        //   border-radius: 50%;
        //   text-align: center;
        //   }
        &.active {
          // background-color: #40a9ff;
          // color: #fff;
          background-color: #42b983;
          color: #fff;
          border-color: #42b983;
          .el-icon-close {
            // display: block;
            color: #fff;
            font-weight: bolder;
          }
          // &::before {
          //   content: '';
          //   background: #fff;
          //   display: inline-block;
          //   width: 8px;
          //   height: 8px;
          //   border-radius: 50%;
          //   position: relative;
          //   margin-right: 2px;
          // }
        }
        &:first-of-type {
          // border-left: 1px solid #e8e8e8;
          margin-left: 15px;
        }
        &:last-of-type {
          margin-right: 15px;
        }
      }
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 100;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
// .tags-view-wrapper {
//   .tags-view-item {
//     .el-icon-close {
//       position: relative;
//       right: 2px;
//       width: 16px;
//       height: 16px;
//       vertical-align: 2px;
//       border-radius: 50%;
//       text-align: right;
//       transition: all .3s cubic-bezier(.645, .045, .355, 1);
//       transform-origin: 100% 50%;
//       &:before {
//         transform: scale(.6);
//         display: inline-block;
//         vertical-align: -3px;
//       }
//       &:hover {
//         background-color: #b4bccc;
//         color: #fff;
//       }
//     }
//   }
// }
</style>
