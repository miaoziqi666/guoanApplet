// pages/leasePayDetail/leasePayDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    saleContractId: "",
    houseAddress: "",

    planRent: "",
    number: "",
    submitCount: "",
    realRent: "",

    receiptList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.receiptPlanId, options.saleContractId)
  },

  getData(receiptPlanId, saleContractId){
    getApp().globalData.$post("RentContractController/getPayReceiptList", {
      receiptPlanId: receiptPlanId,
      saleContractId: saleContractId
    }).then(res => {
      let data = res.data;

      let { saleContractId, houseAddress } = data.contractInfo;
      let { planRent, number,submitCount, realRent } = data.receiptPlan;

      this.setData({
        saleContractId: saleContractId,
        houseAddress: houseAddress,

        planRent: planRent,
        number: number,
        submitCount: submitCount,
        realRent: realRent,

        receiptList: data.receiptList,
      })

    })
  }
})