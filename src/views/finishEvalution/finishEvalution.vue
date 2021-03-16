<!--
 * @Descripttion: 
 * @Author: qt
 * @Date: 2021-03-11 08:14:19
 * @LastEditors: qt
 * @LastEditTime: 2021-03-12 15:21:38
-->
<!--  -->
<template>
  <div class="finishEvalution main">
    <div class="fe_content">
      <img src="../../assets/images/bg_cg@3x.png" alt="" />
      <span>您已完成自评</span>
      <span>请耐心等待考评下一阶段...</span>
    </div>
    <div class="cb_bottom">
      <div class="but prev" @click="back">返回</div>
      <div class="but subClass" @click="DepartmentSub">查看自评</div>
      <!-- <van-button plain type="info" class="prev">上一步</van-button>
      <van-button type="info" class="subClass">提交</van-button> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  methods: {
    DepartmentSub() {
      this.$router.push({
        name: "evaluationDetail",
        query: {
          id: this.$route.query.id,
          evaluationType: "self",
          viewType: "view",
          evaluationId: this.$route.query.evaluationId,
        },
      });
    },
    back() {
      this.$router.push({
        name: "value",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.finishEvalution {
  width: 100%;
  height: 100%;
  .fe_content {
    text-align: center;
    margin-top: 96px;
    img {
      width: 360px;
      height: auto;
      // margin-bottom: 15px;
    }
    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666666;
      text-align: center;
      display: block;
      margin-bottom: 4px;
      &:last-child {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        text-align: center;
        display: block;
      }
    }
  }
}
.cb_bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  margin-bottom: 25px;
  .prev {
    width: 120px;
    height: 48px;
    border: 1px solid #4697ff;
    border-radius: 6px;
    font-family: PingFangSC-Regular;
    color: #4697ff;
    line-height: 48px;
    text-align: center;
    display: inline-block;
    vertical-align: center;
  }
  .subClass {
    width: 216px;
    height: 48px;
    line-height: 48px;
    margin-left: 7px;
    background: #4697ff;
    border-radius: 6px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    display: inline-block;
    vertical-align: center;
  }
}
</style>
