// pages/entrust/entrust.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    name: "",
    remark: "",
    communityName: "",
    communityId: "",

    showCommunityPage: false,
    communityList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let phone = wx.getStorageSync("phoneNum")
    let name = wx.getStorageSync("realName")

    if (name || phone) {
      this.setData({
        phone: phone,
        name: name,
      })
    }
  },

  //手机号改变
  phoneChange(event) {
    this.setData({
      phone: event.detail.value
    })
  },

  //姓名改变
  nameChange(event) {
    this.setData({
      name: event.detail.value
    })
  },

  //备注信息改变
  remarkChange(event) {
    this.setData({
      remark: event.detail.value
    })
  },

  //展示小区列表
  showCommunityList() {
    this.setData({
      showCommunityPage: !this.data.showCommunityPage,
    })
  },

  //清除搜索框
  clearSearch() {
    this.setData({
      communityName: "",
    })
  },

  //查询小区列表
  communityNameConfirm(event) {

    let communityName = event.detail.value;

    if (event.detail.value) {
      // wx.showLoading({ title: "加载中..." });

      this.setData({
        communityName: communityName,
      })

      getApp().globalData.$post('CommunityController/findCommunityList', {
        communityName: communityName
      }).then((res) => {
        if (res.code === 0) {
          this.setData({
            communityList: res.data,
          })
        }

        wx.hideLoading();
      });
    }

  },

  //改变小区名称
  changeCommunityName(event) {
    console.log(event.currentTarget.dataset)
    let { name, id } = event.currentTarget.dataset

    this.setData({
      communityName: name,
      communityId: id,
      showCommunityPage: false,
    })
  },

  //提交委托
  submit() {
    let { name, phone, remark, communityId } = this.data;

    if (phone.length !== 11) {
      getApp().globalData.$broadcast("showError", "entrust", "请输入正确的手机号");
      //wx.showModal({ title: "提示", content: "请输入正确的手机号", "showCancel": false })
      return;
    }

    if (!name) {
      getApp().globalData.$broadcast("showError", "entrust", "请输入姓名");
      //wx.showModal({ title: "提示", content: "请输入姓名", "showCancel": false })
      return;
    }

    getApp().globalData.$post('CEntrusController/saveCEntrus', {
      userName: name,
      phone: phone,
      communityId: communityId,
      remark: remark,
      customerSourceCode: "0020005"
    }).then((res) => {
      if (res.code === 0) {
        wx.showToast({
          title: '委托成功',
          mask: true,
          success: () => {
            wx.navigateBack({
              delta: 1,
            });
          }
        })
      } else {
        wx.showModal({ title: "提示", content: res.msg, "showCancel": false })
      }
    });
  },
})