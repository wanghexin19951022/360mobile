<!--
 * @Descripttion: 
 * @Author: qt
 * @Date: 2021-03-11 18:55:33
 * @LastEditors: qt
 * @LastEditTime: 2021-03-12 11:41:17
-->
<!--  -->
<template>
  <div class="selfMain">
    <img src="../../assets/images/selfEvaltionPC.png" alt="" />
    <p>自评阶段截止时间：{{ this.times }}</p>
    <div class="SEbutton" @click="selfRouter">
      <img src="../../assets/images/selfimg.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      times: this.$route.query.time
        ? this.$route.query.time
        : "2021-01-12 14:00",
    };
  },
  components: {},
  created() {
    localStorage.removeItem("selectArr");
  },
  methods: {
    selfRouter() {
      this.$router.push({
        name: "evaluation",
        query: {
          id: this.$route.query.id,
          evaluationType: "self",
          evaluationId: this.$route.query.evaluationId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@function pcRem($args) {
  @return $args/1.44;
}
.selfMain {
  max-width: pcRem(1200px);
  min-width: pcRem(960px);
  height: 100%;
  margin: 0 auto;
  position: relative;
  img {
    width: 100%;
    height: auto;
  }
  p {
    font-family: PingFangSC-Regular;
    font-size: pcRem(20px);
    color: #ffffff;
    letter-spacing: pcRem(0.44px);
    text-align: center;
    line-height: pcRem(32px);
    position: absolute;
    top: pcRem(516px);
    left: 50%;
    transform: translateX(-50%);
  }
  .SEbutton {
    width: pcRem(134px);
    height: pcRem(134px);
    top: pcRem(860px);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    img {
      width: pcRem(134px);
      height: auto;
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
