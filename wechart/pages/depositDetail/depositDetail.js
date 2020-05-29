// pages/depositDetail/depositDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseData: {
      houseName: "",
      roomName: "",
      rent: "",
      houseArea: "",
      buildFloor: "",
      houseStatus: "",
      picImage: "",
    },

    depositInfo: {
      ownerName: "",
      ownerSex: "",
      ownerPhone: "",
      ownerHeader: "",
      signDateTime: "",
      depositId: "",
      dealCodeName: "",
      amount: "",
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id);
  },
  
  getData(depositId){
    getApp().globalData.$post('RentContractController/getDepositDetail', {
      depositId: depositId
    }).then((res) => {

      let data = res.data;
      let houseData = {
        houseName: data.houseName,
        roomName: data.roomName,
        rent: data.rentPrice,
        houseArea: data.area,
        buildFloor: data.houseBuildNo,
        houseStatus: data.rentStatus,
        picImage: data.picImage,
      }


      let depositInfo = getApp().globalData.$copy(data, this.data.depositInfo);

      depositInfo.ownerHeader = depositInfo.ownerSex === "1" ? "https://img.guoanfamily.com/wechat/depositMan.png" : "https://img.guoanfamily.com/wechat/depositWomen.png"
      
      this.setData({
        houseData: houseData,
        depositInfo: depositInfo,
      })
      
    })
  }
})