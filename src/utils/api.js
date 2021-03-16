/*
 * @Descripttion:
 * @Author: sjq
 * @Date: 2020-12-14 09:26:37
 * @LastEditors: sjq
 * @LastEditTime: 2021-01-06 15:51:58
 */
export const cancleStore = { source: { cancel: null, token: null } };

// 过滤对象空字段和空数组空对象
export function objEachEmpty(obj) {
  for (let key in obj) {
    if (
      (!obj[key] && obj[key] !== 0 && obj[key] + "" !== "false") ||
      (Array.isArray(obj[key]) && obj[key].length === 0)
    ) {
      // || Object.prototype.toString.call(obj[key]) === '[object Object]'
      delete obj[key];
    }
  }
  return obj;
}
export function getlocalStorage(key) {
  return window.localStorage.getItem(key);
}
export function setlocalStorage(key, val) {
  return window.localStorage.setItem(key, val);
}
export function removelocalStorage(key) {
  return window.localStorage.removeItem(key);
}

// 文件类型
export function fileType(url) {
  const urlend =
    url.indexOf("?") !== -1
      ? url.slice(url.lastIndexOf("."), url.indexOf("?"))
      : url.slice(url.lastIndexOf("."));
  const videos = [".mp4", ".3gp", ".avi"];
  const audios = [".cda", ".mav", ".mp3", ".wma"];
  const imgs = [
    ".jpg",
    ".png",
    ".jpeg",
    ".bmp",
    ".gif",
    ".tiff",
    ".psd",
    ".swf",
  ];
  if (videos.some((item) => item === urlend)) {
    return "video";
  } else if (audios.some((item) => item === urlend)) {
    return "audio";
  } else if (imgs.some((item) => item === urlend)) {
    return "img";
  } else {
    console.error("类型错误", urlend);
    return "error";
  }
}
