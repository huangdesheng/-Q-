import service from "@/api";
import {
  bytesArrayToBase64
} from "@/utils/arrayToBase64";
export default {
  data() {
    return {
      showName: false,
      tip: "数据导入中,请勿断开设备或关闭蓝牙",
      currentRate: 0,
      text: 0 + "%",
      speed: 1,

      // 获取活跃度目录条数
      deviceArr: [],
      deviceIndex: 0,
      delBag: [],
      utcValue: "",
      utc: "1",
      delBagIndex: 0,
      // 睡眠部分
      sleepList: [],
      sleepIndex: 0,
      sleepUTC: [],
      sleepUTCIndex: 0,
      utcSleep: 1,

      timestamp: ""
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

    onWXDeviceStateChange() {
      wx.ready(() => {
        WeixinJSBridge.on("onWXDeviceStateChange", res => {
          console.log(res);
          console.log("设备连接状态变化");
          let {
            state
          } = res;
          this.state = res.state;
          if (state === "connecting") {
            console.log("设备连接中");
            this.showName = false;
            // this.$dialog.close();
          } else if (state === "connected") {
            console.log("已连接");
            this.getWXDeviceInfos();
            this.$dialog.close();
          } else {
            this.showName = false;
            console.log("连接断开");
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
              this.$dialog({
                message: "使用前请先打开手机蓝牙"
              });
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



    //解析数据包
    async parsePackets(params = {}) {
      let res = await service.parsePackets(params);
      if (res.errorCode === 0) {
        console.log("解析数据包");
      }
    },
    async parsePacketActive(params = {}) {
      let res = await service.parsePacketActive(params);
      if (res.errorCode === 0) {
        console.log("解析数据包");
      }
    },
    async parsePacketSleep(params = {}) {
      let res = await service.parsePacketSleep(params);
      if (res.errorCode === 0) {
        console.log("睡眠解析数据包");
      }
    },

    // 设置Q星值
    async getStarTotal() {
      var now = new Date();
      var year = now.getFullYear(); //年
      var month = now.getMonth() + 1; //月
      var day = now.getDate(); //日
      let date = `${year}-${month}-${day}`;
      let data = {
        studentId: this.studentId
      };
      let res = await service.queryStar(data);
      console.log(res);
      if (res.errorCode === 0) {
        this.setStart(res.data);
      }
    },

    setStart(value) {
      let num = parseInt(value);
      let start;
      let end;
      let data = num.toString(16);
      if (data.length === 1) {
        start = `0x00`;
        end = `0x0${data}`;
      } else if (data.length === 2) {
        start = `0x00`;
        end = `0x${data}`;
      } else if (data.length === 3) {
        start = `0x0${data.slice(0, 1)}`;
        end = `0x${data.slice(1, 3)}`;
      } else {
        start = `0x${data.slice(0, 2)}`;
        end = `0x${data.slice(2, 4)}`;
      }
      let setStartVlue = [0x23, 0x04, 0x01, 0x04, start, end, 0x00];
      this.sendDataToWXDevice(this.deviceId, bytesArrayToBase64(setStartVlue));
    },
  }
}
