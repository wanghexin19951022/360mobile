<!--
 * @Descripttion: 
 * @Author: qt
 * @Date: 2021-03-11 09:49:00
 * @LastEditors: qt
 * @LastEditTime: 2021-03-16 16:41:01
-->
<!--  -->
<template>
  <div class="eachMain main">
    <div class="top_title">互评阶段截止时间：{{ times }}</div>
    <p>被评人列表</p>
    <div
      class="each_content sroll"
      v-infinite-scroll="loadScroll"
      infinite-scroll-distance
    >
      <div class="each_list" v-for="(item, index) in eachList" :key="index">
        <div class="each_left">
          <span>{{ item.evaluatedEmpName }}</span>
          <p v-if="item.evaluatedEmail">
            <img src="../../assets/images/icon_yx@3x.png" alt="" /><span>{{
              item.evaluatedEmail
            }}</span>
          </p>
        </div>
        <div
          class="each_right"
          :class="item.evaluationStatus ? 'yet' : ''"
          @click="evalutionRouter(item)"
        >
          <p>{{ item.evaluationStatusName }}</p>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>
    <!-- <EvaluationResults /> -->
  </div>
</template>

<script>
// import EvaluationResults from "@/components/EvaluationResults";
import { evaluatedPage } from "@/api/api";
export default {
  data() {
    return {
      pageSize: {
        page: 0,
        size: 7,
      },
      times: this.$route.query.time
        ? this.$route.query.time
        : "2021-01-31 14:00",
      eachList: [],
    };
  },
  created() {
    // this.getEvaluatedPage();
  },
  // components: { EvaluationResults },
  methods: {
    loadScroll() {
      this.pageSize.page += 1;
      this.getEvaluatedPage();
    },
    eachRouter(data) {
      this.$router.push({
        name: "evaluation",
        query: { evaluationType: "peer", id: this.$route.query.id },
      });
    },
    getEvaluatedPage() {
      const local = JSON.parse(localStorage.getItem("userInfo"));
      var params = {
        ...this.pageSize,
        questionnaireId: this.$route.query.id,
        empNo: local.ehrCode,
      };
      evaluatedPage(params).then((res) => {
        this.eachList.push(...res.list);
      });
    },
    evalutionRouter(data) {
      console.log(data);
      if (data.evaluationStatus) {
        this.$router.push({
          name: "evaluationDetail",
          query: {
            id: this.$route.query.id,
            viewType: "view",
            evaluationType: "peer",
            name: data.evaluatedEmpName,
            evaluationId: data.evaluationId,
            evaluatedEmpNo: data.evaluatedEmpNo,
          },
        });
      } else {
        this.$router.push({
          name: "evaluation",
          query: {
            id: this.$route.query.id,
            evaluationType: "peer",
            name: data.evaluatedEmpName,
            evaluationId: data.evaluationId,
            evaluatedEmpNo: data.evaluatedEmpNo,
          },
        });
      }
      console.log(data);
    },
  },
};
</script>

<style lang="scss" scoped>
.yet {
  p {
    color: #cccccc !important;
  }
}
.eachMain {
  height: 100%;
  display: flex;
  flex-direction: column;
  .top_title {
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: rgba(70, 151, 255, 0.6);
    font-family: PingFangSC-Medium;
    font-weight: 600;
    font-size: 12px;
    color: #ffffff;
    letter-spacing: 0;
  }
  > p {
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #333333;
    letter-spacing: 0;
    margin-left: 16px;
    height: 44px;
    line-height: 44px;
    border-bottom: 1px solid#F5F5F5;
  }
  .each_content {
    flex: 1;
    margin: 0px 16px;
    height: 300px;
    overflow: auto;

    .each_list {
      border-bottom: 1px solid#F5F5F5;

      display: flex;
      // align-items: center;
      justify-content: space-between;
      padding: 16px 0 18px 0;
      .each_left {
        > span {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #333333;
          letter-spacing: 0;
          line-height: 14px;
          display: block;
        }
        p {
          margin-top: 4px;
          img {
            width: 12px;
            height: auto;
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
          }
          span {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #999999;
            letter-spacing: 0;
            line-height: 12px;
            vertical-align: middle;
          }
        }
      }
      .each_right {
        display: flex;
        align-items: center;
        cursor: pointer !important;

        p {
          font-family: PingFangSC-Medium;
          font-weight: 600;
          font-size: 14px;
          color: #4697ff;
          letter-spacing: 0;
          text-align: right;
          line-height: 14px;
        }
        i {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
