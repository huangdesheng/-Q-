<template>
  <div class="page">
    <div class="page-bd myHand">
      <template>
        <div class="myhand">
          <div class="flex a-i-c home-user gradient-two" style="position:relative">
            <div class="flex a-i-c">
              <div class="avatar flex a-i-c">
                <template>
                  <img src="@/assets/child-default@2x.png" width="60" height="60" radius="50" />
                  <!-- <img :src="photo" width="60" height="60" radius="50" /> -->
                </template>
              </div>
              <div class="js-user-change">
                <template>
                  <h3 class="mb-20" size-18>{{name}}</h3>
                  <p size-12>运动需要坚持才能长存</p>
                </template>
              </div>
            </div>
            <!-- <button class="connectStatus">已连接</button> -->
            <button class="connectStatus" v-if="state == 'connected'">已连接</button>
            <button class="connectStatus" v-else-if="state == 'disconnected'">未连接</button>
            <button class="connectStatus" v-else-if="state == 'connecting'">连接中</button>
          </div>
          <div class="myAttr">
            <van-cell
              class="a-i-c"
              size="large"
              title="活跃度"
              :value="dataValue.activeValue"
              to="/checkActive"
            >
              <template slot="icon">
                <img src="@/assets/user-icon-5@2x.png" class="user-icon" />
              </template>
            </van-cell>
            <van-cell
              class="a-i-c"
              size="large"
              title="运动步数"
              :value="dataValue.step+'步'"
              to="/checkStep"
            >
              <template slot="icon">
                <img src="@/assets/user-icon-8@2x.png" class="user-icon" />
              </template>
            </van-cell>
            <van-cell
              class="a-i-c"
              size="large"
              title="昨晚睡眠"
              :value="dataValue.nightTime"
              to="/checkSlepp"
            >
              <template slot="icon">
                <img src="@/assets/user-icon-9@2x.png" class="user-icon" />
              </template>
            </van-cell>
            <van-cell
              class="a-i-c"
              size="large"
              title="午睡"
              :value="dataValue.lunchTime"
              to="/checkSlepp"
            >
              <template slot="icon">
                <img src="@/assets/user-icon-9@2x.png" class="user-icon" />
              </template>
            </van-cell>
          </div>
        </div>
        <div class="setAttr">
          <van-cell
            class="a-i-c"
            size="large"
            title="目标设定"
            is-link
            :value="`${dataValue.setStep}步`"
            @click="stepTip"
          ></van-cell>
          <van-cell
            class="a-i-c"
            size="large"
            title="手环闹钟"
            is-link
            :value="clockCount"
            to="/alarm-clock"
          ></van-cell>
          <van-cell class="a-i-c" size="large" title="佩戴方式" is-link value="左手-竖显" to="/setWear"></van-cell>
          <van-cell class="a-i-c" size="large" title="剩余电量" :value="dataValue.electricPercent+'%'"></van-cell>
        </div>
        <div style="margin-top:10px" class="version">
          <van-cell title="版本" value="V1.0" size="large" />
          <van-cell title="品牌" value="小Q手环学校版" size="large" />
        </div>
        <!-- <button @click="run">发送数据</button> -->
      </template>
    </div>
    <!-- <div class="page-ft">
      <qxFooter></qxFooter>
    </div>-->
    <van-dialog v-model="stepStatus" title="标题" show-cancel-button @confirm="sumbitStep">
      <van-field
        v-model="stepValue"
        placeholder="设定您的目标步数"
        style="width: 90%;
        margin: 10px auto;
        background: rgba(46,46,46,0.1);"
        type="number"
      />
    </van-dialog>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import qxFooter from "@/components/Footer";
import { mapState } from "vuex";
import wxapi from "@/config/wxapi";
import { API_ROOT } from "@/config/isdev";
import { bytesArrayToBase64 } from "@/utils/arrayToBase64";
export default {
  name: "user",
  components: {
    qxFooter
  },
  data() {
    return {
      dataValue: {
        activeValue: "超越全国 80%",
        step: "0",
        nightTime: "6小时05分",
        lunchTime: "2小时10分",
        setStep: 0,
        electricPercent: ""
      },
      getValueMenu: [
        {
          title: "活跃度",
          to: "/works/teacher",
          value: "超越全国 80%",
          icon: require("../../assets/user-icon-5@2x.png")
        },
        {
          title: "运动步数",
          to: "/edu-recommend",
          value: "2500步",
          icon: require("../../assets/user-icon-8@2x.png")
        },
        {
          title: "昨晚睡眠",
          to: "/read-recommend",
          value: "6小时05分",
          icon: require("../../assets/user-icon-9@2x.png")
        },

        {
          title: "午睡",
          value: "2小时10分",
          to: "/read-recommend",
          icon: require("../../assets/user-icon-9@2x.png")
        }
      ],
      teacherMenu: [
        {
          title: "目标设定",
          to: "/works/teacher",
          value: "8000步",
          icon: require("../../assets/user-icon-5@2x.png")
        },
        {
          title: "手环闹钟",
          to: "/edu-recommend",
          value: "开启了3个",
          icon: require("../../assets/user-icon-8@2x.png")
        },
        {
          title: "佩戴方式",
          to: "/read-recommend",
          value: "左手-竖显",
          icon: require("../../assets/user-icon-9@2x.png")
        },
        {
          title: "剩余电量",
          value: "50%",
          to: "/activity-recommend",
          icon: require("../../assets/user-icon-10@2x.png")
        }
      ],
      deviceId: "",
      getClockIndex: 1,
      stepStatus: false,
      stepValue: "",
      state: "",
      clockCount: 0,
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
  mounted() {
    // console.log(parseInt(111110, 2).toString(16));
    console.log(this.studentId);
    this.getElectric();
    this.getStepNumber();
    this.getAlarmClockCount();
    this.init();
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
            console.log(this.deviceId);
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

    // 设定运动目标
    stepTip() {
      this.stepStatus = true;
    },
    sumbitStep() {
      let deviceId = this.deviceId;
      this.dataValue.setStep = this.stepValue;
      let n;
      if (this.stepValue > 10) {
        n = `0x${this.stepValue}`;
      } else {
        n = `0x0${this.stepValue}`;
      }
      // 设置运动目标
      let setMovingGoals = [0x23, 0x04, 0x01, 0x06, 0x00, 0x80, 0x00];
      this.sendDataToWXDevice(deviceId, "IwQBBgAQPw==");
      let getMovingGoals = [0x23, 0x02, 0x02, 0x06, 0x29];
      var _this = this;
      setTimeout(function() {
        _this.sendDataToWXDevice(deviceId, "IwICBik=");
      }, 1000);
    },
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
      // let getLocalTime = [0x23, 0x02, 0x02, 0x02, 0x25];
      // 获取设备电量
      // let getDeviceSoc = [0x23, 0x02, 0x02, 0x03, 0x00];
      // 设置Q星值
      // let setStartVlue = [0x23, 0x04, 0x01, 0x04, 0x00, 0x50, 0x00];
      // 设置Q星值
      // let getStartValue = [0x23, 0x02, 0x02, 0x04, 0x00];
      // 设置闹钟
      // let timer = [0x23, 0x07, 0x01, 0x07, 0x02, 0x20, 0x58, 0x3e, 0x01, 0x00];

      // let getAlarmClock = [0x23, 0x03, 0x02, 0x07, 0x01, 0x00];

      // this.sendDataToWXDevice(deviceId, bytesArrayToBase64(timer));
      // this.sendDataToWXDevice(deviceId, bytesArrayToBase64(setLocalTime));
      // var _this = this;
      // setTimeout(function() {
      // this.sendDataToWXDevice(deviceId, bytesArrayToBase64(getLocalTime));
      // }, 500);
      // setTimeout(function() {
      //   _this.sendDataToWXDevice(deviceId, bytesArrayToBase64(timer));
      // }, 1000);
      // setTimeout(function() {
      //   _this.sendDataToWXDevice(deviceId, bytesArrayToBase64(setStartVlue));
      // }, 3000);
      // setTimeout(function() {
      //   _this.sendDataToWXDevice(deviceId, bytesArrayToBase64(getStartValue));
      // }, 4000);
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
          } else {
            this.$toast(`数据发送失败`);
          }
        }
      );
    },
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
            let len = parseInt(obj[5]);
            // let data = {
            //   deviceId,
            //   content: base64Data,
            //   studentId: "227"
            // };
            if (obj[1] === "08" && obj[2] === "04" && obj[3] === "02") {
              // 获取本地时间日期结束，开始电量信息
              console.log("获取本地时间日期结束，开始电量信息");
              let getDeviceSoc = [0x23, 0x02, 0x02, 0x03, 0x00];
              this.sendDataToWXDevice(
                deviceId,
                bytesArrayToBase64(getDeviceSoc)
              );
              this.parsePackets({
                deviceId,
                content: base64Data,
                studentId: this.studentId
              });
            } else if (obj[1] === "04" && obj[2] === "04" && obj[3] === "03") {
              // 获取电量信息结束，开始获取当前步数
              console.log("获取电量信息结束，开始获取当前步数");
              let getCurrentNumberOfSteps = [0x23, 0x02, 0x02, 0x05, 0x00];
              this.sendDataToWXDevice(
                deviceId,
                bytesArrayToBase64(getCurrentNumberOfSteps)
              );
              this.parsePackets({
                deviceId,
                content: base64Data,
                studentId: this.studentId
              });
            } else if (obj[1] === "04" && obj[2] === "04" && obj[3] === "05") {
              // 获取当前步数结束，开始获取获取最近睡眠
              console.log("获取当前步数结束，开始获取获取最近睡眠");
              let getMostRecentSleepEntry = [
                0x23,
                0x03,
                0x02,
                0xf0,
                0x01,
                0x00
              ];
              this.sendDataToWXDevice(
                deviceId,
                bytesArrayToBase64(getMostRecentSleepEntry)
              );
              this.parsePackets({
                deviceId,
                content: base64Data,
                studentId: this.studentId
              });
            } else if (obj[2] === "04" && obj[3] === "F0" && obj[1] === "04") {
              // 获取最近睡眠记录条目
              console.log("获取最近睡眠记录条目");
              let len = parseInt(obj[5]);
              let sleepArr = [];
              console.log(len);
              if (len === 0) {
                // 获取已存的睡眠历史记录条数为0,开始获取活跃度目录条数
                console.log(
                  "获取已存的睡眠历史记录条数为0,开始获取活跃度目录条数"
                );
                // let getAcquisitionActivity = [
                //   0x23,
                //   0x05,
                //   0x02,
                //   0xf1,
                //   0x01,
                //   0x00,
                //   0x03,
                //   0x00
                // ];
                // this.sendDataToWXDevice(
                //   deviceId,
                //   bytesArrayToBase64(getAcquisitionActivity)
                // );
                this.parsePackets({
                  deviceId,
                  content: base64Data,
                  studentId: "227"
                });
              } else {
                let xiao;
                let lenXiao;
                console.log(len);
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
                console.log(sleepArr);
                this.sleepList = sleepArr;
                this.sendDataToWXDevice(
                  this.deviceId,
                  this.sleepList[this.sleepIndex]
                );
                this.parsePackets({
                  deviceId,
                  content: base64Data,
                  studentId: this.studentId
                });
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
              if (obj[0] === "FF" && obj[1] === "FF") {
                this.sleepIndex++;
                if (this.sleepList.length > this.sleepIndex) {
                  this.sendDataToWXDevice(
                    this.deviceId,
                    this.sleepList[this.sleepIndex]
                  );
                } else {
                  console.log("结束啦");
                }
              }
              this.parsePackets({
                deviceId,
                content: base64Data,
                studentId: this.studentId
              });
            } else if (obj[2] === "01" && obj[3] === "00") {
              // 睡眠片段
              console.log("睡眠片段");
              // if (obj[0] === "FF" && obj[1] === "FF") {
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
            } else if (obj[2] === "04" && obj[3] === "F1" && obj[1] === "0B") {
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
                console.log(arr);
                this.deviceArr = arr;
                this.sendDataToWXDevice(
                  this.deviceId,
                  this.deviceArr[this.deviceIndex]
                );
                this.parsePackets({
                  deviceId,
                  content: base64Data,
                  studentId: this.studentId
                });
              }
            } else if (obj[2] === "04" && obj[3] === "F1" && obj[1] === "0C") {
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
              this.sendDataToWXDevice(
                this.deviceId,
                bytesArrayToBase64(lenXiao)
              );
              this.parsePackets({
                deviceId,
                content: base64Data,
                studentId: this.studentId
              });
            } else if (obj[2] === "00" && obj[3] === "03") {
              // 请求数据包
              console.log("请求数据包");
              this.utc = this.utcValue;
              this.parsePacketActive({
                deviceId,
                content: base64Data,
                utc: this.utcValue,
                studentId: this.studentId
              });
              if (obj[0] === "FF" && obj[1] === "FF") {
                this.deviceIndex++;
                // 多次发送数据，知道目录包数等于当前索引
                if (this.deviceArr.length > this.deviceIndex) {
                  this.sendDataToWXDevice(
                    this.deviceId,
                    this.deviceArr[this.deviceIndex]
                  );
                } else {
                  // 请求数据包第一个目录包结束,开始按UTC删除数据
                  console.log("请求数据包第一个目录包结束,开始按UTC删除数据");
                  // return false;
                  let xiao =
                    0x23 ^
                    (0 + 0x09) ^
                    (1 + 0x08) ^
                    (2 + 0xf1) ^
                    (3 + 0x04) ^
                    (4 + 0x00) ^
                    (5 + 0x03) ^
                    (6 + this.delBag[0].n5) ^
                    (7 + this.delBag[0].n6) ^
                    (8 + this.delBag[0].n7) ^
                    (9 + this.delBag[0].n8) ^
                    10;
                  let lenXiao = [
                    0x23,
                    0x09,
                    0x08,
                    0xf1,
                    0x04,
                    0x00,
                    0x03,
                    this.delBag[0].n5,
                    this.delBag[0].n6,
                    this.delBag[0].n7,
                    this.delBag[0].n8,
                    xiao
                  ];
                  console.log("开始按UTC删除数据0");
                  this.sendDataToWXDevice(
                    this.deviceId,
                    bytesArrayToBase64(lenXiao)
                  );
                }
                this.parsePackets({
                  deviceId,
                  content: base64Data,
                  studentId: "227"
                });
              }
            } else if (obj[2] === "04" && obj[3] === "F1" && obj[1] === "04") {
              if (obj[5] === "02") {
                // 请求数据包请求失败，无效记录序号,开始按UTC删除数据
                console.log("请求数据包第一个目录包结束,开始按UTC删除数据");
                // return false;
                let xiao =
                  0x23 ^
                  (0 + 0x09) ^
                  (1 + 0x08) ^
                  (2 + 0xf1) ^
                  (3 + 0x04) ^
                  (4 + 0x00) ^
                  (5 + 0x03) ^
                  (6 + this.delBag[0].n5) ^
                  (7 + this.delBag[0].n6) ^
                  (8 + this.delBag[0].n7) ^
                  (9 + this.delBag[0].n8) ^
                  10;
                let lenXiao = [
                  0x23,
                  0x09,
                  0x08,
                  0xf1,
                  0x04,
                  0x00,
                  0x03,
                  this.delBag[0].n5,
                  this.delBag[0].n6,
                  this.delBag[0].n7,
                  this.delBag[0].n8,
                  xiao
                ];
                console.log("开始按UTC删除数据0");
                this.sendDataToWXDevice(
                  this.deviceId,
                  bytesArrayToBase64(lenXiao)
                );
                this.parsePackets({
                  deviceId,
                  content: base64Data,
                  studentId: "227"
                });
              }
            } else if (obj[2] === "10" && obj[3] === "F1") {
              // return false;
              let index = this.delBagIndex;
              index++;
              if (this.delBag.length > index) {
                this.delBagIndex = index;
                let xiao =
                  0x23 ^
                  (0 + 0x09) ^
                  (1 + 0x08) ^
                  (2 + 0xf1) ^
                  (3 + 0x04) ^
                  (4 + 0x00) ^
                  (5 + 0x03) ^
                  (6 + this.delBag[index].n5) ^
                  (7 + this.delBag[index].n6) ^
                  (8 + this.delBag[index].n7) ^
                  (9 + this.delBag[index].n8) ^
                  10;
                let lenXiao = [
                  0x23,
                  0x09,
                  0x08,
                  0xf1,
                  0x04,
                  0x00,
                  0x03,
                  this.delBag[index].n5,
                  this.delBag[index].n6,
                  this.delBag[index].n7,
                  this.delBag[index].n8,
                  xiao
                ];
                console.log("开始按UTC删除数据" + index);
                this.sendDataToWXDevice(
                  this.deviceId,
                  bytesArrayToBase64(lenXiao)
                );
                this.parsePackets(data);
              } else {
                this.delBagIndex = 0;
                this.deviceIndex = 0;
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
                this.sendDataToWXDevice(
                  deviceId,
                  bytesArrayToBase64(getAcquisitionActivity)
                );
                this.parsePackets({
                  deviceId,
                  content: base64Data,
                  studentId: "227"
                });
              }
            }
            // this.parsePackets(data);
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

    // 获取电量
    async getElectric() {
      let res = await service.getElectric({
        studentId: this.studentId
      });
      if (res.errorCode === 0) {
        this.dataValue.electricPercent = res.data.electricPercent;
      }
    },
    // 获取开启闹钟的个数
    async getAlarmClockCount() {
      let res = await service.getAlarmClockCount({
        studentId: this.studentId
      });
      // this.clockCount = `开启了${res.data}个`;
      console.log(res);
      if (res.errorCode === 0) {
        this.clockCount = `开启了${res.data}个`;
      }
    },
    // 获取当前
    async getStepNumber() {
      let res = await service.getStepNumber({
        studentId: this.studentId
      });
      console.log(res);
      if (res.errorCode === 0) {
        this.dataValue.setStep = res.data.stepTarget;
        this.dataValue.step = res.data.stepNumber;
        // console.log(res);
        // this.dataValue.electricPercent = res.data.electricPercent;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.home-user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 250px;
  padding: 0 30px;
  color: #fff;
  position: relative;
  .js-user-change {
    margin-left: 20px;
  }
}
.snail {
  height: 80px;
  width: calc(100% - 60px);
  margin: 30px auto;
  padding: 0 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 20px 0 rgba(204, 204, 204, 0.3);
}
.user-icon {
  width: 60px;
  height: 60px;
  margin-right: 20px;
}
.switch-role {
  color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  height: 60px;
  padding: 0 30px;
  align-items: center;
  border-radius: 30px 0 0 30px;
  background-color: #c1e77e;
}

.myhand {
  height: 640px;
  position: relative;
  width: 100%;
  .myAttr {
    width: 90%;
    position: absolute;
    left: 5%;
    top: 200px;
    background: #fff;
    box-shadow: 0px 8px 12px 1px rgba(162, 223, 87, 0.09);
    border-radius: 10px;
    .van-cell {
      // padding: 30px 20px;
      .van-cell__title {
        color: #666;
        font-size: 30px;
      }
      .van-cell__value {
        color: #666666;
        font-size: 25px;
      }
    }
  }
}

.setAttr,
.version {
  .van-cell {
    padding: 30px 20px;
    .van-cell__title {
      color: #999999;
      font-size: 30px;
    }
    .van-cell__value {
      color: #666666;
      font-size: 25px;
    }
  }
}

.connectStatus {
  position: absolute;
  right: 0;
  top: 100px;
  width: 200px;
  height: 70px;
  border: none;
  outline: none;
  background: red;
  color: #fff;
  border-radius: 20px 0 0 20px;
}
</style>

