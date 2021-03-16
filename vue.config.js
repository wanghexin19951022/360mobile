/*
 * @Descripttion:
 * @Author: sjq
 * @Date: 2020-12-22 15:41:17
 * @LastEditors: qt
 * @LastEditTime: 2021-03-12 15:24:39
 */
"use strict";
const path = require("path");
const webpack = require("webpack");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: ".",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false, // 使得打包过后的文件不包含未压缩的.map文件，减少压缩后代码体积
  configureWebpack: {
    // 在webpack的name字段中提供应用程序的标题，
    // 可以在index.html中访问它以注入正确的标题。
    name: "360测评",
  },

  // 允许对内部的webpack配置进行更细粒度的修改
  chainWebpack(config) {
    config.plugins.delete("preload"); // 移除 preload 插件
    config.plugins.delete("prefetch"); // 移除 prefetch 插件

    // 配置目录别名
    config.resolve.alias.set("@", resolve("src"));

    config
      .plugin("context")
      .use(webpack.ContextReplacementPlugin, [/moment[/\\]locale$/, /zh-cn/]);

    // 设置 svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    // 为了补删除换行而加的配置
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    // 开发环境添加source map
    config.when(process.env.NODE_ENV === "development", (config) =>
      config.devtool("cheap-source-map")
    );
  },
  // eslint-disable-next-line eol-last
};
