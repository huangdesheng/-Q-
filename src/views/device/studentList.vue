<template>
  <div class="page">
    <div class="dialog" v-if="show">
      <div>
        <van-loading size="24px" vertical v-if="show">加载中...</van-loading>
        <p>{{tip}}</p>
      </div>
    </div>
    <template v-if="handStatus === 0"></template>
    <template v-if="handStatus === 1 || handStatus === 2">
      <div class="page-bd myHand">
        <div class="page-bd no_data">
          <div class="empty">
            <img src="@/assets/kong.png" alt />
            <p class="mt-30">您还没有绑定小Q手环呢~~</p>
            <button>去购买小Q手环</button>
            <p class="commom">已有小Q手环？</p>
            <p class="commom">请使用微信扫描手环上面二维码进行绑定。</p>
          </div>
        </div>
      </div>
    </template>
    <template v-if="handStatus === 3">
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
              <button class="connectStatus" v-if="state == 'connected'" @click="getStarTotal">设备已连接</button>
              <button class="connectStatus" v-else-if="state == 'disconnected'">设备未连接</button>
              <button class="connectStatus" v-else-if="state == 'connecting'">设备未连接</button>
            </div>
            <div class="myAttr">
              <!-- <van-cell
              class="a-i-c"
              size="large"
              title="活跃度"
              :value="dataValue.activeValue"
              to="/checkActive"
            >
              <template slot="icon">
                <img src="@/assets/user-icon-5@2x.png" class="user-icon" />
              </template>
              </van-cell>-->
              <van-cell
                class="a-i-c"
                size="large"
                title="运动步数"
                :value="dataValue.step+'步'"
                to="/checkStep"
              >
                <template slot="icon">
                  <img src="@/assets/nowStep.png" class="user-icon" />
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
                  <img src="@/assets/nightSleep.png" class="user-icon" />
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
                  <img src="@/assets/launchSleep.png" class="user-icon" />
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
            <van-cell
              class="a-i-c"
              size="large"
              title="佩戴方式"
              is-link
              :value="getWear"
              @click="setWear"
            ></van-cell>
            <van-cell class="a-i-c" size="large" title="剩余电量" :value="dataValue.electricPercent"></van-cell>
          </div>
          <div style="margin-top:10px" class="version">
            <van-cell title="版本" value="V1.0" size="large" />
            <van-cell title="品牌" value="小Q手环学校版" size="large" />
          </div>
          <!-- <button @click="run" v-if="isBindBracelet == 1">发送数据</button> -->
        </template>
      </div>
      <div class="backIndex" @click="backIndex">
        <van-icon name="arrow-left" />
        <span>返回首页</span>
      </div>
      <div class="page-ft" v-if="isBindBracelet == 1">
        <div class="fixed-bottom" style="z-index: 100;">
          <van-button type="info" size="large" class="no-radius" @click="handleCancel">解除绑定</van-button>
        </div>
      </div>
    </template>

    <van-dialog v-model="stepStatus" title="标题" show-cancel-button :beforeClose="chargeBtn">
      <van-field
        v-model="stepValue"
        placeholder="目标步数上限65535"
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
        activeValue: "超越全国0%",
        step: "0",
        nightTime: "0小时0分",
        lunchTime: "0小时0分",
        setStep: 0,
        electricPercent: "0%"
      },
      show: false,
      tip: "数据导入中....",
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
      getWear: "",
      wear: 0,
      screen: 0,
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
      // 判断当前孩子列表存在绑定的孩子
      hasBind: true,
      handStatus: 0,
      // 设置的状态
      setStatus: 0
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
      isOpen: state => state.info.isOpen,
      isBindBracelet: state => state.info.isBindBracelet
    })
  },
  mounted() {
    this.deviceId = this.$route.query.deviceId;
    this.hasBind = this.$route.query.hasBind;
    this.init();
    if (this.deviceId === "") {
      this.handStatus = 1;
    } else {
      if (this.isBindBracelet == 0) {
        this.handStatus = 2;
      } else {
        this.handStatus = 3;
        let entryData = sessionStorage.getItem("entryData");
        this.getElectric();
        this.getStepNumber();
        this.getAlarmClockCount();
        this.getSleepTime();
        this.getMannerWear();
        if (!entryData) {
          let _this = this;
          setTimeout(function() {
            _this.show = true;
          }, 1000);
          let getLocalTime = [0x23, 0x02, 0x02, 0x02, 0x25];
          this.sendDataToWXDevice(
            this.deviceId,
            bytesArrayToBase64(getLocalTime)
          );
        }
      }
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
    handleCancel() {
      this.$dialog
        .confirm({
          message: "确认解绑当前小孩"
        })
        .then(() => {
          this.getWXDeviceTicket();
        });
    },

    backIndex() {
      this.$router.push({
        path: "/single"
      });
    },

    async unBindDevice(ticket) {
      let data = {
        deviceId: this.deviceId,
        openId: this.openId,
        ticket: ticket
      };
      let res = await service.unBindDevice(data);
      if (res.errorCode === 0) {
        this.$store.state.user.info.isBindBracelet = 0;
      }
    },
    // 初始化设备库
    openWXDeviceLib() {
      wx.ready(() => {
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
      });
    },

    //设备连接状态变化
    onWXDeviceStateChange() {
      wx.ready(() => {
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
      });
    },

    getWXDeviceTicket() {
      wx.ready(() => {
        WeixinJSBridge.invoke(
          "getWXDeviceTicket",
          { deviceId: this.deviceId, type: "2", connType: "lan" },
          res => {
            if (res.err_msg === "getWXDeviceTicket:ok") {
              this.unBindDevice(res.ticket);
            } else {
              this.$toast("获取凭证失败");
            }
          }
        );
      });
    },

    // 获取设备信息
    getWXDeviceInfos() {
      wx.ready(() => {
        WeixinJSBridge.invoke("getWXDeviceInfos", {}, res => {
          console.log(res);
          if (res.err_msg === "getWXDeviceInfos:ok") {
            // this.state = res.deviceInfos[0].state;
            //绑定设备总数量
            if (res.deviceInfos.length) {
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
          "disconnectWXDevice",
          { deviceId: this.deviceId, connType: "blue" },
          res => {
            if (res.err_msg === "disConnectWXDevice:ok") {
              this.deviceId = "";
              this.$dialog({ message: "使用前请先打开手机蓝牙" });
            }
          }
        );
      });
    },

    //手机蓝牙状态改变事件
    onWXDeviceBluetoothStateChange() {
      wx.ready(() => {
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
      });
    },

    setWear() {
      this.$router.push({
        path: "/setWear",
        query: {
          wear: this.wear,
          screen: this.screen
        }
      });
    },

    // 设定运动目标
    stepTip() {
      this.stepStatus = true;
    },

    chargeBtn(action, done) {
      let deviceId = this.deviceId;
      this.dataValue.setStep = this.stepValue;
      let number = parseInt(this.stepValue);
      if (action === "confirm") {
        if (number < 65535) {
          let start;
          let end;
          let data = number.toString(16);
          console.log(data);
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

          let setMovingGoals = [0x23, 0x04, 0x01, 0x06, start, end, 0x00];
          this.sendDataToWXDevice(
            this.deviceId,
            bytesArrayToBase64(setMovingGoals)
          );
          done();
        } else {
          this.$toast("上限为65535步");
          done(false);
          return false;
        }
      } else {
        done();
      }
    },

    async getStarTotal() {
      var now = new Date();
      var year = now.getFullYear(); //年
      var month = now.getMonth() + 1; //月
      var day = now.getDate(); //日
      let date = `${year}-${month}-${day}`;
      let data = {
        studentId: this.studentId,
        day: date
      };
      let res = await service.getStarTotal(data);
      if (res.errorCode === 0) {
        // console.log(res.data);
        this.setStart(res.data);
      }
    },

    setStart(value) {
      // console.log(1);
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
      // let getStartVlue = [0x23, 0x02, 0x02, 0x04, 0x00];
      this.sendDataToWXDevice(this.deviceId, bytesArrayToBase64(getStartVlue));
    },

    sumbitStep() {
      let deviceId = this.deviceId;
      this.dataValue.setStep = this.stepValue;
      let number = parseInt(this.stepValue);
      if (number < 65535) {
        let start = `0x${number.toString(16).slice(0, 2)}`;
        let end = `0x${number.toString(16).slice(2, 4)}`;
        let setMovingGoals = [0x23, 0x04, 0x01, 0x06, start, end, 0x00];
        this.sendDataToWXDevice(
          this.deviceId,
          bytesArrayToBase64(setMovingGoals)
        );
      } else {
        this.$toast("上限为65535步");
        done(false);
        return false;
      }

      // let n;
      // if (this.stepValue > 10) {
      //   n = `0x${this.stepValue}`;
      // } else {
      //   n = `0x0${this.stepValue}`;
      // }
      // 设置运动目标
      // let setMovingGoals = [0x23, 0x04, 0x01, 0x06, 0x00, 0x80, 0x00];
      // this.sendDataToWXDevice(deviceId, "IwQBBgAQPw==");
      // let getMovingGoals = [0x23, 0x02, 0x02, 0x06, 0x29];
      // var _this = this;
      // setTimeout(function() {
      //   _this.sendDataToWXDevice(deviceId, "IwICBik=");
      // }, 1000);
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

      let getAcquisitionActivity = [
        0x23,
        0x05,
        0x02,
        0xf1,
        0x01,
        0x00,
        0x03,
        0x00
      ];
      // this.sendDataToWXDevice(
      //   deviceId,
      //   bytesArrayToBase64(getAcquisitionActivity)
      // );
      // 获取本地时间
      let getLocalTime = [0x23, 0x02, 0x02, 0x02, 0x25];
      this.sendDataToWXDevice(deviceId, bytesArrayToBase64(getLocalTime));
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

      // let getMostRecentSleepEntry = [0x23, 0x03, 0x02, 0xf0, 0x01, 0x00];
      // this.sendDataToWXDevice(
      //   deviceId,
      //   bytesArrayToBase64(getMostRecentSleepEntry)
      // );

      // this.sendDataToWXDevice(
      //   deviceId,
      //   bytesArrayToBase64(getAcquisitionActivity)
      // );
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
            // this.$toast(`数据已发送`);
          } else {
            this.$toast(`数据发送失败`);
          }
        }
      );
    },

    onReceiveDataFromWXDevice() {
      wx.ready(() => {
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
              // return false;
              let len = parseInt(obj[5]);
              if (obj[1] === "08" && obj[2] === "04" && obj[3] === "02") {
                // 获取本地时间日期结束，开始电量信息
                console.log("获取本地时间日期结束，开始电量信息");
                let getDeviceSoc = [0x23, 0x02, 0x02, 0x03, 0x00];
                this.sendDataToWXDevice(
                  deviceId,
                  bytesArrayToBase64(getDeviceSoc)
                );
                this.parsePackets({
                  studentId: this.studentId,
                  deviceId,
                  content: base64Data
                });
              } else if (
                obj[1] === "04" &&
                obj[2] === "04" &&
                obj[3] === "03"
              ) {
                // 获取电量信息结束，开始获取当前步数
                console.log("获取电量信息结束，开始获取当前步数");
                let getCurrentNumberOfSteps = [0x23, 0x02, 0x02, 0x05, 0x00];
                this.sendDataToWXDevice(
                  deviceId,
                  bytesArrayToBase64(getCurrentNumberOfSteps)
                );
                this.parsePackets({
                  studentId: this.studentId,
                  deviceId,
                  content: base64Data
                });
              } else if (
                obj[1] === "04" &&
                obj[2] === "04" &&
                obj[3] === "05"
              ) {
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
                  studentId: this.studentId,
                  deviceId,
                  content: base64Data
                });
              } else if (
                obj[2] === "04" &&
                obj[3] === "F0" &&
                obj[1] === "04"
              ) {
                // 获取最近睡眠记录条目
                console.log("获取最近睡眠记录条目");
                let len = parseInt(obj[5]);
                console.log(len);
                let sleepArr = [];

                if (len === 0) {
                  // 获取已存的睡眠历史记录条数为0,开始获取活跃度目录条数
                  console.log(
                    "获取已存的睡眠历史记录条数为0,开始获取活跃度目录条数"
                  );
                  let getAcquisitionActivity = [
                    0x23,
                    0x05,
                    0x02,
                    0xf1,
                    0x01,
                    0x00,
                    0x03,
                    0x00
                  ];
                  this.sendDataToWXDevice(
                    deviceId,
                    bytesArrayToBase64(getAcquisitionActivity)
                  );
                  this.parsePackets({
                    studentId: this.studentId,
                    deviceId,
                    content: base64Data
                  });
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
              } else if (
                obj[2] === "04" &&
                obj[3] === "F0" &&
                obj[1] === "0E"
              ) {
                // 获取目录的睡眠信息记录
                console.log("获取目录的睡眠信息记录");
                this.sleepUTC.push({
                  n5: `0x${obj[5]}`,
                  n6: `0x${obj[6]}`,
                  n7: `0x${obj[7]}`,
                  n8: `0x${obj[8]}`
                });
                this.utcSleep = `${obj[5]}${obj[6]}${obj[7]}${obj[8]}`;
                this.parsePackets({
                  deviceId,
                  content: base64Data,
                  studentId: this.studentId
                });
              } else if (obj[2] === "01" && obj[3] === "00") {
                // 睡眠片段
                console.log("睡眠片段");
                this.parsePacketSleep({
                  studentId: this.studentId,
                  deviceId,
                  content: base64Data,
                  utc: this.utcSleep
                });
                if (obj[0] === "FF" && obj[1] === "FF") {
                  this.sleepIndex++;
                  console.log(this.sleepIndex);
                  if (this.sleepList.length > this.sleepIndex) {
                    this.sendDataToWXDevice(
                      this.deviceId,
                      this.sleepList[this.sleepIndex]
                    );
                  } else {
                    console.log(this.sleepUTC);
                    console.log("请求数据包第一个目录包结束,开始删除睡眠数据");
                    console.log("开始获取活跃度");
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
                    // this.parsePackets({
                    //   studentId: this.studentId,
                    //   deviceId,
                    //   content: base64Data
                    // });
                    let xiao =
                      0x23 ^
                      (0 + 0x07) ^
                      (1 + 0x08) ^
                      (2 + 0xf0) ^
                      (3 + 0x04) ^
                      (4 + this.sleepUTC[0].n5) ^
                      (5 + this.sleepUTC[0].n6) ^
                      (6 + this.sleepUTC[0].n7) ^
                      (7 + this.sleepUTC[0].n8) ^
                      8;

                    let lenXiao = [
                      0x23,
                      0x07,
                      0x08,
                      0xf0,
                      0x04,
                      this.sleepUTC[0].n5,
                      this.sleepUTC[0].n6,
                      this.sleepUTC[0].n7,
                      this.sleepUTC[0].n8,
                      xiao
                    ];
                    console.log("删除条目的睡眠记录信息开始0");
                    this.sendDataToWXDevice(
                      this.deviceId,
                      bytesArrayToBase64(lenXiao)
                    );
                    this.parsePackets({
                      studentId: this.studentId,
                      deviceId,
                      content: base64Data
                    });
                  }
                }
              } else if (
                obj[2] === "10" &&
                obj[3] === "F0" &&
                obj[1] === "08"
              ) {
                this.parsePackets({
                  studentId: this.studentId,
                  deviceId,
                  content: base64Data
                });
                this.sleepUTCIndex++;
                if (this.sleepUTC.length > this.sleepUTCIndex) {
                  let xiao =
                    0x23 ^
                    (0 + 0x07) ^
                    (1 + 0x08) ^
                    (2 + 0xf0) ^
                    (3 + 0x04) ^
                    (4 + this.sleepUTC[this.sleepUTCIndex].n5) ^
                    (5 + this.sleepUTC[this.sleepUTCIndex].n6) ^
                    (6 + this.sleepUTC[this.sleepUTCIndex].n7) ^
                    (7 + this.sleepUTC[this.sleepUTCIndex].n8) ^
                    8;
                  let lenXiao = [
                    0x23,
                    0x07,
                    0x08,
                    0xf0,
                    0x04,
                    this.sleepUTC[this.sleepUTCIndex].n5,
                    this.sleepUTC[this.sleepUTCIndex].n6,
                    this.sleepUTC[this.sleepUTCIndex].n7,
                    this.sleepUTC[this.sleepUTCIndex].n8,
                    xiao
                  ];
                  console.log(
                    `删除条目的睡眠记录信息开始${this.sleepUTCIndex}`
                  );
                  this.sendDataToWXDevice(
                    this.deviceId,
                    bytesArrayToBase64(lenXiao)
                  );
                } else {
                  console.log(`删除条目完成${this.sleepUTCIndex}`);
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
                    studentId: this.studentId,
                    deviceId,
                    content: base64Data
                  });
                }
              } else if (
                obj[2] === "04" &&
                obj[3] === "F1" &&
                obj[1] === "0B"
              ) {
                //获取活跃度分包目录数
                console.log("获取活跃度分包目录数");
                let arr = [];
                let len = parseInt(obj[7] + obj[8]);
                console.log(len);
                if (len === 0) {
                  console.log("获取活跃度分包目录数调用结束");

                  this.getElectric();
                  this.getStepNumber();
                  this.getAlarmClockCount();
                  this.getSleepTime();
                  this.getMannerWear();
                  sessionStorage.setItem("entryData", 1);
                  this.tip = "数据导入完成";
                  let _this = this;
                  setTimeout(function() {
                    _this.show = false;
                  }, 2000);
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
                    studentId: this.studentId,
                    deviceId,
                    content: base64Data
                  });
                }
              } else if (
                obj[2] === "04" &&
                obj[3] === "F1" &&
                obj[1] === "0C"
              ) {
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
                  studentId: this.studentId,
                  deviceId,
                  content: base64Data
                });
              } else if (obj[2] === "00" && obj[3] === "03") {
                // 请求数据包
                console.log("请求数据包");
                this.utc = this.utcValue;
                this.parsePacketActive({
                  studentId: this.studentId,
                  deviceId,
                  content: base64Data,
                  utc: this.utcValue
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
                    // this.getElectric();
                    // this.getStepNumber();
                    // this.getAlarmClockCount();
                    // this.getSleepTime();
                    // sessionStorage.setItem("entryData", 1);
                    // this.show = false;
                    // this.tip = "数据导入完成";
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
                      studentId: this.studentId
                    });
                  }
                }
              } else if (
                obj[2] === "04" &&
                obj[3] === "F1" &&
                obj[1] === "04"
              ) {
                if (obj[5] === "02") {
                  // 请求数据包请求失败，无效记录序号,开始按UTC删除数据
                  console.log("请求数据包第一个目录包结束,开始按UTC删除数据");
                  // this.getElectric();
                  // this.getStepNumber();
                  // this.getAlarmClockCount();
                  // this.getSleepTime();
                  // sessionStorage.setItem("entryData", 1);
                  // this.show = false;
                  // this.tip = "数据导入完成";
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
                    studentId: this.studentId
                  });
                }
              } else if (obj[2] === "10" && obj[3] === "F1") {
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

                    studentId: this.studentId
                  });
                }
              } else if (
                obj[1] === "03" &&
                obj[2] === "01" &&
                obj[3] === "01" &&
                obj[4] === "00"
              ) {
                let getMovingGoals = [0x23, 0x02, 0x02, 0x06, 0x00];
                this.sendDataToWXDevice(
                  this.deviceId,
                  bytesArrayToBase64(getMovingGoals)
                );
              } else if (
                obj[1] === "04" &&
                obj[2] === "04" &&
                obj[3] === "06"
              ) {
                this.parsePackets({
                  deviceId,
                  content: base64Data,
                  studentId: this.studentId
                });
              }
            }
          });
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
    // 获取当前步数
    async getStepNumber() {
      let res = await service.getStepNumber({
        studentId: this.studentId
      });
      console.log(res);
      if (res.errorCode === 0) {
        this.dataValue.setStep = res.data.stepTarget;
        this.dataValue.step = res.data.stepNumber;
      }
    },
    // 获取睡眠
    async getSleepTime() {
      let res = await service.getSleepTime({
        studentId: this.studentId
      });
      if (res.errorCode === 0) {
        this.dataValue.nightTime = res.data[0].sleepDuration;
        this.dataValue.lunchTime = "0小时0分钟";
      } else {
        this.dataValue.nightTime = "0小时0分钟";
        this.dataValue.lunchTime = "0小时0分钟";
      }
    },

    // 返回佩戴习惯
    async getMannerWear() {
      let res = await service.getMannerWear({
        studentId: this.studentId
      });
      console.log(res);
      if (res.errorCode === 0) {
        this.getWear = `${res.data.wear === 0 ? "左右" : "右手"}-${
          res.data.screen === 0 ? "横屏" : "竖屏"
        }`;
        this.wear = res.data.wear;
        this.screen = res.data.screen;
      } else {
        this.wear = 0;
        this.screen = 0;
        this.getWear = `左手-横屏`;
      }
    },

    // 获取当前孩子列表
    async queryOpenStudentList() {
      let res = await service.queryOpenStudentList({
        openId: this.$store.state.user.info.openId
      });
      if (res.errorCode === 0) {
        let lists = res.data.filter(item => item.isBindBracelet === 1);
        if (lists.length === 1) {
          this.hasBind = true;
        } else {
          this.hasBind = false;
        }
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
  height: 600px;
  position: relative;
  width: 100%;
  .myAttr {
    width: 90%;
    position: absolute;
    left: 5%;
    top: 220px;
    background: #fff;
    box-shadow: 0px 8px 12px 1px rgba(162, 223, 87, 0.09);
    border-radius: 10px;
    .van-cell {
      &:first-of-type {
        border-radius: 30px 30px 0px 0;
      }
      &:last-of-type {
        border-radius: 0px 0px 30px 30px;
      }
      padding: 30px;
      .van-cell__title {
        color: #666;
        font-size: 30px;
        margin-left: 10px;
      }
      .van-cell__value {
        color: #666666;
        font-size: 28px;
      }
    }
  }
}

.setAttr,
.version {
  .van-cell {
    padding: 40px 20px;
    .van-cell__title {
      color: #999999;
      font-size: 30px;
    }
    .van-cell__value {
      color: #666666;
      font-size: 28px;
    }
  }
}

.connectStatus {
  position: absolute;
  right: 0;
  top: 40px;
  width: 230px;
  height: 70px;
  border: none;
  outline: none;
  background: #c0e77e;
  color: #ff4040;
  border-radius: 80px 0 0 80px;
}

.backIndex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 230px;
  height: 70px;
  position: fixed;
  left: 0;
  top: 800px;
  background: #c0e77e;
  color: #fff;
  border-radius: 0px 80px 80px 0px;
  .van-icon {
    margin-left: 10px;
    font-size: 40px;
  }
}

.no_data {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .empty {
    padding: 0 !important;
    color: #ccc;
    img {
      width: 350px;
      height: 350px;
    }
    button {
      outline: none;
      border: none;
      margin: 150px 0px 50px;
      padding: 20px 100px;
      background: linear-gradient(
        117deg,
        rgba(162, 225, 78, 1),
        rgba(162, 222, 90, 1)
      );
      border-radius: 75px;
      color: #fff;
    }
    .commom {
      color: #999;
      font-size: 28px;
    }
  }
}

.gradient-two {
  height: 36vw;
}

.dialog {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  > div {
    width: 400px;
    height: 300px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    > p {
      width: 100%;
      text-align: center;
    }
  }
}
</style>

