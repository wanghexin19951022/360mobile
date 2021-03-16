<template>
  <div class="evaluationDetail main background">
    <div class="evaluationDetail-title">
      <div>{{ title }}</div>
      <div>
        您此次的评价对象为：<span
          class="person"
          >{{ person }}</span
        >
      </div>
    </div>
    <div class="evaluationDetail-instruction">
      <div class="evaluationDetail-instruction-content">
        <div>
            <div class="title">
                <img
                    src="@/assets/images/icon_ts@2x.png"
                    alt=""
                    class="imgInstruction"
                />
                <span style="position:absolute">说明：</span>
            </div>
          <div>1、进阶通关制：只有达到前一档分数标准之后，才能进行下一档分数的评价，必须对价值观表现从低到高逐项判断；<br/>
              2、评分时，如达到前一档分数标准，部分达到后一档分数标准时，分数可取中间值，如2.5分、3.5分等；<br/>
              3、某项价值观分数小于1分或者达到3分（含）以上，须在"评语"处注明原因或填写案例。因评分属于进阶通关制，评语内容需要涵盖所有已达到的评价标准。例如，某项价值观评分为4分，注明的原因或案例需涵盖1到4分所涉及的全部评价标准；<br/>
              4、优秀区间内不能有任一单项低于2分；<br/>
              5、五项价值观评分中任一价值观考核评分小于1分，整体则视为不合格；<br/>
              6、若出现违纪违法行为将按相应程序进行，价值观考评结果直接视为不合格；
          </div>
        </div>
        <div style="margin-top: 8px;">
          <van-row>
            <van-col span="24"></van-col>
          </van-row>
        </div>
      </div>
    </div>

      <div v-for="(i, index) in textData" :key="index" class="evaluationDetail-cotent">
          <div class="evaluationDetail-cotent-title">
              <span>{{ index + 1 }}、{{ i.title }}</span><span style="color: red">*</span>
          </div>
          <div class="evaluationDetail-cotent-body">
              <div class="evaluationDetail-cotent-body-content">
                  <div style="font-weight: bold;">衡量标准：</div>
                  <div v-for="(n, ind) in i.data" :key="ind" class="title">                
                    <div class="score">{{ ind + 1 }}分</div>
                    <div class="text">{{ n }}</div>   
                  </div>
              </div>
          </div>
          <!-- 员工自评内容（评下级的时候） -->
          <div v-if="i.isHasLower" class="evaluationDetail-cotent-employee">
              <div class="divStyle">
                <div style="font-weight: bold;">
                    <img
                        src="@/assets/images/icon_ygzp@2x.png"
                        alt=""
                        class="imgEmployee"
                    />
                    <span>员工自评：<span style="color:#ff8c2e;">{{ i.selfScore }}分</span></span>
                </div>
                <div style="margin-top: 8px;color:#666666;">
                    <van-row>
                        <van-col span="24">{{ i.seflContent }}</van-col>
                    </van-row>
                </div>
              </div>
          </div>

          <!-- slider滑动条 -->
          <div class="evaluationDetail-cotent-slider">
              <!-- <div v-if="index!==1" class="left" style="border: 2px solid #2d8ffd;background:#2d8ffd;"></div>
              <div v-else  class="left" style="border: 2px solid #2d8ffd;background:#2d8ffd;"></div>
              <div v-if="index!==1" class="right" style="border: 2px solid #ebedf0;background:#ebedf0;"></div>
              <div v-else  class="right" style="border: 2px solid #ebedf0;background:#ebedf0;"></div> -->
              
              
              
            <van-slider v-model="i.value" active-color="#999999;" :min="0" :max="5" :step="0.5" bar-height="4px" @change="sliderChange(i.value, index)" disabled>
                <template #button>
                    <div class="custom-button">{{ i.value }}</div>
                </template>
            </van-slider>
            <!-- 刻度 -->
            <div style="display: flex">
                <span v-for="(item, ind) in scale" :key="ind" style="flex: auto;">
                    <span class="scaleOne">
                        <div  v-if="ind%2!==0" style="height:12px;border:1px solid #ccc;background: #ccc;border-radius: 50%;"></div>
                        <div v-else style="height:15px;border:1px solid #ccc;background: #ccc;border-radius: 50%;"></div>
                        <span v-if="ind%2!==0" class="scaleTwo">{{ item }}</span>
                        <span v-else class="scaleThree">{{ item }}</span>
                    </span>
                </span>
                <span class="scaleOne">
                    <div style="height:15px;border:1px solid #ccc;background: #ccc;border-radius: 50%;"></div>
                    <span class="scaleThree">5</span>
                </span>
            </div>
            <!-- 评语 -->
            <div v-if="i.isShowContent">
                <div class="comment-title">评语</div>
                <div class="comment-content">
                    <van-field
                        v-model="i.content"
                        autosize
                        type="textarea"
                        placeholder="请注明是由或填写案例"
                        show-word-limit
                        disabled
                    />
                </div>
            </div>
             
              
          </div>
      </div>
      
      <!-- 下一步 -->
      <!-- <div class="evaluationDetail-footer">
          <div class="nextStep" @click="nextStep">
              <span>下一步</span>
          </div>
      </div> -->
      
      <!-- 提交的提示框 -->
      <van-popup  
        v-model="showPopup"
        :close-on-click-overlay="false"
        :style="{ width:'80%', 'border-radius': '4px','text-align':' center' }"
        >
          <div style="padding:30px;">
              提交后不能再次修改，是否确认提交?
          </div>
          <div class="popupBtn" >
              <div class="cancel" @click="cancel">
                <span>取消</span>
              </div>
              <div class="confirm" @click="confirm">
                <span>确定</span>
              </div>
          </div>
      </van-popup>
  </div>
</template>
<script>

import {
  Field,
  Button,
  Cell,
  Toast,
  Slider,
  Col, 
  Row,
  Popup
} from "vant";
import textData from './data.js';
import { selfDetail, peerDetail } from '@/api/api';
export default {
    name: 'evaluationDetail',
    components: {
        'van-slider': Slider,
        'van-button': Button,
        'van-field': Field,
        'van-popup': Popup,
        'van-row': Row,
        'van-col': Col
    },

    data() {
        return {
            person: '', // 评价对象
            title: '',// 标题
            scale: [], // 刻度
            showPopup: false,
            textData: textData,
            isSelf: true,
            id: '',
            evaluationId: ''

        }
    },
    created() {
        this.initData()
    },
    mounted() {
        
    },
    methods: {
        initData() {
            this.textData = JSON.parse(JSON.stringify(textData))
            let num = 0
            for(let i = 0; i < 10; i++) {
                this.scale.push(num)
                num += 0.5
            }
            // 查看评价详情
            // 判断进来的是自评还是互评
            if (this.$route.query.evaluationType) {
                const type = this.$route.query.evaluationType
                if (type === 'self') {
                    this.isSelf = true
                } else {
                    this.isSelf = false
                } 
            }

            if (this.$route.query.id) {
                this.id = this.$route.query.id
            }
            if (this.$route.query.evaluationId) {
                this.evaluationId = this.$route.query.evaluationId
            }
            
            if (this.$route.query.evaluationType === 'self') {
                this.viewSelfDetail()
            }

            if (this.$route.query.evaluationType === 'peer') {
                if (this.$route.query.name) {
                    this.person = this.$route.query.name   
                }
                this.viewPeerDetail()
            }  
        },
        nextStep() {
            // this.showPopup = true
            // 跳转到选择部门协作人的页面
            this.$router.push({ path: "/ChooseDepartment", query: {} })
        },
        cancel() {
            this.showPopup = false
        },
        confirm() {
            this.showPopup = false
        },
        sliderChange(item, index) {
           if (item < 1 || item >= 3) {
               this.$set(this.textData[index],'isShowContent', true)
           } else {
               this.$set(this.textData[index],'isShowContent', false)
           }
        },
        viewSelfDetail() {
            const local = JSON.parse(localStorage.getItem('userInfo'))
            this.person = local.name
            if (this.evaluationId !== '') {
                selfDetail({ evaluationId: this.evaluationId }).then(res => {
                    const data = res
                    this.person = data.evaluatedEmpName
                    this.title = data.questionnaireName
                    const valueScoreResponses = data.valueScoreResponses
                    this.textData.forEach((element, index) => {
                        valueScoreResponses.forEach(item => {
                            if (element.valueId === item.valueId) {
                                if (item.score !==null) {
                                    this.textData[index].value = item.score
                                }
                                if (item.comment !==null && item.comment !=='') {
                                    this.textData[index].isShowContent = true
                                    this.textData[index].content = item.comment                                  
                                } else {
                                    this.textData[index].isShowContent = false
                                }
                            }
                        })
                    })
                })
            }
        },
        viewPeerDetail() {
            if(this.id !== '') {
                const local = JSON.parse(localStorage.getItem('userInfo'))
                const body = {
                    questionnaireId: this.id,
                    empNo: local.ehrCode,
                    evaluationId: this.evaluationId
                }
                peerDetail(body).then(res => {
                    const data = res
                    this.title = data.questionnaire.questionnaireName
                    const evaluationValueDetails = data.evaluationValueDetails
                    this.textData.forEach((element, index) => {
                        evaluationValueDetails.forEach(item => {
                            if (element.valueId === item.valueId) {
                                if (item.score !==null) {
                                    this.textData[index].value = item.score
                                }
                                if (item.comment !==null && item.comment !== '') {
                                    this.textData[index].isShowContent = true
                                    this.textData[index].content = item.comment
                                } else {
                                    this.textData[index].isShowContent = false
                                }
                                if (item.selfEvaluationDetail !== null) {
                                    this.textData[index].isHasLower = true
                                    this.textData[index].selfScore = item.selfEvaluationDetail.score
                                    this.textData[index].seflContent = item.selfEvaluationDetail.comment
                                }
                            }
                        }) 
                    }) 
                })
            }
            
        }
    }    
    
}
</script>
<style lang="scss" scoped>
/deep/ .van-slider__bar {
  z-index: 1;
  background-color: rgb(153, 153, 153);
}
/deep/ .van-slider--disabled {
    opacity: 1;
}

.evaluationDetail {
  // max-width: 1200px;
  // min-width: 960px;
  // user-select: none;
  padding-bottom: 100px;

  &-title {
    text-align: left;
    :nth-child(1) {
      font-weight: bold;
      padding: 16px 16px 10px 16px;
    }
    :nth-child(2) {
      padding: 0px 0px 0px 16px;
    }
    .person {
        color:#4697ff;
        font-size: 14px;
        padding:0px
    }
  }
  &-instruction {
    padding: 16px 16px 0px 16px;
    &-content {
    //   height: 218px;
    //   width: 343px;
      background: #f9f9f9;
      border-radius: 3px;
      padding: 16px;
      font-size: 12px;
      color: #666666;
      .imgInstruction {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
      .title {
          padding-bottom: 10px;
      }
    }
  }
  &-cotent {
    &-title {
      font-size: 16px;
      color: #333333;
      padding: 36px 16px 16px 16px;
    }
    &-employee {
        padding: 8px 16px 0px 16px;
        font-size: 12px;
        
        .divStyle {
            // display: flex;
            background: #F9F9F9;
            padding: 16px;
            
        }
        .imgEmployee {
            width: 16px;
            height: 16px;
            margin-right: 4px;
            
            color: #333333;
      }
    }
    
    
    &-slider {
      position: relative;
      padding: 24px 16px 0px 16px;
      .left {
        position: absolute;
        width: 8px;
        border-radius: 2px 0px 0px 2px;
        z-index: 1;
        top: 0px;
        left: 13px;
      }
      .right {
        position: absolute;
        width: 8px;
        border-radius: 0px 2px 2px 0px;
        z-index: 1;
        top: 0px;
        right: 13px;
      }
      &-scale {
        // padding: 0px 8px;
        margin-left: 8px;
        margin-right: 8px;
        display: inline-block;
        text-align: center;
        width: 18.5px;
        font-size: 12px;
      }
      .scaleOne {
          top:0px;
          position: relative;
          width: 1px;
          display: inline-block;
          margin-left: -1px;
      }
      .scaleTwo {
          margin-left: -8px;
        //   margin-right:30.5px;
          color: #CCCCCC;
          position: relative;
          top: 3px;
          
      }
      .scaleThree {
        //   margin-right:30.5px;
          position: relative;
          margin-left: -3px;  
      }
      .comment-title {
          padding: 16px 0px 12px 0px;
      }
      .comment-content {
          background: #F9F9F9;
          border: 1px solid #4697FF;
          border-radius: 4px;
      }
    }
    &-body {
      padding: 0px 16px;
      &-content {
        // width: 343px;
        // height: 388px;
        background: #f9f9f9;
        padding: 16px;
        color: #333333;
        font-size: 12px;
        .title {
            display: flex;
            padding-top: 8px;
        }
        .score {
            width: 32px;
            height: 32px;
            background: #4697FF;
            color: #ffffff;
            text-align: center;
            line-height: 32px;
            border-radius: 2px;
            margin-right: 8px;
        }
        .text {
            flex: 1;
        }
      }
    }
  }
  &-footer {
        /deep/ .van-button--normal {
            width: 100%;  
        }
        padding: 36px 16px 24px 16px;
        .nextStep {
            background: #4697FF;
            text-align: center;
            padding: 13px 0px;
            border-radius: 4px;
            color: #fff;
        }
    }
    .popupBtn {
        padding:0px 50px 30px 50px;
        // display: flex;
        text-align: center;
        // /deep/ .van-button--normal {
        //     width: 88px;  
        //     height: 34px;
        //     border-radius: 4px;   
        // }
        .cancel {
            width: 88px;  
            height: 34px;
            border-radius: 4px;    
            background:#fff;
            color:#666666;
            border: 1px solid #DCDFE6;
            padding: 8px 0px;
            display: inline-block;
        }
        .confirm {
            margin-left: 24px;
            width: 88px;  
            height: 34px;
            border-radius: 4px;
            background:#299FFC;
            color:#fff;
            padding: 8px 0px;
            display: inline-block;
        }
    }
}
.custom-button {
  width: 30px;
  color: #1989fa;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  background-color: #fff;
  border-radius: 1px;
  border: 1px solid #1989fa;
  z-index: 1;
  border-radius: 4px;
}
</style>
