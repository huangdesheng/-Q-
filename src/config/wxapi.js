import service from "@/api";

export default {
  //初始化
  wxRegister(callback) {
    let url = window.location.href.split("#")[0]; //获取当前url,传递到服务端进行签名
    service.sign({
      url
    }).then(res => {
      console.log(res)

      if (res.appid && res.nonceStr) {
        wx.config({
          beta: true, // 注入wx.invoke方法来调用还未开放的jsapi方法
          debug: false, // 开启调试模式,开发时可以开启
          appId: res.appid, // 必填，公众号的唯一标识
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.nonceStr, // 必填，生成签名的随机串
          signature: res.signature, // 必填，签名
          jsApiList: [
            "scanQRCode", //微信扫一扫
            "chooseImage", //拍照或从手机相册中选图接口
            "previewImage", //预览图片
            "uploadImage", //上传图片
            "downloadImage", //下载图片
            "getLocalImgData", //获取本地图片
            "onMenuShareAppMessage",
            "hideMenuItems", //批量隐藏功能按钮
            "hideOptionMenu",
            "showOptionMenu",
            "chooseWXPay", //发起一个微信支付
            "closeWindow", //关闭当前网页窗口
            "openWXDeviceLib", //初始化设备库（只支持蓝牙设备）
            "closeWXDeviceLib", //关闭设备库（只支持蓝牙设备）
            "getWXDeviceInfos", //获取设备信息（获取当前用户已绑定的蓝牙设备列表）
            "sendDataToWXDevice", //发送数据给设备
            "startScanWXDevice", //扫描设备（获取周围所有的设备列表，无论绑定还是未被绑定的设备都会扫描到）
            "stopScanWXDevice", //停止扫描设备
            "connectWXDevice", //连接设备
            "disconnectWXDevice", //断开设备连接
            "getWXDeviceTicket", //获取操作凭证
            //下面是监听事件：
            "onWXDeviceBindStateChange", //微信客户端设备绑定状态被改变时触发此事件
            "onWXDeviceStateChange", //监听连接状态，可以监听连接中、连接上、连接断开
            "onReceiveDataFromWXDevice", //接收到来自设备的数据时触发
            "onScanWXDeviceResult", //扫描到某个设备时触发
            "onWXDeviceBluetoothStateChange" //手机蓝牙打开或关闭时触发
          ] // 必填，需要使用的JS接口列表
        });
      }
    });
    wx.ready(() => {
      //要隐藏的菜单项
      wx.hideMenuItems({
        menuList: [
          "menuItem:share:timeline",
          "menuItem:share:qq",
          "menuItem:share:weiboApp",
          "menuItem:share:QZone",
          "menuItem:favorite"
        ]
      });
      if (callback) {
        callback()
      }
    });
    wx.error(error => {
      console.log("wx.error错误");
      console.log(error);
    });
  },
  //隐藏右上角菜单接口
  wxHideOptionMenu() {
    wx.hideOptionMenu();
  },
  //显示右上角菜单接口
  wxShowOptionMenu() {
    wx.showOptionMenu();
  },
  //微信分享到朋友圈
  wxShareTimeline(option) {
    wx.onMenuShareTimeline({
      title: option.title, // 分享标题
      link: option.link, // 分享链接
      imgUrl: "http://h5.ztuo.cn/img/shareimg.jpg", // 分享图标   
      success: () => {
        option.success();
      },
      cancel: () => {
        option.error();
      }
    });
  },
  //微信分享给朋友
  wxShareAppMessage(option) {
    wx.onMenuShareAppMessage({
      title: option.title, // 分享标题
      desc: option.desc, // 分享描述      
      link: option.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: "http://h5.ztuo.cn/img/shareimg.jpg", // 分享图标  
      success: () => {
        option.success();
      },
      cancel: () => {
        option.error();
      }
    });
  }
}
