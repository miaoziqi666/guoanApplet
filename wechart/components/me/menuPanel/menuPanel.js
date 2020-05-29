// components/me/menuPanel/menuPanel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menu: {
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
    toPage(event) {
      let { url } = event.currentTarget.dataset;
      if (url) {
        wx.navigateTo({
          url: url
        })
      } else {
        wx.showModal({ title: "提示", content: "功能还未开放", "showCancel": false })
      }
    }
  }
})
