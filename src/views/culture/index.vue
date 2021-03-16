<!--
 * @Descripttion: 
 * @Author: sjq
 * @Date: 2020-12-22 15:22:51
 * @LastEditors: sjq
 * @LastEditTime: 2021-01-28 13:34:13
-->
<template>
  <div class="home">
    <div class="swipe">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(image, index) in bannerImgList" :key="index">
          <img v-lazy="image.mediaUrl" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="nav">
      <van-sticky class="sticky">
        <van-tabs
          v-model="activeName"
          title-inactive-color="#299FFC"
          title-active-color="#fff"
          swipeable
          @change="onChange"
        >
          <van-tab v-for="(item, index) in navList" :key="index">
            <template #title>{{ item.title }}</template>
          </van-tab>
        </van-tabs>
      </van-sticky>
    </div>
    <div class="main">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :offset="10"
          :immediate-check="false"
          @load="onLoad"
        >
          <div
            class="list"
            v-for="(item, index) in list"
            :key="index"
            @click="goDetail(item)"
          >
            <div class="title">
              <div class="stick" v-if="item.topFlag === 1 && activeName === 0">
                置顶
              </div>
              <div class="titleName">{{ item.articleTitle }}</div>
            </div>
            <div class="bottom">
              <div class="author">
                {{ item.articleAuthorText || "匿名" }}
              </div>
              <div class="time">
                {{ item.createTime }}
              </div>
              <div class="browse">
                <van-icon class="icon" name="eye-o" />{{ item.browseCount }}
              </div>
              <div class="like">
                <van-icon class="icon" name="good-job-o" />{{ item.likeCount }}
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import {
  Swipe,
  SwipeItem,
  Sticky,
  Tab,
  Tabs,
  Icon,
  PullRefresh,
  List,
} from "vant";
import { getBannerList, getArticleList } from "@/api/api";

export default {
  name: "Home",
  components: {
    "van-swipe": Swipe,
    "van-swipe-item": SwipeItem,
    "van-sticky": Sticky,
    "van-tab": Tab,
    "van-tabs": Tabs,
    "van-icon": Icon,
    "van-pull-refresh": PullRefresh,
    "van-list": List,
  },
  data() {
    return {
      bannerImgList: [],
      navList: [
        {
          title: "最近更新",
          name: 1,
        },
        {
          title: "浏览TOP榜",
          name: 2,
        },
        {
          title: "点赞TOP榜",
          name: 3,
        },
      ],
      activeName: 0,
      list: [],
      refreshing: false,
      loading: false,
      finished: false,
      page: 1,
      size: 20,
      totalPages: "",
    };
  },
  created() {
    this.getBannerList();
    this.getList();
  },
  methods: {
    // tab切换 0=最近更新 1=TOP浏览 2=TOP点赞
    onChange(name, title) {
      this.page = 1;
      this.finished = false;
      this.activeName = name;
      this.getList();
    },
    // 去文章详情
    goDetail(data) {
      this.$router.push({ name: "cultureDetail", query: { id: data.id } });
    },
    // 获取banner
    getBannerList() {
      getBannerList().then((res) => {
        this.bannerImgList = res.articleMediaEntities;
      });
    },
    // 获取数据
    getList() {
      this.refreshing = true;
      this.loading = true;
      getArticleList({
        bussType: this.activeName,
        size: this.size,
        page: this.page,
      }).then((res) => {
        let list = res.content;
        console.log(res);
        if (this.page === 1) {
          this.list = list;
        } else {
          this.list = [...this.list, ...list];
        }
        this.loading = false;
        if (this.page >= res.page.totalPages) {
          this.finished = true;
        }
        this.refreshing = false;
      });
    },
    // 下拉刷新
    onRefresh() {
      this.page = 1;
      this.finished = false;
      this.getList();
    },
    onLoad() {
      console.log("object");
      this.page++;
      this.getList();
    },
  },
};
</script>
<style lang="scss">
.van-tabs__line {
  background: none;
}
.van-tab {
  height: 34px;
}
.van-sticky--fixed {
  margin: 0 15px;
}
.van-tabs--line .van-tabs__wrap {
  height: 34px;
}
.van-tab--active {
  background: #299ffc;
  border-radius: 17px;
  border: 1px solid #299ffc;
}
.van-swipe__indicator--active {
  width: 12.5px;
  height: 5px;
  background: #ffffff;
  border-radius: 4px;
}
</style>
<style lang="scss" scoped>
.swipe {
  width: 100%;
  height: 190px;
  margin-bottom: 10px;
  .van-swipe {
    height: 100%;
    img {
      height: 100%;
      width: 100%;
    }
  }
}
.nav,
.main {
  margin: 0 15px;
}
.nav {
  border-radius: 17px;
  height: 34px;
  overflow: hidden;
  box-shadow: 0 2px 10px 0 rgba(41, 159, 252, 0.15);
  margin-bottom: 10px;
}
.list {
  background: #ffffff;
  box-shadow: 0 2px 10px 0 rgba(41, 159, 252, 0.15);
  border-radius: 17px;
  margin-bottom: 10px;
  padding: 20px 16px;
  .title {
    line-height: 22px;
    margin-bottom: 6px;
    .stick {
      line-height: 20px;
      float: left;
    }
    .titleName {
      font-size: 14px;
      color: #666666;
    }
  }
  .bottom {
    display: flex;
    font-size: 12px;
    color: #999999;
    line-height: 12px;
    .author {
      margin-right: 5px;
    }
    .time {
      flex: 1;
    }
    .browse {
      margin-right: 10px;
    }
    .icon {
      margin-right: 4px;
      font-size: 14px;
    }
  }
}
</style>
