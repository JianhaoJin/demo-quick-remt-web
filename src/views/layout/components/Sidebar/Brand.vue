<template>
  <div class="brand-container">
    <div class="logo">
      <!--<img class="imgLogo" src="@/assets/logo.png" alt="logo">-->
      <h1 id="sysName" :class="{'collapse': collapse}">{{systemName}}</h1>
    </div>
  </div>
</template>
<style scoped>
.brand-container{
  height: 60px;
  line-height: 60px;
  position: relative;
  padding-left: 24px;
  background-color: #08203f;
  box-shadow: 0 1px 9px -3px rgba(0, 0, 0, .2);
  overflow: hidden;
  transition: all .3s;
}
.imgLogo {
  display: inline-block;
  vertical-align: middle;
  width: 32px;
  margin-left: -10px;
}
#sysName{
  margin: 0 0 0 8px;
  line-height: 60px;
  vertical-align: middle;
  font-size: 20px;
  display: inline-block;
  font-weight: bold;
  color: rgba(255, 255, 255, .9);
}

</style>

<script>
import defaultSettings from '@/settings'

const { systemName } = defaultSettings
export default {
  name: 'Brand',
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      systemName : systemName
    }
  }
}
</script>


