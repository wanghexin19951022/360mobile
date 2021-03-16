<template>
  <div class="valueStyle main background">
   
      <div v-if="!hasEvaluation">
        <div style="padding: 0px 18px 0px 16px;">
          <div class="valueStyle-current">
            <img src="@/assets/images/icon_tab@2x.png" class="img" alt="" />
            <span>当前考评</span>
          </div>
          <div
            class="valueStyle-list"
            v-for="(item, index) in currentList"
            :key="index"
          >
            <van-field
              v-model="item.questionnaireName"
              readonly
              @click="goToCurrentEvaluationPage(item)"
            />
            <img src="@/assets/images/icon_r@2x.png" class="img2" alt="" />
          </div>
        </div>
        <div class="valueStyle-split"></div>

        <div style="padding: 0px 18px 0px 16px;">
          <div class="valueStyle-last">
            <img src="@/assets/images/icon_tab@2x.png" class="img" alt="" />
            <span>历史考评</span>
          </div>
          <div
            class="valueStyle-list"
            v-for="(item, index) in historyList"
            :key="index"
          >
            <van-field
              v-model="item.questionnaireName"
              readonly
              @click="goToHistoryEvaluationPage(item)"
            />
            <img src="@/assets/images/icon_r@2x.png" class="img2" alt="" />
          </div>
        </div>
      </div>
      <div v-if="hasEvaluation" class="valueStyle-noEvaluation">
          
        <div>
          <img src="@/assets/images/bg_jzkp.png" alt="" class="" />
        </div>
        <div>
          <span>暂无考评</span>
        </div>
        <!-- <div>
            <van-loading v-if="loadingBoolean" color="#1989fa">加载中...</van-loading>
          </div> -->
      </div>

      <div v-if="isPc">
          <EvaluationResults :dVisible="isPc" :id="id" :summaryId="summaryId" @close="close"></EvaluationResults>
      </div>
      
    
  </div>
</template>
<script>
import { getEvaluationList } from "@/api/api";
import { Field } from "vant";
import EvaluationResults from '@/components/EvaluationResults'
export default {
  name: "Value",
  components: {
    "van-field": Field,
    // 'van-loading': Loading,
     EvaluationResults
  },
  data() {
    return {
      currentList: [], // 当前考评
      historyList: [], // 历史考评
      hasEvaluation: true,
      loadingBoolean: false,
      isPc: false, // pc端进入打开历史评价
      id: '', // pc端进入打开历史评价弹框传入id
      summaryId: ''
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      getEvaluationList({ }).then(res => {
          this.currentList = res.currentQuestionnaireList
          this.historyList = res.historyEvaluationSummaryList

          if (this.currentList.length === 0 && this.historyList.length === 0) {
              this.hasEvaluation = true
          } else {
              this.hasEvaluation = false
          }
      });
    },
    // 去当前考评（自评/互评）
    goToCurrentEvaluationPage(item) {
      // // todo 这边跳转到查看自评互评页面
    //   const currentTime = new Date().getTime()
    //   console.log(currentTime)
    //   const selfEvaluationDeadline = new Date(item.selfEvaluationDeadline).getTime()
    //   const peerEvaluationDeadline = new Date(item.peerEvaluationDeadline).getTime()
      if (item.evaluationDeadline === 'self') {
          // 跳到自评页面
            const type = localStorage.getItem('systemtype')
            if (type === 'pc') {
                if (item.selfStatus === 0) {
                    this.$router.push({ path: "/selfEvaluationPC", query: { id: item.questionnaireId, time: item.selfEvaluationDeadline, evaluationId: item.evaluationId }})
                } else {
                    this.$router.push({ path: "/finishEvalution", query: { id: item.questionnaireId, evaluationId: item.evaluationId }})
                }
            } else {
                if (item.selfStatus === 0) {
                    this.$router.push({ path: "/selfEvaluation", query: { id: item.questionnaireId, time: item.selfEvaluationDeadline, evaluationId: item.evaluationId }})
                } else {
                    this.$router.push({ path: "/finishEvalution", query: { id: item.questionnaireId, evaluationId: item.evaluationId }})
                }
            }
      } else {
          // 跳到互评页面
            this.$router.push({ path: "/eachEvalution", query: { id: item.questionnaireId, time: item.peerEvaluationDeadline }})
      }
    },
    goToHistoryEvaluationPage(item) {
      // todo 这边跳转到查看历史考评页面
      const type = localStorage.getItem('systemtype')
      if (type === '') {
          this.$router.push({ path: "/evaluationConsequence", query: { id: item.questionnaireId, summaryId: item.summaryId } })
      } else {
          this.isPc = true
          this.id = item.questionnaireId
          this.summaryId = item.summaryId
      }
    },
    close(e) {
        this.isPc = e
    }
  }
};
</script>
<style lang="scss" scoped>
.valueStyle {
    user-select: none;
    height: 100%;
/deep/ .van-field__control {
    white-space: nowrap;
    text-overflow: ellipsis !important;
    overflow: hidden;
}
  &-current {
    padding: 16px 0px 16px 0px;
    border-bottom: 1px solid #f5f5f5;
  }
  &-list {
    font-size: 14px;
    color: #333333;
    line-height: 12px;
    position: relative;
  }
  &-split {
    margin-top: 9px;
    height: 8px;
    background: #f9f9f9;
  }

  &-last {
    padding: 24px 0px 16px 0px;
    border-bottom: 1px solid #f5f5f5;
  }
  .img {
    width: 13px;
    height: 12px;
  }
  .img2 {
    width: 12px;
    height: 12px;
    position: absolute;
    right: 0px;
    top: 16px;
  }
  &-noEvaluation {
    text-align: center;
    color: #666666;
    padding: 102px 28px 0px 28px;

    img {
      width: 320px;
      height: 136px;
    }
    span {
      font-size: 14px;
      color: #666666
    }
  }
}
</style>
