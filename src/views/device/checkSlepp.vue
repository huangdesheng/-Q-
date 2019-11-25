<template>
  <div class="page">
    <div class="page-bd">
      <div class="title">
        <div class="bgT flex j-c-c a-i-c f-w-w">
          <div style="height:100px" class="sub">
            <p>
              <span>{{obj.sleepDuration.split('小时')[0]}}</span>小时
              <span>{{obj.sleepDuration.split('小时')[1].split('分钟')[0]}}</span>
              分钟
              <!-- {{obj.sleepDuration}} -->
            </p>
            <!-- <p>超越全国98%用户</p> -->
          </div>
        </div>
        <div class="dataT flex j-c-c a-i-c">
          <div class="flex-1">
            <p>{{obj.deepSleepTime}}</p>
            <p>
              <span></span>深睡
            </p>
          </div>
          <div class="flex-1">
            <p>{{obj.shallowSleepTime}}</p>
            <p>
              <span></span>浅睡
            </p>
          </div>
          <div class="flex-1">
            <p>{{obj.wakingHours}}</p>
            <p>
              <span></span>清醒
            </p>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="box" v-if="totalSleep.length>0">
          <van-cell
            :title="totalSleep[0].date"
            :value="totalSleep[0].sleepTotal"
            size="large"
            label="总睡眠时长"
          />
        </div>

        <template>
          <div v-for="(item,index) in list" :key="index" class="box">
            <van-cell :title="item.createTime" :value="item.sleepDuration" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      // setStep: 0,
      // step: "",
      list: [],
      totalSleep: [],
      obj: {
        shallowSleepTime: "0小时0分钟",
        deepSleepTime: "0小时0分钟",
        wakingHours: "0分钟",
        sleepDuration: "0小时0分钟"
      }
    };
  },
  mounted() {
    this.getSleepTime();
    this.getWeekSleep();
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
    })
  },
  methods: {
    async getSleepTime() {
      let res = await service.getSleepTime({
        studentId: this.studentId
      });
      if (res.errorCode === 0) {
        // this.setStep = res.data.stepTarget;
        // this.step = res.data.stepNumber;
        console.log(res);
        // this.dataValue.electricPercent = res.data.electricPercent;

        if (res.data.length === 0) {
          this.obj = {
            shallowSleepTime: "0小时0分钟",
            deepSleepTime: "0小时0分钟",
            wakingHours: "0分钟",
            sleepDuration: "0小时0分钟"
          };
        } else {
          this.obj = res.data[0];
        }
      } else {
        this.obj = {
          shallowSleepTime: "0小时0分钟",
          deepSleepTime: "0小时0分钟",
          wakingHours: "0分钟",
          sleepDuration: "0小时0分钟"
        };
      }
    },
    async getWeekSleep() {
      let res = await service.getWeekSleep({
        studentId: this.studentId
      });
      console.log(res);
      if (res.errorCode === 0) {
        this.list = res.data.filter(item => item.createTime != "总睡眠时长");
        this.totalSleep = res.data.filter(
          item => item.createTime === "总睡眠时长"
        );
      }
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  height: 450px;
}
.bgT {
  width: 100%;
  height: 350px;
  background: linear-gradient(
    117deg,
    rgba(162, 225, 78, 1),
    rgba(162, 222, 90, 1)
  );
  opacity: 0.88;
}
.dataT {
  width: 90vw;
  position: absolute;
  left: 5vw;
  top: 300px;
  height: 130px;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  div {
    p {
      text-align: center;
      &:nth-of-type(1) {
        color: #2e2e2e;
        font-size: 28px;
      }
      &:nth-of-type(2) {
        color: #999999;
        font-size: 28px;
        margin-top: 20px;
      }
    }
  }
}
.sub {
  p {
    color: #fff;
    text-align: center;
    &:nth-of-type(2) {
      margin-top: 20px;
      font-size: 22px;
    }
    span {
      font-size: 80px;
    }
  }
}

.content {
  width: 90vw;
  margin: 0 auto;
  background: #fff;
  .van-cell {
    padding: 35px 20px;
    font-size: 28px;
    .van-cell__title {
      color: #999999;
      .van-cell__label {
        color: #2e2e2e;
      }
    }
    .van-cell__value {
      color: #666666;
    }
  }
}

.box {
  border-bottom: 1px solid #ebedf0;
}

.content {
  // div {
  //   border-bottom: 1px solid #ebedf0;
  // }
  .van-cell:not(:last-child)::after {
    content: " ";
    border-bottom: none !important;
  }
}
</style>