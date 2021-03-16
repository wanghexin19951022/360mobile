<!--
 * @Descripttion: 
 * @Author: qt
 * @Date: 2021-03-11 18:01:24
 * @LastEditors: qt
 * @LastEditTime: 2021-03-15 17:56:43
-->
<!--  -->
<template>
  <div class="EResults main">
    <!-- <div class="EResults_dialog"> -->
    <img src="../../assets/images/bg_002.png" class="bgimg" alt="" />
    <div class="EResults_header">
      <p class="ellipsis">{{ peopleData.questionnaireName }}</p>
      <div class="ERh_content">
        <div class="ERh_left">
          <h5>{{ peopleData.empName }}</h5>
          <p>综合得分</p>
          <span>{{ peopleData.summaryScore }}分</span>
        </div>
        <div class="ERh_right">
          <img
            src="@/assets/images/icon_bhg@2x.png"
            alt=""
            v-if="peopleData.ratingId == 1"
          />
          <img
            src="@/assets/images/icon_hg@2x.png"
            alt=""
            v-if="peopleData.ratingId == 2"
          />
          <img
            src="@/assets/images/icon_lh@2x.png"
            alt=""
            v-if="peopleData.ratingId == 3"
          />
          <img
            src="@/assets/images/icon_yx@2x.png"
            alt=""
            v-if="peopleData.ratingId == 4"
          />
          <img
            src="@/assets/images/icon_hz@2x.png"
            alt=""
            v-if="peopleData.ratingId == 5"
          />
        </div>
      </div>
    </div>
    <div class="EResults_content">
      <div
        class="EResults_list"
        v-for="(item, index) in peopleData.valueScores"
        :key="index"
      >
        <p>
          <img
            :src="require(`@/assets/images/icon_cjkh${index + 1}.png`)"
            alt=""
          /><span>{{ item.valueName }}</span>
        </p>
        <span>{{ item.score }}分</span>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { historyDetail } from "@/api/api";
export default {
  data() {
    return {
      dialogTableVisible: this.dVisible || false,
      peopleData: {
        questionnaireName: "",
        empName: "",
        summaryScore: "",
        ratingId: "",
        valueScores: [
          {
            valueName: "成就客户",
            score: "",
          },
          {
            valueName: "诚信",
            score: "",
          },
          {
            valueName: "务实",
            score: "",
          },
          {
            valueName: "协作",
            score: "",
          },
          {
            valueName: "创新",
            score: "",
          },
        ],
      },
      dialogTableVisible: true,
    };
  },
  components: {},
  created() {
    this.gethistoryDetail();
  },
  methods: {
    gethistoryDetail() {
      var params = {
        questionnaireId: this.$route.query.id,
        summaryId: this.$route.query.summaryId,
      };
      console.log(params);
      historyDetail(params).then((res) => {
        this.peopleData = res;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.EResults {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  .bgimg {
  }
  .EResults_header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 300px;
    // background-image: url("../../assets/images/bg_002.png");
    overflow: hidden;
    // background-repeat: no-repeat;
    > p {
      width: 80%;
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;

      margin: 0 auto;
      margin-top: 16px;
    }
    .ERh_content {
      display: flex;
      margin: 0 32px 0 52px;
      margin-top: 41px;
      justify-content: space-between;
      .ERh_left {
        h5 {
          font-family: PingFangSC-Medium;
          font-weight: 600;
          font-size: 24px;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 24px;
          margin-bottom: 23px;
        }
        p {
          width: 60px;
          height: 24px;
          text-align: center;
          background: #1b0808;
          border-radius: 4px;
          font-family: PingFangSC-Medium;
          font-weight: 600;
          font-size: 12px;
          line-height: 24px;
          color: #ffffff;
          letter-spacing: 0;
          margin-bottom: 8px;
        }
        span {
          font-family: PingFangSC-Semibold;
          font-size: 18px;
          color: #ffffff;
          letter-spacing: 0;
          margin-left: 10px;
        }
      }
      .ERh_right {
        img {
          width: 158px;
          height: 110px;
        }
      }
    }
  }
  .EResults_content {
    width: 343px;
    height: 325px;
    border-radius: 6px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 4px 10px 0 rgba(75, 158, 255, 0.2);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 215px;
    .EResults_list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      margin: 0 12px;
      padding: 0 12px;
      border-bottom: 1px solid #f5f5f5;
      &:last-child {
        border-bottom: none;
      }

      > span {
        font-family: PingFangSC-Medium;
        font-weight: 600;
        font-size: 14px;
        color: #000000;
        letter-spacing: 0;
      }
      > p {
        img {
          height: 24px;
          width: auto;
          display: inline-block;
          vertical-align: middle;
          margin-right: 14px;
        }
        span {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #333333;
          letter-spacing: 0;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
