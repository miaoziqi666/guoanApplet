const DEGUG = false;

let CONFIG = {
  //接口地址
  DEFAULT_API_URL: "https://www.guoanfamily.com/agenthouseCutomer/",
  OPENWEIXIN_API_URL: "https://www.guoanfamily.com/openweixin/",
  USER_API_URL: "https://www.guoanfamily.com/user/",
  COMMON_API_URL: "https://www.guoanfamily.com/common/",

  //图片地址
  IMAGE_PATH: "https://img.guoanfamily.com/",
  //默认图地址
  Default_PATH: "https://m.zufang.guoanfamily.com/static/img/noneImg1.9a6fefe.png?imageView2/0/w/750/h/415",
  //支付通知地址
  //订金
  PAY_NOTIFY_URL_DEPOSIT: "http://act.guoanfamily.com/common/wxPay/wxOrderNotify/8884",
  //租金
  PAY_NOTIFY_URL_RENT: "http://act.guoanfamily.com/common/wxPay/wxOrderNotify/8885",

  //小程序APPID
  APP_ID: "wxc44e124ba5d0d053"
}

if (DEGUG){
  Object.assign(CONFIG, {
    //接口地址
    DEFAULT_API_URL: "https://rt.guoanfamily.com/agenthouseCutomer/",
    USER_API_URL: "https://www.guoanfamily.com/userTest/",
    //支付通知地址
    //订金
    PAY_NOTIFY_URL_DEPOSIT: "http://act.guoanfamily.com/common/wxPay/wxOrderNotify/8904",
    //租金
    PAY_NOTIFY_URL_RENT: "http://act.guoanfamily.com/common/wxPay/wxOrderNotify/8905"
  })
}


module.exports = CONFIG;