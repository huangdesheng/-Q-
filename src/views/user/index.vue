<template>
  <div class="page">
    <div class="page-bd">
      <template v-if="visibility">
        <div class="overlay" @click="visibility = false" style="z-index: 110;"></div>
        <div class="share-tip" style="z-index: 120;">
          <img src="@/assets/share-tip.png" />
          <p size-18>请点击右上角按钮邀请好友吧</p>
        </div>
      </template>
      <!-- 用户 -->
      <template v-if="roleType == 1 || roleType == 2 || roleType == 4">
        <div class="flex a-i-c home-user gradient-two" @click="handleRoleJump">
          <div class="switch-role" v-if="roleList.length == 2" @click.stop="jumpRoleSelect">
            <van-icon name="replay" size="16px"></van-icon>
            <span>切换角色</span>
          </div>
          <div class="flex a-i-c">
            <div class="avatar flex a-i-c">
              <img :src="photo" width="60" height="60" radius="50" />
            </div>
            <div class="js-user-change">
              <h3 class="mb-20" size-18>{{ name }}</h3>
              <p size-12>知识是智慧的火炬</p>
            </div>
          </div>
          <van-icon name="arrow" size="16px"></van-icon>
        </div>
        <van-cell
          class="a-i-c"
          size="large"
          :title="cell.title"
          is-link
          :to="cell.to"
          v-for="(cell, index) in teacherMenu"
          :key="index"
        >
          <template slot="icon">
            <img :src="cell.icon" class="user-icon" />
          </template>
        </van-cell>
      </template>
      <template v-else>
        <div class="flex a-i-c home-user gradient-two" @click="handleRoleJump">
          <div class="switch-role" v-if="roleList.length == 2" @click.stop="jumpRoleSelect">
            <van-icon name="replay" size="16px"></van-icon>
            <span>切换角色</span>
          </div>
          <div class="flex a-i-c">
            <div class="avatar flex a-i-c">
              <template v-if="name">
                <img :src="photo" width="60" height="60" radius="50" v-if="photo" />
                <img src="@/assets/child-default@2x.png" width="60" height="60" radius="50" v-else />
              </template>
              <template v-else>
                <img src="@/assets/child-default@2x.png" width="60" height="60" radius="50" />
                <p class="ml-20">尚未有关注孩子，点击添加。</p>
              </template>
            </div>
            <div class="js-user-change">
              <template v-if="name">
                <h3 class="mb-20" size-18>
                  {{ name }}
                  <small>Q星: {{ totalStarCount }}</small>
                </h3>
                <p size-12>您的坚持和鼓励是开启孩子好习惯的钥匙</p>
              </template>
            </div>
          </div>
          <van-icon name="arrow" size="16px"></van-icon>
        </div>
        <van-cell
          class="mb-20 a-i-c"
          size="large"
          title="邀请亲友关注"
          is-link
          @click="visibility = true"
          v-if="studentId != 0"
        >
          <template slot="icon">
            <img src="@/assets/user-icon-6@2x.png" class="user-icon" />
          </template>
        </van-cell>
        <!-- <van-cell
          class="a-i-c"
          size="large"
          :title="cell.title"
          is-link
          :to="cell.to"
          v-for="(cell, index) in userMenu"
          :key="index"
        >
          <template slot="icon">
            <img :src="cell.icon" class="user-icon" />
          </template>
        </van-cell>-->

        <van-cell class="a-i-c" size="large" title="我的作品" is-link to="/works">
          <template slot="icon">
            <img src="../../assets/user-icon-5@2x.png" class="user-icon" />
          </template>
        </van-cell>
        <van-cell class="a-i-c" size="large" title="我的课表" is-link to="/schedule">
          <template slot="icon">
            <img src="../../assets/user-icon-11@2x.png" class="user-icon" />
          </template>
        </van-cell>
        <van-cell class="a-i-c" size="large" title="我的手环" is-link @click="handleHand">
          <template slot="icon">
            <img src="../../assets/user-icon-7@2x.png" class="user-icon" />
          </template>
        </van-cell>
        <van-cell class="a-i-c" size="large" title="教育推荐" is-link to="/edu-recommend">
          <template slot="icon">
            <img src="../../assets/user-icon-8@2x.png" class="user-icon" />
          </template>
        </van-cell>
        <van-cell class="a-i-c" size="large" title="阅读推荐" is-link to="/read-recommend">
          <template slot="icon">
            <img src="../../assets/user-icon-9@2x.png" class="user-icon" />
          </template>
        </van-cell>
        <van-cell class="a-i-c" size="large" title="活动推荐" is-link to="/activity-recommend">
          <template slot="icon">
            <img src="../../assets/user-icon-10@2x.png" class="user-icon" />
          </template>
        </van-cell>
        <van-cell class="a-i-c" size="large" title="帮助中心" is-link to="/help-center">
          <template slot="icon">
            <img src="../../assets/user-icon-2@2x.png" class="user-icon" />
          </template>
        </van-cell>
      </template>
      <!-- <div class="cells mt-20" v-if="roleType == 4 || roleType == 1">
        <div class="cell min-h100">
          <img src="@/assets/ClassRing.png" alt="" />
          <div class="cell-hd">班级圈开关</div>
          <div class="cell-bd" style="text-align: right;">
            <van-switch
              v-model="switched"
              size="26px"
              active-color="#92cd36"
              @change="handleChange"
            ></van-switch>
          </div>
        </div>
      </div>-->

      <div class="cells mt-20" v-if="roleType == 4 || roleType == 1">
        <div class="cell min-h100">
          <img src="@/assets/leaveWord.png" alt />
          <div class="cell-hd">留言开关</div>
          <div class="cell-bd" style="text-align: right;">
            <van-switch
              v-model="switched"
              size="26px"
              active-color="#92cd36"
              @change="handleChange"
            ></van-switch>
          </div>
        </div>
      </div>
    </div>
    <div class="page-ft">
      <qxFooter></qxFooter>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import qxFooter from "@/components/Footer";
import { mapState } from "vuex";
import wxapi from "@/config/wxapi";
import { API_ROOT } from "@/config/isdev";
import sdkDevice from "@/mixins/sdkDevice";
export default {
  name: "user",
  components: {
    qxFooter
  },

  data() {
    return {
      switched: false,
      visibility: false,
      roleList: [],
      hasBind: true,
      teacherMenu: [
        {
          title: "学生作品",
          to: "/works/teacher",
          icon: require("../../assets/user-icon-5@2x.png")
        },
        {
          title: "教育推荐",
          to: "/edu-recommend",
          icon: require("../../assets/user-icon-8@2x.png")
        },
        {
          title: "阅读推荐",
          to: "/read-recommend",
          icon: require("../../assets/user-icon-9@2x.png")
        },
        {
          title: "活动推荐",
          to: "/activity-recommend",
          icon: require("../../assets/user-icon-10@2x.png")
        },
        {
          title: "帮助中心",
          to: "/help-center",
          icon: require("../../assets/user-icon-2@2x.png")
        }
      ],
      userMenu: [
        {
          title: "我的作品",
          to: "/works",
          icon: require("../../assets/user-icon-5@2x.png")
        },
        {
          title: "我的课表",
          to: "/schedule",
          icon: require("../../assets/user-icon-11@2x.png")
        },
        {
          title: "我的手环",
          to: "/device/studentList",
          icon: require("../../assets/user-icon-7@2x.png")
        },
        {
          title: "教育推荐",
          to: "/edu-recommend",
          icon: require("../../assets/user-icon-8@2x.png")
        },
        {
          title: "阅读推荐",
          to: "/read-recommend",
          icon: require("../../assets/user-icon-9@2x.png")
        },
        {
          title: "活动推荐",
          to: "/activity-recommend",
          icon: require("../../assets/user-icon-10@2x.png")
        },
        {
          title: "帮助中心",
          to: "/help-center",
          icon: require("../../assets/user-icon-2@2x.png")
        }
      ]
    };
  },
  mixins: [sdkDevice],
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
    handleInitSwitch() {
      return (this.switched = this.isOpen === "true" ? true : false);
    },
    //管理员控制家长是否可以发班级圈
    handleChange() {
      let isOpen = this.switched ? true : false;
      this.updateIsOpen({ isOpen, schoolId: this.id });
    },
    handleRoleJump() {
      if (this.roleType == 1 || this.roleType == 2 || this.roleType == 4) {
        this.$router.push({
          path: "/role"
        });
      } else {
        let path = this.studentId == 0 ? "/child/add" : "/child";
        this.$router.push({
          path,
          query: {
            search: "user"
          }
        });
      }
    },
    //角色切换页面
    jumpRoleSelect() {
      this.$router.push({
        path: "/role/select"
      });
    },
    wxRegCallback() {
      //用于微信JS-SDK回调
      this.wxShareAppMessage();
    },
    wxShareAppMessage() {
      let that = this;
      let shareUrl = "";
      let shareDesc = "";
      if (this.studentId != 0) {
        shareUrl = API_ROOT + "#/baby/share?classId=0&id=" + this.id;
        shareDesc = "邀请您一起关注孩子成长吧";
      } else {
        shareUrl = API_ROOT + "#/share";
        shareDesc = "小Q智慧欢迎您的加入";
      }
      let option = {
        title: "亲爱的用户您好", // 分享标题
        desc: shareDesc, // 分享描述
        link: shareUrl, // 分享链接，根据自身项目决定是否需要split
        success: () => {
          that.$toast("分享成功");
        },
        error: () => {
          that.$toast("已取消分享");
        }
      };
      wxapi.wxShareAppMessage(option);
    },
    //多角色列表
    async queryRole(params = {}) {
      let res = await service.queryRole(params);
      if (res.errorCode === 0) {
        this.roleList = res.data;
      }
    },
    //控制家长端发布班级圈权限
    async updateIsOpen(params = {}) {
      let res = await service.updateIsOpen(params);
      if (res.errorCode === 0) {
        //更新本地cookie值
        let { isOpen } = res.data;
        let _cookie = Cookies.getJSON("info");
        let obj = Object.assign({}, _cookie, { isOpen });
        this.$store.dispatch("user/setInfo", obj).then(data => {
          if (data.success === "ok") {
          }
        });
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
    },

    // 获取绑定设备的状态
    handleHand() {
      this.$router.push({
        path: "/device"
      });
      // this.init();
    },
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
              this.state = res.deviceInfos[0].state;
              this.deviceId = res.deviceInfos[0].deviceId;
              console.log(this.deviceId);
            } else {
              this.list = [];
              this.deviceId = "";
            }
            if (this.bluetooth === true) {
              this.$router.push({
                path: "/device/studentList",
                query: {
                  deviceId: this.deviceId,
                  hasBind: this.hasBind
                }
              });
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
              this.$dialog({
                message: "使用前请先打开手机蓝牙"
              });
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
    onReceiveDataFromWXDevice() {}
  },
  mounted() {
    this.handleInitSwitch();
    wxapi.wxRegister(this.wxRegCallback);
    this.queryRole({ openId: this.openId });
  },
  beforeRouteLeave(to, from, next) {
    console.log("beforeRouteLeave");
    if (this.roleType == 9 && to.path === "/home") {
      let _cookie = Cookies.getJSON("info");
      console.log("进入体验用户");
      this.$store
        .dispatch("experience/experience", { studentId: this.studentId })
        .then(res => {
          if (Object.keys(res).length) {
            let params = Object.assign({}, _cookie, res);
            this.$store.dispatch("user/setInfo", params).then(data => {
              if (data.success === "ok") {
                next();
              }
            });
          }
        });
    } else {
      next();
    }
  }
};
</script>
<style lang="less" scoped>
.home-user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 180px;
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
.cell {
  img {
    width: 46px;
    height: 46px;
    margin-right: 27px;
    margin-left: 8px;
  }
}
</style>

