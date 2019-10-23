<template>
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
    <div class="title">当天打卡详细时间</div>
    <div class="clockOnBox">
      <div class="clockOn">
        <div class="Am">
          <div class="timeTitle">
            <p>上午</p>
            <span v-for="(item,index) in listAm" :key="index">{{item.sendTime}}</span>
          </div>
        </div>
        <div class="Noon">
          <div class="timeTitle">
            <p>中午</p>
            <span v-for="(item,index) in listNoon" :key="index">{{item.sendTime}}</span>
          </div>
        </div>
        <div class="Pm">
          <div class="timeTitle">
            <p>下午</p>
            <span v-for="(item,index) in listPm" :key="index">{{item.sendTime}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  data() {
    return {
      query: {
        studentId: this.$route.query.studentId,
        openId: this.$store.state.user.info.openId,
        data: this.$route.query.day
      },
      listAm: [],
      listNoon: [],
      listPm: []
    };
  },
  methods: {
    //查询学生当天打卡记录
    async clockQueryDate(params = {}) {
      let res = await service.clockQueryDate(params);
      if (res.errorCode === 0) {
        this.listAm = res.data.morming;
        this.listNoon = res.data.lunch;
        this.listPm = res.data.evening;
      }
    }
  },
  activated() {
    this.clockQueryDate(this.query);
  }
};
</script>
<style lang="less" scoped>
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
        border-bottom: 1px solid #ccc;
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
          margin-bottom: 60px;
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
