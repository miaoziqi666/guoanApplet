// components/public/popError/popError.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    errorMsg: "",
    hasErrorTimer: false,
  },

  //订阅错误提示
  created() {
    getApp().globalData.$subscribe("showError", "popError", (msg) => {
      if (!this.data.hasErrorTimer){
        this.data.hasErrorTimer = true;

        this.setData({
          errorMsg: msg,
        }, setTimeout(() => {
          this.setData({
            errorMsg: "",
          })

          this.data.hasErrorTimer = false;
        }, 3000))
      }
    })
  },

  //移除时取消订阅
  detached(){
    getApp().globalData.$unsubscribe("showError", "popError");
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
