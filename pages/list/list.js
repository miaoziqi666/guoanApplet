const tagColor = ['#e99064', '#7dadd2', '#76b48f']
Page({
  data: {
    list: [],
    tagColor: tagColor,
    loading: 0,
    request: {
      timeStamp: 0,
      roomNo: "",
      productType: "",
      districtId: "",
      regionId: "",
      subwayLineId: "",
      stationsId: "",
      priceMax: "",
      priceMin: "",
      textSearch: "",
      size: 10,
      userAreaMin: "",
      userAreaMax: "",
    },
    //默认的房源列表类型
    defaultProductType: "",
    onShowTimeStamp: new Date().getTime(),
    clearSearchCondition: true,
  },

  onLoad: function (options) {
    let query = getApp().globalData.query;
    if (query && query.type) {

    } else {
      this.getPageData()
    }
  },

  onShareAppMessage: function (res) {
    return {
      title: '国安家-高品质公寓运营商',
      path: '/pages/list/list',
      imageUrl: "https://img.guoanfamily.com/rent/static/HomePage/chuxin01.png",
      success: function (res) {
        wx.showModal({
          title: '转发',
          content: '分享成功',
        })
      }
    }
  },

  onShow(options) {
    let query = getApp().globalData.query;

    if (query && query.type) {
      getApp().globalData.query = null;

      let productType = query.type ==='clear' ? '': query.type;
      let request = this.data.request;
      request.productType = productType;
      this.setData({
        defaultProductType: productType,
        request: request
      }, this.getPageData())
    }
  },

  onHide(){
    if (this.data.clearSearchCondition){
      this.setData({
        onShowTimeStamp: new Date().getTime(),
      })
    }else{
      this.setData({
        clearSearchCondition: true,   //重置清除查询条件标志位
      })
    }
  },

  //修改查询条件
  changeRquest(request) {
    this.setData({
      request: request.detail,
      loading: 0,
    }, this.getPageData)
  },

  //清空查询条件
  clearSearch(){
    this.setData({
      onShowTimeStamp: new Date().getTime(),
    })
  },

  //获取分页数据
  getPageData() {
    if (this.data.loading === 1 || this.data.loading === -1 || this.data.loading === -2) {
      wx.stopPullDownRefresh();
      wx.hideLoading();
      return;
    } else {
      this.setData({
        loading: 1
      })
    }

    getApp().globalData.$post("HouseInfoController/getHouseList", this.data.request, "", false).then((res) => {
      let list = res.data.map(item => {
        item.image = getApp().globalData.$concatFileUrl(item.image);
        if (item.tags) {
          item.tags = item.tags.split(",").splice(0, 3);
        } else {
          item.tags = [];
        }
        return item;
      });

      if (this.data.request.timeStamp !== 0) {
        list = this.data.list.concat(list);
      }

      let loading = res.data.length < 10 ? -1 : 0;
      if (res.data.length === 0){
        loading = -2;
      }

      this.setData({
        list: list,
        loading: loading,
      }, () => {
        wx.stopPullDownRefresh();
        wx.hideLoading();
      })
    })
  },

  //下拉刷新
  onPullDownRefresh() {
    let request = this.data.request;
    request.timeStamp = 0;
    wx.showLoading({ title: "加载中..." });
    this.setData({
      request: request,
    }, this.getPageData)
  },

  //上拉加载
  onReachBottom() {
    if (this.data.list.slice(-1)[0]){
      let timeStamp = this.data.list.slice(-1)[0].publishTime;
      let request = this.data.request;
      request.timeStamp = timeStamp;
      this.setData({
        request: request,
      }, this.getPageData)
    }
  },

  //跳转到房间详情
  toDetail(event) {
    this.setData({
      clearSearchCondition: false,
    }, ()=>{
      let { producttype, id } = event.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}&producttype=${producttype}`
      })
    })
  }
})