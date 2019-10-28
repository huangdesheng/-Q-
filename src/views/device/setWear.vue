<template>
  <div class="page">
    <div class="page-bd">
      <div class="habit commom">
        <h2>您的佩戴习惯</h2>
        <van-radio-group v-model="wear" class="flex j-c-s-b">
          <van-radio name="0" checked-color="#84CE09">左手</van-radio>
          <van-radio name="1" checked-color="#84CE09">右手</van-radio>
        </van-radio-group>
      </div>
      <div class="way commom">
        <h2>手环显示方式</h2>
        <van-radio-group v-model="screen" class="flex j-c-s-b">
          <van-radio name="0" checked-color="#84CE09">横屏</van-radio>
          <van-radio name="1" checked-color="#84CE09">竖屏</van-radio>
        </van-radio-group>
      </div>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;" @click="setWear">
        <van-button type="info" size="large" class="no-radius">确认</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { bytesArrayToBase64 } from "@/utils/arrayToBase64";
import { mapState } from "vuex";
export default {
  name: "alarmClock",
  data() {
    return {
      wear: `${this.$route.query.wear}`,
      screen: `${this.$route.query.screen}`,
      deviceId: ""
    };
  },
  computed: {
    ...mapState("user", {
      openId: state => state.info.openId,
      name: state => state.info.name,
      photo: state => state.info.photo,
      totalStarCount: state => state.info.totalStarCount,
      id: state => state.info.id,
      studentId: state => state.info.studentId,
      roleType: state => state.info.roleType,
      isOpen: state => state.info.isOpen
    })
  },
  methods: {
    async setWear() {
      let n = `0x0${this.screen}`;
      let setScreen = [0x23, 0x03, 0x01, 0x08, n, 0x00];
      this.sendDataToWXDevice(this.deviceId, bytesArrayToBase64(setScreen));
    },

    async contain() {
      let res = await service.setMannerWear({
        wear: this.wear,
        screen: this.screen,
        deviceId: this.deviceId,
        studentId: this.studentId
      });
      console.log(res);
      if (res.errorCode === 0) {
        this.$toast(res.data);
        this.$router.push({
          path: "/device/studentList"
        });
      } else {
        this.$dialog({
          message: res.errorMessage
        });
      }
    },

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
      //   this.onReceiveDataFromWXDevice();
    },
    // 初始化设备库
    openWXDeviceLib() {
      WeixinJSBridge.invoke("openWXDeviceLib", { connType: "blue" }, res => {
        if (res.err_msg === "openWXDeviceLib:ok") {
          //使用前请先打开手机蓝牙
          if (res.bluetoothState === "off") {
            this.bluetooth = false;
            this.$dialog({ message: "使用前请先打开手机蓝牙" });
          }
          //用户没有授权微信使用蓝牙功能
          if (res.bluetoothState === "unauthorized") {
            this.bluetooth = false;
            this.$dialog({ message: "请授权微信蓝牙功能并打开蓝牙" });
          }
          //蓝牙已打开
          if (res.bluetoothState === "on") {
            this.bluetooth = true;
          }
        } else {
          this.bluetooth = false; //微信蓝牙打开失败
          this.$dialog({ message: "微信蓝牙打开失败" });
        }
      });
    },

    //设备连接状态变化
    onWXDeviceStateChange() {
      WeixinJSBridge.on("onWXDeviceStateChange", res => {
        console.log(res);
        console.log("设备连接状态变化");
        let { state } = res;
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
    },

    // 获取设备信息
    getWXDeviceInfos() {
      WeixinJSBridge.invoke("getWXDeviceInfos", {}, res => {
        if (res.err_msg === "getWXDeviceInfos:ok") {
          this.state = res.deviceInfos[0].state;
          //绑定设备总数量
          if (
            res.deviceInfos.length &&
            res.deviceInfos[0].state === "connected"
          ) {
            this.state = res.deviceInfos[0].state;
            this.deviceId = res.deviceInfos[0].deviceId;
          } else {
            this.list = [];
            this.deviceId = "";
          }
        }
      });
    },

    //断开设备连接
    disconnectWXDevice() {
      WeixinJSBridge.invoke(
        "disconnectWXDevice",
        { deviceId: this.deviceId, connType: "blue" },
        res => {
          if (res.err_msg === "disConnectWXDevice:ok") {
            this.deviceId = "";
            this.$dialog({ message: "使用前请先打开手机蓝牙" });
          }
        }
      );
    },

    //手机蓝牙状态改变事件
    onWXDeviceBluetoothStateChange() {
      WeixinJSBridge.on("onWXDeviceBluetoothStateChange", res => {
        let { state } = res;
        if (state === "on") {
          this.$toast(`蓝牙打开`);
          this.bluetooth = true;
        } else {
          this.$toast(`蓝牙已关闭`);
          this.bluetooth = false;
          this.disconnectWXDevice();
        }
      });
    },
    // 发送数据给设备
    sendDataToWXDevice(deviceId, base64Data = "") {
      console.log("send data");
      WeixinJSBridge.invoke(
        "sendDataToWXDevice",
        {
          deviceId,
          connType: "blue",
          base64Data
        },
        res => {
          if (res.err_msg === "sendDataToWXDevice:ok") {
            this.$toast(`数据已发送`);
            this.contain();
          } else {
            this.$toast(`数据发送失败`);
          }
        }
      );
    }
  },
  mounted() {
    console.log(this.$route.query.wear);
    console.log(this.$route.query.screen);
    this.init();
  }
};
</script>
<style lang="less" scoped>
.commom {
  background: #fff;
  padding: 50px 30px;
  h2 {
    font-size: 40px;
    font-weight: 500;
    padding: 10px 0px 50px;
  }
  .van-radio-group {
    padding: 0 80px;
  }
}

.way {
  margin-top: 20px;
}
</style>