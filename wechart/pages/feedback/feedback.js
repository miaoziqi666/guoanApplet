// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["我要投诉", "查看投诉记录"],
    current: 0,

    content: "",
    phone: "",

    currentPageNo: 1,
    loading: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let phone = wx.getStorageSync("phoneNum");
    if (phone){
      this.setData({
        phone: phone.substr(0, 3) + "****" + phone.substr(7, 4),
      })
    }

    this.getPageData();
  },
  
  //切换tab
  changeTab(event){
    let index = event.detail;
    this.setData({
      current: index,
    })
  },

  //记录投诉内容
  contentChange(event){
    this.setData({
      content: event.detail.value,
    })
  },

  //提交投诉
  submit(){
    let content = this.data.content.trim();
    let emojRole =/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
    if (emojRole.test(content)){
      getApp().globalData.$broadcast("showError", "feedback", "请输入正确的内容");
      return false;
    }
    if (content.length === 0){
      getApp().globalData.$broadcast("showError", "feedback", "请输入投诉内容");
      //wx.showModal({ title: "提示", content: "请输入投诉内容", "showCancel": false })
      return;
    }

    getApp().globalData.$post('CComplaintController/save', {
      complaintId: "", //用户id
      questionDescription: content,  //问题描述
      complaintIdentity: "",  //投诉对象
      sourceCode: "0056013",
    }).then((res)=>{
        if(res.code === 0){
          wx.showToast({ title: "提交成功", icon: "success"})

          this.setData({
            content: "",
          }, this.getPageData());
        }else{
          wx.showModal({ title: "提示", content: res.msg, "showCancel": false })
        }
    })
  },

  //获取投诉记录列表
  getPageData(){
    getApp().globalData.$post("CComplaintController/getComplaint", {
      currentPageNo: this.data.currentPageNo
    }).then((res) => {

      let list = res.content.map(item => {
        return item;
      });

      if (this.data.currentPageNo !== 1) {
        list = this.data.list.concat(list);
      }

      this.setData({
        list: list,
        loading: res.content.length < 10 ? -1 : 0
      }, () => {
        wx.stopPullDownRefresh();
        wx.hideLoading();
      })
    })
  },

  //下拉刷新
  onPullDownRefresh(){
    wx.showLoading({ title: "加载中..." });
    this.setData({
      currentPageNo: 1,
    }, this.getPageData)
  },

  //上拉加载
  onReachBottom: function () {
    this.setData({
      currentPageNo: ++this.data.currentPageNo,
    }, this.getPageData)
  },
})