<!--
 * @Descripttion: 
 * @Author: qt
 * @Date: 2021-03-08 13:53:35
 * @LastEditors: qt
 * @LastEditTime: 2021-03-15 10:32:19
-->
<!--  -->
<template>
  <div class="chooseBox main">
    <div class="cb_header">
      <p>
        <img src="@/assets/images/icon_tab@2x.png" alt="" />
        <span>请从协作部门中选取6人</span>
      </p>
      <p>在互评阶段将从中随机选取人员参与您的价值观考评</p>
    </div>
    <div class="cb_content">
      <p>已选择 {{ selectArr.length }}/6</p>
      <div class="people_content">
        <div class="people_img" v-for="(item, index) in selectArr" :key="index">
          <p>
            <img
              @click="del(index)"
              class="err"
              src="../../assets/images/icon_s_off@3x.png"
              alt=""
            />
            <img
              :src="
                item.logo
                  ? item.logo
                  : require('../../assets/images/icon_sam_tx@3x.png')
              "
              class="logo"
              alt=""
            />
          </p>
          <span>{{ item.name }}</span>
        </div>
        <div v-if="selectArr.length < 6" class="people_img" @click="addPeople">
          <p>
            <img src="../../assets/images/icon_add@2x.png" alt="" />
          </p>
        </div>
      </div>
    </div>
    <Cdepartment
      :dVisible="dVisible"
      @selectArr="getSelectArr"
      @close="close"
      v-if="dVisible"
    />
    <div class="cb_bottom">
      <div class="but prev" @click="back">上一步</div>
      <div class="but subClass" @click="DepartmentSub">提交</div>
      <!-- <van-button plain type="info" class="prev">上一步</van-button>
      <van-button type="info" class="subClass">提交</van-button> -->
    </div>
  </div>
</template>

<script>
import { Button, Icon, Toast } from "vant";
import { completeEvaluation } from "@/api/api";
import Cdepartment from "@/components/Cdepartment";
export default {
  data() {
    return {
      peopleNumber: 0,
      dVisible: false,
      selectArr: [],
    };
  },
  components: {
    "van-button": Button,
    "van-icon": Icon,
    "van-toast": Toast,
    Cdepartment,
  },
  created() {
    if (localStorage.getItem("selectArr")) {
      this.selectArr = JSON.parse(localStorage.getItem("selectArr"));
    }
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
    DepartmentSub() {
      if (this.selectArr.length < 6) {
        Toast("人数不足，请继续选择");
      } else {
        var peerEmpModels = [];
        this.selectArr.forEach((item, index) => {
          peerEmpModels.push({
            empNo: item.empno,
            relation: item.relation,
          });
        });
        var params = {
          questionnaireId: this.$route.query.id,
          selfStatus: 1,
          peerEmpModels,
          evaluationId: this.$route.query.evaluationId,
        };
        completeEvaluation(params).then((res) => {
          localStorage.removeItem("selectArr");
          this.$router.push({
            name: "finishEvalution",
            query: {
              id: this.$route.query.id,
              evaluationId: this.$route.query.evaluationId,
            },
          });
        });
        // this.$router.push({
        //   name: "finishEvalution",
        //   query: {
        //     id: this.$route.query.id,
        //     evaluationId: this.$route.query.evaluationId,
        //   },
        // });
      }
    },
    back() {
      this.$router.go(-1);
      // this.$router.push({
      //   path: "evaluation",
      //   query: { id: this.$route.query.id, evaluationType: "self", evaluationId: this.$route.query.evaluationId },
      // });
    },
    del(index) {
      this.selectArr.splice(index, 1);
      localStorage.setItem("selectArr", JSON.stringify(this.selectArr));
    },
    getSelectArr(val) {
      this.selectArr = val;
    },
    addPeople() {
      var type = localStorage.getItem("systemtype");
      if (type && type == "pc") {
        this.dVisible = true;
      } else {
        this.$router.push({ name: "selectPeople", query: this.$route.query });
      }
    },
    close(val) {
      this.dVisible = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.chooseBox {
  padding: 15px;
  .cb_header {
    border-bottom: 1px solid #f5f5f5;
    p {
      margin-bottom: 12px;
      img {
        width: 15px;
        height: 12px;
        vertical-align: middle;
        margin-right: 4px;
      }
      span {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        line-height: 16px;
        font-weight: 550;
        vertical-align: middle;
      }
      &:last-child {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        letter-spacing: 0;
        line-height: 12px;
        margin-bottom: 16px;
      }
    }
  }
  .cb_content {
    margin-top: 16px;
    p {
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      line-height: 16px;
      font-weight: 550;
    }
    .people_content {
      margin-top: 24px;

      // display: flex;

      .people_img {
        width: 25%;
        text-align: center;
        display: inline-block;
        vertical-align: top;
        margin-bottom: 16px;
        p {
          // margin-top: 16px;
          width: 87%;
          text-align: center;
          flex-wrap: wrap;
          display: inline-block;
          vertical-align: top;
          position: relative;
          img {
            width: 100%;
            height: auto;
          }
          .err {
            width: 16px;
            height: 16px;
            position: absolute;
            right: 0;
            top: 0;
            cursor: pointer;
          }
        }
        span {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #333333;
          letter-spacing: 0;
          text-align: center;
          line-height: 12px;
          display: block !important;
        }
      }
      @media only screen and (min-width: 600px) {
        .people_img {
          width: 78px;
          text-align: center;
          display: inline-block;
          vertical-align: top;
          margin-bottom: 16px;
          p {
            // margin-top: 16px;
            width: 87%;
            text-align: center;
            flex-wrap: wrap;
            display: inline-block;
            vertical-align: top;
            position: relative;
            img {
              width: 100%;
              height: auto;
            }
            .err {
              width: 16px;
              height: 16px;
              position: absolute;
              right: 0;
              top: 0;
              cursor: pointer;
            }
          }
          span {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #333333;
            letter-spacing: 0;
            text-align: center;
            line-height: 12px;
            display: block !important;
          }
        }
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
