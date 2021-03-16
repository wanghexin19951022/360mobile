/*
 * @Descripttion:
 * @Author: sjq
 * @Date: 2020-12-22 18:25:20
 * @LastEditors: qt
 * @LastEditTime: 2021-03-09 15:58:43
 */
module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ["Android >= 4.0", "iOS >= 7"],
    },
    "postcss-pxtorem": {
      rootValue: 37.5,
      propList: ["*"],
    },
  },
};
