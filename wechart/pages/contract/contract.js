// pages/contract/contract.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["定金合同", "承租合同"],
    current: 0,

    //定金合同列表
    depositList: [],
    //承租合同列表
    contract: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  //切换列表
  changeTab(event) {
    let index = event.detail;
    this.setData({
      current: index,
    }, this.getData)
  },

  //获取合同列表数据
  getData(force = false) {
    let listType = this.data.current + 1;

    if (!force) {
      //如果已经有数据了就不再拉取
      if (listType === 1) {
        if (this.data.depositList.length !== 0) {
          return;
        }
      } else if (listType === 2) {
        if (this.data.contract.length !== 0) {
          return;
        }
      }
    }

    wx.showLoading({ title: "加载中..." });
    getApp().globalData.$post('RentContractController/getContractList', {
      contractType: listType
    }).then((res) => {

      if(res.code === 0){
        if (listType === 1) {
          this.setData({
            depositList: res.data.depositList.map(item => {
              item.picImage = getApp().globalData.$concatFileUrl(item.picImage, 200, 200)
              return item;
            })
          })
        } else if (listType === 2) {
          this.setData({
            contract: res.data.rentContractList.map(item => {
              item.picImage = getApp().globalData.$concatFileUrl(item.picImage, 200, 200)
              return item;
            })
          })
        }
      }

      wx.stopPullDownRefresh();
      wx.hideLoading();
    })
  },

  //下拉刷新
  onPullDownRefresh() {
    wx.showLoading({ title: "加载中..." });
    this.getData(true);
  },

  //跳转到定金合同
  toDeposit(event) {
    wx.navigateTo({
      url: `/pages/depositDetail/depositDetail?id=${event.currentTarget.dataset.id}`
    })
  },

  //跳转到承租合同
  toContract(event) {
    wx.navigateTo({
      url: `/pages/contractDetail/contractDetail?id=${event.currentTarget.dataset.id}`
    })
  }
})