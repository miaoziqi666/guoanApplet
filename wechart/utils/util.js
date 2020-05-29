require('./es6-promise.auto.min.js').polyfill();
import config from "./config.js";

//定义全局扩展方法
(function(){
  Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
})()

module.exports = {
  //封装post请求
  $post: function (url, data, interfaceType = "", redirectToLogin = true) {
    return new Promise((resolve, reject) => {

      let API = config.DEFAULT_API_URL
      switch (interfaceType) {
        case "user":
          API = config.USER_API_URL;
          break;
        case "openweixin":
          API = config.OPENWEIXIN_API_URL;
          break;
        case "common":
          API = config.COMMON_API_URL;
          break;
      }

      wx.request({
        method: "POST",
        url: API + url,
        data: data,
        header: {
          'content-type': 'application/json',
          "Authorization": wx.getStorageSync("token")
        },
        success: function (res) {
          console.group(`请求接口：${url}`)

          console.info(`请求前缀：${API}`)
          console.info("request", data);
          console.info("response", res.data);
          console.groupEnd()

          if (redirectToLogin){
            //用户信息不正确直接跳转到登录页面
            switch (res.data.code) {
              case 4:
              case 10030:
                wx.redirectTo({
                  url: "/pages/login/login"
                })
                break;
              default:
                resolve(res.data);
                break;
            }
          }else{
            resolve(res.data);
          }
        }
      })
    })
  },

  $get: function (url, interfaceType = "", redirectToLogin = true) {
    return new Promise((resolve, reject) => {

      let API = config.DEFAULT_API_URL
      switch (interfaceType) {
        case "user":
          API = config.USER_API_URL;
          break;
        case "openweixin":
          API = config.OPENWEIXIN_API_URL;
          break;
        case "common":
          API = config.COMMON_API_URL;
          break;
      }

      wx.request({
        method: "GET",
        url: API + url,
        header: {
          'content-type': 'application/json',
          "Authorization": wx.getStorageSync("token")
        },
        success: function (res) {
          console.group(`请求接口：${url}`)

          console.info(`请求前缀：${API}`)
          console.info("response", res.data);
          console.groupEnd()

          if (redirectToLogin) {
            //用户信息不正确直接跳转到登录页面
            switch (res.data.code) {
              case 4:
              case 10030:
                wx.redirectTo({
                  url: "/pages/login/login"
                })
                break;
              default:
                resolve(res.data);
                break;
            }
          } else {
            resolve(res.data);
          }
        }
      })
    })
  },

  //获取图片链接
  $concatFileUrl: function (fileName, w, h) {
    let size = "";
    if (w !== undefined && h !== undefined) {
      size = `?imageView2/0/w/${w}/h/${h}`;
    }
    if (!fileName){
      return config.Default_PATH;
    }
    return config.IMAGE_PATH + `${fileName}${size}`;
  },

  //复制对象中的值
  $copy: function (original, target) {
      for(let key in target){
        target[key] = original[key];
      }
      return target;
  },

  //获取url中的参数
  $getQuery: function(url){
    let query = {};

    if (url.indexOf("?") !== -1){
      url = url.split("?")[1];
    }

    url.split("&").map(item => {
      let arr = item.split("=")
      query[arr[0]] = arr[1];
    });

    return query;
  },

  //订阅事件
  $subscribe: function (eventName, owner, cb) {
    let $this = getApp().globalData;
    let queue = $this.events[eventName];

    if (!queue) {
      queue = [];
    }

    queue.push({
      owner: owner,
      cb: cb,
    });

    $this.events[eventName] = queue;
  },

  //取消订阅
  $unsubscribe: function (eventName, owner) {
    let $this = getApp().globalData;
    let queue = $this.events[eventName];

    $this.events[eventName] = $this.events[eventName].filter(item => {
      return item.ownbroadcaster !== owner;
    });
  },

  //发送广播
  $broadcast: function (eventName, sender, parameter, cb) {
    let $this = getApp().globalData;
    let queue = $this.events[eventName];

    queue.map(item => {
      item.cb(parameter);
    });

    if (cb) {
      cb();
    }

  },
}