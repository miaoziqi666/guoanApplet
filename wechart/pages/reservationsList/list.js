// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["未完成的约看", "已完成的约看"],
    status: 0,
    phone: "",
    currentPageNo: 1,
    loading: 0,
    tagColor :['#e99064', '#7dadd2', '#76b48f'],
    current:11
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
  },

  //切换约看的状态
  changeTab(event) {
    let index = event.detail;
    this.setData({
      status: index,
      currentPageNo:1
    }, this.getPageData)
  },

  //获取约看记录列表
  getPageData() {
    getApp().globalData.$post('CAppointController/getCAppointList', {
      'isFinished'
      : this.data.status,//0是未完成  1 是已完成
      currentPageNo: this.data.currentPageNo
    }).then((res) => {
      let list = res.content.map(item => {
        if (item.productType == '0019002') {
          item.roomFirst = getApp().globalData.$concatFileUrl(item.houseImg, 200, 180);
        } else {
            item.roomFirst = getApp().globalData.$concatFileUrl(item.roomFirst, 200, 180);
        }
        item.appointTime = new Date(item.appointTime).Format('yyyy-MM-dd hh:mm:ss');
        if (item.advantageTags) {
          item.advantageTags = item.advantageTags.split(",").splice(0, 3);
        } else {
          item.advantageTags = [];
        }
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
  //取消约看
  cancelAppoint(event){
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.showLoading({ title: "取消中..." });
          getApp().globalData.$post("CAppointController/deleteCAppoint", { appointId: event.currentTarget.dataset.id }).then((res)=>{
            if(res.code===0){
              wx.hideLoading();
              wx.showToast("取消成功");
              that.getPageData();
            }
          });
        }
      }
    });
   
  },
  //下拉刷新
  onPullDownRefresh() {
    wx.showLoading({ title: "加载中..." });
    this.setData({
      currentPageNo: 1,
    }, this.getPageData)
  },

  //上拉加载
  onReachBottom: function () {
    if (this.data.loading === -1){
        return false;
    }
    this.setData({
      currentPageNo: ++this.data.currentPageNo,
    }, this.getPageData());
  },
  //跳转到房间详情
  toDetail(event) {
    let { producttype, id } = event.currentTarget.dataset;
    console.info(producttype);
    console.info(id);
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}&producttype=${producttype}`
    })
  }
})