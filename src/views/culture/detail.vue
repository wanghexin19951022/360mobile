<!--
 * @Descripttion: 
 * @Author: sjq
 * @Date: 2020-12-23 09:59:52
 * @LastEditors: sjq
 * @LastEditTime: 2021-02-19 09:16:41
-->
<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <div class="detail">
      <div class="main" @click="inputBlur">
        <div class="title">
          {{ detail.articleTitle }}
        </div>
        <div class="title-bottom">
          <div class="author">
            {{ detail.articleAuthor }}
          </div>
          <div class="time">
            {{ detail.createTime }}
          </div>
          <div class="browse">
            <van-icon class="icon" name="eye-o" />{{ detail.browseCount }}
          </div>
          <div class="like">
            <van-icon class="icon" name="good-job-o" />{{ detail.likeCount }}
          </div>
          <div
            class="set"
            @click="setArticle"
            v-if="adminType === 1 || detail.createBy === loginName"
          >
            <img src="@/assets/set.png" class="img" alt="" />
          </div>
        </div>
        <div class="content" v-html="detail.articleContent"></div>
        <div class="like-box">
          <van-icon
            @click="clickLike"
            class="like-icon"
            :class="{ active: !!detail.articleLikesResponse }"
            name="good-job-o"
          />
          <div class="like-num">赞({{ detail.likeCount }})</div>
        </div>
      </div>
      <!-- 评论 -->
      <div
        class="comment"
        @click="inputBlur"
        v-if="detail.articleCommentResponses"
      >
        <div class="comment-title">
          <span class="icon"></span>
          评论（{{ detail.articleCommentResponses.length }}）
        </div>
        <div
          class="comment-kong"
          v-if="detail.articleCommentResponses.length == 0"
        >
          <img src="@/assets/wupinglun.png" class="img" alt="" />
          <span class="a">还没有人评论哦~</span>
          <van-button
            plain
            round
            hairline
            size="small"
            class="btn"
            type="info"
            @click="replyComment"
            >快来抢沙发</van-button
          >
        </div>
        <div
          v-else
          class="comment-content"
          v-for="item in detail.articleCommentResponses"
          :key="item.id"
        >
          <div class="head">
            <img :src="item.logo" class="img" v-if="item.logo" alt="" />
          </div>
          <div class="comment-detail">
            <div class="name">
              {{ item.createByName || "匿名" }}
              <span class="stick" v-if="item.commentTop">置顶</span>
            </div>
            <div class="content">
              {{ item.commentContent }}
            </div>
            <div class="fn">
              <div class="like" @click="clickLike(item)">
                <van-icon
                  class="icon"
                  :class="{
                    active: !!item.articleLikesResponse,
                  }"
                  name="good-job-o"
                />
                {{
                  item.commentLikes.length > 0 ? item.commentLikes.length : ""
                }}
              </div>
              <div
                class="reply"
                @click.prevent.stop="replyComment(item, $event)"
              >
                <img class="img" src="@/assets/huifu.png" alt="" /> 回复
              </div>
              <div
                class="ellipsis"
                v-if="adminType === 1 || item.createBy === loginName"
                @click="setArticle(item)"
              >
                <van-icon name="ellipsis" />
              </div>
              <div class="time">
                {{ item.createTime }}
              </div>
            </div>
            <div
              class="reply-content"
              v-for="child in item.childArticleComments"
              :key="child.id"
            >
              <div class="Ititle">
                <span class="Iname">{{ child.createByName || "匿名" }}</span>
                <span>回复</span>
                <span class="Iname">{{ child.commentTarget.createName }}:</span>
                <div class="time">
                  {{ child.createTime }}
                </div>
              </div>
              <div class="Icontent">
                {{ child.commentContent }}
              </div>
              <div class="fn">
                <span
                  class="reply"
                  @click.prevent.stop="replyComment(child, $event)"
                  >回复</span
                >
                <span
                  class="delete"
                  v-if="adminType === 1 || child.createBy === loginName"
                  @click="deteleComment(child)"
                  >删除</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="comment-bottom">
          —— 已显示所有评论 ——
        </div>
      </div>
      <div class="comment-input">
        <van-field
          class="input"
          :class="{ anonymousFlag: anonymousFlag }"
          v-model="commentValue"
          label=""
          ref="input"
          maxlength="1000"
          clearable
          left-icon=""
          @click-left-icon="setAnonymity"
          :placeholder="commentPlaceholder"
        >
          <!-- @blur="inputBlur" -->
          <template #button>
            <!-- @mousedow="preventBlur($event)" -->
            <van-button
              @click.prevent="sendComment"
              plain
              class="sendbtn"
              type="info"
            >
              发送
            </van-button>
          </template></van-field
        >
      </div>
      <van-action-sheet
        v-model="show"
        :actions="actions"
        cancel-text="取消"
        close-on-click-action
        @select="onSelect"
      ></van-action-sheet>
      <van-dialog
        v-model="dialogShow"
        @confirm="confirmSubmit"
        title=""
        show-cancel-button
      >
        <div class="dialogContent">
          确定要删除此{{
            dialogType === "deleteArticle"
              ? "文章"
              : dialogType === "deleteComment"
              ? "评论"
              : ""
          }}吗？
        </div>
        <div class="btns"></div>
      </van-dialog>
    </div>
  </van-pull-refresh>
</template>

<script>
import { Icon, Field, ActionSheet, Dialog, Button, PullRefresh } from "vant";
import {
  getArticleDetail,
  setStickArticle,
  deleteArticle,
  likeArticle,
  getArticleComment,
  setStickComment,
  deleteComment,
  replyArticleComment,
  browseArticle,
  getAdminInfo,
} from "@/api/api";
import { fileType } from "@/utils/api";

export default {
  components: {
    "van-icon": Icon,
    "van-field": Field,
    "van-action-sheet": ActionSheet,
    "van-dialog": Dialog.Component,
    "van-button": Button,
    "van-pull-refresh": PullRefresh,
  },
  data() {
    return {
      id: "",
      detail: {
        // createTime: "2020-12-28 09:28:55",
        // createBy: "lee",
        // lastModifiedTime: "2020-12-28 09:29:10",
        // lastModifiedBy: "lee",
        // id: 1,
        // articleTitle: "文章标题",
        // articleContent:
        //   '<p>sdfsadfsdaf&nbsp;</p ><figure class="media"><oembed url="https://ksv-video-publish.cdn.bcebos.com/3615ea3afdffc2c2c9d731c36a5b7e8b1ea2885e.mp4?auth_key=1656452033-0-0-a24a76aa93d078d23e5836d8dabd7dfb"></oembed></figure>',
        // articleCover: null,
        // articleAuthor: "lee",
        // address: null,
        // releaseStatus: 1,
        // opened: 1,
        // validTime: null,
        // schoolCode: null,
        // isDelete: 0,
        // cultureArticleLabel: null,
        // articleCommentResponses: [{ commentLikes: [] }],
        // articleLikesResponses: [
        //   {
        //     createTime: null,
        //     createBy: null,
        //     lastModifiedTime: null,
        //     lastModifiedBy: null,
        //     id: 1,
        //     articleId: 1,
        //     bussId: 1,
        //     bussType: 0,
        //     likes: 0,
        //     createByName: null,
        //   },
        // ],
        // releaseStatusText: null,
        // openedText: null,
        // likeCount: null,
        // browseCount: null,
        // topFlag: null,
      },
      commentValue: "",
      commentPlaceholder: "我要发表评论",
      show: false,
      actions: [
        { name: "取消置顶", type: "stickArticle" },
        { name: "删除", type: "deleteArticle" },
      ],
      dialogShow: false,
      dialogType: "",
      loginName: JSON.parse(localStorage.getItem("userInfo")).loginName || "",
      userLogo: JSON.parse(localStorage.getItem("userInfo")).logo || "",
      adminType: "",
      replyData: {},
      commentId: "",
      commentData: {},
      anonymousFlag: false,
      refreshing: false,
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getDetail();
    this.browseArticle();
    this.getAdminInfo();
  },
  mounted() {},
  methods: {
    // 下拉刷新
    onRefresh() {
      this.refreshing = true;
      this.getDetail();
    },
    // 管理员信息 0-非 1= 是
    getAdminInfo() {
      getAdminInfo({ loginName: this.loginName }).then((res) => {
        this.adminType = res.adminType;
      });
    },
    // 点赞文章
    clickLike(data) {
      console.log(data.id);
      let params = {
        articleId: this.id,
        bussId: this.id,
        bussType: 0,
      };
      let type = "add";
      if (this.detail.like && !data.id) {
        type = "cancel";
        let likesId = this.detail.articleLikesResponse.id;
        params = {
          likesId,
        };
      }
      if (data.id) {
        let list = data.articleLikesResponse;
        if (!!list) {
          type = "cancel";
          params = {
            likesId: list.id,
          };
        } else {
          type = "add";
          params = {
            articleId: this.id,
            bussId: data.id,
            bussType: 1,
          };
        }
      }
      likeArticle(params).then((res) => {
        this.getDetail();
      });
    },
    // 设置文章 弹起遮罩
    setArticle(data) {
      if (data.id) {
        this.commentId = data.id;
        this.commentData = data;
        this.actions = [];
        if (this.adminType === 1) {
          this.actions.push({
            name: data.commentTop === 1 ? "取消置顶" : "置顶",
            type: "stickComment",
          });
        }
        if (data.createBy === this.loginName || this.adminType === 1) {
          this.actions.push({ name: "删除", type: "deleteComment" });
        }
      } else {
        this.actions = [];
        if (this.adminType === 1) {
          this.actions.push({
            name: this.detail.topFlag === 1 ? "取消置顶" : "置顶",
            type: "stickArticle",
          });
        }
        if (this.detail.createBy === this.loginName || this.adminType === 1) {
          this.actions.push({ name: "删除", type: "deleteArticle" });
        }
      }
      this.show = true;
    },
    // 设置文章 删除/置顶
    onSelect(action, index) {
      console.log(action, index);
      if (action.type === "deleteArticle" || action.type === "deleteComment") {
        this.show = false;
        this.dialogType = action.type;
        this.dialogShow = true;
      } else if (action.type === "stickArticle") {
        setStickArticle({
          articleId: this.id,
          bussType: this.detail.topFlag === 1 ? 0 : 1,
        }).then((res) => {
          console.log(res, "置顶");
          this.$notify({
            type: "success",
            message:
              this.detail.topFlag === 1 ? "取消置顶文章成功" : "置顶文章成功",
          });
          this.getDetail();
        });
      } else if (action.type === "stickComment") {
        setStickComment({
          commentId: this.commentId,
          bussType: this.commentData.commentTop === 1 ? 0 : 1,
        }).then((res) => {
          console.log(res, "置顶");
          this.$notify({
            type: "success",
            message:
              this.commentData.commentTop === 1
                ? "取消置顶评论成功"
                : "置顶评论成功",
          });
          this.getDetail();
        });
      }
    },
    // 删除评论
    deteleComment(data) {
      console.log("eee");
      this.commentId = data.id;
      this.dialogType = "deleteComment";
      this.dialogShow = true;
    },
    // 确认提交
    confirmSubmit() {
      if (this.dialogType === "deleteArticle") {
        deleteArticle({ articleId: this.id })
          .then((res) => {
            console.log(res, "shanchu");
            this.$router.push({ name: "culture" });
          })
          .catch(() => {
            this.dialogShow = true;
          });
      } else if (this.dialogType === "deleteComment") {
        deleteComment({ commentId: this.commentId })
          .then((res) => {
            console.log(res, "删除");
            this.$notify({
              type: "success",
              message: "删除评论成功",
            });
            this.dialogVisible = false;
            this.getDetail();
          })
          .catch(() => {
            this.dialogVisible = true;
          });
      }
    },
    getDetail() {
      getArticleDetail({ articleId: this.id }).then((res) => {
        this.detail = res;
        this.detail.like =
          res.articleLikesResponses.findIndex(
            (item) => item.createBy === this.loginName
          ) !== -1;
        this.$nextTick(() => {
          document.querySelectorAll("oembed[url]").forEach((element) => {
            let url = element.getAttribute("url");
            let html = "";
            if (fileType(url) === "video") {
              html = `<video controls src="${url}" ></video>`;
            } else if (fileType(url) === "audio") {
              html = `<audio controls controlsList="nodownload"  src="${url}" ></audio>`;
            }
            element.innerHTML = html;
          });
        });
        this.refreshing = false;
        console.log(res, "res");
      });
    },
    // 浏览
    browseArticle() {
      browseArticle({ articleId: this.id }).then((res) => {});
    },
    // 回复
    replyComment(data, event) {
      console.log(data, "回复");
      if (data) {
        this.replyData.commentParentId = data.commentParentId
          ? data.commentParentId
          : data.id;
        this.replyData.commentTargetId = data.id;
        this.commentPlaceholder = `回复 ${data.createByName || "匿名"}:`;
      }
      console.log(this.commentPlaceholder, "///////");
      this.$refs.input.focus();
      event.preventDefault();
    },
    // 发送评论
    sendComment(event) {
      event.preventDefault();
      console.log(this.commentValue, ";;;;;");
      if (this.replyData.commentParentId) {
        replyArticleComment({
          ...this.replyData,
          articleId: this.id * 1,
          commentContent: this.commentValue,
          anonymousFlag: this.anonymousFlag * 1,
        }).then((res) => {
          console.log(res, "评论");
          this.getDetail();
          this.replyData.commentParentId = "";
          this.commentValue = "";
          this.inputBlur();
        });
      } else {
        getArticleComment({
          articleId: this.id,
          commentContent: this.commentValue,
          anonymousFlag: this.anonymousFlag * 1,
        }).then((res) => {
          console.log(res, "评论");
          this.getDetail();
          this.commentValue = "";
        });
      }
    },
    // 失去焦点
    inputBlur() {
      console.log("失去焦点");
      this.replyData.commentParentId = "";
      this.commentValue = "";
      this.commentPlaceholder = "我要发表评论";
    },
    // 设置匿名
    setAnonymity() {
      console.log(111111);
      this.anonymousFlag = !this.anonymousFlag;
    },
  },
};
</script>

<style lang="scss" scoped>
.detail {
  margin: 10px;
}
.main {
  background: #ffffff;
  box-shadow: 0 2px 10px 0 rgba(41, 159, 252, 0.15);
  border-radius: 17px;
  padding: 20px 16px;
  margin-bottom: 10px;
  .title {
    font-size: 18px;
    color: #333333;
    margin-bottom: 11px;
    font-weight: bold;
  }

  .title-bottom {
    display: flex;
    font-size: 12px;
    color: #999999;
    line-height: 12px;
    margin-bottom: 16px;
    .author {
      margin-right: 5px;
    }
    .time {
      margin-right: 15px;
    }
    .browse {
      margin-right: 10px;
    }
    .icon {
      margin-right: 4px;
      font-size: 14px;
    }
    .set {
      flex: 1;
      text-align: right;
      .img {
        width: 17px;
        height: 16px;
      }
    }
  }
  .content {
    font-size: 14px;
    color: #666666;
    line-height: 22px;
    margin-bottom: 26px;
  }
  .like-box {
    margin-bottom: 4px;
    text-align: center;
    .like-icon {
      background: #e5e5e5;
      margin-bottom: 8px;
      padding: 6px;
      font-size: 37px;
      border-radius: 50%;
      color: #fff;
    }
    .active {
      background: #299ffc;
    }
    .like-num {
      color: #999999;
    }
  }
}
.comment {
  background: #ffffff;
  box-shadow: 0 2px 10px 0 rgba(41, 159, 252, 0.15);
  border-radius: 17px;
  padding: 20px 16px;
  .comment-title {
    font-size: 16px;
    color: #333333;
    margin-bottom: 16px;
    font-weight: bold;
    .icon {
      border: 2px solid #299ffc;
      border-radius: 2px;
      display: inline-block;
      width: 8px;
      height: 8px;
      font-size: 0;
      margin-bottom: 2px;
    }
  }
  .comment-content {
    margin-bottom: 30px;
    display: flex;
    .head {
      margin-right: 10px;
      background: url("../../assets/headerImg.png") no-repeat;
      background-size: contain;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .comment-detail {
      flex: 1;
      .name {
        color: #299ffc;
        .stick {
          float: right;
        }
      }
      .content {
        font-size: 12px;
        color: #666666;
        margin-bottom: 10px;
        word-break: break-word;
        text-align: justify;
      }
      .fn {
        font-size: 12px;
        display: flex;
        line-height: 19px;
        margin-bottom: 10px;
        .like {
          color: #fcc800;
          margin-right: 20px;
          .icon {
            background: #e5e5e5;
            padding: 2px;
            font-size: 11px;
            border-radius: 50%;
            color: #fff;
          }
          .active {
            background: #fcc800;
          }
        }
        .reply {
          color: #75c2ff;
          margin-right: 20px;
          .img {
            width: 15px;
            height: 15px;
            margin-bottom: -3px;
          }
        }
        .ellipsis {
          color: #e5e5e5;
          font-size: 20px;
          flex: 1;
        }
        .time {
          color: #e3e3e3;
        }
      }
      .reply-content {
        background: #f9f9f9;
        border-radius: 5px;
        padding: 10px;
        color: #666;
        .Ititle {
          color: #3f3f3f;
          font-size: 12px;
          display: flex;
          margin-bottom: 5px;
          .Iname {
            color: #666;
            font-weight: bold;
          }
          span {
            margin-right: 3px;
          }
          .time {
            flex: 1;
            text-align: right;
            color: #e3e3e3;
          }
        }
        .Icontent {
          color: #666666;
          font-size: 12px;
          word-break: break-word;
          text-align: justify;
        }
        .fn {
          margin-top: 8px;
          display: flex;
          justify-content: flex-end;
          .reply {
            color: #299ffc;
            margin-right: 10px;
          }
          .delete {
            color: #f56c6c;
          }
        }
      }
    }
  }
  .comment-kong {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 30px 0;
    .img {
      width: 105px;
      height: 79px;
      margin: 0 auto;
      margin-bottom: 14px;
    }
    .a {
      font-size: 14px;
      color: #999999;
      margin-bottom: 20px;
    }
    .btn {
      width: 160px;
      margin: 0 auto;
      margin-bottom: 20px;
    }
  }
  .comment-bottom {
    font-size: 14px;
    color: #e3e3e3;
    text-align: center;
  }
}
.dialogContent {
  padding: 30px;
  text-align: center;
}
.comment-input {
  width: 100%;
  background: #fff;
  border-radius: 17px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: 26px;
  .input {
    background: url("../../assets/icon-niming-zhihui.png") no-repeat;
    background-size: 16px;
    background-position: 15px center;
    padding: 0;
    padding-left: 36px;
    box-shadow: inset 0 0 7px 0 rgba(109, 114, 120, 0.1);
    border-radius: 17px;
  }
  .anonymousFlag {
    background: url("../../assets/icon-niming.png") no-repeat;
    background-size: 16px;
    background-position: 15px center;
  }
  .sendbtn {
    width: 70px;
    height: 46px;
    background: #47a2ff;
    color: #fff;
    font-size: 14px;
    border-radius: 0px 17px 17px 0px;
    border: none;
  }
}
</style>
