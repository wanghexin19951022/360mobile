/*
 * @Descripttion:
 * @Author: sjq
 * @Date: 2020-12-24 11:32:59
 * @LastEditors: qt
 * @LastEditTime: 2021-03-15 16:58:53
 */
import { request } from "@/utils/request";

//  获取轮播图
export function getBannerList() {
  return request({
    url: "/px-enterprise-culture/advertising",
    method: "get",
    params: {
      systemDomain: "px-enterprise-culture-app",
    },
  });
}

//  获取文章列表
export function getArticleList(params) {
  return request({
    url: "/px-enterprise-culture/article",
    method: "get",
    params,
  });
}

//  获取文章信息
export function getArticleDetail(params) {
  return request({
    url: `/px-enterprise-culture/article/${params.articleId}`,
    method: "get",
    params,
  });
}

// 置顶文章
export function setStickArticle(data) {
  return request({
    url: `/px-enterprise-culture/article/${data.articleId}`,
    method: "put",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
// 删除文章
export function deleteArticle(params) {
  return request({
    url: `/px-enterprise-culture/article/${params.articleId}`,
    method: "delete",
    params,
  });
}

// 文章评论
export function getArticleComment(data) {
  return request({
    url: `/px-enterprise-culture/article/${data.articleId}/comment`,
    method: "put",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
// 回复评论
export function replyArticleComment(data) {
  return request({
    url: `/px-enterprise-culture/article/${data.articleId}/comment/${data.commentTargetId}/reply`,
    method: "put",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// 置顶评论
export function setStickComment(data) {
  return request({
    url:
      `/px-enterprise-culture/comment/${data.commentId}` +
      (data.bussType === 0 ? "/cancel" : ""),
    method: "put",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// 删除评论
export function deleteComment(data) {
  return request({
    url: `/px-enterprise-culture/comment/${data.commentId}`,
    method: "delete",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
// 点赞文章 取消点赞
export function likeArticle(data) {
  return request({
    url:
      `/px-enterprise-culture/likes` + (data.likesId ? `/${data.likesId}` : ""),
    method: data.likesId ? `delete` : "POST",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// 文章浏览

export function browseArticle(params) {
  return request({
    url: `/px-enterprise-culture/article/${params.articleId}/browse`,
    method: "get",
    params,
  });
}
// 获取管理员信息
export function getAdminInfo(params) {
  return request({
    url: `/px-enterprise-culture/article/admin`,
    method: "get",
    params,
  });
}

// 个人信息查询
export function getUserInfo(params) {
  return request({
    url: `/px-user-center/manager/findByLoginName`,
    method: "get",
    params,
  });
}

// 我的考评列表
export function getEvaluationList(params) {
  return request({
    url: `/px-personnel-evaluation/questionnaire/myself/list`,
    method: "get",
    params,
  });
}

// 查看历史考评
export function viewHistory(params) {
  return request({
    url: `/px-personnel-evaluation/self/evaluation/history-detail`,
    method: "get",
    params,
  });
}
//根据部门id查询部门下的人员及子部门
export function departmentChild(data) {
  return request({
    url: "/px-personnel-evaluation/department/child",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
  });
}
//完成自评
export function completeEvaluation(data) {
  return request({
    url: `/px-personnel-evaluation/self/evaluation/complete/${data.evaluationId}`,
    method: "post",
    data,
  });
}
//查看历史考评
export function historyDetail(params) {
  console.log(params);
  return request({
    url: `/px-personnel-evaluation/self/evaluation/history-detail`,
    method: "get",
    params,
  });
}

// 互评保存接口
export function savePeer(data) {
  return request({
    url: `/px-personnel-evaluation/peer/evaluation/detail/save`,
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// 查看自评
export function selfDetail(params) {
  return request({
    url: `/px-personnel-evaluation/self/evaluation/detail`,
    method: "get",
    params,
  });
}

// 查看互评
export function peerDetail(data) {
  return request({
    url: `/px-personnel-evaluation/peer/evaluation/detail/list`,
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
// 查看自评
export function evaluatedPage(params) {
  return request({
    url: `/px-personnel-evaluation/peer/evaluation/evaluated/page`,
    method: "get",
    params,
  });
}
