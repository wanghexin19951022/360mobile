<!--
 * @Descripttion: 
 * @Author: sjq
 * @Date: 2020-12-22 15:22:51
 * @LastEditors: sjq
 * @LastEditTime: 2021-01-26 11:19:04
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  created() {
    // login().then((res) => {
    //   console.log(res);
    // });
  },
};
</script>
<style lang="scss">
#app {
  font-size: 14px;
  background: #fff;
}
img {
  max-width: 100%;
}
</style>
