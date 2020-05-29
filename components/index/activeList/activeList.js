// components/activeList/activeList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
    }
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
    tapActive(event) {
      let {url} = event.currentTarget.dataset;
      if (url) {
        if (url === "/pages/list/list") {
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
