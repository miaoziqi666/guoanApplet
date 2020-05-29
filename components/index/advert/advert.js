// components/advert/advert.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: String,
    url: String,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapImage(event) {
      let { url } = event.currentTarget.dataset;
      if (url) {
        if (url.indexOf("/pages/list/list") >= 0) {
          let query = getApp().globalData.$getQuery(url);
          getApp().globalData.query = {
            type: query.type
          };

          wx.switchTab({
            url: url
          });
        } else {
          wx.navigateTo({
            url: url,
          })
        }
      }
    }
  }
})
