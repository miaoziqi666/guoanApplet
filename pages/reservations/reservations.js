// pages/reservations/reservations.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectDate: '',
    selectTime: '',
    roomId: '',
    houseId: '',
    houseData: {},
    gengers: [
      { name: '1', value: '男' },
      { name: '0', value: '女' }
    ],
    loading: false,
    btnDisable: false,
    popErrorMsg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      roomId: options.roomId,
      houseId: options.houseId
    });
    getApp().globalData.$post("RentContractController/makeDepositInfo", {
      roomId: this.data.roomId,
      houseId: this.data.houseId
    }).then((res) => {
      this.setData({
        houseData: res.data
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindDateChange: function (e) {
    this.setData({
      selectDate: e.detail.value
    });

  },
  bindTimeChange: function (e) {
    this.setData({
      selectTime: e.detail.value
    });
  },
  radioChange: function (e) {
    this.setData({
      'houseData.renterSex': e.detail.value
    });
  },
  bindPhoneInput: function (e) {
    this.setData({
      'houseData.renterPhone': e.detail.value
    });
  },
  bindUserNameInput: function (e) {
    this.setData({
      'houseData.renterName': e.detail.value
    });
  },
  bindTextTap: function (e) {
    this.setData({
      'houseData.remark': e.detail.value
    });
  },
  saveAppoint: function (e) {
    let phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!this.data.houseData.renterPhone) {
      getApp().globalData.$broadcast("showError", "popError", "请输入您的手机号！");
      return false;
    }
    if (!phoneReg.test(this.data.houseData.renterPhone)) {
      getApp().globalData.$broadcast("showError", "popError", "请输入有效手机号码！");
      return false;
    }
    if (!this.data.houseData.renterName) {
      getApp().globalData.$broadcast("showError", "popError", "请输入用户名！");
      return false;
    }
    if (!this.data.selectDate || !this.data.selectTime) {
      getApp().globalData.$broadcast("showError", "popError", "请选择有效的看房时间！");
      return false;
    }
    this.setData({
      loading: !this.data.loading,
      btnDisable: !this.data.btnDisable
    });
    getApp().globalData.$post("CAppointController/saveCAppoint", {
      id: '',//id
      sourceCode: '0020005',
      houseId: this.data.houseId,//房源id
      roomId: this.data.roomId,//房间id
      appointTime: new Date(this.data.selectDate.replace(/-/g, '/') + ' ' + this.data.selectTime.replace(/-/g, '/')),//看房时间
      remark: this.data.houseData.remark,//留言
      userName: this.data.houseData.renterName,//姓名
      phone: this.data.houseData.renterPhone,//电话
      sex: this.data.houseData.renterSex//性别1男0女
    }).then((res) => {
      if (res.code == 0) {
        wx.showToast({
          title: '约看成功期待与您相约!',
        });
        setTimeout(()=>{
          wx.redirectTo({
            url: "../reservationsList/list"
          });
        },1000);
      } else {
        getApp().globalData.$broadcast("showError", "popError",  res.msg);
      }
      this.setData({
        loading: !this.data.loading,
        btnDisable: !this.data.btnDisable
      });
    });
  }
});