// pages/detail/detail.js
//页面底部产品案例
Page({
  data: {
    isload:false,     //收藏按钮遮罩
    userInfo:{},
    moblie:"400-900-2225",
    type: "",//收藏传入的参数
    address:"",     //地址
    images:"",      //第一张图片
    newCollectUrl: '',//收藏路径后半部分
    advantageTagsCollect:"",  //收藏标签

    isCollection:false,
    imagesList: [], //主轮播图
    imgList: [],    //轮播图
    productList: [],      //小区轮播图
    id: "",               //房源id 房间id
    productType: "",     //整租合租 合租 0019001 0019003|整租 0019002
    userId:"",                  //用户id
    resetTime: 0,
    indicatorDots: false,
    autoplay: true, 
    circular: true,
    interval: 5000,
    duration: 1000,
    current: 0, 
    currentPage: "",//当前页
    /**
     * 房源详情参数
     */
    shareName:'',                                            //分享名
    isRoomOrHouse: '',                                       //是合租还是整租
    price: "",                                               //租金
    areaName: "",                                            //区域名
    communityName: "",                                       //小区名字
    colledtName: "",                                         //房间显示的名字和收藏的名字
    advantageTagsArr: "",                                    //标签
    changeRoomNo: "",                                        //几室
    changeLivingNo: "",                                      //几厅
    buildFloor:"",                                           //层数
    usedArea:"",                                             //房间面积
    roomOrientation:"",                                      //房间朝向
    advantageEnvironment: '',                                //房源介绍 | 房间描述
    roomItems:[],                                            //房屋配套信息
    room: [],                                                //房间
    parlour: [],                                             //客厅
    Kitchen: [],                                             //厨房
    toilet: [],                                              //卫生间
    houseId:'' ,                                             //房源id
    roomId:'',                                               //房间id
    roomList: '',                                            //房屋室友信息
    isHaveroomList: true,                                    //是否有室友房间信息
    isthisHouse: '',                                         //是否为本房间
    isHaveEnvironment: true,                                 //是否有房源介绍
    recommend: '',                                           //小区介绍
    isHaveRecommend: true,                                   //是否有小区介绍
    isHaveCommunityImages: true,                             //是否有小区图片
    surrounding: '',                                         //周边
    isHaveSurrounding: true,                                 //是否有周边信息
    circumjacentTraffic: '',                                 //交通
    ishaveTraffic: true,                                     //是否有交通
    recommendList: [],                                       //获取推荐房源房间
    roomArr:[],                                             //获取推荐房源房间 整理过后的arr
    controls: [{
        id: 1,
        iconPath: '../../icon/detail/block.png',
        position: {
          left: 10,
          top: 50,
          width: 20,
          height: 20
        },
        clickable: true
      }
    ],
    hasAppoint: false,//hasDepositContract为false，该房间没有被预定
    hasDepositContract: false//hasAppoint为false，当前登陆者没有约看过该房间
  },
  //地图
  controltap(e) {
    var that = this;
    console.log("scale===" + this.data.scale)
    if (e.controlId === 1) {
      // if (this.data.scale === 13) {
      // that.setData({
      //   scale: --this.data.scale
      // })
      this.mapCtx.moveToLocation();
      // }
    } else {
      that.setData({
        scale: ++this.data.scale
      })
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: `${'国安家-' + this.data.areaName + "　" + this.data.communityName + "　" + this.data.colledtName }`,
      path: `/pages/detail/detail?id=${this.data.id}&producttype=${this.data.productType}`,
      imageUrl: "https://img.guoanfamily.com/rent/static/HomePage/chuxin01.png",
      success: function (res) {
        wx.showModal({
          title: '转发',
          content: '分享成功',
        })
      }
    }
  },
  onLoad: function (options) {
    // "0014001"卧室  "0014002" 客厅 "0014003"厨房 "0014004"卫生间
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function (res) {
        that.setData({
          userInfo: res.data
        });
      },
    });
    
    this.setData({
      id:options.id,
      productType: options.producttype,
      newCollectUrl: 'productType=' + options.producttype + '&id=' + options.id,
    })

    getApp().globalData.$post("HouseInfoController/getHouseDetail", {
      id: options.id,
      productType: options.producttype,
      userId: ""
    }, "", false).then((res) => {
      //设置index 修改图片路径 向数组中添加图片
      this.getRecommendHouse();
      let imgList = [],imageList=[],productList=[];
      // 获取小区 数组
      let len = res.data.communityImages.length;
      imgList = res.data.communityImages.substring(0, len - 1).split(",");
      imgList.forEach(function(key,index){
        let image = "";
        if(key == ""){
          image = "https://m.zufang.guoanfamily.com/static/img/noneImg1.9a6fefe.png?imageView2/0/w/750/h/415";
        } else {
          image = getApp().globalData.$concatFileUrl(key, 750, 415);
        }
        let objx = {    //小区
          img :image
        }
        productList.push(objx); //小区
        imageList.push(image);  //放大预览
      })
      //获取主轮播图
      let roomBanners = res.data.roomBanners, arr = [], obj = {}, imagesList = [];
      for (let i = 0; i < roomBanners.length;i++){
        if (roomBanners[i].typeCode == "0014001"){
          if (roomBanners[i].roomFirst){
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].roomFirst, 750, 415),
              roomName: roomBanners[i].roomName,
            });
          }
          if (roomBanners[i].layoutImage) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].layoutImage, 750, 415),
              roomName: "户型图",
            });
          }
          if (roomBanners[i].roomSecond) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].roomSecond, 750, 415),
              roomName: roomBanners[i].roomName,
            });
          }
          if (roomBanners[i].roomThird) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].roomThird, 750, 415),
              roomName: roomBanners[i].roomName,
            });
          }
        }
        if (roomBanners[i].typeCode == "0014002") {
          if (roomBanners[i].roomFirst) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].roomFirst, 750, 415),
              roomName: roomBanners[i].roomName,
            });
          }
          if (roomBanners[i].layoutImage) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].layoutImage, 750, 415),
              roomName: "户型图",
            });
          }
          if (roomBanners[i].roomSecond) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].roomSecond, 750, 415),
              roomName: roomBanners[i].roomName,
            });
          }
          if (roomBanners[i].roomThird) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].roomThird, 750, 415),
              roomName: roomBanners[i].roomName,
            });
          }
        }
        if (roomBanners[i].typeCode == "0014003") {
          if (roomBanners[i].roomFirst) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].roomFirst, 750, 415),
              roomName: roomBanners[i].roomName,
            });
          }
          if (roomBanners[i].layoutImage) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].layoutImage, 750, 415),
              roomName: "户型图",
            });
          }
          if (roomBanners[i].roomSecond) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].roomSecond, 750, 415),
              roomName: roomBanners[i].roomName,
            });
          }
          if (roomBanners[i].roomThird) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].roomThird, 750, 415),
              roomName: roomBanners[i].roomName,
            });
          }
        }
        if (roomBanners[i].typeCode == "0014004") {
          if (roomBanners[i].roomFirst) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].roomFirst, 750, 415),
              roomName: roomBanners[i].roomName,
            });
          }
          if (roomBanners[i].layoutImage) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].layoutImage, 750, 415),
              roomName: "户型图",
            });
          }
          if (roomBanners[i].roomSecond) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].roomSecond, 750, 415),
              roomName: roomBanners[i].roomName,
            });
          }
          if (roomBanners[i].roomThird) {
            arr.push({
              image: getApp().globalData.$concatFileUrl(roomBanners[i].roomThird, 750, 415),
              roomName: roomBanners[i].roomName,
            });
          }
        }
      }
      if(arr.length == 0){
        arr.push({
          image: "https://m.zufang.guoanfamily.com/static/img/noneImg1.9a6fefe.png?imageView2/0/w/750/h/415",
        });
      }
      arr.forEach(function (key, index) {
        let image = key.image;
        let name = key.name;
        if (key == "") {
          image = "https://m.zufang.guoanfamily.com/static/img/noneImg1.9a6fefe.png?imageView2/0/w/750/h/415";
        } else {
          image = key.image;
        }
        let objx = {    //小区
          img: image
        },
        obj = {     //主轮播
          index: index,
          image: image,
          name: name
        };
        imageList.push(image);  //放大预览
        imagesList.push(obj);  //放大预览
      })
      

      // imagesList.push(obj);   //主轮播
      //加载swiper中数据
      this.setData({
        productList: productList, //小区轮播图
        imgList: imageList,       //放大预览
        imagesList: imagesList,   //主轮播
      })
      //加载imagesList后加载 imagelist length
      this.setData({
        currentPage: this.data.current + 1 + '/' + this.data.imagesList.length,
      })
      /**
       * 加载房源详情重要数据
       */ 

      //整租合租数据区分
      let advantageEnvironment = "", isHaveEnvironment = true;  //房源介绍 是否有房源介绍

      if (this.data.productType == "0019001" || this.data.productType == "0019003") {//判断是整租-合租
        // console.log("合租")
        if (res.data.advantageEnvironment) {//房源介绍  
          advantageEnvironment = res.data.assessmentRoom;
        } else {
          isHaveEnvironment = false;
        }
        //定义 setData 中 标签数组 value
        let advantageTagsArr = [], advantageTagsCollect = "";
        if (res.data.roomAdvantageTags) {//房间标签
          advantageTagsCollect = res.data.roomAdvantageTags;      //收藏房间标签
          advantageTagsArr = res.data.roomAdvantageTags.split(",", 6);
        }
        this.setData({
          isRoomOrHouse: true,                                  //合租
          price: res.data.price + " ",                                //房间价格
          colledtName: res.data.roomName,                       //房间编号
          advantageTagsArr: advantageTagsArr,                   //标签
          usedArea: res.data.usedArea,                          //房间面积
          roomOrientation: res.data.roomOrientation,            //房间朝向
          advantageEnvironment: advantageEnvironment,           //房源介绍 
          houseId:res.data.houseId,   
          roomId: res.data.roomId,                              //房间id
          shareName: res.data.houseName + res.data.roomName,    //分享名
          isHaveEnvironment: isHaveEnvironment,                 //是否有房源介绍
          advantageTagsCollect: advantageTagsCollect,
        })
        switch (res.data.intakeState) {
          case "0015001"://已预约
            this.isAppointment = true;
            break;
          case "0015004"://已出租
            this.isRent = true;
            break;
        }
      } else if (this.data.productType == "0019002") {
        //console.log("整租")
        if (res.data.advantageEnvironment) {//房源描述
          advantageEnvironment = res.data.advantageEnvironment;
        } else {
          isHaveEnvironment = false;
        }
        //定义 setData 中 标签数组 value
        let advantageTagsArr = [], advantageTagsCollect = "";
        if (res.data.advantageTags) {//房源标签
          advantageTagsCollect = res.data.advantageTags;
          advantageTagsArr = res.data.advantageTags.split(",", 6)
        }
        this.setData({
          isRoomOrHouse: false,                                 //整租
          isHaveEnvironment: isHaveEnvironment,                 //是否有房源介绍
          price: res.data.rentPrice,                            //房源价格
          colledtName: res.data.houseName,                      //房间编号
          advantageTagsArr: advantageTagsArr,                   //标签
          usedArea: res.data.coveredArea,                       //房源面积
          roomOrientation: res.data.orientation,                //房间朝向
          advantageEnvironment: advantageEnvironment,           //房源介绍    
          shareName: res.data.houseName,                        //分享名
          houseId: res.data.houseId,   
          roomId: "",                                           //房间id
          advantageTagsCollect: advantageTagsCollect,
        })
        switch (res.data.rentStatusCode) {
          case "0026002"://已预约
            this.isAppointment = true;
            break;
          case "0026004"://已出租
            this.isRent = true;
            break;
        }
      }

      //其他房间室友入住信息
      let roomList = [], isHaveroomList = true;//室友信息数组 是否有房间室友信息
      if (res.data.roomList) {
        roomList = res.data.roomList.map((item, index) => {
          if (item.intakeState == "已入住") {
            item.isIntakeState = true;
            switch (item.ownerSex) {
              case "1":
                item.icon = "../../icon/detail/boy.png";
                item.sexChinese = "男";
                break;
              case "0":
                item.icon = "../../icon/detail/girl.png";
                item.sexChinese = "女";
                break;
              case null:
                item.icon = "../../icon/detail/none.png";
                item.sexChinese = "未知";
                break;
            }
          } else {
            item.isIntakeState = false;
            item.sexChinese = "";
            if (this.data.roomId == item.roomId) {
              item.isthisHouse = true
            } else {
              item.isthisHouse = false
            }

          }
          return item;
        })
      } else {
        isHaveroomList = false
      }

      //房间物品配套信息
      let roomItems = res.data.roomItems, room, parlour, Kitchen, toilet;  //房间 客厅 厨房 卫生间
      room = roomItems.filter(function checkAdult(currentValue, index, arr) {
        return currentValue.typeCode == "0014001"
      });
      parlour = roomItems.filter(function checkAdult(currentValue, index, arr) {
        return currentValue.typeCode == "0014002"
      });
      Kitchen = roomItems.filter(function checkAdult(currentValue, index, arr) {
        return currentValue.typeCode == "0014003"
      });
      toilet = roomItems.filter(function checkAdult(currentValue, index, arr) {
        return currentValue.typeCode == "0014004" || currentValue.typeCode == "0014005";
      });
      //小区介绍
      let recommend = "", isHaveRecommend = true, communityList = [], isHaveCommunityImages = true;  //小区介绍 是否有小区介绍
      if (res.data.recommend) {//是否有小区介绍
        recommend = res.data.recommend;
      } else {
        isHaveRecommend = false;
      }
      //小区图片展示
      if (res.data.communityImages) {
        communityList = res.data.communityImages.split(",", 5);
      } else {
        isHaveCommunityImages = false;
      }
      //是否有周边信息，交通
      let isHaveSurrounding = true, surrounding, ishaveTraffic = true, circumjacentTraffic;//是否有周边信息 周边信息  是否有交通 交通
      if (res.data.surrounding == null || res.data.surrounding == "") {
        isHaveSurrounding = false;
        //console.log(this.isHaveSurrounding)
      } else {
        surrounding = res.data.surrounding;
      }
      if (res.data.circumjacentTraffic == null || res.data.circumjacentTraffic == "") {
        ishaveTraffic = false;
      } else {
        circumjacentTraffic = res.data.circumjacentTraffic;
      }
        /**
         * 房源房间 公用数据
         */
      this.longitude = res.data.longitude;
      this.latitude = res.data.latitude;
      this.setData({
        address: res.data.buildAddress,                       //地址
        images : res.data.roomBanners[0].roomFirst,           //第一张图片
        changeRoomNo : res.data.changeRoomNo,                 //几室
        changeLivingNo: res.data.changeLivingNo,              //几厅
        buildFloor: res.data.buildFloor,                      //层数
        areaName: res.data.areaName,                          //区域名
        communityName: res.data.communityName,                //小区名字
        roomList: roomList,                                   //房屋室友信息
        roomItems: roomItems,                                 //房屋配套信息
        room: room,                                           //房间
        parlour: parlour,                                     //客厅
        Kitchen: Kitchen,                                     //厨房
        toilet: toilet,                                       //卫生间
        recommend: recommend,                                 //小区介绍
        isHaveRecommend: isHaveRecommend,                     //小区介绍
        isHaveCommunityImages: isHaveCommunityImages,         //是否有小区图片
        surrounding: surrounding,                             //周边
        isHaveSurrounding: isHaveSurrounding,                 //是否有周边信息
        circumjacentTraffic: circumjacentTraffic,             //交通
        ishaveTraffic: ishaveTraffic,                         //是否有交通
        isHaveroomList: isHaveroomList,                       //房间室友
        longitude : res.data.longitude,                       //经度
        latitude: res.data.latitude,                          //纬度
        markers: [{
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          name: res.data.houseName,
          desc: '大西北',
          iconPath: '../../icon/detail/ditu2.gif',//图片
        }],
        hasAppoint: res.data.hasAppoint,
        hasDepositContract: res.data.hasDepositContract 
      })
       /**
       * 加载房源详情重要数据
       */
      
    })
  },
  //获取推荐房源接口
  notEmpty(value) {
    if (value === null || value === undefined || value === "null" || value === "undefined" || value === "") {
      return true;
    } else {
      return false;
    }
  },
  getRecommendHouse() {
    //遍历本地localStorage收藏数组
    if (!this.notEmpty(this.data.userInfo.collectList)) {
      let userArr = this.data.userInfo.collectList;
      let hres = this.data.newCollectUrl;
      for (let i = 0; i < userArr.length; i++) {
        if (hres == userArr[i]) {
          this.setData({
            isCollection: true//收藏按钮变红
          });
        }
      }
    }
    let recommendList = [], isHaveGaj = true, roomArr=[];
    getApp().globalData.$post("HouseInfoController/recommendHouse", {
      "productType": this.data.productType,
      "id": this.data.id
    }).then((res) => {
      if (res.data.length == 0) {
        isHaveGaj = false;
      }
      roomArr = res.data.map(item => {
        if (item.roomName == null){
          item.roomName ="";
        }
        if (item.image == null) {
          item.image = "https://m.zufang.guoanfamily.com/static/img/noneImg1.9a6fefe.png?imageView2/0/w/750/h/415";
        }else{
          item.image = getApp().globalData.$concatFileUrl(item.image, 331, 259);
        }
        return {
          id: item.id,
          productType: item.productType,
          name: item.houseName + " " + item.roomName,
          price: `￥${item.price}/月`,
          img: item.image,
          url: '../detail/detail' + '?id=' + item.id + '&producttype=' + item.productType,
        }
      });
      this.setData({
        roomArr: roomArr,
      })
    })
  },
  //房间轮播图 event
  tapBanner(e) {
    this.setData({
      currentPage: e.currentTarget.dataset.index + 1 + '/' + this.data.imagesList.length,
    })
  },
  //拨打400电话
  callme(){
    wx.makePhoneCall({
      phoneNumber: this.data.moblie
    });
  },
  //房间轮播图change event
  bindchange: function (e) {//轮播图发生改变
    this.setData({
      currentPage: e.detail.current + 1 + '/' + this.data.imagesList.length,
    });
    this.setData({
      current: e.detail.current
    })
  }, 
  //点击轮播图放大事件
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = this.data.imgList;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  //收藏
  collection(){
    var self = this;
    switch (this.data.productType) {
      case "0019001":
        this.setData({
          type: 3,
        })
        break;
      case "0019003":
        this.setData({
          type: 3,
        })
        break;
      case "0019002":
        this.setData({
          type: 3,
        })
        break;
    }	
    if (this.data.isCollection == true){//取消收藏
      var that = this;
      wx.showModal({
        title: '确定取消收藏吗？',
        duration: 2000,
        success: function (res){
          if (res.confirm) {
            self.setData({
              isCollection: false
            })
            getApp().globalData.$post("CollectController/delCollectInfo", {
              "collectUrl": that.data.newCollectUrl,//当前url的后半部分
            },"user").then((res) => {
              //遍历本地localStorage收藏数组
              var userInfo;
              var deleteUser = that.data.userInfo;
              let deleteUserArr = deleteUser.collectList;
              for (let i = 0; i < deleteUserArr.length; i++) {
                if (that.data.newCollectUrl == deleteUserArr[i]) {
                  deleteUserArr.splice(i, 1);
                  wx.setStorage({
                    key: "userInfo",
                    data: deleteUser,
                  })
                  return;
                }
              }
              that.data.userInfo = deleteUserArr;
              console.log(that.data.userInfo)
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    }else{
        //收藏
      var that = this;
      getApp().globalData.$post("CollectController/saveCollectInfo", {
        "collectTitle": this.data.shareName,//名称
        "collectResume": this.data.price,//价格
        "collectContent": this.data.address,//地址
        "imageName": this.data.images,//如123.png
        "collectUrl": this.data.newCollectUrl,//当前url
        "type": this.data.type,//收藏类型
        "adjunctContent": this.data.usedArea,//面积
        "afterRoom": this.data.changeRoomNo + "室",//几室
        "afterLiving": this.data.changeLivingNo + "厅",//几厅
        "productType": this.data.productType,//整租合租 合租 0019001 0019003|整租 0019002
        "productId": this.data.id,
        "advantageTagsArr": this.data.advantageTagsCollect,//标签
        "buildFloor": this.data.buildFloor + "层",//楼层
        "source": '1'
      }, "user").then((res) => {
        if (res.code === 200) {
          self.setData({
            isCollection: true
          });
          wx.showToast({
            title: '收藏成功！',
            icon: 'success',
            duration: 2000
          });
          that.data.userInfo.collectList.push(that.data.newCollectUrl)
          console.log(that.data.userInfo)
          wx.setStorage({
            key: 'userInfo',
            data: that.data.userInfo,
          })
        } else if (res.code === 10033) {
          self.setData({
            isCollection: true
          });
          wx.showModal({
            title: '您已收藏过该房间',
            duration: 2000,
            success: function (res) {
              if (res.confirm) {
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          })
          return false;
        }
      });
    }
    
  },
  //查看房间
  watchRoom(event){
      wx.navigateTo({
        url: "../detail/detail?id=" + event.currentTarget.dataset.id + "&producttype=" + this.data.productType, 
      })
  },
  //去约看
  goAppoint(event) {
    if (this.data.hasAppoint){
      getApp().globalData.$broadcast("showError", "popError", "您已约看过该房间！");
      return false;
    }
    if (this.data.hasDepositContract) {
      getApp().globalData.$broadcast("showError", "popError", "该房源已被预订！");
      return false;
    }
    wx.navigateTo({
      url: "../reservations/reservations?roomId=" + this.data.roomId + "&houseId=" + this.data.houseId
    })
  },
  //下定金
  goDepositReservation(event) {
    if (this.data.hasDepositContract) {
      getApp().globalData.$broadcast("showError", "popError", "该房源已被预订！");
      return false;
    }
    wx.navigateTo({
      url: "../depositReservation/depositReservation?roomId=" + this.data.roomId + "&houseId=" + this.data.houseId
    })
  },
})
