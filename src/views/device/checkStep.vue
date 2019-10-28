<template>
  <div class="page">
    <div class="page-bd">
      <div class="title">
        <div class="bgT flex j-c-c a-i-c f-w-w">
          <div style="height:100px" class="sub">
            <p>
              <span>{{step}}</span>
              /{{setStep}}步
            </p>
            <p>超越全国98%用户</p>
          </div>
        </div>
        <div class="content">
          <div class="top">
            <p>{{totalStepName.date}}</p>
            <div class="flex j-c-s-b a-i-c">
              <span>{{totalStepName.createTime}}</span>
              <span>{{totalStepName.totalStep}}步</span>
              <span>燃烧{{totalStepName.calorie}}卡路里</span>
            </div>
          </div>
          <div class="flex j-c-s-b a-i-c" v-for="(item,index) in list" :key="index">
            <span>{{item.createTime}}</span>
            <span>{{item.stepNumber}}步</span>
            <span>燃烧{{item.calorie}}卡路里</span>
          </div>
        </div>
      </div>
      <!-- <div class="content">
        <van-cell title="08月12日-08月18日" value="55小时54分钟" size="large" label="总时长" />
        <van-cell title="08月16日" value="6小时35分钟" />
        <van-cell title="08月16日" value="6小时35分钟" />
        <van-cell title="08月16日" value="6小时35分钟" />
        <van-cell title="08月16日" value="6小时35分钟" />
        <van-cell title="08月16日" value="6小时35分钟" />
      </div>-->
    </div>
  </div>
</template>

<script>
import service from "@/api";
import { bytesArrayToBase64 } from "@/utils/arrayToBase64";
import { mapState } from "vuex";

export default {
  data() {
    return {
      setStep: 0,
      step: "",
      list: [],
      totalStepName: {}
    };
  },
  mounted() {
    this.getStepNumber();
    this.getStepNumberHistory();
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
  },
  methods: {
    async getStepNumber() {
      let res = await service.getStepNumber({
        studentId: this.studentId
      });
      if (res.errorCode === 0) {
        this.setStep = res.data.stepTarget;
        this.step = res.data.stepNumber;
      }
    },
    async getStepNumberHistory() {
      let res = await service.getStepNumberHistory({
        studentId: this.studentId
      });
      if (res.errorCode === 0) {
        this.list = res.data.filter(item => item.createTime != "总步数");
        this.totalStepName = res.data.filter(
          item => item.createTime === "总步数"
        )[0];
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
.content {
  width: 90vw;
  position: absolute;
  left: 5vw;
  top: 300px;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  > div {
    padding: 30px 0;
    margin: 10px 20px;
    color: #666666;
    border-bottom: 1px solid #eee;
    font-size: 27px;
    &:last-of-type {
      border: none;
    }
  }
  .top {
    > p {
      margin: 20px 0px 30px;
    }
    > div {
      margin: 20px 0px 10px;
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
</style>