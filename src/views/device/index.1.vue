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
      </template>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <div class="flex">
          <van-button type="danger" size="large" class="no-radius" @click="run">发送数据</van-button>
        </div>
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
      map: [],
      // 活跃度部分
      deviceArr: [],
      deviceIndex: 0,
      delBag: [],
      delBagIndex: 0,
      utc: "1",
      utcValue: "",
      // 睡眠部分
      sleepList: [],
      sleepIndex: 0,
      sleepUTC: [],
      sleepUTCIndex: 0
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
    //循环调用
    run() {
      let deviceId = this.deviceId;
      let getDate = new Date();
      let year = getDate
        .getFullYear()
        .toString()
        .substr(2, 2);
      let month =
        getDate.getMonth() + 1 > 9
          ? getDate.getMonth() + 1
          : `0${getDate.getMonth() + 1}`;
      let day =
        getDate.getDate() > 9 ? getDate.getDate() : `0${getDate.getDate()}`;

      let hour =
        getDate.getHours() > 9 ? getDate.getHours() : `0${getDate.getHours()}`;
      let minutes =
        getDate.getMinutes() > 9
          ? getDate.getMinutes()
          : `0${getDate.getMinutes()}`;
      let seconds =
        getDate.getSeconds() > 9
          ? getDate.getSeconds()
          : `0${getDate.getSeconds()}`;
      let week = `0${getDate.getDay()}`;
      //获取活跃度分包目录数
      let getAcquisitionActivity = [
        0x23,
        0x05,
        0x02,
        0xf1,
        0x01,
        0x00,
        0x03,
        0xd8
      ];

      // 设置本地时间日期
      let setLocalTime = [
        0x23,
        0x09,
        0x01,
        0x02,
        parseInt(`0x${year}`),
        parseInt(`0x${month}`),
        parseInt(`0x${day}`),
        parseInt(`0x${hour}`),
        parseInt(`0x${minutes}`),
        parseInt(`0x${seconds}`),
        parseInt(`0x${week}`),
        0x00
      ];

      // 获取本地时间
      let getLocalTime = [0x23, 0x02, 0x02, 0x02, 0x25];

      // 获取设备电量
      let getDeviceSoc = [0x23, 0x02, 0x02, 0x03, 0x00];

      //获取最近睡眠记录条目IwMC8AHR
      let getMostRecentSleepEntry = [0x23, 0x03, 0x02, 0xf0, 0x01, 0xd1];

      //设置运动目标
      let setMovingGoals = [0x23, 0x04, 0x01, 0x06, 0x00, 0x200, 0x00];

      //获取运动目标
      let getMovingGoals = [0x23, 0x02, 0x02, 0x06, 0x29];

      // 获取当前步数
      let getCurrentNumberOfSteps = [0x23, 0x02, 0x02, 0x05, 0x26];

      let xiao =
        0x23 ^
        (0 + 0x09) ^
        (1 + 0x08) ^
        (2 + 0xf1) ^
        (3 + 0x04) ^
        (4 + 0x00) ^
        (5 + 0x03) ^
        (6 + 0x5d) ^
        (7 + 0x9d) ^
        (8 + 0xfc) ^
        (9 + 0x83);

      let lenXiao = [
        0x23,
        0x09,
        0x08,
        0xf1,
        0x04,
        0x00,
        0x03,
        0x5d,
        0x9d,
        0xfc,
        0x81,
        xiao
      ];

      //       帧头	长度	接口	参数
      // 23	07	08 F0	04 aa aa aa aa  5C  2B  2C  F4

      // let xiao =
      //   0x23 ^
      //   (0 + 0x07) ^
      //   (1 + 0x08) ^
      //   (2 + 0xf0) ^
      //   (3 + 0x04) ^
      //   (4 + 0x5c) ^
      //   (5 + 0x2b) ^
      //   (6 + 0x2c) ^
      //   (7 + 0xf4);

      // let lenXiao = [
      //   0x23,
      //   0x07,
      //   0x08,
      //   0xf0,
      //   0x04,
      //   0x5c,
      //   0x2b,
      //   0x2c,
      //   0xf4,
      //   xiao
      // ];

      let map = [
        // bytesArrayToBase64(getAcquisitionActivity)
        // bytesArrayToBase64(setLocalTime)
        // bytesArrayToBase64(getLocalTime),
        // bytesArrayToBase64(getDeviceSoc)
        // bytesArrayToBase64(getMostRecentSleepEntry)
        // bytesArrayToBase64(setMovingGoals)
        // bytesArrayToBase64(getMovingGoals)
      ];

      this.sendDataToWXDevice(
        deviceId,
        bytesArrayToBase64(getMostRecentSleepEntry)
      );
      // var _this = this;
      // setTimeout(function() {
      //   _this.sendDataToWXDevice(deviceId, bytesArrayToBase64(getLocalTime));
      // }, 1000);
      // // // setTimeout(function() {
      // // //   _this.sendDataToWXDevice(deviceId, bytesArrayToBase64(setLocalTime));
      // // // }, 2000);
      // setTimeout(function() {
      //   _this.sendDataToWXDevice(
      //     deviceId,
      //     bytesArrayToBase64(getCurrentNumberOfSteps)
      //   );
      // }, 3000);

      // setTimeout(function() {
      //   _this.sendDataToWXDevice(
      //     deviceId,
      //     bytesArrayToBase64(getMostRecentSleepEntry)
      //   );
      // }, 5000);
      // setTimeout(function() {
      //   _this.sendDataToWXDevice(
      //     deviceId,
      //     bytesArrayToBase64(getAcquisitionActivity)
      //   );
      // }, 10000);

      // for (let i in map) {
      //   console.log(i);
      //   let base64Data = map[i]; //key
      //   if (base64Data != "") {
      //     this.sendDataToWXDevice(deviceId, base64Data);
      //   } else {
      //     this.$toast(`请输入base64转码后的字符串`);
      //   }
      // }
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
                console.log(res);
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
        //设备id
        //base64编码过的设备发到H5的数据
        let { deviceId, base64Data } = res;
        //调用后台接口进行base64解码
        service.decoder({ content: base64Data }).then(res => {
          if (res.errorCode === 0) {
            let obj = res.data[0];
            console.log(obj);
            if (obj[2] === "04" && obj[3] === "F1" && obj[1] === "0B") {
              this.utc = "1";
              //获取活跃度分包目录数
              console.log("获取活跃度分包目录数");
              let arr = [];
              let len = parseInt(obj[7] + obj[8]);
              if (len === 0) {
                console.log("获取活跃度分包目录数调用结束");
              } else {
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
              }
            } else if (obj[2] === "04" && obj[3] === "F1" && obj[1] === "0C") {
              this.utc = "1";
              //获取活跃度目录内容
              console.log("获取活跃度目录内容");
              let n5 = parseInt(`0x${obj[5]}`);
              let n6 = parseInt(`0x${obj[6]}`);
              let n7 = parseInt(`0x${obj[7]}`);
              let n8 = parseInt(`0x${obj[8]}`);
              this.delBag.push({
                n5: `0x${obj[5]}`,
                n6: `0x${obj[6]}`,
                n7: `0x${obj[7]}`,
                n8: `0x${obj[8]}`
              });
              this.utcValue = `${obj[5]}${obj[6]}${obj[7]}${obj[8]}`;
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
            } else if (obj[2] === "00" && obj[3] === "03") {
              // 请求数据包
              console.log("请求数据包");
              this.utc = this.utcValue;
              this.parsePacketActive({
                deviceId,
                content: base64Data,
                utc: this.utcValue
              });
              if (obj[0] === "FF" && obj[1] === "FF") {
                this.deviceIndex++;
                // 多次发送数据，知道目录包数等于当前索引
                if (this.deviceArr.length > this.deviceIndex) {
                  this.sendActiveDataToWXDevice(
                    this.deviceId,
                    this.deviceArr[this.deviceIndex]
                  );
                } else {
                  // 请求数据包第一个目录包结束,开始按UTC删除数据
                  console.log("请求数据包第一个目录包结束,开始按UTC删除数据");
                  // return false;
                  // let xiao =
                  //   0x23 ^
                  //   (0 + 0x09) ^
                  //   (1 + 0x08) ^
                  //   (2 + 0xf1) ^
                  //   (3 + 0x04) ^
                  //   (4 + 0x00) ^
                  //   (5 + 0x03) ^
                  //   (6 + this.delBag[0].n5) ^
                  //   (7 + this.delBag[0].n6) ^
                  //   (8 + this.delBag[0].n7) ^
                  //   (9 + this.delBag[0].n8) ^
                  //   10;

                  // let lenXiao = [
                  //   0x23,
                  //   0x09,
                  //   0x08,
                  //   0xf1,
                  //   0x04,
                  //   0x00,
                  //   0x03,
                  //   this.delBag[0].n5,
                  //   this.delBag[0].n6,
                  //   this.delBag[0].n7,
                  //   this.delBag[0].n8,
                  //   xiao
                  // ];
                  // console.log("开始按UTC删除数据0");
                  // this.sendActiveBagDataToWXDevice(
                  //   this.deviceId,
                  //   bytesArrayToBase64(lenXiao)
                  // );
                  // this.parsePackets(data);
                  // }
                }
              } else if (
                obj[2] === "04" &&
                obj[3] === "F1" &&
                obj[1] === "04"
              ) {
                if (obj[5] === "02") {
                  // 请求数据包请求失败，无效记录序号,开始按UTC删除数据
                  console.log("请求数据包第一个目录包结束,开始按UTC删除数据");
                  // return false;
                  // let xiao =
                  //   0x23 ^
                  //   (0 + 0x09) ^
                  //   (1 + 0x08) ^
                  //   (2 + 0xf1) ^
                  //   (3 + 0x04) ^
                  //   (4 + 0x00) ^
                  //   (5 + 0x03) ^
                  //   (6 + this.delBag[0].n5) ^
                  //   (7 + this.delBag[0].n6) ^
                  //   (8 + this.delBag[0].n7) ^
                  //   (9 + this.delBag[0].n8) ^
                  //   10;
                  // let lenXiao = [
                  //   0x23,
                  //   0x09,
                  //   0x08,
                  //   0xf1,
                  //   0x04,
                  //   0x00,
                  //   0x03,
                  //   this.delBag[0].n5,
                  //   this.delBag[0].n6,
                  //   this.delBag[0].n7,
                  //   this.delBag[0].n8,
                  //   xiao
                  // ];
                  // console.log("开始按UTC删除数据0");
                  // this.sendActiveBagDataToWXDevice(
                  //   this.deviceId,
                  //   bytesArrayToBase64(lenXiao)
                  // );
                  // this.parsePackets(data);
                }
              } else if (obj[2] === "10" && obj[3] === "F1") {
                // return false;
                // let index = this.delBagIndex;
                // index++;
                // if (this.delBag.length > index) {
                //   this.delBagIndex = index;
                //   let xiao =
                //     0x23 ^
                //     (0 + 0x09) ^
                //     (1 + 0x08) ^
                //     (2 + 0xf1) ^
                //     (3 + 0x04) ^
                //     (4 + 0x00) ^
                //     (5 + 0x03) ^
                //     (6 + this.delBag[index].n5) ^
                //     (7 + this.delBag[index].n6) ^
                //     (8 + this.delBag[index].n7) ^
                //     (9 + this.delBag[index].n8) ^
                //     10;
                //   let lenXiao = [
                //     0x23,
                //     0x09,
                //     0x08,
                //     0xf1,
                //     0x04,
                //     0x00,
                //     0x03,
                //     this.delBag[index].n5,
                //     this.delBag[index].n6,
                //     this.delBag[index].n7,
                //     this.delBag[index].n8,
                //     xiao
                //   ];
                //   console.log("开始按UTC删除数据" + index);
                //   this.sendActiveBagDataToWXDevice(
                //     this.deviceId,
                //     bytesArrayToBase64(lenXiao)
                //   );
                // this.parsePackets(data);
              } else {
                console.log("开启下面的包");
                // return false;
                // this.delBagIndex = 0;
                // this.deviceIndex = 0;
                // let getAcquisitionActivity = [
                //   0x23,
                //   0x05,
                //   0x02,
                //   0xf1,
                //   0x01,
                //   0x00,
                //   0x03,
                //   0xd8
                // ];
                // this.sendDataToWXDevice(
                //   deviceId,
                //   bytesArrayToBase64(getAcquisitionActivity)
                // );
              }
            } else if (obj[2] === "04" && obj[3] === "F0" && obj[1] === "04") {
              //获取最近睡眠记录条目
              console.log("获取最近睡眠记录条目");
              var sleepArr = [];
              let len = parseInt(obj[5]);
              console.log(len);
              if (len === 0) {
                console.log("获取最近睡眠记录条目调用结束");
              } else {
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
              }
            } else if (obj[2] === "04" && obj[3] === "F0" && obj[1] === "0E") {
              // 获取目录的睡眠信息记录
              console.log("获取目录的睡眠信息记录");
              this.sleepUTC.push({
                n5: `0x${obj[5]}`,
                n6: `0x${obj[6]}`,
                n7: `0x${obj[7]}`,
                n8: `0x${obj[8]}`
              });
              // if (obj[0] === "FF" && obj[1] === "FF") {
              //   this.sleepIndex++;
              //   console.log(this.sleepIndex);
              //   if (this.sleepList.length > this.sleepIndex) {
              //     this.sendActiveDataToWXDevice(
              //       this.deviceId,
              //       this.sleepList[this.sleepIndex]
              //     );
              //   }
            }
          } else if (obj[2] === "01" && obj[3] === "00") {
            // 睡眠片段
            console.log("睡眠片段");
            if (obj[0] === "FF" && obj[1] === "FF") {
              this.sleepIndex++;
              console.log(this.sleepIndex);
              if (this.sleepList.length > this.sleepIndex) {
                this.sendActiveDataToWXDevice(
                  this.deviceId,
                  this.sleepList[this.sleepIndex]
                );
              } else {
                console.log(this.sleepUTC);
                console.log("请求数据包第一个目录包结束,开始删除睡眠数据");
                //     //   let xiao =
                //     //     0x23 ^
                //     //     (0 + 0x09) ^
                //     //     (1 + 0x08) ^
                //     //     (2 + 0xf1) ^
                //     //     (3 + 0x04) ^
                //     //     (4 + 0x00) ^
                //     //     (5 + 0x03) ^
                //     //     (6 + this.sleepUTC[0].n5) ^
                //     //     (7 + this.sleepUTC[0].n6) ^
                //     //     (8 + this.sleepUTC[0].n7) ^
                //     //     (9 + this.sleepUTC[0].n8) ^
                //     //     10;

                //     //   let lenXiao = [
                //     //     0x23,
                //     //     0x09,
                //     //     0x08,
                //     //     0xf1,
                //     //     0x04,
                //     //     0x00,
                //     //     0x03,
                //     //     this.sleepUTC[0].n5,
                //     //     this.sleepUTC[0].n6,
                //     //     this.sleepUTC[0].n7,
                //     //     this.sleepUTC[0].n8,
                //     //     xiao
                //     //   ];

                //     //   console.log("删除条目的睡眠记录信息开始0");
                //     //   this.sendActiveBagDataToWXDevice(
                //     //     this.deviceId,
                //     //     bytesArrayToBase64(lenXiao)
                //     //   );
                //     //   this.parsePackets(data);
              }
              //   let xiao =
              //     0x23 ^
              //     (0 + 0x09) ^
              //     (1 + 0x08) ^
              //     (2 + 0xf1) ^
              //     (3 + 0x04) ^
              //     (4 + 0x00) ^
              //     (5 + 0x03) ^
              //     (6 + this.sleepUTC[0].n5) ^
              //     (7 + this.sleepUTC[0].n6) ^
              //     (8 + this.sleepUTC[0].n7) ^
              //     (9 + this.sleepUTC[0].n8) ^
              //     10;

              //   let lenXiao = [
              //     0x23,
              //     0x09,
              //     0x08,
              //     0xf1,
              //     0x04,
              //     0x00,
              //     0x03,
              //     this.sleepUTC[0].n5,
              //     this.sleepUTC[0].n6,
              //     this.sleepUTC[0].n7,
              //     this.sleepUTC[0].n8,
              //     xiao
              //   ];

              //   console.log("删除条目的睡眠记录信息开始0");
              //   this.sendActiveBagDataToWXDevice(
              //     this.deviceId,
              //     bytesArrayToBase64(lenXiao)
              //   );
              //   this.parsePackets(data);
              // }
            } else if (obj[2] === "10" && obj[3] === "F0" && obj[1] === "08") {
              console.log("请求数据包第二个目录包结束,开始删除数据");
            }
          }
        });
        let data = {
          deviceId,
          content: base64Data,
          studentId: "227"
        };
        console.log(data);
        this.parsePackets(data);
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
    async parsePacketActive(params = {}) {
      let res = await service.parsePacketActive(params);
      if (res.errorCode === 0) {
        console.log("解析数据包");
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
    // 初始化蓝牙状态
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




