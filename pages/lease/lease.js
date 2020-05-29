// pages/lease/lease.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: false,
    circular: false,
    interval: 5000,
    duration: 500,
    current: 0,

    contractList: [],
    receiptPlanGroup: [],
    receiptPlanList: [],

    colors: ["#f27362", "#0097be", "#ed9b2d"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  getData() {
    getApp().globalData.$post('RentContractController/getUserLease', {

    }).then((res) => {

      if(res.code !== 0){
        return;
      }

      let data = res.data;

      let receiptPlanGroup = data.map(item => {
        return item.receiptPlanList.map((listItem, index) => {

          listItem.payStatusName = listItem.payStatus ? "支付完成" : "待支付";

          listItem.leftDate = "";
          listItem.exceedDate = "";

          let startTimeStmp = new Date(listItem.rentDate + " 00:00:00").getTime();
          let todayTimeStmp = new Date().getTime();
          const oneDayTimes = 24 * 60 * 60 * 1000;
          if (todayTimeStmp < startTimeStmp + oneDayTimes) {
            //计算下次付款剩余天数
            let day = (startTimeStmp - todayTimeStmp) / oneDayTimes;
            if (day < 0) {
              listItem.leftDate = 0;
            } else {
              listItem.leftDate = parseInt(day) + 1;
            }

          } else {
            //计算逾期天数
            if (listItem.planCompleteTime) {
              let completeTimeStmp = new Date(listItem.planCompleteTime).getTime();
              let day = (completeTimeStmp - startTimeStmp) / oneDayTimes;
              day = parseInt(day) < 0 ? 0 : parseInt(day);
              listItem.exceedDate = parseInt(day);
            } else {
              let day = (todayTimeStmp - startTimeStmp) / oneDayTimes;
              day = parseInt(day) < 0 ? 0 : parseInt(day);
              listItem.exceedDate = day;
            }
          }

          listItem.color = this.data.colors[parseInt(index % this.data.colors.length)];
          return listItem;
        });
      })

      this.setData({
        contractList: data,
        receiptPlanGroup: receiptPlanGroup,
        receiptPlanList: receiptPlanGroup[0]
      })

    })
  },

  //切换展示的合同列表
  changeContract(event) {
    let current = event.detail.current;
    this.setData({
      receiptPlanList: this.data.receiptPlanGroup[current]
    })
  },

  //去支付
  toPay(event) {
    let { receiptplanid, salecontractid, canpay } = event.currentTarget.dataset;

    if (!canpay) {
      return;
    }

    wx.navigateTo({
      url: `/pages/contractPay/contractPay?receiptPlanId=${receiptplanid}&saleContractId=${salecontractid}`
    })
  },

  //去支付详情
  toPayDetail(event){
    let { receiptplanid, salecontractid} = event.currentTarget.dataset;

    wx.navigateTo({
      url: `/pages/leasePayDetail/leasePayDetail?receiptPlanId=${receiptplanid}&saleContractId=${salecontractid}`
    })
  }
})