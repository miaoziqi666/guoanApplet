// components/list/selectBar.js
const types = ["区域", "地铁", "价格", "筛选"];

//房型选项
const houseType = [{
  name: "合租",
  code: "0019001",
}, {
  name: "整租",
  code: "0019002",
}, {
  name: "国安家Home",
  code: "0019003",
}];

//户型选项
const roomType = [{
  name: "一居",
  code: 1,
}, {
  name: "二居",
  code: 2,
}, {
  name: "三居",
  code: 3,
}, {
  name: "四居",
  code: 4,
}, {
  name: "五居",
  code: 5,
}];

//面积选项
const areaType = [{
  name: "不限",
  code: "",
  max: "",
  min: "",
}, {
  name: "10m²以下",
  code: "1",
  max: 10,
  min: "",
}, {
  name: "10-12m²",
  code: "2",
  max: 12,
  min: 10,
}, {
  name: "12-15m²",
  code: "3",
  max: 15,
  min: 12,
}, {
  name: "15-20m²",
  code: "4",
  max: 20,
  min: 15,
}, {
  name: "20m²以上",
  code: "5",
  max: "",
  min: 20,
},];

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    defaultProductType: {
      type: String,
      value: "",
      observer: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.setData({
            activeHouseCode: newVal,
          })
        }
      }
    },

    onShowTimeStamp: {
      type: Number,
      value: "",
      observer: function (newVal, oldVal){
        this.setData({
          current: -1,
          activeAreaId: 0,
          activeRegionId: 0,
          activeSubwayId: 0,
          activeStationId: 0,
          price: 20000,
          activeHouseCode: "",
          activeRoomCode: "",
          activeAreaCode: "",
        }, this.submitSearch)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    types: types,
    current: -1,

    //区域
    areaList: [],
    regionList: [],
    activeAreaId: 0,
    activeRegionId: 0,

    //地铁
    subwayLine: [],
    stationLine: [],
    activeSubwayId: 0,
    activeStationId: 0,

    //价格
    price: 20000,

    //筛选
    //房型
    houseType: houseType,
    activeHouseCode: "",
    //户型
    roomType: roomType,
    activeRoomCode: "",
    //面积
    areaType: areaType,
    activeAreaCode: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //选择头部标签
    switchType(event) {
      let index = event.currentTarget.dataset.index;
      if (index !== this.data.current) {

        //获取列表数据
        if (index === 0) {
          this._getAreaList();
        } else if (index === 1) {
          this._getSubwayLine();
        }

        this.setData({
          current: index,
        });

      } else {
        this.setData({
          current: -1,
        });
      }
    },

    //获取区域列表
    _getAreaList() {
      if (this.data.areaList.length === 0) {
        getApp().globalData.$post("common/getAreaList").then((res) => {
          this.setData({
            areaList: [{ name: "不限", id: 0 }].concat(res.data),
          });
        })
      }
    },

    //获取国安家区域列表
    getAreaList(event) {
      let id = event.currentTarget.dataset.areaid;

      if (id !== 0 && this.data.activeAreaId === id) {
        return;
      }

      this.setData({
        activeAreaId: id,
      });

      if (id !== 0) {
        getApp().globalData.$post("common/getRegionList", {
          areaId: id,
        }).then((res) => {
          this.setData({
            regionList: [{ name: "不限", id: 0 }].concat(res.data),
          });
        })
      } else {
        this.setData({
          current: -1,
          regionList: [],
          activeRegionId: 0,
        })

        this.submitSearch();
      }
    },

    //获取地铁线路列表
    _getSubwayLine() {
      if (this.data.subwayLine.length === 0) {
        getApp().globalData.$post("common/getSubwayLine").then((res) => {
          this.setData({
            subwayLine: [{ name: "不限", id: 0 }].concat(res.data),
          });
        })
      }
    },

    //获取地铁站点列表
    getStationLine(event) {
      let id = event.currentTarget.dataset.subwayid;

      if (id !== 0 && this.data.activeSubwayId === id) {
        return;
      }

      this.setData({
        activeSubwayId: id,
      });

      if (id !== 0) {
        getApp().globalData.$post("common/getStationLine", {
          subwayId: id,
        }).then((res) => {
          this.setData({
            stationLine: [{ name: "不限", id: 0 }].concat(res.data),
          });
        })
      } else {
        this.setData({
          current: -1,
          stationLine: [],
          activeStationId: 0,
        })

        this.submitSearch();
      }
    },

    //提交选择的区域
    commitArea(event) {
      let id = event.currentTarget.dataset.regionid;

      this.setData({
        activeRegionId: id,
        current: -1,
      })

      this.submitSearch();
    },

    //提交选择的站点
    commitStation(event) {
      let id = event.currentTarget.dataset.stationid;
      this.setData({
        activeStationId: id,
        current: -1,
      })

      this.submitSearch();
    },

    //提交价格
    submitPrice() {
      this.setData({
        current: -1,
      })

      this.submitSearch();
    },

    //清除价格
    clearPrice() {
      this.setData({
        price: 10000,
      })
    },

    //改变价格
    changePrice(event) {
      this.setData({
        price: event.detail.value,
      })
    },

    //选择房型
    changeHouseType(event) {
      let code = event.currentTarget.dataset.code;
      this.setData({
        activeHouseCode: code,
      })
    },

    //选择户型
    changeRoomType(event) {
      let code = event.currentTarget.dataset.code;
      this.setData({
        activeRoomCode: code,
      })
    },

    //选择面积
    changeAreaType(event) {
      let code = event.currentTarget.dataset.code;
      this.setData({
        activeAreaCode: code,
      })
    },

    //提交筛选
    submitFilter() {
      this.setData({
        current: -1,
      })

      this.submitSearch();
    },

    //清除筛选
    clearFilter() {
      this.setData({
        activeHouseCode: "",
        activeRoomCode: "",
        activeAreaCode: "",
      })
    },

    //提交所有的查询条件
    submitSearch() {

      let { activeAreaId, activeRegionId, activeSubwayId, activeStationId, price, activeHouseCode, activeRoomCode, activeAreaCode } = this.data;

      activeAreaId = activeAreaId === 0 ? "" : activeAreaId
      activeRegionId = activeRegionId === 0 ? "" : activeRegionId
      activeSubwayId = activeSubwayId === 0 ? "" : activeSubwayId
      activeStationId = activeStationId === 0 ? "" : activeStationId

      let areaInfo = this.data.areaType.find(item => {
        return item.code === activeAreaCode;
      })

      let req = {
        timeStamp: 0,
        roomNo: activeRoomCode,
        productType: activeHouseCode,
        districtId: activeAreaId,
        regionId: activeRegionId,
        subwayLineId: activeSubwayId,
        stationsId: activeStationId,
        priceMax: price,
        priceMin: "",
        textSearch: "",
        size: 10,
        userAreaMin: areaInfo.min,
        userAreaMax: areaInfo.max,
      }

      this.triggerEvent('changeRquest', req);
    },

    hiddenMask() {
      this.setData({
        current: -1,
      });
    }
  }
})
