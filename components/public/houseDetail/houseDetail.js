// components/public/houseDetail/houseDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    houseDetail: {
      type: Object,
      value: null,
      observer:function(newValue,oldValue){
        this.setData({
          picImage: getApp().globalData.$concatFileUrl(this.data.houseDetail.picImage, 90, 75)
        });
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    picImage:''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
