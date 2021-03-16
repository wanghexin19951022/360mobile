/*
 * @Descripttion:
 * @Author: sjq
 * @Date: 2020-12-22 15:22:51
 * @LastEditors: qt
 * @LastEditTime: 2021-03-09 08:50:05
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { Lazyload } from "vant";
import "lib-flexible/flexible";
import "@vant/touch-emulator";
import "@/style/index.scss";

import "./permission.js";

Vue.use(Lazyload);
Vue.use(ElementUI);
document.title = "360测评";
// 注册时可以配置额外的选项
Vue.use(Lazyload, {
  lazyComponent: true,
});
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
