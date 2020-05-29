// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultUserHead: "/icon/me/unlisted.png",
    userHead: "",
    userName: "",
    userPhone: "",

    entry: [{
      name: "我的收藏",
      icon: "/icon/me/entry-collect.png",
      url: "/pages/collectList/collectList"
    }],

    menu: [{
      name: "约看房间",
      icon: "/icon/me/entry-appointment.png",
      url: "/pages/reservationsList/list"
    }, {
      name: "租房合同",
      icon: "/icon/me/entry-contract.png",
      url: "/pages/contract/contract"
    }, {
      name: "业主委托",
      icon: "/icon/me/entry-entrust.png",
      url: "/pages/entrust/entrust"
    }, {
      name: "我的租约",
      icon: "/icon/me/entry-lease.png",
      url: "/pages/lease/lease"
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setUserInfo();
  },

  setUserInfo() {
    let userPhone = wx.getStorageSync("phoneNum");

    if (userPhone) {
      this.setData({
        userHead: wx.getStorageSync("headImg"),
        userName: wx.getStorageSync("realName") || "",
        userPhone: userPhone,
      })
    } else {
      this.setData({
        userName: "未登录",
      })

      // wx.navigateTo({
      //   url: "/pages/login/login"
      // })
    }
  },

  //去意见反馈
  toFeedback() {
    wx.navigateTo({
      url: `/pages/feedback/feedback`
    })
  },

  //跳转到登录
  toLogin(){
    let { userPhone} = this.data;
    if (!userPhone){
      wx.navigateTo({
        url: "/pages/login/login",
      })
    }
  },

  //退出登录
  toLogout() {
    wx.showModal({
      title: "提示",
      content: "确定退出登录？",
      success: (event) => {
        let { confirm } = event;
        if (confirm) {
          wx.clearStorageSync();

          this.setData({
            userHead: "",
            userName: "未登录",
            userPhone: "",
          })

          wx.switchTab({
            url: "/pages/index/index"
          });
        }
      }
    })
  }
})