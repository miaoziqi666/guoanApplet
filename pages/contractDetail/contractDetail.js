// pages/contractDetail/contractDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseData: {
      houseName: "",
      roomName: "",
      rent: "",
      houseStatus: "",
      picImage: "",
      buildNo: "",
      buildUnitNo: "",
      houseNo: "",
    },

    contractInfo: {
      validDate: "",
      endDate: "",
      houseId: "",
      isDelivery: "",
      jointRentName: "",
      jointRentPhone: "",
      'number': "",
      ownerPhone: "",
      payStatus: "",
      receiptCycleName: "",
      receiptPlanId: "",
      renterName: "",
      roomId: "",
      saleContractId: "",
    },

    payStatusActive: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id)
  },

  getData(saleContractId) {
    getApp().globalData.$post('RentContractController/getRentContractDetail', {
      saleContractId: saleContractId
    }).then((res) => {

      let data = res.data;
      let houseData = {
        houseName: data.houseRoom,
        roomName: data.roomName,
        rent: data.realRentMoney,
        houseStatus: data.statusName,
        picImage: data.picImage,
        buildNo: data.buildNo,
        buildUnitNo: data.buildUnitNo,
        houseNo: data.houseNo,
      }

      let contractInfo = getApp().globalData.$copy(data, this.data.contractInfo);

      let payStatusActive = contractInfo.statusName === "已解约" ? false : contractInfo.payStatus === "0" ? true : false;

      contractInfo.payStatus = contractInfo.payStatus === "0" ? "待支付" : "已支付";
      contractInfo.isDelivery = contractInfo.isDelivery === "0" ? "未交割" : "已交割";

      this.setData({
        houseData: houseData,
        contractInfo: contractInfo,
        payStatusActive: payStatusActive,
      })
    })
  },

  //跳转到支付页面
  toPay() {
    if (!this.data.payStatusActive) {
      return;
    }

    let { contractInfo: { receiptPlanId, saleContractId } } = this.data;

    wx.navigateTo({
      url: `/pages/contractPay/contractPay?receiptPlanId=${receiptPlanId}&saleContractId=${saleContractId}`
    })
  }
})