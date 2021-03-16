<template>
  <div class="evaluation main background">
    <div class="evaluation-title">
      <div>{{ title }}</div>
      <div>
        您此次的评价对象为：<span
          class="person"
          >{{ person }}</span
        >
      </div>
    </div>
    <div class="evaluation-instruction">
      <div class="evaluation-instruction-content">
        <div >
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

      <div v-for="(i, index) in textData" :key="index" class="evaluation-cotent">
          <div class="evaluation-cotent-title">
              <span>{{ index + 1 }}、{{ i.title }}</span><span style="color: red">*</span>
          </div>
          <div class="evaluation-cotent-body">
              <div class="evaluation-cotent-body-content">
                  <div style="font-weight: bold;">衡量标准：</div>
                  <div v-for="(n, ind) in i.data" :key="ind" class="title">                
                    <div class="score">{{ ind + 1 }}分</div>
                    <div class="text">{{ n }}</div>   
                  </div>
              </div>
          </div>
          <!-- 员工自评内容（评下级的时候） -->
          <div v-if="i.isHasLower" class="evaluation-cotent-employee">
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
          <div class="evaluation-cotent-slider">
              <!-- <div v-if="index!==1" class="left" style="border: 2px solid #2d8ffd;background:#2d8ffd;"></div>
              <div v-else  class="left" style="border: 2px solid #2d8ffd;background:#2d8ffd;"></div>
              <div v-if="index!==1" class="right" style="border: 2px solid #ebedf0;background:#ebedf0;"></div>
              <div v-else  class="right" style="border: 2px solid #ebedf0;background:#ebedf0;"></div> -->
            <van-slider v-model="i.value" active-color="#2D8FFD" :min="0" :max="5" :step="0.5" bar-height="4px" @change="sliderChange(i.value, index)">
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
                        maxlength="1000"
                        placeholder="请注明是由或填写案例"
                        show-word-limit
                        @blur="changeContent(i, index)"
                    />
                </div>
            </div>

            <div v-if="i.isTip" class="tip">
                <span>请回答此项</span>
            </div>
          </div>
      </div>
      
      <!-- 下一步 -->
      <div class="evaluation-footer">
          <div class="nextStep but" @click="nextStep">
              <span v-if="isSelf">下一步</span>
              <span v-else>提交</span>
          </div>
      </div>
      
      <!-- 提交的提示框 -->
      

    <van-popup  
        v-model="showPopup"
        :close-on-click-overlay="false"
        :style="{ width:'80%', 'border-radius': '4px','text-align':' center' }"
        class="popupPc"
        >
        <div style="padding:30px;">
            提交后不能再次修改，是否确认提交?
        </div>
        <div class="popupBtn" >
            <div class="cancel but" @click="cancel">
                <span>取消</span>
            </div>
            <div class="confirm but" @click="confirm">
                <span>确定</span>
            </div>
            <!-- <van-button type="default" @click="cancel" :style="{'margin-right': '24px'}">取消</van-button>
            <van-button type="info" @click="confirm">确定</van-button> -->
        </div>
    </van-popup>

  </div>
</template>
<script>

import {
  Field,
  Button,
  Toast,
  Slider,
  Col, 
  Row,
  Popup
} from "vant";
import textData from './data.js'
import { completeEvaluation, selfDetail, peerDetail, savePeer } from "@/api/api"
export default {
    name: 'Evaluation',
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
            textData: [],
            isSelf: true, // 默认是自评（判断是自评还是互评进来的）
            id: '', // 考评id
            evaluationId: '', // 自评id
            evaluatedEmpNo: '',//被评人工号
            buttonDom: []
        }
    },
    created() {
        this.initData()
    },
    mounted() {
        this.buttonDom = document.getElementsByClassName('custom-button')
        this.buttonDom.forEach(element => {
            element.style.color = '#fff'
        });
    },
    methods: {
        initData() {
            this.textData = JSON.parse(JSON.stringify(textData))
            let num = 0
            for(let i = 0; i < 10; i++) {
                this.scale.push(num)
                num += 0.5
            }
            // 判断进来的是自评还是互评
            if (this.$route.query.evaluationType) {
                const type = this.$route.query.evaluationType
                if (type === 'self') {
                    this.isSelf = true
                    if (JSON.parse(localStorage.getItem('selectArr'))) {
                        localStorage.removeItem('selectArr')
                    }
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
                if (this.$route.query.evaluatedEmpNo) {
                    this.evaluatedEmpNo = this.$route.query.evaluatedEmpNo
                }
                this.viewPeerDetail()
            }

        },
        nextStep() {
            let isOk = true
            this.textData.forEach((element, index) => {
                // 初始为0的时候
                if (element.value === 0 && element.isShowContent===false) {
                    isOk = false
                    this.$set(this.textData[index], 'isTip', true )
                }
                
              if (element.isShowContent===true && element.content === '') {
                  isOk = false
                  this.$set(this.textData[index], 'isTip', true )
              }
              if (element.isShowContent===false && element.content !== '') {
                  this.$set(this.textData[index], 'content', '' )
              }  
            })

            if (isOk) {
                if (this.isSelf) {
                    // 自评下一步，在这缓存提交的需要的数据
                    const params = {
                        evaluationId: this.evaluationId,
                        questionnaireId: this.id,
                        selfStatus: '0',
                        peerEmpModels: [],
                        valueScoreRequests: []
                    }
                    const obj = {
                        valueId: '',
                        score: '',
                        comment: ''
                    }
                    this.textData.forEach(element => {
                        obj.valueId = element.valueId
                        obj.score = element.value
                        obj.comment = element.content
                        params.valueScoreRequests.push(JSON.parse(JSON.stringify(obj)))
                    })
                    completeEvaluation(params).then(res => {
                        // 跳转到选择部门协作人的页面
                        this.$router.push({ path: "/ChooseDepartment", query: { evaluationId: this.evaluationId, id: this.id } });
                    })
                } else {
                    // 互评弹框
                    this.showPopup = true
                }
            } else {
                Toast('请填写必填项')
                // 跳转到未填的第一个
                let array = []
                const arr = document.getElementsByClassName('evaluation-cotent')
                arr.forEach(element => { 
                   array.push(element.offsetTop)
                });
                let num = 0
                this.textData.forEach((element, index) => {
                    if (element.isTip === true && num===0) {
                        num += 1
                        document.body.scrollTop = array[index]
                        document.documentElement.scrollTop = array[index] 
                    }
                });
            }
            
        },
        cancel() {
            this.showPopup = false
        },
        confirm() {
            // 互评提交
            const local = JSON.parse(localStorage.getItem('userInfo'))
            const body = {
                questionnaireId: this.id, // 考评id
                empNo: local.ehrCode, // 考评人工号
                evaluatedEmpNo: this.evaluatedEmpNo, // 被评人工号
                evaluationDetails: []
            }
            const obj = {
                detailId: '',
                valueId: '',
                score: '',
                comment: ''
            }
            this.textData.forEach(element => {
                obj.valueId = element.valueId
                obj.score = element.value
                obj.comment = element.content
                obj.detailId = element.detailId
                body.evaluationDetails.push(JSON.parse(JSON.stringify(obj)))
            });
            savePeer(body).then(res => {
                Toast('提交成功')
                setTimeout(() => {
                    this.$router.go(-1)
                }, 2000)     
            })
            this.showPopup = false
            
        },
        // 滑块小于1大于等于3的时候必填评价
        sliderChange(item, index) {
            this.buttonDom[index].style.color = '#1989fa'
           if (item < 1 || item >= 3) {
               this.$set(this.textData[index],'isShowContent', true)
           } else {
               this.$set(this.textData[index],'isShowContent', false)
               this.$set(this.textData[index], 'isTip', false) 
           }
        },
        changeContent(item, index) {
            if (item.content === '' && item.isShowContent ===true) {
                this.$set(this.textData[index], 'isTip', true)
            } else {
                this.$set(this.textData[index], 'isTip', false) 
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
                                    this.buttonDom[index].style.color = '#1989fa'
                                }
                                if (item.comment !==null && item.comment!=='') {
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
                                if (item.comment!==null && item.comment!== '') {
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
                                if (item.detailId !==null && item.detailId !== '') {
                                    this.textData[index].detailId = item.detailId
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
}
/deep/ .van-slider__button-wrapper, .van-slider__button-wrapper-right {
  top: 51%;
}

.evaluation {
    user-select: none;

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
      .tip {
          background: #FF7F7F;
          text-align: center;
          padding: 12px 0px;
          margin-top: 16px;
          color: #fff;
          font-size: 12px;
          border-radius: 16px 16px 0 0;
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
        text-align: center;
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
  user-select: none;
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
