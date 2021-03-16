<!--
 * @Descripttion: 
 * @Author: qt
 * @Date: 2021-03-11 18:54:34
 * @LastEditors: qt
 * @LastEditTime: 2021-03-16 17:33:57
-->
<!--  -->
<template>
  <div class="selfMain">
    <img src="../../assets/images/selfEvaltion.png" alt="" />
    <p>
      <span>自评阶段截止时间：</span><span>{{ this.times }}</span>
    </p>
    <div class="SEbutton" @click="selfRouter">
      <img src="../../assets/images/selfimg.png" alt="" />
    </div>
    <!-- <div class="SEbutton">
      开始自评
    </div> -->
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
.selfMain {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  background: rgba(36, 110, 255, 1);
  img {
    width: 100%;
    height: 100%;
  }
  p {
    position: absolute;
    top: 499px;
    left: 82px;
    span {
      font-family: PingFangSC-Regular;

      color: #ffffff;
      letter-spacing: 0.44px;
      margin-top: 12px;
      display: block;
      font-size: 12px;
    }
    // left: 50%;
    // transform: translateX(-50%);
  }
  .SEbutton {
    width: 80px;
    height: 80px;
    top: 477px;
    position: absolute;
    right: 79px;

    cursor: pointer;
    img {
      width: 80px;
      height: auto;
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
