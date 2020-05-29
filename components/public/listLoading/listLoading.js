// components/public/listLoding/listLoading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loading: {
      type: Number,
      value: 0,
    },
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
    callPhone () {
      wx.makePhoneCall({
        phoneNumber: '400-900-2225'
      });
    }
  }
})