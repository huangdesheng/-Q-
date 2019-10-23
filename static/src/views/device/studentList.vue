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
            @click="radio = item.studentId"
          >
            <van-radio
              :name="item.studentId"
              checked-color="#a2e14e"
              v-if="item.isBindBracelet"
              disabled
            />
            <van-radio :name="item.studentId" checked-color="#a2e14e" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" @click="handleBang">确认绑定</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      radio: "1",
      studentList: [],
      deviceId: ""
    };
  },
  mounted() {
    this.queryOpenStudentList();
    this.openWXDeviceLib();
    this.getWXDeviceInfos();
  },
  methods: {
    handleBang() {
      let data = {
        deviceId: this.deviceId,
        studentId: this.radio
      };
      console.log(data);
    },
    async queryOpenStudentList() {
      let res = await service.queryOpenStudentList({
        openId: this.$store.state.user.info.openId
      });
      if (res.errorCode === 0) {
        this.studentList = res.data;
        this.radio = res.data[0].studentId;
      }
    },
    openWXDeviceLib() {
      wx.invoke("openWXDeviceLib", { connType: "blue" }, res => {
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
    getWXDeviceInfos() {
      wx.invoke("getWXDeviceInfos", {}, res => {
        console.log(res);
        console.log("res设备deviceId");
        if (res.err_msg === "getWXDeviceInfos:ok") {
          //绑定设备总数量
          if (res.deviceInfos.length) {
            // this.list = res.deviceInfos;
            this.deviceId = res.deviceInfos[0].deviceId;
          } else {
            this.list = [];
          }
        }
      });
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
</style>