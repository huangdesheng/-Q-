<template>
  <div>
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
            <template v-if="hasBind">
              <van-radio
                :name="item.studentId"
                checked-color="#a2e14e"
                :disabled="hasBind"
                v-if="item.isBindBracelet == 0"
              />
              <span v-else class="binded">已绑定</span>
            </template>
            <template v-else>
              <van-radio :name="item.studentId" checked-color="#a2e14e" />
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
    <div class="page-ft" v-if="!hasBind && state === 'connected'">
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
</style>