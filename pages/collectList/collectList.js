// pages/collectList/collectList.js
const tagColor = ['#e99064', '#7dadd2', '#76b48f']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagColor: tagColor,
    list: [],
    currentPageNo: 0,
    loading: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
  },

  //下拉刷新
  onPullDownRefresh() {
    wx.showLoading({ title: "加载中..." });
    this.setData({
      currentPageNo: 0,
    }, this.getPageData)
  },

  //上拉加载
  onReachBottom() {
    this.getPageData();
  },

  getPageData() {
    getApp().globalData.$get(`CollectController/getAllByUid?startCount=${this.data.currentPageNo}&type=3`, "user")
      .then((res) => {
        let { collectList, startCount } = res.data;

        let list = collectList.map(item => {
          item.image = getApp().globalData.$concatFileUrl(item.imageName, 200, 180);
          if (item.advantageTagsArr) {
            item.tags = item.advantageTagsArr.split(",").splice(0, 3);
          } else {
            item.tags = [];
          }

          //获取类型，id
          let { productType, id } = getApp().globalData.$getQuery(item.collectUrl);
          item.productType = productType;
          item.roomId = id;
          return item;
        });

        if (this.data.currentPageNo !== 0) {
          list = this.data.list.concat(list);
        }

        this.setData({
          list: list,
          loading: collectList.length < 10 ? -1 : 0,
          currentPageNo: startCount,
        }, () => {
          wx.stopPullDownRefresh();
          wx.hideLoading();
        })

      })
  },

  //去详情页
  toDetail(event) {
    let { producttype, id } = event.currentTarget.dataset;

    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}&producttype=${producttype}`
    })
  },

  //删除收藏
  deleteCollect(event) {
    let { collecturl } = event.currentTarget.dataset;

    getApp().globalData.$post(`CollectController/delCollectInfo`, {
      collectUrl: collecturl
    }, "user").then((res) => {

      if (res.code === 200) {
        //展示删除成功
        wx.showToast({
          title: '删除成功',
          mask: true,
        })

        //删除列表中的数据
        this.setData({
          list: this.data.list.filter(item => {
            return item.collectUrl !== collecturl;
          })
        })
        
        //删除本地数据
        let userInfo = wx.getStorageSync("userInfo");
        userInfo.collectList =  userInfo.collectList.filter(item => {
          return item !== collecturl;
        });
        wx.setStorageSync("userInfo", userInfo);
       
      } else {
        wx.showModal({ title: "提示", content: res.msg, "showCancel": false })
      }

    })
  },

  //阻止冒泡
  stop() {
    //console.log("stop")
  }
})