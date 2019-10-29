  <template>
  <div class="page">
    <div class="page-bd">
      <!-- dialog 图片生成分享 -->
      <van-dialog v-model="dialogImage" close-on-click-overlay :show-confirm-button="false">
        <div class="cells">
          <img :src="shareImgUrl" />
          <p class="text-center pt-30 pb-30 share-desctext">长按图片保存或发给朋友</p>
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
              <li v-for="(item, index) in actionView.rules" :key="index">{{ item.ruleText }}</li>
            </ul>
          </div>
        </div>
      </van-dialog>
      <!-- dialog 1 -->
      <van-dialog v-model="dialogNote" title="添加备注" show-cancel-button :before-close="handleSubmit">
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
                <img :src="photo" width="60" height="60" radius="50" v-if="photo" />
                <!-- 如果用户没有上传头像 -->
                <img src="@/assets/child-default@2x.png" width="60" height="60" radius="50" v-else />
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
                <img src="@/assets/child-default@2x.png" width="60" height="60" radius="50" />
              </div>
              <p class="ml-20">尚未有关注孩子，点击添加。</p>
            </template>
          </div>
          <van-icon name="arrow" size="16px"></van-icon>
        </div>
        <!-- 用户 -->
        <van-tabs v-model="active" :line-height="2">
          <van-tab title="在家表现">
            <div class="container">
              <!-- 蒙版 -->
              <div class="overlay" v-if="studentId == 0" style="z-index: 500" @click="overlay"></div>
              <div class="mod">
                <!-- 今天的 -->
                <router-link :to="{path: '/actionHistory'}" tag="div" class="action-today flex">
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
                    <img src="@/assets/action-icon-1@2x.png" width="20" height="20" />
                    <span class="ml-10">行为管理</span>
                  </router-link>
                  <router-link to="/prize">
                    <img src="@/assets/prize-icon-1@2x.png" width="20" height="20" />
                    <span class="ml-10">奖励兑换</span>
                  </router-link>
                </div>
              </div>
              <!-- 分享 -->
              <div class="mod">
                <div class="share-image flex a-i-c j-c-s-b min-h100 mt-30">
                  <p>晒一晒我的表现</p>
                  <van-icon name="share" size="20px" @click="shareActionImage(1)"></van-icon>
                </div>
              </div>
            </div>
            <div class="mod no-radius" ref="mod">
              <div class="echarts-head flex a-i-c j-c-c mb-30">
                <span>近一周在家表现</span>
              </div>
              <!-- 筛选 -->
              <div class="screen">
                <div
                  class="screen-item"
                  :class="[screenIndex == index ? 'curr': '']"
                  v-for="(item,index) in myActions"
                  :key="item.title"
                  @click="handleScreen(item,index)"
                >
                  <i style="width:12px;height:12px;margin-right:4px;"></i>
                  <span>{{ item.title }}</span>
                </div>
              </div>
              <!-- 一周数据分析 -->
              <qxChart id="homeStat" :option="homeOption" />
            </div>
          </van-tab>
          <van-tab title="在校表现">
            <div class="container">
              <!-- 蒙版 -->
              <div class="overlay" v-if="studentId == 0" style="z-index: 500" @click="overlay"></div>
              <div class="mod">
                <router-link :to="{path: '/course/history'}" tag="div" class="action-today flex">
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
                        <span
                          size-12
                          v-show="item.startTime"
                        >{{ item.startTime }}-{{ item.endTime }}</span>
                      </div>
                      <div class="action-cell-rate" @click="jumpCourseView(item)">
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
                  <van-icon name="share" size="20px" @click="shareActionImage(2)"></van-icon>
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
                  :class="[lessonIndex == index ? 'curr': '']"
                  v-for="(item, index) in lessonsList"
                  :key="item.title"
                  @click="handleScreen(item,index)"
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
export default {
  name: "home",
  components: {
    qxFooter,
    qxChart
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
      remark: {}
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
              //window.location.reload();
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
        this.$router.push({
          path: "/bracelet",
          query: {
            title: params.title
          }
        });
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
</style>
