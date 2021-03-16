<!--
 * @Descripttion: 
 * @Author: qt
 * @Date: 2021-03-11 13:47:19
 * @LastEditors: qt
 * @LastEditTime: 2021-03-15 17:55:34
-->
<!--  -->
<template>
  <div class="EResults">
    <el-dialog
      title=""
      custom-class="EResults_dialog"
      :before-close="handleClose"
      :visible.sync="dialogTableVisible"
    >
      <div class="EResults_header">
        <p>{{ peopleData.questionnaireName }}</p>
        <div class="ERh_content">
          <div class="ERh_left">
            <h5>{{ peopleData.empName }}</h5>
            <p>综合得分</p>
            <span>{{ peopleData.summaryScore }}分</span>
          </div>
          <div class="ERh_right">
            <img
              src="../assets/images/icon_bhg@2x.png"
              alt=""
              v-if="peopleData.ratingId == 1"
            />
            <img
              src="../assets/images/icon_hg@2x.png"
              alt=""
              v-if="peopleData.ratingId == 2"
            />
            <img
              src="../assets/images/icon_lh@2x.png"
              alt=""
              v-if="peopleData.ratingId == 3"
            />
            <img
              src="../assets/images/icon_yx@2x.png"
              alt=""
              v-if="peopleData.ratingId == 4"
            />
            <img
              src="../assets/images/icon_hz@2x.png"
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
              :src="require(`../assets/images/icon_cjkh${index + 1}.png`)"
              alt=""
            /><span>{{ item.valueName }}</span>
          </p>
          <span>{{ item.score }}分</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { historyDetail } from "@/api/api";
export default {
  props: {
    id: {
      default: "",
    },
    dVisible: {
      type: Boolean,
      default: false,
    },
    summaryId: {
      default: "",
    },
  },
  data() {
    return {
      dialogTableVisible: this.dVisible || false,
      peopleData: {
        questionnaireName: "朴新教育科技集团2020年核心价值观季度",
        empName: "王天一",
        summaryScore: 25,
        ratingId: "",
        valueScores: [
          {
            valueName: "成就客户",
            score: 5,
          },
          {
            valueName: "诚信",
            score: 5,
          },
          {
            valueName: "务实",
            score: 5,
          },
          {
            valueName: "协作",
            score: 5,
          },
          {
            valueName: "创新",
            score: 5,
          },
        ],
      },
      dialogTableVisible: true,
    };
  },
  watch: {
    dVisible: {
      handler: function(newVal, oldVal) {
        // console.log(newVal);
        // console.log(this);
        this.dialogTableVisible = newVal;
        this.gethistoryDetail();
      },
      deep: true,
      // immediate: true,
    },
  },
  components: {},
  created() {
    console.log(this.id);
    this.gethistoryDetail();
  },
  methods: {
    handleClose() {
      this.$emit("close", false);
    },
    gethistoryDetail() {
      var params = {
        questionnaireId: this.id,
        summaryId: this.summaryId,
      };
      console.log(params);
      historyDetail(params).then((res) => {
        this.peopleData = res;
      });
    },
  },
};
</script>
<style lang="scss">
@function pcRem($args) {
  @return $args/1.44;
}
.EResults_dialog {
  width: pcRem(576px) !important;
  height: pcRem(671px) !important;
  border-radius: pcRem(17px) !important;
  position: relative;
  overflow: hidden;
  .el-dialog__header {
    padding: 0 !important;
    i {
      color: #333333;
      &::before {
        content: "\e79d";
      }
    }
  }
  .el-dialog__body {
    padding: 0;
    overflow: hidden;
    .EResults_header {
      background-image: url("../assets/images/bg02.png");
      width: 100%;
      height: pcRem(340px) !important;
      overflow: hidden;
      // margin-top: pcRem(69px) !important;
      > p {
        text-align: center;
        font-family: PingFangSC-Medium;
        font-weight: 600;
        font-size: pcRem(18px);
        color: #ffffff;
        letter-spacing: 0;
        line-height: pcRem(32px);
        margin-top: pcRem(69px);
      }
      .ERh_content {
        display: flex;
        margin: 0 pcRem(68px) 0 pcRem(48px);
        margin-top: pcRem(42px);
        justify-content: space-between;
        .ERh_left {
          h5 {
            font-family: PingFangSC-Medium;
            font-size: pcRem(24px);
            color: #ffffff;
            letter-spacing: 0;
            line-height: pcRem(24px);
            margin-bottom: pcRem(23px);
          }
          p {
            width: pcRem(60px);
            height: pcRem(24px);
            text-align: center;
            background: #1b0808;
            border-radius: pcRem(4px);
            font-family: PingFangSC-Medium;
            font-size: pcRem(12px);
            line-height: pcRem(24px);
            color: #ffffff;
            letter-spacing: 0;
            margin-bottom: pcRem(8px);
          }
          span {
            font-family: PingFangSC-Semibold;
            font-size: pcRem(18px);
            color: #ffffff;
            letter-spacing: 0;
            margin-left: pcRem(10px);
          }
        }
        .ERh_right {
          img {
            width: pcRem(215px);
            height: pcRem(149px);
          }
        }
      }
    }
  }
  .EResults_content {
    width: pcRem(528px);
    height: pcRem(324px);
    border-radius: pcRem(6px);
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 pcRem(4px) pcRem(10px) 0 rgba(75, 158, 255, 0.2);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: pcRem(316px);
    .EResults_list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: pcRem(64px);
      margin: 0 pcRem(12px);
      padding: 0 pcRem(12px);
      border-bottom: pcRem(1px) solid #f5f5f5;
      &:last-child {
        border-bottom: none;
      }

      > span {
        font-family: PingFangSC-Medium;
        font-weight: 600;
        font-size: pcRem(14px);
        color: #000000;
        letter-spacing: 0;
      }
      > p {
        img {
          height: pcRem(24px);
          width: auto;
          display: inline-block;
          vertical-align: middle;
          margin-right: pcRem(14px);
        }
        span {
          font-family: PingFangSC-Regular;
          font-size: pcRem(14px);
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
<style lang="scss" scoped>
/deep/ .EResults {
  background: #fff;
}
</style>
