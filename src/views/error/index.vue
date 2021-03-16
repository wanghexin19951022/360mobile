<!--
 * @Descripttion: 
 * @Author: sjq
 * @Date: 2021-01-19 09:17:20
 * @LastEditors: sjq
 * @LastEditTime: 2021-01-28 13:50:59
-->
<template>
  <div class="error">
    <div class="message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "",
    };
  },
  created() {
    this.message =
      decodeURIComponent(this.$route.query.message) || "出错了，请联系管理员";
  },
};
</script>

<style lang="scss" scoped>
.error {
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
}
.message {
  width: 65%;
  height: 100%;
  margin: 0 auto;
  padding-top: 120px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
</style>
