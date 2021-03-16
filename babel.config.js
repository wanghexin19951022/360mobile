/*
 * @Descripttion:
 * @Author: sjq
 * @Date: 2020-12-22 15:22:51
 * @LastEditors: sjq
 * @LastEditTime: 2021-01-22 17:57:40
 */

var plugins = [];

if (process.env.NODE_ENV === "production") {
  plugins.push("transform-remove-console");
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "import",
      {
        libraryName: "vant",
        style: true,
      },
    ],
  ],
  env: {
    development: {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      // https://panjiachen.github.io/vue-element-admin-site/guide/advanced/lazy-loading.html
      plugins: plugins,
    },
  },
};
