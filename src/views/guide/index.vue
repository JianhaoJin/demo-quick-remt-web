<template>
  <div class="app-container">
    <p class="warn-content">
      如果你第一次使用，可以简单跟随介绍了解本系统界面和操作
      <!-- <a href="https://github.com/kamranahmedse/driver.js" target="_blank">driver.js.
      </a> -->
    </p>
    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">{{ $t('guide.button') }}</el-button>
  </div>
</template>

<script>
import * as Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './defineSteps'

export default {
  name: 'Guide',
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver()
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    }
  }
}
</script>
