//banner轮播图数据
const imagesList = [{
  url: '/pages/list/list',
  img: 'https://img.guoanfamily.com/rent/static/HomePage/redPerson.png',
}, {
  url: '/pages/list/list',
  img: 'https://img.guoanfamily.com/rent/static/HomePage/banner1020.jpg',
}, {
  url: '/pages/list/list',
  img: 'https://img.guoanfamily.com/rent/static/HomePage/banner05.png',
}, {
  url: '/pages/entrust/entrust',
  img: 'https://img.guoanfamily.com/rent/static/HomePage/banner03.png',
}];

//活动列表
const activeList = [{
  url: '/pages/list/list',
  img: 'https://m.zufang.guoanfamily.com/static/img/article01.7440b99.jpg',
  title: "点亮北京",
  desc: "在这个日渐寒冷的深秋时刻，为这座古老又崭新的城市，与在这城市漂泊的每一个认真生活的年轻人，点亮等你回家的灯火",
}, {
  url: '/pages/list/list',
  img: 'https://img.guoanfamily.com/rent/static/activeList/active01.png',
  title: "百万房租免费送",
  desc: "今年十一让我们来个改变之旅参加国安家品质租住节领取价值3500元礼包为自己找一个理想家~",
}];

//页面底部产品案例
const productList = [
  [{
    url: '/pages/list/list',
    img: 'https://img.guoanfamily.com/rent/static/HomePage/model1.png'
  },
  {
    url: '/pages/list/list',
    img: 'https://img.guoanfamily.com/rent/static/HomePage/model2.png'
  },
  {
    url: '/pages/list/list',
    img: 'https://img.guoanfamily.com/rent/static/HomePage/model3.png'
  },
  {
    url: '/pages/list/list',
    img: 'https://img.guoanfamily.com/rent/static/HomePage/model4.png'
  },
  {
    url: '/pages/list/list',
    img: 'https://img.guoanfamily.com/rent/static/HomePage/model5.png'
  }], [
    {
      url: '/pages/list/list',
      img: 'https://img.guoanfamily.com/rent/static/HomePage/chuxin01.png'
    },
    {
      url: '/pages/list/list',
      img: 'https://img.guoanfamily.com/rent/static/HomePage/chuxin02.png'
    },
    {
      url: '/pages/list/list',
      img: 'https://img.guoanfamily.com/rent/static/HomePage/chuxin03.png'
    },
    {
      url: '/pages/list/list',
      img: 'https://img.guoanfamily.com/rent/static/HomePage/chuxin04.png'
    },
    {
      url: '/pages/list/list',
      img: 'https://img.guoanfamily.com/rent/static/HomePage/chuxin05.png'
    }
  ]
]

Page({
  data: {
    imgUrls: imagesList.map(item => { return item.img }),
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 5000,
    duration: 1000,
    current: 0,

    roomList: [],
    houseList: [],
    activeList: activeList,

    tabs: ["初心系列产品", "初见系列产品"],
    //切换tab后，轮播跳转到第一页
    resetTime: 0,
    productList: productList[0],
  },

  onLoad: function () {
    getApp().globalData.$post("common/homePage", {
      size: 6
    }).then((res) => {

      let roomList = [], houseList = [];
      roomList = res.data.roomList.map(item => {
        return {
          id: item.id,
          productType: item.productType,
          name: item.houseName + " " + item.roomName,
          price: `￥${item.price}/月`,
          img: getApp().globalData.$concatFileUrl(item.image, 331, 259),
          url: `/pages/detail/detail?id=${item.id}&producttype=${item.productType}`,
        }
      });
      houseList = res.data.roomList.map(item => {
        return {
          id: item.id,
          productType: item.productType,
          name: item.houseName + " " + item.roomName,
          price: `￥${item.price}/月`,
          img: getApp().globalData.$concatFileUrl(item.image, 331, 259),
          url: `/pages/detail/detail?id=${item.id}&producttype=${item.productType}`,
        }
      });
      this.setData({
        roomList: roomList,
        houseList: houseList.reverse()
      })
    })
  },
  onShareAppMessage: function (res){
    return{
      title:'国安家-高品质公寓运营商',
      path:'/pages/index/index',
      imageUrl: "https://img.guoanfamily.com/rent/static/HomePage/chuxin01.png",
      success: function (res){
        wx.showModal({
          title: '转发',
          content: '分享成功',
        })
      }
    }
  },
  tapBanner(event) {

    let { index } = event.currentTarget.dataset;
    let url = imagesList[index].url;

    if (url.indexOf("http") === 0) {

    } else {
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
  },

  switchProduct(event) {
    this.setData({
      resetTime: new Date().getTime(),
      productList: productList[event.detail],
    })
  }
})
