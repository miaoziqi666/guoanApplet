// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    code: "",
    time: 0,
    buttonTip: "获取验证码",
    timer: null,
  },

  //手机号改变
  phoneChange(event) {
    this.setData({
      phone: event.detail.value
    })
  },

  //验证码改变
  codeChange(event) {
    this.setData({
      code: event.detail.value
    })
  },

  //获取验证码
  getCode() {
    if(this.data.time !== 0){
      return;
    }

    if (this.data.phone.length !== 11){
      getApp().globalData.$broadcast("showError", "login", "请输入正确的手机号");
      //wx.showModal({ title: "提示", content: "请输入正确的手机号", "showCancel": false })
      return;
    }

    //开启获取验证码倒计时
    this.setData({
      time: 60,
      timer: setInterval(() => {
        if(this.data.time -1 === 0){
          clearInterval(this.data.timer);
          this.setData({
            timer: null,
            time: 0,
            buttonTip: "获取验证码",
          })
        }else{
          let time = --this.data.time;
          this.setData({
            time: time,
            buttonTip: `${time}s后重新获取`,
          })
        }
      }, 1000)
    });

    getApp().globalData.$post('smsAuthCodeController/unionSMSAuthCOde', {
      phoneNum: this.data.phone
    }, "user").then((res) => {
      if (res.code === 200) {
        wx.showModal({ title: "提示", content: "短信验证码已经发送至您的手机，请注意查收！", "showCancel": false})
      }
    });
  },

  submit(){
    if (this.data.phone.length !== 11) {
      getApp().globalData.$broadcast("showError", "login", "请输入正确的手机号");
      //wx.showModal({ title: "提示", content: "请输入正确的手机号", "showCancel": false })
      return;
    }

    if (this.data.code.length !== 6) {
      getApp().globalData.$broadcast("showError", "login", "请输入正确的验证码");
      //wx.showModal({ title: "提示", content: "请输入正确的验证码", "showCancel": false })
      return;
    }

    getApp().globalData.$post('userLoginController/unionlogin', {
      phoneNum: this.data.phone,
      authCode: this.data.code,
      openId: wx.getStorageSync("openId"),
      freeLonin: true,
      source: 2,
    }, "user").then((res) => {
      if (res.code == 200) {

        //将用户信息保存到本地
        wx.clearStorageSync();
        for (let key in res.data){
          wx.setStorageSync(key, res.data[key]);
        }

        wx.showToast({
          title: '登录成功',
          mask: true,
          success: () => {
            if (getCurrentPages().length === 1){
              wx.switchTab({
                url: "/pages/index/index"
              })
            }else {
              wx.navigateBack({
                delta: 1,
              });
            }
          }
        })
      }else{
        wx.showModal({ title: "提示", content: res.msg, "showCancel": false })
      }
    });
  }
})