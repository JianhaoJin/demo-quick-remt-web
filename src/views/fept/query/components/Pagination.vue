<template>
  <div >
    <div :class="{'hidden':hidden}" >
      <el-pagination
        :small="true"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :page-sizes="pageSizes"
        :pager-count="pagerCount"
        :total="total"
        :layout="layout"
        v-bind="$attrs"
        class="batch-btn-padding fr"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100]
      }
    },
    layout: {
      type: String,
      default: 'total, prev, pager, next,sizes, jumper'
    },
    hidden: {
      type: Boolean,
      default: false
    },
    pagerCount: {
      type: Number,
      default: 5
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { pageNum: this.currentPage, pageSize: val })
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { pageNum: val, pageSize: this.pageSize })
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-pagination.hidden {
  display: none;
}
</style>
