// components/switchTab/switchTab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(event) {
      let index = event.target.dataset.index;
      if (index !== this.data.current){
        this.setData({
          current: index,
        });
        this.triggerEvent('switchProduct', index);
      }
    }
  }
})
