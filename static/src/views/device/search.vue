<template>
  <div class="page">
    <div class="page-bd">
      <!-- popup -->
      <van-popup v-model="popupShow" position="bottom">
        <van-picker
          :columns="studentList"
          show-toolbar
          title="选择要绑定的学生"
          value-key="studentName"
          @cancel="popupShow = false"
          @confirm="handleClassConfirm"
        ></van-picker>
      </van-popup>
      <!-- popup -->
      <!--  扫描的设备列表 -->
      <div class="cells-title a-i-c">
        <span>设备列表</span>
        <van-loading type="spinner" size="20px" v-if="loading"></van-loading>
      </div>
      <template v-if="devices.length">
        <div class="cells mb-20">
          <div class="cell min-h120" v-for="item in devices" :key="item.deviceId">
            <div class="cell-hd">
              <img src="@/assets/avatar-bg@2x.png" width="40" height="40" />
            </div>
            <div class="cell-bd">
              <p class="text-right">
                <van-button type="info" size="small" @click="handleBindDevice(item)">绑定设备</van-button>
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="danger" size="large" class="no-radius" @click="startScanWXDevice">扫描设备</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
export default {
  name: "deviceSearch",
  data() {
    return {
      popupShow: false,
      toast: null,
      loading: false,
      devices: [], //发现的设备列表数组
      bluetooth: false, //是否打开蓝牙
      deviceId: null, //设备ID
      openId: this.$store.state.user.info.openId,
      studentId: this.$store.state.user.info.studentId,
      studentList: []
    };
  },
  methods: {
    handleBindDevice(params) {
      //设备ID
      this.deviceId = params.deviceId;
      this.popupShow = true;
    },
    handleClassConfirm(value, index) {
      let { isBindBracelet } = value;
      if (isBindBracelet == 0) {
        this.getWXDeviceTicket(1, this.deviceId);
      } else {
        this.$toast(`该学生已经绑定了设备`);
      }
    },
    //初始化设备库（只支持蓝牙设备）
    openWXDeviceLib() {
      WeixinJSBridge.invoke("openWXDeviceLib", { connType: "blue" }, res => {
        console.log("openWXDeviceLib");
        console.log(res);
        if (res.err_msg === "openWXDeviceLib:ok") {
          //使用前请先打开手机蓝牙
          if (res.bluetoothState === "off") {
            this.bluetooth = false;
            console.log("使用前请先打开手机蓝牙");
          }
          //用户没有授权微信使用蓝牙功能
          if (res.bluetoothState === "unauthorized") {
            this.bluetooth = false;
            console.log("请授权微信蓝牙功能并打开蓝牙");
          }
          //蓝牙已打开
          if (res.bluetoothState === "on") {
            this.bluetooth = true;
          }
        } else {
          this.bluetooth = false; //微信蓝牙打开失败
          console.log("微信蓝牙打开失败");
        }
      });
    },
    //关闭设备库
    closeWXDeviceLib() {
      WeixinJSBridge.invoke("closeWXDeviceLib", { connType: "blue" }, res => {
        if (res.err_msg === "closeWXDeviceLib:ok") {
          console.log("关闭设备库成功");
        } else {
          console.log("关闭设备库失败");
        }
      });
    },
    //扫描设备（获取周围所有的设备列表，无论绑定还是未被绑定的设备都会扫描到）
    startScanWXDevice() {
      //每次扫描前先调用closeWXDeviceLib关闭设备库
      this.closeWXDeviceLib();
      //再调用openWXDeviceLib打开设备库
      this.openWXDeviceLib();
      //检查用户是否打开了手机蓝牙
      if (this.bluetooth) {
        this.list = []; //清空列表
        this.loading = true;
        WeixinJSBridge.invoke(
          "startScanWXDevice",
          { connType: "blue", btVersion: "ble" },
          res => {
            if (res.err_msg === "startScanWXDevice:ok") {
              console.log(res);
              console.log("扫描设备");
            }
          }
        );
      } else {
        this.$toast(`请先打开手机蓝牙在进行扫描`);
      }
    },
    //扫描到某个设备
    onScanWXDeviceResult() {
      WeixinJSBridge.on("onScanWXDeviceResult", res => {
        console.log("扫描到某个设备");
        console.log(res);
        if (res.isCompleted == 0) {
          for (let i = 0; i < res.devices.length; i++) {
            let deviceId = res.devices[i].deviceId;
            this.devices.push({ deviceId });
          }
        }
      });
    },
    //用户绑定设备
    //先获取操作凭证（type为1表示绑定，2表示解除绑定）
    async getWXDeviceTicket(type, deviceId) {
      let obj = {
        deviceId,
        type,
        connType: "blue"
      };
      WeixinJSBridge.invoke("getWXDeviceTicket", obj, res => {
        //操作凭证
        let { ticket } = res;
        console.log(ticket);
        console.log("操作凭证");
        if (res.err_msg === "getWXDeviceTicket:ok") {
          if (type === 1) {
            //绑定之前先进行设备状态查询
            service.getDeviceStatus({ deviceId }).then(res => {
              if (res.errorCode === 0) {
                console.log(res);
                console.log("绑定之前先进行设备状态查询");
                let status = res.data.status;
                if (status === 0) {
                  this.$toast("该设备还未授权");
                } else if (status === 1) {
                  //绑定设备
                  let params = {
                    studentId: this.studentId,
                    openId: this.openId,
                    deviceId,
                    ticket
                  };
                  service.bindDevice(params).then(res => {
                    if (res.errorCode === 0) {
                      this.popupShow = false;
                      let { isBindBracelet } = res.data;
                      let _cookie = Cookies.getJSON("info");
                      this.$dialog
                        .alert({
                          title: "提示",
                          message: "手环设备绑定成功"
                        })
                        .then(() => {
                          this.$router.push({
                            path: "/device"
                          });
                        });
                      //当绑定成功后更新更新cookie值
                      let obj = Object.assign({}, _cookie, { isBindBracelet });
                      this.$store.dispatch("user/setInfo", obj).then(data => {
                        if (data.success === "ok") {
                        }
                      });
                    } else {
                      this.$toast(`设备绑定失败`);
                    }
                  });
                } else if (status === 2) {
                  this.$toast("设备已经被用户绑定了");
                }
              }
            });
          }
        }
      });
    },
    //微信客户端设备绑定状态改变事件
    onWXDeviceBindStateChange() {
      WeixinJSBridge.on("onWXDeviceBindStateChange", res => {
        console.log(res);
        console.log("微信客户端设备绑定状态改变事件");
      });
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
        }
      });
    },
    //初始化事件
    init() {
      this.openWXDeviceLib();
      this.onWXDeviceBluetoothStateChange();
      this.onScanWXDeviceResult();
    },
    //获取关联的学生
    async getOpenIdRelationStudent(params = {}) {
      let res = await service.getOpenIdRelationStudent(params);
      if (res.errorCode === 0) {
        this.studentList = res.data;
      }
    }
  },
  mounted() {
    this.init();
    this.getOpenIdRelationStudent({ openId: this.openId });
  },
  deactivated() {
    this.loading = false;
    this.devices = [];
    this.closeWXDeviceLib();
    console.log("deactivated");
  }
};
</script>
<style lang="less" scoped>
</style>