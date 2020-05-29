// components/doubleSwiper/doubleSwiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    desc: {
      type: Boolean,
      value: false,
    },

    originalList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        let imageList = [];

        for (let i = 0; i < newVal.length; i++) {
          let item = newVal[i];
          if (i % 2 === 0) {
            imageList.push([]);
          }

          imageList[imageList.length - 1].push({
            img: item.img,
            url: item.url,
            name: this.properties.desc ? item.name : "",
            price: this.properties.desc ? item.price : "",
          })
        }

        if (imageList.length != 0 && imageList[imageList.length - 1].length === 1){
          imageList[imageList.length - 1].push({});
        }

        this.setData({
          imageList: imageList,
        })
      },
    },

    resetFlag: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal){
        this.setData({
          current: 0,
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageList: [],
    indicatorDots: false,
    autoplay: false,
    circular: false,
    //interval: 5000,
    duration: 500,
    current: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapImage(event) {
      let { url } = event.currentTarget.dataset;
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
