  <template>
  <div class="page">
    <div class="page-bd">
      <div class="dialogData" style="z-index:1000" v-if="show">
        <div>
          <van-circle v-model="currentRate" :rate="100" :speed="speed" :text="text" />
          <p>{{tip}}</p>
        </div>
      </div>
      <!-- dialog 图片生成分享 -->
      <van-dialog
        v-model="dialogImage"
        close-on-click-overlay
        :show-confirm-button="false"
      >
        <div class="cells">
          <img :src="shareImgUrl" />
          <p class="text-center pt-30 pb-30 share-desctext">
            长按图片保存或发给朋友
          </p>
        </div>
      </van-dialog>
      <!-- dialog 1 -->
      <van-dialog v-model="dialogVisible">
        <div class="actionView">
          <div>
            <strong>行为目标:</strong>
            <div class="ml-20 font-color">{{ actionView.textContent }}</div>
          </div>
          <div class>
            <strong>评价标准:</strong>
            <ul class="ml-20 disc font-color">
              <li v-for="(item, index) in actionView.rules" :key="index">
                {{ item.ruleText }}
              </li>
            </ul>
          </div>
        </div>
      </van-dialog>
      <!-- dialog 1 -->
      <van-dialog
        v-model="dialogNote"
        title="添加备注"
        show-cancel-button
        :before-close="handleSubmit"
      >
        <div class="cells" style="padding:15px 0 15px 0;">
          <div class="cell">
            <div class="cell-bd">
              <textarea
                rows="5"
                class="textarea"
                placeholder="您可以输入备注信息....."
                v-model="form.remarks"
              ></textarea>
            </div>
          </div>
        </div>
      </van-dialog>
      <div class="wrap">
        <!-- 用户 -->
        <div class="flex a-i-c home-user gradient-two" @click="handleRoleJump">
          <div class="flex a-i-c">
            <template v-if="name">
              <div class="avatar-circle flex a-i-c j-c-c">
                <img
                  :src="photo"
                  width="60"
                  height="60"
                  radius="50"
                  v-if="photo"
                />
                <!-- 如果用户没有上传头像 -->
                <img
                  src="@/assets/child-default@2x.png"
                  width="60"
                  height="60"
                  radius="50"
                  v-else
                />
              </div>
              <div class="js-user-change">
                <h3 class="mb-20" size-18>
                  {{ name }}
                  <small>Q星: {{ totalStarCount }}</small>
                </h3>
                <p size-12>您的坚持和鼓励是开启孩子好习惯的钥匙</p>
              </div>
            </template>
            <template v-else>
              <div class="avatar-circle">
                <img
                  src="@/assets/child-default@2x.png"
                  width="60"
                  height="60"
                  radius="50"
                />
              </div>
              <p class="ml-20">尚未有关注孩子，点击添加。</p>
            </template>
          </div>
          <van-icon name="arrow" size="16px"></van-icon>
        </div>
        <!-- 用户 -->
        <van-tabs v-model="active" :line-height="2" @click="onClick">
          <van-tab title="在家表现">
            <div class="container">
              <!-- 蒙版 -->
              <div
                class="overlay"
                v-if="studentId == 0"
                style="z-index: 500"
                @click="overlay"
              ></div>
              <div class="mod">
                <!-- 今天的 -->
                <router-link
                  :to="{ path: '/actionHistory' }"
                  tag="div"
                  class="action-today flex"
                >
                  <div class="cell-bd">
                    <time size-16>{{ query.day }}</time>
                    <span>日获得Q星{{ start }}颗</span>
                  </div>
                  <div class="cell-ft">
                    <van-icon name="arrow" size="16px"></van-icon>
                  </div>
                </router-link>
                <div class="action-cells">
                  <!-- 无数据提示 -->
                  <template v-if="myActions.length">
                    <div
                      class="action-cell flex a-i-c j-c-s-b"
                      v-for="(item, index) in myActions.slice(0, showNumber)"
                      :key="index"
                    >
                      <div class="action-cell-bd flex a-i-c j-c-s-b">
                        <div
                          class="action-cell-label text-ellipsis"
                          @click.stop="handleActionMore(item)"
                        >
                          <span>{{ item.title }}</span>
                        </div>
                        <div class="action-cell-rate">
                          <van-rate
                            v-model="item.starCount"
                            :count="5"
                            :size="22"
                            color="#febf56"
                            void-color="#e5eee0"
                            :readonly="rateReadonly"
                            @change="handleChangeRate(index)"
                          ></van-rate>
                        </div>
                        <div class="action-cell-edit" @click="handleNote(item)">
                          <van-icon name="edit" size="16px"></van-icon>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="empty">
                      <img src="@/assets/kong.png" alt />
                      <p class="mt-30">好的行为习惯从添加开始哟</p>
                    </div>
                  </template>
                </div>
                <!-- 查看更多 -->
                <div
                  class="flex j-c-c mb-30 show-more"
                  @click="handleShowMoreActions"
                  v-if="myActions.length > 5"
                >
                  <template v-if="showNumber == 5">
                    <van-icon name="arrow-down" size="14px"></van-icon>
                    <span class="ml-10">点击展开更多</span>
                  </template>
                  <template v-else>
                    <van-icon name="arrow-up" size="14px"></van-icon>
                    <span class="ml-10">点击收起</span>
                  </template>
                </div>
                <div class="dhole flex">
                  <router-link to="/action">
                    <img
                      src="@/assets/action-icon-1@2x.png"
                      width="20"
                      height="20"
                    />
                    <span class="ml-10">行为管理</span>
                  </router-link>
                  <router-link to="/prize">
                    <img
                      src="@/assets/prize-icon-1@2x.png"
                      width="20"
                      height="20"
                    />
                    <span class="ml-10">奖励兑换</span>
                  </router-link>
                </div>
              </div>
              <!-- 分享 -->
              <div class="mod">
                <div class="share-image flex a-i-c j-c-s-b min-h100 mt-30">
                  <p>晒一晒我的表现</p>
                  <van-icon
                    name="share"
                    size="20px"
                    @click="shareActionImage(1)"
                  ></van-icon>
                </div>
              </div>
            </div>
            <div class="mod no-radius atHome" ref="mod">
              <div class="echarts-head flex a-i-c j-c-c mb-30">
                <span>近一周在家表现</span>
              </div>
              <!-- <div class="statement" @click="showPopup">
                <van-icon name="share" size="15px" color="#FF9933"></van-icon>
                <span>行为报表</span>
              </div> -->
              <van-popup v-model="show" @close="onClose">
                <div class="flex a-i-c" @click="popupOne = true">
                  <time size-16>{{ query1.startDate }}</time>
                  <span style="padding:0 4px;">至</span>
                  <time class="mr-20" size-16>{{ query1.endDate }}</time>
                </div>
                <div style="textAlign:center">
                  <van-button
                    type="primary"
                    size="small"
                    @click="statementPopup"
                    >查询</van-button
                  >
                </div>
              </van-popup>
              <!-- 角色选择 -->
              <!-- 日期选择 1 -->
              <van-popup v-model="popupOne" position="bottom">
                <calendar
                  :zero="true"
                  :value="valueOne"
                  :range="true"
                  :lunar="true"
                  @select="selectOne"
                ></calendar>
              </van-popup>
              <!-- 日期选择 1 -->
              <!-- 日期选择 2 -->
              <van-popup v-model="popupTwo" position="bottom">
                <calendar
                  :zero="true"
                  :value="valueTwo"
                  :range="true"
                  :lunar="true"
                  @select="selectTwo"
                ></calendar>
              </van-popup>
              <!-- 筛选 -->
              <div class="screen">
                <div
                  class="screen-item"
                  :class="[screenIndex == index ? 'curr' : '']"
                  v-for="(item, index) in myActions"
                  :key="item.title"
                  @click="handleScreen(item, index)"
                >
                  <i style="width:12px;height:12px;margin-right:4px;"></i>
                  <span>{{ item.title }}</span>
                </div>
              </div>
              <!-- 一周数据分析 -->
              <qxChart id="homeStat" :option="homeOption" />
            </div>
          </van-tab>
          <!-- 报表 -->
          <van-popup v-model="statementShow" @close="statementOnClose">
            <!-- <div class="container" ref="imageDom">
              反馈等会撒九分裤黑色大健康法华师大
            </div>
            <img :src="imgUrl" alt="" /> -->
            <statement></statement>
          </van-popup>
          <van-tab title="在校表现">
            <div class="container">
              <!-- 蒙版 -->
              <div
                class="overlay"
                v-if="studentId == 0"
                style="z-index: 500"
                @click="overlay"
              ></div>
              <div class="mod">
                <router-link
                  :to="{ path: '/course/history' }"
                  tag="div"
                  class="action-today flex"
                >
                  <div class="cell-bd">
                    <time size-16>{{ query.day }}</time>
                    <span>日获得Q星{{ inSchool }}颗</span>
                  </div>
                  <div class="cell-ft">
                    <van-icon name="arrow" size="16px"></van-icon>
                  </div>
                </router-link>
                <div class="action-cells">
                  <div
                    class="action-cell flex a-i-c j-c-s-b"
                    v-for="(item, index) in lessonsList"
                    :key="index"
                  >
                    <div class="action-cell-bd flex a-i-c j-c-s-b">
                      <div class="action-cell-label">
                        <div>{{ item.title }}</div>
                        <!-- 课堂时间 -->
                        <span size-12 v-show="item.startTime"
                          >{{ item.startTime }}-{{ item.endTime }}</span
                        >
                      </div>
                      <div
                        class="action-cell-rate"
                        @click="jumpCourseView(item)"
                      >
                        <van-rate
                          v-model="item.starCount"
                          :count="5"
                          :size="22"
                          color="#febf56"
                          void-color="#e5eee0"
                          readonly
                        ></van-rate>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 分享 -->
              <div class="mod">
                <div class="share-image flex a-i-c j-c-s-b min-h100 mt-30">
                  <p @click="popupShow = true">晒一晒我的表现</p>
                  <van-icon
                    name="share"
                    size="20px"
                    @click="shareActionImage(2)"
                  ></van-icon>
                </div>
              </div>
            </div>
            <div class="mod no-radius">
              <div class="echarts-head flex a-i-c j-c-c mb-30">
                <span>近一周在校表现</span>
              </div>
              <!-- 筛选 -->
              <div class="screen">
                <div
                  class="screen-item"
                  :class="[lessonIndex == index ? 'curr' : '']"
                  v-for="(item, index) in lessonsList"
                  :key="item.title"
                  @click="handleScreen(item, index)"
                >
                  <i style="width:12px;height:12px;margin-right:4px;"></i>
                  <span>{{ item.title }}</span>
                </div>
              </div>
              <!-- 一周数据分析 -->
              <qxChart id="stateMent" :option="stateMentOption" />
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <div class="page-ft">
      <qxFooter></qxFooter>
    </div>
  </div>
</template>
<script>
import html2canvas from "html2canvas";
import statement from "./statement"
import calendar from "@/components/calendar";
import Cookies from "js-cookie";
import { urlSearch } from "@/utils/urlSearch";
import service from "@/api";
import formatter from "@/mixins/date-formatter";
import qxFooter from "@/components/Footer";
import qxChart from "@/components/Myecharts";
import pageMixin from "@/mixins/page";
import echartMixin from "@/mixins/echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
// 20191101
// import sdkDevice from "@/mixins/sdkDevice";
import { bytesArrayToBase64 } from "@/utils/arrayToBase64";
export default {
  name: "home",
  components: {
    qxFooter,
    qxChart,
    calendar,
    statement
  },
  mixins: [pageMixin, echartMixin, formatter],
  data() {
    return {
      dialogImage: false,
      shareImgUrl: "", //生成的分享图片地址
      dialogNote: false,
      rateReadonly: false,
      showNumber: 0,
      active: 0,
      //tabActive: 0,
      screenIndex: 0, //在家表现图表默认起始位置
      lessonIndex: 0, //在校表现图表默认起始位置
      query: {
        openId: this.$store.state.user.info.openId,
        day: dayjs().format("YYYY-MM-DD")
      },
      //家长数据图表查询
      homeQuery: {
        studentId: this.$store.state.user.info.studentId,
        actionType: null,
        actionId: null
      },
      //在校数据图表查询
      schoolQuery: {
        studentId: this.$store.state.user.info.studentId,
        openId: this.$store.state.user.info.openId,
        lessonId: null
      },
      form: {
        remarks: "",
        actionId: null,
        actionType: null,
        studentId: null
      },
      actionView: {},
      myActions: [], //我的行为列表
      lessonsList: [],
      remark: {},
      show: false, //控制日期
      popupOne: false, //控制日期选择器
      popupTwo: false,
      valueOne: [
        dayjs()
          .format("YYYY-MM-DD")
          .split("-"),
        dayjs()
          .format("YYYY-MM-DD")
          .split("-")
      ], //默认日期
      valueTwo: [
        dayjs()
          .format("YYYY-MM-DD")
          .split("-"),
        dayjs()
          .format("YYYY-MM-DD")
          .split("-")
      ], //默认日期
      query1: {
        classId: this.$store.state.user.info.classId,
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD")
      },
      query2: {
        classId: this.$store.state.user.info.classId,
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD")
      },
      statementShow: false, //报表的出现与隐藏
      imgUrl: ""
    };
  },
  computed: {
    ...mapState("user", {
      name: state => state.info.name,
      photo: state => state.info.photo,
      openId: state => state.info.openId,
      roleType: state => state.info.roleType,
      studentId: state => state.info.studentId,
      id: state => state.info.id,
      classId: state => state.info.classId,
      gradeId: state => state.info.gradeId,
      totalStarCount: state => state.info.totalStarCount,
      isBindBracelet: state => state.info.isBindBracelet, // 0未绑定手环 1绑定
      experience: state => state.info.experience,
      tel: state => state.info.tel,
      push: state => state.info.push
    }),
    //计算在家表现已选择的星星数
    start() {
      let n = 0;
      this.myActions.forEach(element => (n += element.starCount));
      return n;
    },
    //计算在校表现已选择的星星数
    inSchool() {
      let n = 0;
      this.lessonsList.forEach(element => (n += element.starCount));
      return n;
    }
  },
  methods: {
    clickGeneratePicture() {
      this.$nextTick(function() {
        window.scrollTo(0, 0);
        html2canvas(this.$refs.imageDom).then(canvas => {
          // 转成图片，生成图片地址
          this.imgUrl = canvas.toDataURL("image/png");
          console.log(this.imgUrl);
          this.$refs.imageDom.style.display = "none";
        });
      });
    },
    //查询报表
    statementPopup() {
      this.statementShow = true;
      setTimeout(() => {
        this.clickGeneratePicture();
      }, 2000);
    },
    //关闭报表
    statementOnClose() {
      this.statementShow = false;
    },
    //在家表现选择日期范围
    selectOne(begin, end) {
      //begin end (Array)
      if (begin && end) {
        this.query1.startDate = begin.join("-");
        this.query1.endDate = end.join("-");
        this.popupOne = false;
      }
    },
    //在校表现选择日期范围
    selectTwo(begin, end) {
      if (begin && end) {
        this.query2.startDate = begin.join("-");
        this.query2.endDate = end.join("-");
      }
    },
    //弹出时间
    showPopup() {
      this.show = true;
    },
    //关闭日期选择器
    onClose() {
      this.show = false;
    },
    overlay() {
      if (this.studentId == 0) {
        this.$dialog
          .confirm({
            title: "提示",
            message: "添加孩子信息，才能记录成长表现哦"
          })
          .then(() => {
            this.$router.push({
              path: "/child/add"
            });
          })
          .catch(() => {});
      }
    },
    handleRoleJump() {
      if (this.roleType == 1 || this.roleType == 2 || this.roleType == 4) {
        this.$router.push({
          path: "/role"
        });
      } else {
        let path = this.studentId == 0 ? "/child/add" : "/child";
        this.$router.push({
          path: path,
          query: {
            search: "single"
          }
        });
      }
    },
    //备注打星
    handleNote(params) {
      let day = dayjs().format("YYYY-MM-DD");
      console.log(params);
      let { openId, title, starCount, ...args } = params;
      this.dialogNote = true;
      this.form = Object.assign({}, args, { day });
    },
    //备注提交
    async handleSubmit(action, done) {
      console.log(done);
      if (action === "confirm") {
        if (this.form.remarks == "" || this.form.remarks == null) {
          this.$toast("请输入备注说明");
          done(false);
        } else {
          let res = await service.remarks(this.form);
          if (res.errorCode === 0) {
            done();
            this.actionListQuery();
          }
        }
      } else {
        done();
      }
    },
    //rate事件
    async handleChangeRate(index) {
      let action = this.myActions[index];
      if (action) {
        let { studentId, actionId, actionType, starCount, id } = action;
        let obj = Object.assign({}, this.query, {
          studentId,
          actionId,
          actionType,
          starCount,
          id
        });
        //行为打星
        this.rateReadonly = true;
        let res = await service.actionStrike(obj);
        if (res.errorCode === 0) {
          let { totalStarCount, star } = res.data;
          this.rateReadonly = false;
          action.starCount = star;
          //更新星星数量
          let _cookie = Cookies.getJSON("info");
          let obj = Object.assign({}, _cookie, { totalStarCount });
          this.$store.dispatch("user/setInfo", obj).then(data => {
            if (data.success === "ok") {
            }
          });
        } else if (res.errorCode === -1) {
          this.$dialog
            .alert({
              title: "提示",
              message: "你打太快了"
            })
            .then(() => {
              this.rateReadonly = false;
              this.actionListQuery();
            });
        }
      }
    },
    //显示更多我的行为
    handleShowMoreActions() {
      return (this.showNumber =
        this.showNumber === this.myActions.length ? 5 : this.myActions.length);
    },
    //查看行为说明
    handleActionMore(params = {}) {
      let { title, starCount, ...args } = params;
      this.actionQuery(args);
    },
    //选择年月日
    handleShowDatePicker(value) {
      let now = dayjs(new Date(value).getTime()).format("YYYY-MM-DD");
      this.query.day = now;
      this.lessonList();
    },
    jumpExamPaper(params = {}, index = 0) {
      let gradeId = this.gradeId;
      let { lessonId } = params;
      this.$router.push({
        path: "/examPaper",
        query: {
          gradeId,
          lessonId
        }
      });
    },
    jumpCourseView(params) {
      //如果没有绑定手环
      if (this.isBindBracelet == 1) {
        if (params.title === "运动" || params.title === "午睡") {
        } else {
          this.$router.push({
            path: "/bracelet",
            // path: "/device",
            query: {
              title: params.title,
              startTime: params.startTime,
              endTime: params.endTime,
              type: params.type
            }
          });
        }
      } else {
        this.$router.push({
          path: "/course/view",
          query: {
            title: params.title
          }
        });
      }
    },
    //筛选在家表现行为图表
    handleScreen(params = {}, index) {
      if (this.active == 0) {
        let { actionType, actionId } = params;
        this.screenIndex = index;
        this.homeQuery.actionType = actionType;
        this.homeQuery.actionId = actionId;
        this.homeStatQuery(this.homeQuery);
      } else {
        let { lessonId } = params;
        this.lessonIndex = index;
        this.schoolQuery.lessonId = lessonId;
        this.stateMentList(this.schoolQuery);
      }
    },
    //行为列表查询
    async actionListQuery() {
      let obj = {
        day: this.query.day,
        studentId: this.$store.state.user.info.studentId,
        openId: this.$store.state.user.info.openId
      };
      let res = await service.actionListQuery(obj);
      console.log(res);
      if (res.errorCode === 0) {
        this.myActions = res.data.myActions;
        this.showNumber = this.myActions.length;
        this.homeQuery.actionType = this.myActions[0].actionType;
        this.homeQuery.actionId = this.myActions[0].actionId;
        //数据图表
        this.homeStatQuery(this.homeQuery);
      }
    },
    //按行为查询已选中的规则
    async actionQuery(params = {}) {
      let res = await service.actionQuery(params);
      if (res.errorCode === 0) {
        this.dialogVisible = true;
        this.actionView = res.data;
      }
    },
    //在校表现课程列表查询(关联课程表)
    async lessonList() {
      let obj = {
        day: this.query.day,
        studentId: this.studentId,
        classId: this.classId
      };
      let res = await service.lessonList(obj);
      if (res.errorCode === 0) {
        this.lessonsList = res.data;
        this.schoolQuery.lessonId = this.lessonsList[0].lessonId;
        //数据图表
        this.stateMentList(this.schoolQuery);
      }
    },
    //查询最新Q星数
    async queryStar(params = {}) {
      console.log("查询最新Q星数");
      let res = await service.queryStar(params);
      if (res.errorCode === 0) {
        let _cookie = Cookies.getJSON("info");
        let totalStarCount = res.data; //Q星数
        let obj = Object.assign({}, _cookie, { totalStarCount });
        this.$store.dispatch("user/setInfo", obj).then(data => {
          if (data.success === "ok") {
          }
        });
      }
    },
    //生成行为图片分享
    async shareActionImage(type) {
      let star = type == 1 ? this.start : this.inSchool;
      let params = {
        type,
        star,
        studentId: this.studentId
      };
      let res = await service.actionImage(params);
      if (res.errorCode === 0) {
        this.shareImgUrl = res.data;
        this.dialogImage = true;
      }
    },

    //切换在校表现20191109
    onClick() {
      if (this.active === 1) {
        this.getDeviceIdList();
      }
    },
    // 发送数据给设备20191109
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
            this.show = false;
          }
        }
      );
    },

    // 初始化20191109
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
    // 初始化设备库20191109
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

    //设备连接状态变化20191109
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

    // 获取设备信息20191109
    getWXDeviceInfos() {
      wx.ready(() => {
        WeixinJSBridge.invoke("getWXDeviceInfos", {}, res => {
          console.log(res);
          if (res.err_msg === "getWXDeviceInfos:ok") {
            //绑定设备总数量
            if (res.deviceInfos.length) {
              let arr = res.deviceInfos.filter(
                item => item.state === "connected"
              );
              if (arr.length > 0) {
                this.state = arr[0].state;
                this.deviceId = arr[0].deviceId;
                let entryData = sessionStorage.getItem("entryData");
                console.log(this.active);
                if (
                  this.active === 1 &&
                  this.deviceId != "" &&
                  this.isBindBracelet == 1 &&
                  entryData === null &&
                  this.bluetooth == true
                ) {
                  // let _this = this;
                  // setTimeout(function() {
                  this.show = true;
                  // }, 100);
                  let getLocalTime = [0x23, 0x02, 0x02, 0x02, 0x25];
                  this.sendDataToWXDevice(
                    this.deviceId,
                    bytesArrayToBase64(getLocalTime)
                  );
                } else {
                  this.show = false;
                }
              } else {
                this.state = "disconnected";
                this.deviceId = "";
              }
            } else {
              this.list = [];
              this.deviceId = "";
            }
          }
        });
      });
    },

    //断开设备连接20191109
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

    //手机蓝牙状态改变事件20191109
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

    //  获取Q星值20191109
    async getStarTotal() {
      var now = new Date();
      var year = now.getFullYear(); //年
      var month = now.getMonth() + 1; //月
      var day = now.getDate(); //日
      let date = `${year}-${month < 10 ? "0" : ""}${month}-${
        day < 10 ? "0" : ""
      }${day}`;
      let data = {
        studentId: this.studentId,
        day: date
      };
      let res = await service.getStarTotal(data);
      if (res.errorCode === 0) {
        this.setStart(res.data);
      }
    },

    // 设置Q星值20191109
    setStart(value) {
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
      this.sendDataToWXDevice(this.deviceId, bytesArrayToBase64(setStartVlue));
    },
    // 接收数据20191109
    onReceiveDataFromWXDevice() {
      wx.ready(() => {
        WeixinJSBridge.on("onReceiveDataFromWXDevice", res => {
          console.log("接收数据onReceiveDataFromWXDevice");
          let { deviceId, base64Data } = res;
          service.decoder({ content: base64Data }).then(res => {
            this.currentRate += 1;
            this.text = this.currentRate + "%";
            if (res.errorCode === 0) {
              let obj = res.data[0];
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
                // let getCurrentNumberOfSteps = [0x23, 0x02, 0x02, 0x13, 0x00];
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
                // 获取电量信息结束，开始获取当前步数
                console.log("获取电量信息结束，开始获取当前步数");
                // let getCurrentNumberOfSteps = [0x23, 0x02, 0x02, 0x05, 0x00];
                let getCurrentNumberOfSteps = [0x23, 0x02, 0x02, 0x13, 0x00];
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
                obj[1] === "11" &&
                obj[2] === "04" &&
                obj[3] === "13"
              ) {
                // 获取当前步数结束，开始获取获取最近睡眠
                console.log("获取当前步数结束，开始获取获运动目标");
                let MoveStaget = [0x23, 0x02, 0x02, 0x06, 0x00];

                this.sendDataToWXDevice(
                  deviceId,
                  bytesArrayToBase64(MoveStaget)
                );
                this.parsePackets({
                  studentId: this.studentId,
                  deviceId,
                  content: base64Data
                });
              } else if (
                obj[1] === "04" &&
                obj[2] === "04" &&
                obj[3] === "06"
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

                    // 关删除开启
                    // console.log("开始获取活跃度");
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

                    // 开删除开启
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
                // 开删除开启
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
                  this.lessonList();
                  this.getStarTotal();
                  this.currentRate = 100;
                  this.text = this.currentRate + "%";
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

                    // 关删除开启
                    // console.log("请求数据包第一个目录包结束,开始按UTC删除数据");
                    // this.lessonList();
                    // this.getStarTotal();
                    // sessionStorage.setItem("entryData", 1);
                    // this.show = false;
                    // this.tip = "数据导入完成";

                    // 开删除开启
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

                  // 关删除开启
                  // console.log("请求数据包第一个目录包结束,开始按UTC删除数据");
                  // this.lessonList();
                  // this.getStarTotal();
                  // sessionStorage.setItem("entryData", 1);
                  // this.show = false;
                  // this.tip = "数据导入完成";

                  // 开删除开启
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
                // 开删除开启
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
              }
            }
          });
        });
      });
    },
    //解析数据包20191109
    async parsePackets(params = {}) {
      let res = await service.parsePackets(params);
      if (res.errorCode === 0) {
        console.log("解析数据包");
      }
    },
    // 活跃度解析数据包20191109
    async parsePacketActive(params = {}) {
      let res = await service.parsePacketActive(params);
      if (res.errorCode === 0) {
        console.log("活跃度解析数据包");
      }
    },
    // 睡眠解析数据包20191109
    async parsePacketSleep(params = {}) {
      let res = await service.parsePacketSleep(params);
      if (res.errorCode === 0) {
        console.log("睡眠解析数据包");
      }
    },
    // 获取用户绑定设备20191109
    async getDeviceIdList() {
      let data = {
        openId: this.$store.state.user.info.openId
      };
      let res = await service.getDeviceIdList(data);
      if (res.errorCode === 0) {
        if (res.data != null) {
          this.init();
        }
      }
    }
  },
  mounted() {
    this.stateMentList();
    if (Object.keys(this.$route.query).length || this.push == "true") {
      //查询最新Q星数
      this.queryStar({ studentId: this.studentId });
    }
  },
  activated() {
    this.actionListQuery();
    this.lessonList();
  },
  //导航离开该组件的对应路由时调用
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
  },
  beforeRouteEnter(to, from, next) {
    console.log("beforeRouteEnter");
    if (from.path === "/welcome") {
      window.toast.clear();
    }
    next();
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
  .js-user-change {
    margin-left: 20px;
  }
}
.container {
  padding: 30px;
  position: relative;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
}

.mod {
  height: auto;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 1px 20px 0 rgba(204, 204, 204, 0.4);
}
.action-today {
  text-align: center;
  padding: 30px 20px 0 20px;
  i {
    color: #999;
  }
}
.action-cells {
  padding-bottom: 20px;
}
.course {
  padding: 0 30px;
}
.action-cell {
  position: relative;
  margin: 30px 0;
  padding: 0 30px;
  i {
    vertical-align: top;
  }
  &-bd {
    flex: 1;
  }
  &-rate {
    flex: 1;
  }
  &-label {
    width: 280px;
    overflow: hidden;
  }
  &-edit {
    color: #999;
  }
}
.dhole {
  min-height: 100px;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 1px;
    border-top: 1px solid #e5e5e5;
    color: #e5e5e5;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    z-index: 2;
  }
  > a {
    font-size: 28px;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.actionView {
  padding: 30px;
  line-height: 1.6;
}

.snail {
  height: 80px;
  padding: 0 20px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 1px 20px 0 rgba(204, 204, 204, 0.3);
}

.remark {
  border-radius: 20px;
  margin-bottom: 20px;
  text-align: justify;
  background-color: #fff;
  box-shadow: 0 1px 20px 0 rgba(204, 204, 204, 0.3);
  &-hd {
    height: 80px;
    padding: 0 20px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      height: 1px;
      border-top: 1px solid #e5e5e5;
      color: #e5e5e5;
      transform-origin: 0 0;
      transform: scaleY(0.5);
      z-index: 2;
    }
  }
  &-right {
    color: #7d7e80;
  }
  &-bd {
    padding: 30px;
    min-height: 120px;
  }
  &-time {
    color: #b5b5b5;
    text-align: right;
  }
  span {
    display: inline-block;
  }
  p {
    flex: 1;
    line-height: 1.4;
  }
}

.eland {
  padding: 30px;
  text-align: center;
  p {
    margin-bottom: 60px;
    text-align: left;
    line-height: 1.6;
  }
}

.echarts-head {
  text-align: center;
  padding: 30px 30px 0 30px;
}

.show-more {
  color: #999;
}

.disc {
  padding-left: 20px;
  list-style-type: disc;
}

.share-image {
  padding: 0 30px;
  color: #ff9933;
}
.share-desctext {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}

.screen {
  padding: 0 30px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  &-item {
    color: #999;
    font-size: 28px;
    display: flex;
    align-items: center;
    margin-right: 16px;
    margin-bottom: 16px;
    i {
      display: inline-block;
      border-radius: 50%;
      background-color: #999;
    }
  }
  .curr {
    color: #252525;
    i {
      background-color: #f00;
    }
  }
}
.atHome {
  position: relative;
  .statement {
    position: absolute;
    top: 30px;
    right: 30px;
    display: flex;
    align-items: center;
    span {
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 153, 51, 1);
      margin-left: 9px;
    }
  }
}
</style>
