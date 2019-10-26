<template>
  <div class="page">
    <div class="page-hd">
      <template v-if="roleType == 1 || roleType == 2 || roleType == 4">
        <div class="button-sp-area flex" size-17>
          <a
            href="javascript:void(0);"
            id="showDatePicker"
            @click="popupOne = true"
          >
            <span id="data1">{{ query.date }}</span>
            <van-icon name="arrow-down" size="16px"></van-icon>
          </a>
        </div>
      </template>
      <template v-else>
        <div class="button-sp-area flex" size-17>
          <a
            href="javascript:void(0);"
            class="flex j-c-c a-i-c"
            @click="popupTwo = true"
          >
            <span id="data1" class="mr-10">{{ querys.month }}</span>
            <van-icon name="arrow-down" size="16px"></van-icon>
          </a>
        </div>
      </template>
    </div>
    <div class="page-bd">
      <!-- 老师端 -->
      <van-popup v-model="popupOne" position="bottom">
        <van-datetime-picker
          ref="datetime"
          @cancel="popupOne = false"
          @confirm="handleShowDatePicker"
          v-model="currentDate"
          type="date"
          :formatter="formatter"
        ></van-datetime-picker>
      </van-popup>
      <!-- 家长端 -->
      <van-popup v-model="popupTwo" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="year-month"
          @confirm="handleChangeMonth"
          @cancel="popupTwo = false"
          :formatter="formatter"
        ></van-datetime-picker>
      </van-popup>
      <template v-if="roleType != 3">
        <div class="clock-table">
          <div class="cells">
            <div class="cell" size-17>
              <div class="cell-bd">{{ roleType == 2 ? "班级" : "年级" }}</div>
              <div class="cell-bd">应到</div>
              <div class="cell-bd">实到</div>
              <div class="cell-bd">请假</div>
              <div class="cell-bd">缺勤</div>
              <div class="cell-bd">出勤率</div>
            </div>
          </div>
          <div class="cells">
            <div
              class="cell"
              v-for="(clock, index) in clockList"
              :key="index"
              @click="handleQueryClock(clock, $event)"
            >
              <div class="cell-bd">
                <div>
                  {{ roleType == 2 ? clock.className : clock.gradeName }}
                </div>
              </div>
              <div class="cell-bd">
                <p data-status="0">{{ clock.classCount }}</p>
              </div>
              <div class="cell-bd">
                <p data-status="1">{{ clock.clockCount }}</p>
              </div>
              <div class="cell-bd">
                <p data-status="2">{{ clock.vacate }}</p>
              </div>
              <div class="cell-bd">
                <p data-status="3">{{ clock.absenteeism }}</p>
              </div>
              <div class="cell-bd">
                <van-circle
                  v-model="clock.clockRate"
                  :rate="clock.clockRate"
                  color="#07c160"
                  layer-color="#ebedf0"
                  size="42px"
                  :text="clock.clockRate.toFixed(0) + '%'"
                ></van-circle>
              </div>
            </div>
          </div>
        </div>
        <div class="empty" v-if="!clockList.length">
          <img src="@/assets/kong.png" alt />
          <p>还没有打卡记录</p>
        </div>
      </template>
      <!-- 家长端 -->
      <template v-else>
        <div class="clock-show-table">
          <div class="cells">
            <div
              class="cell"
              style="height:74px;"
              v-for="(month, index) in clockMonthList"
              :key="index"
            >
              <div class="cell-bd" style="padding-left:0;">
                <time>{{ month.day }}</time>
                已打卡
                <div class="timeFrame">
                  <div class="Am">
                    <span>上午</span>
                    <img
                      v-if="month.morming === 0"
                      src="@/assets/check.png"
                      alt
                    />
                    <img v-else src="@/assets/NoCheck.png" alt="" />
                  </div>

                  <div class="Noon">
                    <span>中午</span>
                    <img
                      v-if="month.lunch === 0"
                      src="@/assets/check.png"
                      alt
                    />
                    <img v-else src="@/assets/NoCheck.png" alt="" />
                  </div>

                  <div class="Pm">
                    <span>下午</span>
                    <img
                      v-if="month.evening === 0"
                      src="@/assets/check.png"
                      alt
                    />
                    <img v-else src="@/assets/NoCheck.png" alt="" />
                  </div>
                </div>
              </div>
              <div
                class="cell-ft"
                style="color:#92cd36;"
                @click="handleClockDay(month)"
              >
                <van-icon color="#999999" name="arrow" />
              </div>
            </div>
          </div>
        </div>
        <div class="empty" v-if="!clockMonthList.length">
          <img src="@/assets/kong.png" alt />
          <p>本月还没有打卡过呢</p>
        </div>
      </template>
    </div>
    <div class="page-ft" v-if="roleType == 3">
      <!-- 打卡按钮 -->
      <div class="fixed-bottom" style="z-index: 100;">
        <template v-if="experience != 1">
          <van-button
            type="info"
            size="large"
            class="no-radius"
            @click="handleScanQRCode"
            >扫码接送</van-button
          >
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import service from "@/api";
import formatter from "@/mixins/date-formatter";
import { mapState } from "vuex";
export default {
  name: "clock",
  mixins: [formatter],
  data() {
    return {
      popupOne: false,
      popupTwo: false,
      currentDate: new Date(),
      clockList: [],
      clockMonthList: [],
      roleType: this.$store.state.user.info.roleType,
      query: {
        date: dayjs().format("YYYY-MM-DD")
      },
      querys: {
        studentId: this.$store.state.user.info.studentId,
        openId: this.$store.state.user.info.openId,
        month: dayjs().format("YYYY-MM")
      }
    };
  },
  computed: {
    ...mapState("user", {
      experience: state => state.info.experience //0不是体验用户 1是
    })
  },
  methods: {
    //调起微信扫一扫接口
    handleScanQRCode() {
      let { openId } = this.querys; //用户openId
      wx.scanQRCode({
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: res => {
          if (res.errMsg === "scanQRCode:ok") {
            let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            console.log(res);
            //window.location.href = result;
          }
        }
      });
    },
    //一键接送
    handleAddPunch() {
      let { openId, studentId } = this.querys;
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定接送孩子吗？"
        })
        .then(() => {
          this.addPunch({ openId, studentId });
        });
    },
    //家长端
    handleClockDay(month) {
      this.$router.push({
        path: "/clock/day",
        query: { ...month }
      });
    },
    //选择年月日
    handleShowDatePicker(value) {
      let now = dayjs(new Date(value).getTime()).format("YYYY-MM-DD");
      this.query.date = now;
      if (this.roleType == 2) {
        this.clockStat(this.query);
      } else {
        this.clockStatWithSchool(this.query);
      }
    },
    //选择年月
    handleChangeMonth(value) {
      let month = dayjs(new Date(value).getTime()).format("YYYY-MM");
      this.querys.month = month;
      this.clockQuery(this.querys);
    },
    //园长端和老师端跳转
    handleQueryClock(clock, e) {
      let status = e.target.dataset.status;
      if (this.roleType == 2) {
        this.$router.push({
          path: "/clock/show",
          query: {
            className: `${clock.className}`,
            classId: `${clock.classId}`,
            date: `${clock.statDate}`
          }
        });
      } else {
        if (status) {
          this.$router.push({
            path: "/clock/view",
            query: {
              status,
              gradeId: `${clock.gradeId}`,
              date: `${clock.statDate}`
            }
          });
        }
      }
    },
    //园长端考勤统计查询
    async clockStatWithSchool(params = {}) {
      let schoolId = this.$store.state.user.info.id;
      let obj = Object.assign({}, params, { schoolId });
      let res = await service.clockStatWithSchool(obj);
      if (res.errorCode === 0) {
        this.clockList = res.data;
        this.popupOne = false;
      }
    },
    //考勤统计查询
    async clockStat(params = {}) {
      let openId = this.$store.state.user.info.openId;
      let obj = Object.assign({}, params, { openId });
      let res = await service.clockStat(obj);
      if (res.errorCode === 0) {
        this.clockList = res.data;
        this.popupOne = false;
      }
    },
    //月考勤记录查询
    async clockQuery(params = {}) {
      let res = await service.clockQuery(params);
      if (res.errorCode === 0) {
        this.clockMonthList = res.data;
        this.popupTwo = false;
      }
    },
    //打卡按钮
    async addPunch(params = {}) {
      let res = await service.addPunch(params);
      if (res.errorCode === 0) {
        this.$toast(`${res.errorMsg}`);
        setTimeout(() => {
          this.clockQuery(this.querys);
        }, 1000);
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  },
  activated() {
    if (this.roleType == 1 || this.roleType == 4) {
      this.clockStatWithSchool(this.query);
    } else if (this.roleType == 2) {
      this.clockStat(this.query);
    } else {
      this.clockQuery(this.querys);
    }
  }
};
</script>
<style lang="less" scoped>
.page-hd {
  margin-bottom: 20px;
  background-color: #fff;
}

.clock-table {
  .cell {
    padding: 0 0;
    height: 120px;
  }
  .cell-bd {
    text-align: center;
    padding-left: 0;
    p {
      color: #9cd248;
    }
  }
}
.van-circle {
  vertical-align: top;
}
.timeFrame {
  display: flex;
  align-items: center;
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
  margin-top: 25px;
  .Am {
    display: flex;
    align-items: center;
    margin-right: 70px;
  }
  .Noon {
    display: flex;
    align-items: center;
    margin-right: 70px;
  }
  .Pm {
    display: flex;
    align-items: center;
  }
  img {
    width: 20px;
    height: 20px;
    margin-left: 20px;
  }
}
.cells /deep/ .cell {
  padding-bottom: 10px;
}
</style>
