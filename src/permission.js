/*
 * @Descripttion:
 * @Author: sjq
 * @Date: 2021-01-18 18:28:21
 * @LastEditors: sjq
 * @LastEditTime: 2021-03-10 08:37:29
 */
import router from "./router";
import { getUserInfo } from "@/api/api";
import { Message } from "element-ui";

router.beforeEach(async (to, from, next) => {
  console.log(to);
  // if (to.path === "/error") next();
  // alert(window.location.href);
  if (to.query.ticket) {
    localStorage.setItem("systemtype", to.query.subId ? "pc" : "");
    localStorage.setItem("ticket", to.query.ticket);
    getUserInfo().then((res) => {
      localStorage.setItem("userInfo", JSON.stringify(res));
    });
    next();
  }
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    next();
    return;
  }
  let hasToken = localStorage.getItem("ticket");
  if (to.query.code && to.path !== "/error") {
    next({
      path: "error",
      query: {
        code: to.query.code,
        message: to.query.message,
      },
    });
  } else if (hasToken) {
    getUserInfo().then((res) => {
      localStorage.setItem("userInfo", JSON.stringify(res));
    });
    next();
  } else {
    if (to.path === "/error") {
      next();
    } else {
      // http://test.tas.pxjy.com/api/tas-ca/qywx/1000007?
      // subId=404
      // &successRedirectUrl=test-tas.pxjy.com/pxculture/#/home
      // errorRedirectUrl=http://test-tas.pxjy.com/pxculture/#/home
      // 朴新大学	子系统id:403
      // 文化社区 子系统id：412	 agentId:1000007
      // alert(encodeURIComponent(process.env.VUE_APP_WEIXIN));
      // alert(
      //   VUE_APP_WEIXIN +
      //     "appid=" +
      //     VUE_APP_APPID +
      //     "&redirect_url=" +
      //     encodeURIComponent(VUE_APP_REDIRECT_URL) +
      //     "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
      // );
      // window.location.href =
      //   "https://open.weixin.qq.com/connect/oauth2/authorize?appid=ww95c48f926d8ecccc&redirect_uri=http%3a%2f%2ftest.tas.pxjy.com%2fapi%2ftas-ca%2fqywx%2f1000006%3fsubId%3d404%26successRedirectUrl%3d%20http%3A%2F%2Flocalhost%3A8081%2F%23%2Fhome%26errorRedirectUrl%3dhttp%3a%2f%2ftest-tas.pxjy.com%2fpxculture%2f%23%2ferror&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
      // alert(
      //   VUE_APP_WEIXIN +
      //     "appid=" +
      //     VUE_APP_APPID +
      //     "&redirect_uri=" +
      //     encodeURIComponent(VUE_APP_REDIRECT_URL) +
      //     "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
      // );
      let type = localStorage.getItem("systemtype");
      if (type === "pc") {
        Message({
          type: "sucess",
          message: "请重新登录",
        });
        if (process.env.NODE_ENV !== "development") {
          setTimeout(() => {
            window.location.href = process.env.VUE_APP_LOGOUT;
          }, 500);
          // 重新登陆
        }
        return;
      }

      let { VUE_APP_WEIXIN, VUE_APP_APPID, VUE_APP_REDIRECT_URL } = process.env;
      window.location.replace(
        VUE_APP_WEIXIN +
          "appid=" +
          VUE_APP_APPID +
          "&redirect_uri=" +
          encodeURIComponent(VUE_APP_REDIRECT_URL) +
          "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
      );

      // ("subId=412&successRedirectUrl=test-tas.pxjy.com/pxculture/#/home&errorRedirectUrl=http://test-tas.pxjy.com/pxculture/#/error");
      // window.location.href =
      //   "https://open.weixin.qq.com/connect/oauth2/authorize?appid=ww95c48f926d8ecccc&redirect_uri=http%3a%2f%2ftest.tas.pxjy.com%2fapi%2ftas-ca%2fqywx%2f1000006%3fsubId%3d404%26successRedirectUrl%3dhttp%3a%2f%2ftest.tas.pxjy.com%2fsuccess.html%26errorRedirectUrl%3dhttp%3a%2f%2ftest.tas.pxjy.com%2ferror.html&response_rtype=code&scope=snsapi_base&state=STATE#wechat_redirect";

      // window.location.href =
      //   "https://open.weixin.qq.com/connect/oauth2/authorize?appid=ww95c48f926d8ecccc&redirect_uri=http%3A%2F%2Ftest-tas.pxjy.com%2Fapi%2Ftas-ca%2Fqywx%2F1000007%3FsubId%3D412%26successRedirectUrl%3Dlocalhost%3A8081%2F%23%2Fhome&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
    }
  }
});
