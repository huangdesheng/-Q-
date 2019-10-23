<template>
  <div>
    <div class="cells-title studentList">选择需要绑定手环的小孩</div>
    <div class="list">
      <div class="flex title">
        <span class="tp"></span>
        <span>孩子列表</span>
      </div>
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell
            v-for="(item,index) in studentList"
            :key="index"
            :title="item.studentName"
            clickable
            @click="selectChild(item)"
          >
            <van-radio
              :name="item.studentId"
              checked-color="#a2e14e"
              v-if="item.isBindBracelet"
              disabled
              style="display:none"
            />
            <van-radio :name="item.studentId" checked-color="#a2e14e" v-else />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
    <button class="connectStatus" v-if="state == 'connected'">已连接</button>
    <button class="connectStatus" v-else-if="state == 'disconnected'">未连接</button>
    <button class="connectStatus" v-else-if="state == 'connecting'">连接中</button>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" @click="handleBang">确认绑定</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { bytesArrayToBase64 } from "@/utils/arrayToBase64";
import Cookies from "js-cookie";
import { mapState } from "vuex";
import sdkDevice from "@/mixins/sdkDevice";
// import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      radio: "1",
      studentList: [],
      isBindBracelet: "",
      itemObj: {}
    };
  },

  mounted() {
    // 获取关联学生
    this.queryOpenStudentList();
    // 初始化设备库
    this.openWXDeviceLib();
    // 获取设备信息
    this.getWXDeviceInfos();
    //设备连接状态变化
    this.onWXDeviceStateChange();
    //手机蓝牙状态改变事件;
    this.onWXDeviceBluetoothStateChange();
  },

  mixins: [sdkDevice],
  methods: {
    // 初始化设备库
    // openWXDeviceLib() {
    //   WeixinJSBridge.invoke("openWXDeviceLib", { connType: "blue" }, res => {
    //     if (res.err_msg === "openWXDeviceLib:ok") {
    //       //使用前请先打开手机蓝牙
    //       if (res.bluetoothState === "off") {
    //         this.bluetooth = false;
    //         this.$dialog({ message: "使用前请先打开手机蓝牙" });
    //       }
    //       //用户没有授权微信使用蓝牙功能
    //       if (res.bluetoothState === "unauthorized") {
    //         this.bluetooth = false;
    //         this.$dialog({ message: "请授权微信蓝牙功能并打开蓝牙" });
    //       }
    //       //蓝牙已打开
    //       if (res.bluetoothState === "on") {
    //         this.bluetooth = true;
    //       }
    //     } else {
    //       this.bluetooth = false; //微信蓝牙打开失败
    //       this.$dialog({ message: "微信蓝牙打开失败" });
    //     }
    //   });
    // },

    //设备连接状态变化
    // onWXDeviceStateChange() {
    //   WeixinJSBridge.on("onWXDeviceStateChange", res => {
    //     console.log(res);
    //     console.log("设备连接状态变化");
    //     let { state } = res;
    //     if (state === "connecting") {
    //       console.log("已连接");
    //       this.$dialog.close();
    //     } else if (state === "connected") {
    //       console.log("连接断开");
    //     } else {
    //       console.log("连接断开");
    //     }
    //     this.getWXDeviceInfos();
    //   });
    // },

    // 获取设备信息
    // getWXDeviceInfos() {
    //   WeixinJSBridge.invoke("getWXDeviceInfos", {}, res => {
    //     if (res.err_msg === "getWXDeviceInfos:ok") {
    //       this.state = res.deviceInfos[0].state;
    //       //绑定设备总数量
    //       if (
    //         res.deviceInfos.length &&
    //         res.deviceInfos[0].state === "connected"
    //       ) {
    //         this.state = res.deviceInfos[0].state;
    //         this.deviceId = res.deviceInfos[0].deviceId;
    //       } else {
    //         this.list = [];
    //         this.deviceId = "";
    //       }
    //     }
    //   });
    // },

    //断开设备连接
    // disconnectWXDevice() {
    //   WeixinJSBridge.invoke(
    //     "disconnectWXDevice",
    //     { deviceId: this.deviceId, connType: "blue" },
    //     res => {
    //       if (res.err_msg === "disConnectWXDevice:ok") {
    //         this.deviceId = "";
    //         this.$dialog({ message: "使用前请先打开手机蓝牙" });
    //       }
    //     }
    //   );
    // },

    //手机蓝牙状态改变事件
    // onWXDeviceBluetoothStateChange() {
    //   WeixinJSBridge.on("onWXDeviceBluetoothStateChange", res => {
    //     let { state } = res;
    //     if (state === "on") {
    //       this.$toast(`蓝牙打开`);
    //       this.bluetooth = true;
    //     } else {
    //       this.$toast(`蓝牙已关闭`);
    //       this.bluetooth = false;
    //       this.disconnectWXDevice();
    //     }
    //   });
    // },

    // 获取关联学生
    async queryOpenStudentList() {
      let res = await service.queryOpenStudentList({
        openId: this.$store.state.user.info.openId
      });
      if (res.errorCode === 0) {
        this.studentList = res.data;
        this.isBindBracelet = res.data[0].isBindBracelet;
        this.radio = res.data[0].studentId;
        this.itemObj = res.data[0];
      }
    },

    // 获取选中孩子的关联状态
    async selectChild(item) {
      this.radio = item.studentId;
      this.isBindBracelet = item.isBindBracelet;
      this.itemObj = item;
    },

    // 确认绑定
    async handleBang() {
      console.log(this.itemObj);
      let data = {
        deviceId: this.deviceId,
        studentId: this.radio
      };

      if (this.deviceId === "") {
        this.$toast(`暂无搜索到手环设备`);
        return false;
      }
      // if (this.isBindBracelet === 1) {
      //   this.$toast(`该孩子已经绑定手环`);
      //   return false;
      // }
      let res = await service.bindStudent(data);
      if (res.errorCode === 0) {
        this.$router.push({
          path: "/device/studentList"
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.studentList {
  color: #93db21;
  font-size: 30px;
}

.list {
  margin: 0 4vw;
  background: #fff;

  .title {
    margin: 0 3vw;
    align-items: center;
    padding: 3vw 0vw;
    .tp {
      height: 30px;
      width: 6px;
      background: #a2e14e;
      margin-right: 10px;
    }
  }
}

.connectStatus {
  position: fixed;
  right: 0;
  top: 500px;
  width: 200px;
  height: 70px;
  border: none;
  outline: none;
  background: red;
  color: #fff;
  border-radius: 20px 0 0 20px;
}
</style>