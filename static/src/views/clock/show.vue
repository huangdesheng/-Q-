<template>
  <div class="page">
    <div class="page-hd">
      <div class="class-mod">
        <van-button type="info" round size="small" style="min-width:100px;">{{ className }}</van-button>
      </div>
    </div>
    <div class="pae-bd">
      <!-- 修改学生考勤状态 -->
      <van-dialog
        title="学生考勤状态修改"
        v-model="dialogVisible"
        show-cancel-button
        @cancel="dialogVisible = false"
        :before-close="handleSubmit"
      >
        <van-radio-group v-model="form.studentStatus">
          <van-cell-group>
            <van-cell :title="item.title" v-for="(item, index) in statusList" :key="index">
              <van-radio :name="item.studentStatus" checked-color="#92cd36"></van-radio>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </van-dialog>
      <div class="cells-title">点击学生头像可进行考勤状态修改</div>
      <!-- 修改学生考勤状态 -->
      <div class="table">
        <div class="table-head">
          <div class="tr">
            <div class="th">
              <i style="background-color:#9cd248;"></i>
              <span size-12>打卡</span>
            </div>
            <div class="th">
              <i style="background-color:#fda322;"></i>
              <span size-12>未打卡</span>
            </div>
            <div class="th">
              <i style="background-color:#07c160;"></i>
              <span size-12>请假</span>
            </div>
            <div class="th">
              <i style="background-color:#ea7e53;"></i>
              <span size-12>出勤</span>
            </div>
            <div class="th">
              <i style="background-color:#1989fa;"></i>
              <span size-12>缺勤</span>
            </div>
            <div class="th">
              <i style="background-color:#909399;"></i>
              <span size-12>漏打卡</span>
            </div>
          </div>
        </div>
        <div class="table-body">
          <div class="tr">
            <div
              class="td"
              :class="[
                { 'td-success': item.status == 'success' },
                { 'td-default': item.status == 'default' },
                { 'td-qingjia': item.status == 'qingjia' },
                { 'td-chuqing': item.status == 'chuqing' },
                { 'td-queqing': item.status == 'queqing' },
                { 'td-loudaka': item.status == 'loudaka' },
              ]"
              v-for="item in list"
              :key="item.studentId"
              @click="handleChangeStatus(item)"
            >
              <div>
                <img :src="item.photo" v-if="item.photo" />
                <img src="@/assets/child-default@2x.png" v-else />
                <div class>
                  <span>{{ item.studentName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 打卡记录列表 -->
      <!-- <div class="cells" style="margin-top:15px;">
        <div class="cell" v-for="item in punchList" :key="item.studentId">
          <div class="cell-hd">
            <label for class="label">{{ item.studentName }}</label>
          </div>
          <div class="cell-bd">
            <p class="cell-p">{{ item.postTime }}</p>
          </div>
        </div>
      </div>-->
      <div class="page">
        <!-- <div class="page-bd">
      <div class="cells-title">当天打卡详细时间</div>
      <div class="cells">
        <div class="cell min-h100" v-for="(day, index) in list" :key="index">
          <div class="cell-bd">
            <p>{{ day }}</p>
          </div>
        </div>
      </div>
        </div>-->
        <div class="title">当天打卡详细</div>
        <div class="clockOnBox">
          <div class="clockOn">
            <div class="Am">
              <div class="timeTitle">
                <p>上午</p>
                <div class="timeTitleBox" v-for="(item,index) in listAm" :key="index">
                  <span>{{item.studentName}}</span>
                  <span>{{item.postTime}}</span>
                </div>
              </div>
            </div>
            <div class="Noon">
              <div class="timeTitle">
                <p>中午</p>
                <div class="timeTitleBox" v-for="(item,index) in listNoon" :key="index">
                  <span>{{item.studentName}}</span>
                  <span>{{item.postTime}}</span>
                </div>
              </div>
            </div>
            <div class="Pm">
              <div class="timeTitle">
                <p>下午</p>
                <div class="timeTitleBox" v-for="(item,index) in listPm" :key="index">
                  <span>{{item.studentName}}</span>
                  <span>{{item.postTime}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 打卡记录列表 -->
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import service from "@/api";
export default {
  name: "clockShow",
  data() {
    return {
      studentStatus: 1,
      dialogVisible: false,
      className: this.$route.query.className,
      query: {
        date: this.$route.query.date,
        classId: this.$route.query.classId
      },
      form: {
        studentId: null,
        studentStatus: null
      },
      statusList: [
        { title: "请假", studentStatus: 1 },
        { title: "缺勤", studentStatus: 2 },
        { title: "漏打卡", studentStatus: 3 },
        { title: "出勤", studentStatus: 4 }
      ],
      list: [],
      punchList: [],
      listAm: [],
      listNoon: [],
      listPm: []
    };
  },
  methods: {
    async handleSubmit(action, done) {
      if (action === "confirm") {
        let res = await service.changeStatus(this.form);
        if (res.errorCode === 0) {
          done();
          this.$toast(`修改成功`);
          this.dialogVisible = false;
          this.queryAttendance(this.query);
        }
      } else {
        done();
      }
    },
    handleChangeStatus(params) {
      if (dayjs().format("YYYY-MM-DD") == this.query.date) {
        let { studentStatus, studentId } = params;
        this.dialogVisible = true;
        this.form.studentStatus = studentStatus;
        this.form.studentId = studentId;
      } else {
        this.$toast(`学生考勤状态只能修改当天的`);
      }
    },
    //考勤统计详情
    async queryAttendance(params = {}) {
      let res = await service.queryAttendance(params);
      if (res.errorCode === 0) {
        if (res.data.length) {
          this.list = res.data.map(item => {
            let { punchStatus, studentStatus, ...args } = item;
            var status;
            if (studentStatus == 0 && punchStatus == 1) {
              status = "success";
            } else if (studentStatus == 0 && punchStatus == 2) {
              status = "default";
            } else if (studentStatus == 1) {
              status = "qingjia"; //请假
            } else if (studentStatus == 2) {
              status = "queqing"; //缺勤
            } else if (studentStatus == 3) {
              status = "loudaka"; //漏打卡
            } else {
              status = "chuqing"; //出勤
            }
            return {
              ...args,
              punchStatus,
              studentStatus,
              status
            };
          });
        }
      }
    },
    //改变学生出勤状态
    async changeStatus(params = {}) {
      let res = await service.changeStatus(params);
      if (res.errorCode === 0) {
        this.$toast(`${res.errorMsg}`);
      }
    },
    //出勤管理-查询学生打卡时间
    async queryStudentPunchList(params = {}) {
      let res = await service.queryStudentPunchList(params);
      if (res.errorCode === 0) {
        this.punchList = res.data;
        this.listAm = res.data.morming;
        this.listNoon = res.data.lunch;
        this.listPm = res.data.evening;
      }
    }
  },
  activated() {
    this.queryAttendance(this.query);
    this.queryStudentPunchList(this.query);
  }
};
</script>
<style lang="less" scoped>
.class-mod {
  text-align: center;
  padding: 20px 0;
  background-color: #fff;
}
.table {
  background-color: #fff;
  .tr {
    display: flex;
    flex-wrap: wrap;
  }
}
.table-head {
  padding: 24px 0;
  .th {
    flex: 1;
    text-align: center;
    font-size: 0;
    i {
      display: inline-block;
      width: 28px;
      height: 28px;
      margin-right: 10px;
      vertical-align: top;
    }
  }
}
.table-body {
  .td {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25%;
    height: 200px;
    position: relative;
    text-align: center;
    color: #fff;
    background-color: #fff;
    &::before {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      width: 1px;
      bottom: 0;
      border-left: 1px solid #e5e5e5;
      color: #e5e5e5;
      transform-origin: 0 0;
      transform: scaleX(0.5);
    }
    &::after {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #e5e5e5;
      color: #e5e5e5;
      transform-origin: 0 0;
      transform: scaleY(0.5);
    }
    &-success {
      background-color: #9cd248;
    }
    &-default {
      background-color: #fda322;
    }
    &-qingjia {
      background-color: #07c160;
    }
    &-chuqing {
      background-color: #ea7e53;
    }
    &-queqing {
      background-color: #1989fa;
    }
    &-loudaka {
      background-color: #909399;
    }
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    span {
      display: inline-block;
      margin-top: 15px;
    }
  }
}
.clock-down {
  position: absolute;
  right: 5%;
  top: 10%;
}
.page {
  .title {
    font-size: 34px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(153, 153, 153, 1);
    margin: 20px 33px;
  }
  .clockOnBox {
    display: flex;
    justify-content: center;
    .clockOn {
      width: 690px;
      // height: 771px;
      background: rgba(255, 255, 255, 1);
      border-radius: 20px;
      .Am,
      .Noon,
      .Pm {
        margin-left: 30px;
        margin-right: 30px;
        border-bottom: 1px solid #ccc;
        .timeTitleBox {
          display: flex;
          justify-content: space-between;
        }
        p {
          font-size: 30px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(156, 210, 72, 1);
          margin: 30px 0 40px 0;
          &::before {
            content: "";
            width: 6px;
            height: 30px;
            background: linear-gradient(
              0deg,
              rgba(162, 225, 78, 1),
              rgba(162, 222, 90, 1)
            );
            border-radius: 2px;
            display: inline-block;
            margin-right: 20px;
            position: relative;
            top: 2px;
          }
        }
        span {
          display: block;
          font-size: 30px;
          font-family: PingFang SC;
          // font-weight: 500;
          color: rgba(51, 51, 51, 1);
          // margin-bottom: 60px;
          &:last-child {
            margin-bottom: 30px;
          }
        }
        &:last-child {
          border: 0;
        }
      }
    }
  }
}
</style>
