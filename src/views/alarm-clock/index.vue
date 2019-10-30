<template>
  <div class="page">
    <template v-if="lists === 1"></template>
    <template v-if="lists.length === 0">
      <div class="page-bd myHand">
        <div class="page-bd no_data">
          <div class="empty">
            <img src="@/assets/kong.png" alt />
            <p class="mt-30">添加闹钟有助于您把控时间哦~</p>
          </div>
        </div>
      </div>
    </template>
    <template v-if="lists.length >0">
      <div class="page-bd">
        <div class="cells flex j-c-s-b a-i-c alarm" v-for="(item,index) in lists" :key="index">
          <div @click="editClock(item.clockId,item.id)">
            <p>{{item.remark}}</p>
            <p class="flex a-i-c">
              <span v-if="parseInt(item.time.slice(0, 2))<12">上午</span>
              <span v-else>下午</span>
              {{item.time}}
            </p>
          </div>
          <div class="flex-1" @click="editClock(item.clockId,item.id)">
            <p>
              <span v-if="String(item.bitMap).split('')[0] == 1">周日</span>
              <span v-if="String(item.bitMap).split('')[1] == 1">周一</span>
              <span v-if="String(item.bitMap).split('')[2] == 1">周二</span>
              <span v-if="String(item.bitMap).split('')[3] == 1">周三</span>
              <span v-if="String(item.bitMap).split('')[4] == 1">周四</span>
              <span v-if="String(item.bitMap).split('')[5] ==1">周五</span>
              <span v-if="String(item.bitMap).split('')[6] == 1">周六</span>
            </p>
            <p v-if="item.status === true">开启</p>
            <p v-if="item.status === false">未开启</p>
          </div>
          <van-switch v-model="item.status" active-color="#FDA322" @change="clockBtn(item)" />
        </div>
      </div>
    </template>
    <div class="page-ft" v-if="lists.length<6">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" @click="addClock">添加闹钟</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { mapState } from "vuex";
import sdkDevice from "@/mixins/sdkDevice";
import { bytesArrayToBase64 } from "@/utils/arrayToBase64";

export default {
  name: "alarmClock",
  data() {
    return {
      lists: 1,
      itemObj: {}
    };
  },
  mixins: [sdkDevice],

  mounted() {
    this.getAlarmClock();
    this.init();
    // 初始化蓝牙状态
  },
  methods: {
    clockBtn(item) {
      this.itemObj = item;
      let hh = `0x${parseInt(item.time.slice(0, 2))}`;
      let ff = `0x${parseInt(item.time.slice(3, 5))}`;
      let num = `0x0${item.id}`;
      let n = `0x${parseInt(item.bitMap, 2).toString(16)}`;
      let clockStatus;
      if (item.status === true) {
        clockStatus = `0x01`;
      } else {
        clockStatus = `0x00`;
      }
      const setAlarmClock = [
        0x23,
        0x07,
        0x01,
        0x07,
        num,
        hh,
        ff,
        n,
        clockStatus,
        0x00
      ];
      this.sendDataToWXDevice(this.deviceId, bytesArrayToBase64(setAlarmClock));
    },
    async getAlarmClock() {
      let res = await service.getAlarmClock({
        studentId: this.studentId
      });
      if (res.errorCode === 0) {
        this.lists = res.data;
      }
    },
    async addOrUpdateAlarmClock() {
      let data = this.itemObj;
      data.status = data.status === true ? 1 : 0;
      let res = await service.addOrUpdateAlarmClock(data);
      if (res.errorCode === 0) {
        this.getAlarmClock();
      } else {
        this.$toast(res.errorMessage);
      }
    },
    addClock() {
      this.$router.push({
        path: "/alarm-clock/add",
        query: { index: this.lists.length + 1 }
      });
    },
    editClock(clockId, index) {
      this.$router.push({
        path: "/alarm-clock/add",
        query: { clockId, index }
      });
    },

    sendDataToWXDevice(deviceId, base64Data = "") {
      console.log("send data");
      var _this = this;
      wx.ready(function() {
        WeixinJSBridge.invoke(
          "sendDataToWXDevice",
          {
            deviceId,
            connType: "blue",
            base64Data
          },
          res => {
            if (res.err_msg === "sendDataToWXDevice:ok") {
              _this.$toast(`数据已发送`);
              _this.addOrUpdateAlarmClock();
            } else {
              _this.$toast(`数据发送失败`);
            }
          }
        );
      });
    },
    onReceiveDataFromWXDevice() {
      wx.ready(function() {
        WeixinJSBridge.on("onReceiveDataFromWXDevice", res => {
          console.log("接收数据onReceiveDataFromWXDevice");
          service.decoder({ content: res.base64Data }).then(res => {
            if (res.errorCode === 0) {
              let obj = res.data[0];
              // this.addOrUpdateAlarmClock();
            }
          });
        });
      });
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
  }
};
</script>
<style lang="less" scoped>
.alarm {
  padding: 50px 30px;
  border-bottom: 1px solid #eee;
  div {
    color: #666666;
    &:nth-of-type(2) {
      padding-left: 20px;
      font-size: 24px;
    }
    &:nth-of-type(1) {
      padding-right: 20px;
      border-right: 1px solid #eee;
      p {
        &:nth-of-type(2) {
          font-size: 50px;
          font-weight: 600;
          color: #333;
          padding-top: 15px;
          span {
            font-size: 24px;
            color: #666;
            font-weight: 500;
          }
        }
      }
    }
    p {
      &:nth-of-type(2) {
        padding-top: 20px;
      }
    }
  }
}

.no_data {
  width: 100vw;
  height: 90vh;
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
  }
}
</style>