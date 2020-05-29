// commponent/titleBar/titleBar.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的属性列表
   */
  properties: {
    icon: String,
    labelName: String,
    link: Boolean,
    url: String,
    openType: {
      type: String,
      value: "navigate"
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  created: function () {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    more() {
      switch (this.properties.openType){
        case "navigate":
          wx.navigateTo({
            url: this.properties.url
          });
          break;
        case "redirect":
          wx.redirectTo({
            url: this.properties.url
          });
          break;
        case "switch":
          //tabbar切换将链接参数保存到App Data中
          let url = this.properties.url;
          let path = url.split("?")[0];
          let query = getApp().globalData.$getQuery(url);
          getApp().globalData.query = query;

          wx.switchTab({
              url: path
          });
          break;
      }

      
    }
  }
})
