// pages/contractPay/contractPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    saleContractId: "",
    houseAddress: "",
    receiptPlanNumber: 0,
    receiptPlanSubmitCount: 0,
    receiptPlanPlanRent: 0,
    receiptPlanRealRent: 0,
    receiptPlanId: "",

    payMoney: 0,
    //是否已经缴费完成
    payComplete: false,

    houseName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.receiptPlanId, options.saleContractId)
  },

  getData(receiptPlanId, saleContractId) {
    getApp().globalData.$post('RentContractController/getPayReceiptList', {
      receiptPlanId: receiptPlanId,
      saleContractId: saleContractId,
    }).then((res) => {
      let data = res.data;

      let { contractInfo: { houseAddress, saleContractId, houseName }, receiptPlan: { number, planRent, realRent, submitCount, receiptPlanId } } = data;

      let payMoney = planRent - realRent < 0 ? 0 : planRent - realRent;

      this.setData({
        saleContractId: saleContractId,
        houseAddress: houseAddress,
        receiptPlanNumber: number,
        receiptPlanSubmitCount: submitCount,
        receiptPlanPlanRent: planRent,
        receiptPlanRealRent: realRent,
        payMoney: payMoney,
        receiptPlanId: receiptPlanId,

        payComplete: !payMoney,
        houseName: houseName
      })
    })
  },

  //增加支付金额
  addMoney() {
    this.checkAndSetMoney(this.data.payMoney + 100)
  },

  //减少支付金额
  reduceMoney() {
    this.checkAndSetMoney(this.data.payMoney - 100)
  },

  //改变支付金额
  changeRant(event) {
    this.checkAndSetMoney(event.detail.value)
  },

  //校验金额是否正确
  checkAndSetMoney(money) {
    let payMoney = "";
    let maxLimit = this.data.receiptPlanPlanRent - (this.data.receiptPlanRealRent || 0);

    if (money) {
      if (money < 0) {
        payMoney = 0;
      } else if (money > maxLimit) {
        payMoney = maxLimit;
      } else {
        payMoney = money;
      }
    } else if (money === 0) {
      payMoney = money;
    }

    this.setData({
      payMoney: payMoney
    })
  },

  //失去焦点检查金额
  clearMoney() {
    if (this.data.payMoney === "") {
      this.setData({
        payMoney: 0,
      })
    }
  },

  //确认支付
  submit() {
    if (!this.data.payMoney) {
      getApp().globalData.$broadcast("showError", "contractPay", "请输入正确的金额");
      return;
    }

    if (this.data.payComplete){
      getApp().globalData.$broadcast("showError", "contractPay", "租金已经缴齐");
      return;
    }

    let { receiptPlanId, receiptPlanPlanRent, payMoney } = this.data;
    let openId = wx.getStorageSync("openId");

    getApp().globalData.$post("PayController/rentChargePayOrder", {
      "receiptPlanId": receiptPlanId,
      "planRent": receiptPlanPlanRent,
      "realReceipt": payMoney,
      "openId": openId,
      "receiptSubjectCode": "0057001",
      "receiptWayCode": "0058005",
      "receiptTypeCode": "0053003",
    }).then(res => {
      if (res.code !== 0){
        getApp().globalData.$broadcast("showError", "contractPay", "支付失败");
        return;
      }
      
      let { userId, receiptId} = res.data;
      let { houseName, payMoney} = this.data;

      let nameGoods = houseName;
      let notifyURL = getApp().globalData.notifyUrl.rent;
      let tradeNo = receiptId;
      let appId = getApp().globalData.appId;

      return getApp().globalData.$post("wxPay/payInfo", {
        "userId": userId,
        "body": nameGoods,
        "notifyURL": notifyURL,
        "outTradeNo": tradeNo,
        "totalFee": payMoney * 100,
        "appid": appId,
        "tradeType": "JSAPI",
        "openid": openId
      }, "common")

    }).then(res => {
      if (res.code === 1) {
        getApp().globalData.$broadcast("showError", "contractPay", "支付失败");
        return;
      }

      let { timeStamp, nonceStr, paySign} = res.data;

      wx.requestPayment({
        timeStamp: timeStamp,
        nonceStr: nonceStr,
        package: res.data.package,
        signType: "MD5",
        paySign: paySign,
        success: (res) => {
          wx.showToast({
            title: '支付成功',
            mask: true,
            success: () => {
              wx.navigateBack();
            }
          })
        },
        fail: (res) => {
          getApp().globalData.$broadcast("showError", "contractPay", "支付失败");
        }
      })
    })
  }
})