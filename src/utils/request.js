/*
 * @Descripttion:
 * @Author: sjq
 * @Date: 2020-12-14 08:16:56
 * @LastEditors: sjq
 * @LastEditTime: 2021-03-09 15:07:01
 */
import axios from "axios";
import { Notify } from "vant";
import { cancleStore, objEachEmpty } from "./api";
const url = process.env.VUE_APP_WEB_URL + process.env.VUE_APP_BASE_API;

// create an axios instance
const service = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    config.cancelToken = cancleStore.source.token;
    if (config.method === "post") {
      objEachEmpty(config.params);
      if (config.headers["Content-Type"] !== "application/json") {
        const params = new URLSearchParams();
        for (const key in config.data) {
          if (config.data.hasOwnProperty(key)) {
            params.append(key, config.data[key]);
          }
        }
        config.data = params;
      }
    }
    if (localStorage.getItem("ticket")) {
      config.headers["ticket"] = localStorage.getItem("ticket");
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      console.log(res.code, process.env);
      if (res.code === 16502 && process.env.NODE_ENV !== "development") {
        let type = localStorage.getItem("systemtype");
        if (type === "pc") {
          this.$message({
            type: "sucess",
            message: "请重新登录",
          });
          setTimeout(() => {
            // 重新登陆
            window.location.href = process.env.VUE_APP_LOGOUT;
          }, 500);
          return;
        }
        let {
          VUE_APP_WEIXIN,
          VUE_APP_APPID,
          VUE_APP_REDIRECT_URL,
        } = process.env;
        window.location.replace(
          VUE_APP_WEIXIN +
            "appid=" +
            VUE_APP_APPID +
            "&redirect_uri=" +
            encodeURIComponent(VUE_APP_REDIRECT_URL) +
            "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
        );
        return;
      }
      Notify({
        message: res.message || "Error",
        type: "danger",
      });
      return Promise.reject(new Error(res.Notify || "Error"));
    } else {
      return res.data;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    Notify({
      message: error.message,
      type: "danger",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

/**
 * []请求
 * @param params  参数
 * @param operation     接口
 */
function request(data) {
  // var _a = {
  //   url: url,
  //   method: method
  // }
  // var datatype = method === 'get' || method === 'GET' ? 'params' : 'data'
  // _a[datatype] = data
  // console.log(_a)
  return service(data);
}

export { request, service };
