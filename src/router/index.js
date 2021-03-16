/*
 * @Descripttion:
 * @Author: sjq
 * @Date: 2020-12-22 15:22:51
 * @LastEditors: qt
 * @LastEditTime: 2021-03-12 08:57:58
 */
import Vue from "vue";
import VueRouter from "vue-router";
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/values",
  },
  // {
  //   path: "/culture",
  //   name: "culture",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "@/views/culture/index.vue"),
  // },
  // {
  //   path: "/cultureDetail",
  //   name: "cultureDetail",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "@/views/culture/detail.vue"),
  // },
  {
    path: "/error",
    name: "error",
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/error/index.vue"),
  },
  {
    path: "/values",
    name: "value",
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/values/value.vue"),
  },
  {
    path: "/evaluation",
    name: "evaluation",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "@/views/evaluation/evaluation.vue"
      ),
  },
  {
    path: "/ChooseDepartment",
    name: "ChooseDepartment",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "@/views/evaluation/ChooseDepartment.vue"
      ),
  },
  {
    path: "/selectPeople",
    name: "selectPeople",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "@/views/selectPeople/selectPeople.vue"
      ),
  },
  {
    path: "/finishEvalution",
    name: "finishEvalution",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "@/views/finishEvalution/finishEvalution.vue"
      ),
  },
  {
    path: "/eachEvalution",
    name: "eachEvalution",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "@/views/eachEvalution/eachEvalution.vue"
      ),
  },
  {
    path: "/evaluationConsequence",
    name: "evaluationConsequence",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "@/views/evaluationConsequence/evaluationConsequence.vue"
      ),
  },
  {
    path: "/evaluationDetail",
    name: "evaluationDetail",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "@/views/evaluationDetail/evaluationDetail.vue"
      ),
  },
  {
    path: "/selfEvaluation",
    name: "selfEvaluation",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "@/views/selfEvaluation/selfEvaluation.vue"
      ),
  },
  {
    path: "/selfEvaluationPC",
    name: "selfEvaluationPC",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "@/views/selfEvaluationPC/selfEvaluationPC.vue"
      ),
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "@/views/About.vue"),
  // },
];

const router = new VueRouter({
  routes,
});

export default router;
