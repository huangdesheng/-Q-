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
            <van-radio :name="item.studentId" checked-color="#a2e14e" :disabled="hasBind" />
            <!-- <van-radio :name="item.studentId" checked-color="#a2e14e" v-else /> -->
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <button @click="addChild">添加小孩</button>
    </div>
    <button class="connectStatus" v-if="state == 'connected'">已连接</button>
    <button class="connectStatus" v-else-if="state == 'disconnected'">未连接</button>
    <button class="connectStatus" v-else-if="state == 'connecting'">连接中</button>
    <div class="page-ft" v-if="!hasBind">
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
      itemObj: {},
      hasBind: true
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
    // 获取关联学生
    async queryOpenStudentList() {
      let res = await service.queryOpenStudentList({
        openId: this.$store.state.user.info.openId
      });
      if (res.errorCode === 0) {
        this.studentList = res.data;
        let lists = res.data.filter(item => item.isBindBracelet === 1);
        if (lists.length === 1) {
          this.hasBind = true;
          this.isBindBracelet = lists[0].isBindBracelet;
          this.radio = lists[0].studentId;
          this.itemObj = lists[0];
        } else {
          this.hasBind = false;
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
      console.log(obj);
      this.$store.dispatch("user/setInfo", obj).then(data => {
        if (data.success === "ok") {
          let param = {
            openId: this.$store.state.user.info.openId,
            studentId: obj.studentId,
            type: 1
          };
          this.switchingState(param);
          this.$router.push({
            path: "/device/studentList",
            query: {
              deviceId: this.deviceId,
              hasBind: true
            }
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