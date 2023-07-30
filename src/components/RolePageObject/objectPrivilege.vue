<template>
  <div id="common"/>
</template>

<script>

import commRolePageObject from '@/api/mercurySysManagement/roleManagement/commRolePageObjectApi'
export default {
  name: 'ObjectPrivilege',
  data() {
    return {
      privilege: []
    }
  },
  created() {
    console.log('comm.this', this.$parent.$parent.$refs)
    commRolePageObject.queryRolePageByRoleId().then(res => {
      var temp = res.data.results
      for (var i = 0; i < temp.length; i++) {
        var rolePageObject = {}
        rolePageObject.objectType = temp[i].objectType
        rolePageObject.privilege = temp[i].privilege
        rolePageObject.objectId = temp[i].objectId
        this.privilege.push(rolePageObject)
      }
      this.setAttribute()
    })
  },
  methods: {
    setAttribute() {
      for (var i = 0; i < this.privilege.length; i++) {
        var objectId = this.privilege[i].objectId
        var objectType = this.privilege[i].objectType
        var privilege = this.privilege[i].privilege
        var pageObject = this.$parent.$parent.$refs[objectId]
        console.log('objectId' + i, objectId)
        console.log('pageObject', pageObject)
        if (pageObject != null && pageObject !== undefined) {
          var pageObjectEl = pageObject.$el
          console.log('pageObjectEl', pageObject.$el)
          console.log('pageObjectEl.refs', pageObject.$refs.input)
          if (privilege === 'hidden') {
            pageObjectEl.style.display = 'none'
          } else if (privilege === 'readonly') {
            if (objectType === 'button') {
              pageObjectEl.disabled = true
              pageObjectEl.classList.add('is-disabled')
            } else if(objectType === 'select') {
              pageObject.$refs.select.disabled = "true"
              pageObjectEl.classList.add('is-disabled')
            }else if(objectType === 'treeSelect'){
              pageObject.$refs.treeSelect.disabled = "true"
              // pageObjectEl.classList.add('is-disabled')
            }else{
              pageObject.$refs.input.disabled = "true"
              pageObjectEl.classList.add('is-disabled')
            }
          } else if (privilege === 'disabled') {
            if (objectType === 'button') {
              pageObjectEl.disabled = true
              pageObjectEl.classList.add('is-disabled')
            } else if(objectType === 'select'){
              console.log("pageObject.$refs.select.disabled", pageObject.$refs.select.disabled)
              // pageObject.$refs.select.disabled = true
              pageObjectEl.classList.add('is-disabled')
            }else if(objectType === 'treeSelect'){
              pageObject.$refs.treeSelect.disabled = "true"
              // pageObjectEl.classList.add('is-disabled')
            }else{
              pageObject.$refs.input.disabled = "true"
              pageObjectEl.classList.add('is-disabled')
            }
          }
        }
      }
    }
  }
}
</script>

