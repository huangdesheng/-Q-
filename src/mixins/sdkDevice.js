export default {
  data() {
    return {
      deviceId: "",
      state: "disconnected",
    }
  },

  methods: {
    init() {
      // 初始化蓝牙状态
      this.openWXDeviceLib();
      // 设备连接状态
      this.getWXDeviceInfos();
      // 手机蓝牙监听开启事件
      this.onWXDeviceBluetoothStateChange();
      // 设备连接状态
      this.onWXDeviceStateChange();
      // 接收到设备数据
      this.onReceiveDataFromWXDevice();
    },
    // 初始化设备库
    openWXDeviceLib() {
      wx.ready(() => {
        WeixinJSBridge.invoke("openWXDeviceLib", {
          connType: "blue"
        }, res => {

          if (res.err_msg === "openWXDeviceLib:ok") {
            //使用前请先打开手机蓝牙
            if (res.bluetoothState === "off") {
              this.bluetooth = false;
              this.$dialog({
                message: "使用前请先打开手机蓝牙"
              });
            }
            //用户没有授权微信使用蓝牙功能
            if (res.bluetoothState === "unauthorized") {
              this.bluetooth = false;
              this.$dialog({
                message: "请授权微信蓝牙功能并打开蓝牙"
              });
            }
            //蓝牙已打开
            if (res.bluetoothState === "on") {
              this.bluetooth = true;
            }
          } else {
            this.bluetooth = false; //微信蓝牙打开失败
            this.$dialog({
              message: "微信蓝牙打开失败"
            });
          }
        });
      });
    },

    //设备连接状态变化
    onWXDeviceStateChange() {
      wx.ready(() => {
        WeixinJSBridge.on("onWXDeviceStateChange", res => {
          console.log(res);
          console.log("设备连接状态变化");
          let {
            state
          } = res;
          if (state === "connecting") {
            console.log("已连接");
            this.$dialog.close();
          } else if (state === "connected") {
            console.log("连接断开");
          } else {
            console.log("连接断开");
          }
          this.getWXDeviceInfos();
        });
      });
    },

    // 获取设备信息
    getWXDeviceInfos() {
      wx.ready(() => {
        WeixinJSBridge.invoke("getWXDeviceInfos", {}, res => {
          console.log(res)
          if (res.err_msg === "getWXDeviceInfos:ok") {

            //绑定设备总数量
            if (
              res.deviceInfos.length
            ) {
              this.state = res.deviceInfos[0].state;
              this.deviceId = res.deviceInfos[0].deviceId;
              console.log(this.deviceId);
            } else {
              this.list = [];
              this.deviceId = "";
            }
          }
        });
      });
    },

    //断开设备连接
    disconnectWXDevice() {
      wx.ready(() => {
        WeixinJSBridge.invoke(
          "disconnectWXDevice", {
            deviceId: this.deviceId,
            connType: "blue"
          },
          res => {
            if (res.err_msg === "disConnectWXDevice:ok") {
              this.deviceId = "";
              // this.$dialog({
              //   message: "使用前请先打开手机蓝牙"
              // });
            }
          }
        );
      });
    },

    //手机蓝牙状态改变事件
    onWXDeviceBluetoothStateChange() {
      wx.ready(() => {
        WeixinJSBridge.on("onWXDeviceBluetoothStateChange", res => {
          let {
            state
          } = res;
          if (state === "on") {
            this.$toast(`蓝牙打开`);
            this.bluetooth = true;
          } else {
            this.$toast(`蓝牙已关闭`);
            this.bluetooth = false;
            this.disconnectWXDevice();
          }
        });
      });
    },
  }
}
