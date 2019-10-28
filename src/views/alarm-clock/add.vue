<template>
  <div>
    <div>
      <van-datetime-picker
        v-model="currentTime"
        type="time"
        :min-hour="0"
        :max-hour="23"
        :show-toolbar="false"
        @change="onChange"
      />
    </div>
    <div class="remarks">
      <van-cell-group>
        <van-field v-model="value" label="备注" placeholder="请输入备注" id="remark" />
      </van-cell-group>
    </div>
    <div>
      <van-checkbox-group v-model="result" @change="selectWeek">
        <van-cell-group>
          <van-cell
            v-for="(item, index) in list"
            clickable
            :key="index"
            :title="`${item.week}`"
            @click="toggle(index)"
          >
            <van-checkbox :name="index" ref="checkboxes" slot="right-icon" checked-color="#A2DE5A" />
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <div class="flex">
          <van-button size="large" type="danger" class="no-radius">移除</van-button>
          <van-button size="large" type="info" class="no-radius" @click="submit">保存</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { bytesArrayToBase64 } from "@/utils/arrayToBase64";
import { mapState } from "vuex";
export default {
  data() {
    return {
      currentTime: "12:00",
      value: "闹钟",
      result: [],
      status: 1,
      len: 0,
      clock_id: 0,
      hh: 0,
      ff: 0,
      obj: {},
      weekArr: [],
      list: [
        {
          week: "星期天"
        },
        {
          week: "星期一"
        },
        {
          week: "星期二"
        },
        {
          week: "星期三"
        },
        {
          week: "星期四"
        },
        {
          week: "星期五"
        },
        {
          week: "星期六"
        }
      ]
    };
  },
  mounted() {
    let getDate = new Date();
    let hour =
      getDate.getHours() > 9 ? getDate.getHours() : `0${getDate.getHours()}`;
    let minutes =
      getDate.getMinutes() > 9
        ? getDate.getMinutes()
        : `0${getDate.getMinutes()}`;
    this.currentTime = `${hour}:${minutes}`;
    this.hh = hour;
    this.ff = minutes;
    this.init();
    if (this.$route.query.clockId) {
      this.clock_id = this.$route.query.clockId;
      this.getAlarmId(this.$route.query.clockId);
    }
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
    onChange(e) {
      this.hh = e.getValues()[0];
      this.ff = e.getValues()[1];
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    selectWeek() {
      console.log(this.result);
    },
    // 查询闹钟详细
    async getAlarmId(clockId) {
      let res = await service.getAlarmId({
        clockId,
        studentId: this.studentId
      });
      if (res.errorCode === 0) {
        this.obj = res.data;
        this.currentTime = res.data.time;
        this.value = res.data.remark;
        this.hh = parseInt(this.currentTime.slice(0, 2));
        this.ff = parseInt(this.currentTime.slice(3, 5));
        let bitMap = String(res.data.bitMap).split("");
        let arr = String(res.data.time).split("");
        bitMap.map((item, index) => {
          console.log(item, index);
          if (item === "1") {
            this.result.push(index);
          }
        });
      }
    },

    submit() {
      let arr = [];
      for (let i = 0; i < 7; i++) {
        arr.push(this.result.indexOf(i) >= 0 ? 1 : 0);
      }
      this.weekArr = arr;
      console.log(arr.join(""));
      let n = `0x${parseInt(parseInt(arr.join("")), 2).toString(16)}`;
      let hh = `0x${this.hh}`;
      let ff = `0x${this.ff}`;
      let num = `0x${this.$route.query.index}`;

      const setAlarmClock = [
        0x23,
        0x07,
        0x01,
        0x07,
        num,
        hh,
        ff,
        n,
        0x01,
        0x00
      ];
      this.sendDataToWXDevice(this.deviceId, bytesArrayToBase64(setAlarmClock));
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
      this.onReceiveDataFromWXDevice();
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
            this.addOrUpdateAlarmClock();
          } else {
            this.$toast(`数据发送失败`);
          }
        }
      );
    },
    onReceiveDataFromWXDevice() {
      WeixinJSBridge.on("onReceiveDataFromWXDevice", res => {
        console.log("接收数据onReceiveDataFromWXDevice");
        // let obj = res.data[0];

        service.decoder({ content: res.base64Data }).then(res => {
          if (res.errorCode === 0) {
            let obj = res.data[0];
            console.log(obj);
          }
        });
      });
    },
    async addOrUpdateAlarmClock() {
      let len = parseInt(this.$route.query.index);
      let data = {
        id: len,
        studentId: this.studentId,
        remark: this.value,
        status: 1,
        time: `${this.hh}:${this.ff}`,
        bitMap: this.weekArr.join("")
      };
      if (this.clock_id) {
        data.clock_id = this.clock_id;
      }
      let res = await service.addOrUpdateAlarmClock(data);
      console.log(res);
      if (res.errorCode === 0) {
        this.$router.go(-1);
      } else {
        this.$toast(res.errorMessage);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.remarks {
  margin: 10px 0;
}
</style>