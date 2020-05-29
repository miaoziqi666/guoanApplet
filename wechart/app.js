//app.js
import util from "./utils/util.js";
import config from "./utils/config.js";

App({
  onLaunch: function () {
    wx.login({
      success: function (res) {
        if (res.code) {


          getApp().globalData.$get(`miniapp/login?jsCode=${res.code}`, "openweixin", false).then((res) => {
            if (res.code !== 0) {
              return;
            }

            let openId = res.data;
            wx.setStorageSync("openId", openId);

            getApp().globalData.$post('userLoginController/unionlogin', {
              openId: openId,
              freeLonin: true,
              source: 2,
            }, "user", false).then(res => {
              if (res.code === 200) {
                //将用户信息保存到本地
                wx.clearStorageSync();
                for (let key in res.data) {
                  wx.setStorageSync(key, res.data[key]);
                }
              }
            })
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },

  globalData: {
    //缓存数据 （页面跳转时临时需要保存的数据）
    query: null,

    //记录全局的订阅事件
    events: {},

    //记录支付通知地址
    notifyUrl: {
      deposit: config.PAY_NOTIFY_URL_DEPOSIT,
      rent: config.PAY_NOTIFY_URL_RENT
    },

    //小程序ID
    appId: config.APP_ID,

    //封装请求
    $post: util.$post,
    $get: util.$get,

    //获取图片全路径
    $concatFileUrl: util.$concatFileUrl,

    //获取默认图片
    $defaultImgUrl: config.Default_PATH,

    //复制对象属性
    $copy: util.$copy,

    //获取url中的get参数
    $getQuery: util.$getQuery,

    //订阅事件
    $subscribe: util.$subscribe,

    //取消订阅
    $unsubscribe: util.$unsubscribe,

    //发送广播
    $broadcast: util.$broadcast,
  }
})