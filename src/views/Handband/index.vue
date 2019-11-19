<template>
  <div>
    <div class="dialogDeviceId" v-if="dialog" style="z-index:1000">
      <!-- <ul>

        <li
          v-for="(item, index) in deviceList"
          :key="index"
          @click="deviceIdClick(item.deviceId)"
        >{{item.deviceId}}</li>
      </ul>-->
      <div>
        <p>
          已连接
          <span>{{num}}</span>手环设备
        </p>
        <!-- <p>中国暂时实现一夫一妻制！所以暂时只针对单手环进行处理！将多出的手环移开</p> -->
        <p>温馨提示：发现多个设备，请先关闭其他手环设备或将其他手环挪开。</p>
        <van-radio-group v-model="radioDevice" class="radio-btn">
          <van-radio
            v-for="(item, index) in deviceList"
            :key="index"
            :name="item.deviceId"
          >手环:{{item.deviceId}}</van-radio>
        </van-radio-group>
        <!-- <button @click="dialog=false">确认</button> -->
      </div>
    </div>
    <div class="cells-title studentList">选择需要绑定手环的小孩</div>
    <div class="list">
      <div class="flex title">
        <div class="title_left">
          <span class="tp"></span>
          <span>孩子列表</span>
        </div>
        <button class="connectStatus" v-if="state == 'connected'">设备已连接</button>
        <button class="connectStatus" v-else-if="state == 'disconnected'">设备未连接</button>
        <button class="connectStatus" v-else-if="state == 'connecting'">设备连接中</button>
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
            <template v-if="!hasBind && item.isBindBracelet == 0">
              <van-radio :name="item.studentId" checked-color="#a2e14e" />
            </template>
            <template v-else>
              <van-radio
                :name="item.studentId"
                checked-color="#a2e14e"
                :disabled="hasBind"
                v-if="item.isBindBracelet == 0"
              />
              <span v-else class="binded">已绑定</span>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
    <div class="addChild" @click="addChild" v-if="!hasBind">
      <van-icon name="add-o" />
      <span>点击新增小孩</span>
    </div>
    <!-- <button class="connectStatus" v-if="state == 'connected'">已连接</button>
    <button class="connectStatus" v-else-if="state == 'disconnected'">未连接</button>
    <button class="connectStatus" v-else-if="state == 'connecting'">连接中</button>-->

    <p class="tip">注释：如若设备长时间未连接请重新开启蓝牙并让手机与 手环设备贴合</p>
    <div class="page-ft" v-if="!hasBind && state === 'connected' && studentLength">
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
// import sdkDevice from "@/mixins/sdkDevice";
// import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      radio: "1",
      studentList: [],
      isBindBracelet: "",
      itemObj: {},
      hasBind: false,
      state: "",
      bindStudentList: [],
      studentLength: false,
      deviceList: [],
      dialog: false,
      deviceId: "",
      radioDevice: "",
      num: 0
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

  activated() {
    // 获取关联学生
    this.queryOpenStudentList();
  },

  computed: {
    ...mapState("user", {
      device: state => state.info.deviceId
    })
  },

  // mixins: [sdkDevice],
  methods: {
    // 获取关联学生
    async queryOpenStudentList() {
      let res = await service.queryOpenStudentList({
        openId: this.$store.state.user.info.openId
      });
      if (res.errorCode === 0) {
        this.studentList = res.data;
        let lists = res.data.filter(item => item.isBindBracelet === 1);
        this.bindStudentList = lists;
        if (this.bindStudentList.length != this.studentList.length) {
          this.studentLength = true;
        }
        if (lists.length === 1) {
          // this.hasBind = true;
          this.isBindBracelet = lists[0].isBindBracelet;
          this.radio = lists[0].studentId;
          this.itemObj = lists[0];
        } else {
          // this.hasBind = false;
          this.isBindBracelet = res.data[0].isBindBracelet;
          this.radio = res.data[0].studentId;
          this.itemObj = res.data[0];
        }
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
      let data = {
        deviceId: this.deviceId,
        studentId: this.radio
      };
      if (this.deviceId === "") {
        this.$toast(`暂无搜索到手环设备`);
        return false;
      }

      if (this.bindStudentList.length === this.studentList.length) {
        this.$toast(`当前所有孩子已绑定手环`);
        return false;
      }
      let res = await service.bindStudent(data);
      if (res.errorCode === 0) {
        this.itemObj.isBindBracelet = 1;
        this.handleStudentChange(this.itemObj);
      }
    },
    // 添加小孩
    async addChild() {
      this.$router.push({
        path: "/Handband/add",
        query: {
          deviceId: this.deviceId
        }
      });
    },

    //点击孩子进行切换操作
    handleStudentChange(params = {}) {
      let { sex, ...args } = params;
      let _cookie = Cookies.getJSON("info");
      let obj = Object.assign({}, _cookie, args);
      obj.deviceId = this.deviceId;
      this.$store.dispatch("user/setInfo", obj).then(data => {
        if (data.success === "ok") {
          let param = {
            openId: this.$store.state.user.info.openId,
            studentId: obj.studentId,
            type: 1
          };
          this.switchingState(param);
          this.$dialog({
            title: "设备绑定成功",
            message: `手环设备的后6位字符为${this.deviceId.substr(
              this.deviceId.length - 6
            )}`
          }).then(() => {
            this.$router.push({
              path: "/device/studentList",
              query: {
                deviceId: this.deviceId,
                hasBind: true
              }
            });
          });
        }
      });
    },
    //最后登录状态记录
    async switchingState(params = {}) {
      let res = await service.switchingState(params);
      console.log(res);
      if (res.errorCode === 0) {
      }
    },

    //  查询设备是否绑定学生
    async queryBindStudent(device) {
      let res = await service.queryBindStudent({
        deviceId: device
      });
      console.log(res);
      if (res.errorCode === 0) {
        this.hasBind = false;
        if (this.bindStudentList.length === this.studentList.length) {
          this.$toast("当前所有孩子已被绑定");
        }
      } else {
        this.hasBind = true;
        this.$toast(res.errorMsg);
      }
    },

    // 初始化设备库
    openWXDeviceLib() {
      wx.ready(() => {
        WeixinJSBridge.invoke(
          "openWXDeviceLib",
          {
            connType: "blue"
          },
          res => {
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
          }
        );
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

    // 获取设备信息
    getWXDeviceInfos() {
      wx.ready(() => {
        WeixinJSBridge.invoke("getWXDeviceInfos", {}, res => {
          console.log(res);
          if (res.err_msg === "getWXDeviceInfos:ok") {
            //绑定设备总数量
            if (res.deviceInfos.length) {
              // let arr = [];
              let deviceIdArr = [];
              this.studentList.forEach(element => {
                deviceIdArr.push(element.deviceId);
              });
              let arr = res.deviceInfos.filter(item => {
                return (
                  item.state === "connected" &&
                  !deviceIdArr.includes(item.deviceId)
                );
              });
              console.log(arr);
              if (arr.length > 1) {
                this.dialog = true;
                this.num = arr.length;
                // this.state = arr[0].state;
                // this.deviceId = arr[0].deviceId;
                // this.queryBindStudent(this.deviceId);
                // this.$dialog.alert({
                //   message: "已接入多个设备！请先移除剩一个"
                // });
              } else if (arr.length === 1) {
                console.log(1);
                this.dialog = false;
                this.state = arr[0].state;
                this.deviceId = arr[0].deviceId;
                this.queryBindStudent(this.deviceId);
              } else {
                console.log(2);
                let singleArr = res.deviceInfos.filter(
                  item => item.deviceId == this.device
                );
                // console.log(singleArr);
                this.dialog = false;
                this.state = singleArr[0].state;
                this.deviceId = singleArr[0].deviceId;
                this.queryBindStudent(this.deviceId);
                // this.state = "disconnected";
                // this.deviceId = "";
                // this.$dialog.alert({
                //   message: "已接入多个设备！请先移除剩一个"
                // });
              }
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
          {
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
    deviceIdClick(deviceId) {
      this.dialog = false;
      this.deviceId = deviceId;
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
    margin: 0 0vw 0 1vw;
    align-items: center;
    padding: 4vw 0vw;
    justify-content: space-between;
    .title_left {
      .tp {
        height: 30px;
        width: 6px;
        background: #a2e14e;
        margin-right: 10px;
      }
    }
  }
}

.connectStatus {
  width: 250px;
  height: 60px;
  border: none;
  outline: none;
  background: rgba(192, 231, 126, 1);
  border-radius: 25px 0px 0px 25px;
  color: #fff;
}

.addChild {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 4vw;
  margin: 5vw 0 5vw;
  span {
    margin-left: 15px;
    color: #a2df58;
    font-size: 30px;
  }
}

.van-icon {
  font-size: 40px;
  color: #a2df58;
}

.list {
  .van-radio-group {
    .van-cell-group {
      .van-cell {
        padding: 30px 15px;
      }
    }
  }
}

.binded {
  font-size: 25px;
  background: #b0de7a;
  color: #fff;
  border-radius: 100px;
  padding: 5px 15px;
}

.tip {
  font-size: 25px;
  line-height: 40px;
  color: #666;
  padding: 0 10vw;
  margin: 20px 0;
}

.dialogDeviceId {
  background: rgba(0, 0, 0, 0.6);
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;

  > div {
    background: #fff;
    border-radius: 20px;
    width: 90%;
    p {
      &:nth-of-type(1) {
        text-align: center;
        // color: #93db21;
        font-size: 35px;
        padding-top: 40px;
        span {
          color: red;
        }
      }
      &:nth-of-type(2) {
        color: #666;
        font-size: 32px;
        padding: 40px;
        line-height: 50px;
      }
    }
    button {
      padding: 30px 0px;
      width: 100%;
      border: none;
      outline: none;
      text-align: center;
      color: #93db21;
      font-size: 35px;
    }
    .radio-btn {
      .van-radio {
        padding: 40px 20px;
        border-bottom: 1px solid #eee;
      }
    }
  }
}
</style>