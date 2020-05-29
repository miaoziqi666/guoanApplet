// components/public/tabBar/tabBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        this.setData({
          right: (1 - 1 / newVal.length) * 100,
        })
      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: 0,
    left: 0,
    right: 0,
    direction: 1,  //1: 右, 0: 左
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(event) {
      let index = event.target.dataset.index;
      if (index !== this.data.current) {

        let left = 1 / this.properties.tabs.length * index * 100;
        let width = 1 / this.properties.tabs.length * 100;
        let right = 100 - (left + width);

        let cb = () => {
          this.setData({
            current: index,
            left: left,
            right: right,
          });
          
          this.triggerEvent('changeTab', index);
        }

        //判断左滑还是右滑
        if (index > this.data.current) {
          //右滑
          this.setData({
            direction: 1,
          }, cb);
        } else {
          //左滑
          this.setData({
            direction: 0,
          }, cb);
        }
      }
    }
  }
})
