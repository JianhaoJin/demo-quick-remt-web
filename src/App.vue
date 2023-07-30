<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    function GetRequestParam() {
      let url = location.href; //获取url中"?"符后的字串
      let theRequest = {};
      if (url.indexOf("?") != -1) {
        let str = url.substr(url.indexOf("?") + 1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    }
    let query = GetRequestParam();
    console.log(query, " this.$route.params");

    if (query.custId) {
      localStorage.setItem("custId", query.custId);
    } 
    if (query.corpCode) {
      localStorage.setItem("corpCode", query.corpCode);
    } 
    if (query.accessToken) {
      localStorage.setItem("accessToken", query.accessToken);
    } 

//从k3wise跳转
    if(query.k3wise){
      localStorage.setItem("k3wise", 1);
    }
    else{
      localStorage.removeItem("k3wise");
    }
    // else {
    //   // localStorage.removeItem("code", query.code);
    // }
  },
};
</script>
