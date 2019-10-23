<template>
  <div class="page">
    <div class="page-bd">
      <template>
        <div class="cells mb-20">
          <div class="cell min-h120" v-for="item in list" :key="item.deviceId">
            <div class="cell-hd">
              <img src="@/assets/avatar-bg@2x.png" width="40" height="40" />
            </div>
            <div class="cell-bd text-right">
              <span style="color:#07c160;" v-if="item.state == 'connected'">已连接</span>
              <span style="color:#f44;" v-else-if="item.state == 'disconnected'">连接断开</span>
              <span style="color:#1989fa;" v-else-if="item.state == 'connecting'">连接中...</span>
            </div>
          </div>
        </div>
        <div class="cells">
          <div class="cell min-h120" v-for="(item,index) in map" :key="item.index">
            <div class="cell-bd">
              <input class="input text-left" placeholder="请输入base64转码后的字符串" v-model.trim="item.key" />
            </div>
            <div class="cell-ft">
              <van-button type="danger" size="small" @click="del(index)" v-if="map.length > 1">删除</van-button>
            </div>
          </div>
        </div>
        <!-- <p class="text-right">
          <van-button type="warning" size="normal" @click="run">发送</van-button>
        </p>-->
      </template>
      <div class="steps">
        <!-- <p>1.确认手环处于工作状态</p>
        <p>2.进入手机设置界面，打开蓝牙。</p>
        <p>3.点击添加设备，开始扫描找到手环设备，点击绑定，稍后会提示绑定成功。</p>-->
      </div>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <div class="flex">
          <van-button type="danger" size="large" class="no-radius" @click="run">发送数据</van-button>
          <van-button size="large" class="no-radius" @click="add">添加</van-button>
        </div>
        <!-- <van-button type="danger" size="large" class="no-radius" @click="unBindDevice">手环设备解绑</van-button> -->
        <!-- <van-button type="info" size="large" class="no-radius" @click="handleAddDevice">添加设备</van-button> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import service from "@/api";
import { bytesArrayToBase64 } from "@/utils/arrayToBase64";
export default {
  name: "device",
  data() {
    return {
      base64: "",
      bluetooth: false, //是否打开蓝牙
      deviceId: null, //设备ID
      list: [], //设备列表
      map: [
        //设置手环时间
        // newFunction()
        // {
        //   // 电量
        //   key: "IwICAyQ="
        // },
        {
          // 步数
          key: "IwICBSY="
        },
        {
          // 活跃度条数
          key: "IwUC8QEAA9g="
        },
        {
          // 睡眠条数
          key: "IwMC8AHR"
        }
      ],
      deviceArr: [],
      deviceIndex: 0,
      utc: null,
      sleepList: [],
      sleepIndex: 0
    };
  },
  computed: {
    ...mapState("user", {
      openId: state => state.info.openId,
      studentId: state => state.info.studentId,
      isBindBracelet: state => state.info.isBindBracelet // 0未绑定手环 1绑定
    })
  },
  methods: {
    //循环调用
    run() {
      let deviceId = this.deviceId;
      let map = this.map;
      console.log(map);
      for (let i in map) {
        let base64Data = map[i].key; //key

        if (base64Data != "") {
          console.log(base64Data);
          this.sendDataToWXDevice(deviceId, base64Data);
        } else {
          this.$toast(`请输入base64转码后的字符串`);
        }
      }
    },
    //添加
    add() {
      this.map.push({ key: "" });
    },
    //删除
    del(index) {
      return this.map.splice(index, 1);
    },
    //数字转十六进制字符串
    numberToByt(num) {
      for (let i = 0; i < num; i++) {
        let n = `0x` + i.toString(16);
        console.log(n);
      }
    },
    handleAddDevice() {
      //if (this.studentId == 0) {
      //this.$toast("您尚未关注小孩，请先关注");
      //} else {
      this.$router.push({
        path: "/device/search"
      });
      //}
    },
    //手环设备解绑
    unBindDevice() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定要解绑设备吗？"
        })
        .then(() => {
          let obj = {
            deviceId: this.deviceId,
            type: 2, //2表示解除绑定
            connType: "blue"
          };
          WeixinJSBridge.invoke("getWXDeviceTicket", obj, res => {
            //操作凭证
            let { ticket } = res;
            if (res.err_msg === "getWXDeviceTicket:ok") {
              console.log(res);
              console.log("开始解绑");
              //开始解绑
              let params = {
                deviceId: this.deviceId,
                openId: this.openId,
                ticket
              };
              service.unBindDevice(params).then(res => {
                if (res.errorCode === 0) {
                  this.$dialog
                    .alert({
                      title: "提示",
                      message: "解除绑定成功"
                    })
                    .then(() => {
                      this.getWXDeviceInfos();
                    });
                } else {
                  console.log("解除绑定失败");
                }
              });
            }
          });
        });
    },
    connectWXDevice(params) {
      let { state, deviceId } = params;
      //如果连接设备断开，则重新连接
      if (state === "disconnected") {
        if (!this.bluetooth) {
          this.$toast(`请先打开手机蓝牙再进行连接`);
        } else {
          //连接设备
          WeixinJSBridge.invoke(
            "connectWXDevice",
            { deviceId, connType: "blue" },
            res => {
              if (res.err_msg === "connectWXDevice:ok") {
                console.log("connectWXDevice");
                console.log(deviceId);
                this.getWXDeviceInfos();
              }
            }
          );
        }
      }
    },
    //断开设备连接
    disconnectWXDevice() {
      WeixinJSBridge.invoke(
        "disconnectWXDevice",
        { deviceId: this.deviceId, connType: "blue" },
        res => {
          console.log(res);
          console.log("断开设备连接1");
          if (res.err_msg === "disConnectWXDevice:ok") {
            console.log(this.deviceId);
            console.log("断开设备连接2");
          }
        }
      );
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
    //取得微信设备信息
    //只有绑定成功后才有list列表数据返回
    getWXDeviceInfos() {
      WeixinJSBridge.invoke("getWXDeviceInfos", {}, res => {
        console.log(res);
        console.log("res设备deviceId");
        if (res.err_msg === "getWXDeviceInfos:ok") {
          //绑定设备总数量
          if (res.deviceInfos.length) {
            this.list = res.deviceInfos;
            this.deviceId = res.deviceInfos[0].deviceId;
          } else {
            this.list = [];
          }
        }
      });
    },
    //发送数据给设备 发送的数据需要经过base64编码
    sendDataToWXDevice(deviceId, base64Data = "") {
      console.log("send data");
      console.log(this.deviceId);
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
          } else {
            this.$toast(`数据发送失败`);
          }
          console.log(res);
        }
      );
    },

    //发送活跃数据给设备 发送的数据需要经过base64编码
    sendActiveDataToWXDevice(deviceId, base64Data = "") {
      console.log("send active data");

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
          } else {
            this.$toast(`数据发送失败`);
          }
          console.log(res);
          console.log("活跃数据");
        }
      );
    },

    //发送活跃包数据给设备 发送的数据需要经过base64编码
    sendActiveBagDataToWXDevice(deviceId, base64Data = "") {
      console.log("send active bag data");

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
          } else {
            this.$toast(`数据发送失败`);
          }
          console.log(res);
          console.log("活跃数据");
        }
      );
    },

    //接收到设备数据
    onReceiveDataFromWXDevice() {
      WeixinJSBridge.on("onReceiveDataFromWXDevice", res => {
        console.log("接收数据onReceiveDataFromWXDevice");
        console.log(res);
        //设备id
        //base64编码过的设备发到H5的数据
        let { deviceId, base64Data } = res;
        //this.decoder({ content: base64Data });
        // this.parsePackets({ deviceId, content: base64Data });

        //调用后台接口进行base64解码
        service.decoder({ content: base64Data }).then(res => {
          if (res.errorCode === 0) {
            let obj = res.data[0];
            var objArr = Object.keys(obj);
            let data = {
              deviceId: this.deviceId,
              content: base64Data
            };
            if (obj[2] === "04" && obj[3] === "F1" && obj[1] === "0B") {
              //活跃度分包目录数
              // console.log('ret接口活跃度分包目录数')
              let arr = [];
              let len = parseInt(obj[7] + obj[8]); //目录包的数据长度
              let xiao;
              let lenXiao;
              for (let i = 0; i < len; i++) {
                var n = parseInt(`0x0${i}`);
                xiao =
                  0x23 ^
                  (0 + 0x07) ^
                  (1 + 0x02) ^
                  (2 + 0xf1) ^
                  (3 + 0x02) ^
                  (4 + 0x00) ^
                  (5 + 0x03) ^
                  (6 + 0x00) ^
                  (7 + n) ^
                  8;
                lenXiao = [
                  0x23,
                  0x07,
                  0x02,
                  0xf1,
                  0x02,
                  0x00,
                  0x03,
                  0x00,
                  n,
                  xiao
                ];
                arr.push(bytesArrayToBase64(lenXiao));
              }
              this.deviceArr = arr;
              this.sendActiveDataToWXDevice(
                this.deviceId,
                this.deviceArr[this.deviceIndex]
              );
              this.parsePackets(data);
            } else if (obj[2] === "04" && obj[3] === "F1" && obj[1] === "0C") {
              //活跃度分包目录内容
              console.log("活跃度分包目录内容");
              // let n5 = parseInt(`0x${obj[5]}`);
              // let n6 = parseInt(`0x${obj[6]}`);
              // let n7 = parseInt(`0x${obj[7]}`);
              // let n8 = parseInt(`0x${obj[8]}`);
              // this.utc = `${obj[5]}${obj[6]}${obj[7]}${obj[6]}`;
              let xiao =
                0x23 ^
                (0 + 0x0b) ^
                (1 + 0x02) ^
                (2 + 0xf1) ^
                (3 + 0x03) ^
                (4 + 0x00) ^
                (5 + 0x03) ^
                (6 + n5) ^
                (7 + n6) ^
                (8 + n7) ^
                (9 + n8) ^
                (10 + 0x00) ^
                (11 + 0x00) ^
                12;
              let lenXiao = [
                0x23,
                0x0b,
                0x02,
                0xf1,
                0x03,
                0x00,
                0x03,
                n5,
                n6,
                n7,
                n8,
                0x00,
                0x00,
                xiao
              ];
              this.sendActiveBagDataToWXDevice(
                this.deviceId,
                bytesArrayToBase64(lenXiao)
              );
              this.parsePackets(data);
            } else if (objArr.length === 20) {
              this.parsePackets(data);
              if (obj[0] === "FF" && obj[1] === "FF") {
                this.deviceIndex++;
                // 多次发送数据，知道目录包数等于当前索引
                if (this.deviceArr.length > this.deviceIndex) {
                  this.sendActiveDataToWXDevice(
                    this.deviceId,
                    this.deviceArr[this.deviceIndex]
                  );
                } else {
                  console.log("活跃度调用结束");
                }
              }
            } else if (obj[2] === "04" && obj[3] === "F0" && obj[1] === "04") {
              //ret接口睡眠条数
              console.log("ret接口睡眠条数");
              var sleepArr = [];
              let len = parseInt(obj[5]); //数据的数据总长度
              let xiao;
              let lenXiao;
              for (let i = 0; i < len; i++) {
                var n = parseInt(`0x0${i}`);
                xiao =
                  0x23 ^
                  (0 + 0x04) ^
                  (1 + 0x02) ^
                  (2 + 0xf0) ^
                  (3 + 0x02) ^
                  (4 + n) ^
                  5;
                lenXiao = [0x23, 0x04, 0x02, 0xf0, 0x02, n, xiao];
                sleepArr.push(bytesArrayToBase64(lenXiao));
              }
              this.sleepList = sleepArr;
              this.sendActiveDataToWXDevice(
                this.deviceId,
                this.sleepList[this.sleepIndex]
              );
              this.parsePackets(data);
            } else if (obj[2] === "04" && obj[3] === "F0" && obj[1] === "0E") {
              console.log("睡眠总体记录");
              this.parsePackets(data);
              this.sleepIndex++;
              if (this.sleepList.length > this.sleepIndex) {
                this.sendActiveDataToWXDevice(
                  this.deviceId,
                  this.sleepList[this.sleepIndex]
                );
              }
            } else if (obj[2] === "10" && obj[3] === "F0" && obj[1] === "07") {
              console.log("睡眠片段");
              //睡眠片段
              //  this.parsePackets(data)
            }
          }
        });
      });
    },
    //手机蓝牙状态改变事件
    onWXDeviceBluetoothStateChange() {
      WeixinJSBridge.on("onWXDeviceBluetoothStateChange", res => {
        console.log(res);
        console.log("手机蓝牙状态改变事件");
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
    //设备连接状态变化
    onWXDeviceStateChange() {
      WeixinJSBridge.on("onWXDeviceStateChange", res => {
        console.log(res);
        console.log("设备连接状态变化");
        let { state } = res;
        if (state === "connecting") {
          console.log("已连接");
        } else if (state === "connected") {
          console.log("连接断开");
        } else {
          console.log("连接断开");
        }
        this.getWXDeviceInfos();
      });
    },
    //解析数据包
    async parsePackets(params = {}) {
      let res = await service.parsePackets(params);
      if (res.errorCode === 0) {
        console.log("解析数据包");
      }
    },

    async decoder(params = {}) {
      console.log(params);
      console.log(11111);
      let res = await service.decoder(params);
      console.log(res);
      if (res.errorCode === 0) {
        console.log(res);
        console.log("解码成功");
      }
    },
    //事件监听
    init() {
      // 手机蓝牙监听开启事件
      this.onWXDeviceBluetoothStateChange();

      // 设备连接状态
      this.onWXDeviceStateChange();

      // 接收到设备数据
      this.onReceiveDataFromWXDevice();
    }
  },
  activated() {
    // 初始化蓝牙状态(时候打开，打开是否成功还是失败)
    this.openWXDeviceLib();
    // 获取微信设备deviceId
    this.getWXDeviceInfos();
    this.init();
  }
};
</script>
<style lang="less" scoped>
.steps {
  padding: 30px;
  p {
    margin-bottom: 20px;
  }
}
</style>


function newFunction() {
  return {
    key: "IwkBAhkJKBUlAAYq"
  };
}
