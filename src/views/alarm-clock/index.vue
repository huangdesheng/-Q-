<template>
  <div class="page">
    <div class="page-bd">
      <div class="cells flex j-c-s-b a-i-c alarm" v-for="(item,index) in lists" :key="index">
        <div @click="editClock(item.id,index)">
          <p>{{item.remark}}</p>
          <p class="flex a-i-c">
            <span>上午</span>
            {{item.time}}
          </p>
        </div>
        <div class="flex-1" @click="editClock(item.id,index)">
          <p>
            <span v-if="String(item.bitMap).split('')[0] == 1">周日</span>
            <span v-if="String(item.bitMap).split('')[1] == 1">周一</span>
            <span v-if="String(item.bitMap).split('')[2] == 1">周二</span>
            <span v-if="String(item.bitMap).split('')[3] == 1">周三</span>
            <span v-if="String(item.bitMap).split('')[4] == 1">周四</span>
            <span v-if="String(item.bitMap).split('')[5] ==1">周五</span>
            <span v-if="String(item.bitMap).split('')[6] == 1">周六</span>
          </p>
          <p v-if="item.status === true">开启</p>
          <p v-if="item.status === false">未开启</p>
        </div>
        <van-switch v-model="item.status" active-color="#FDA322" />
      </div>
    </div>

    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" @click="addClock">添加闹钟</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { mapState } from "vuex";
export default {
  name: "alarmClock",
  data() {
    return {
      lists: []
    };
  },
  methods: {
    async getAlarmClock() {
      let res = await service.getAlarmClock({
        studentId: this.studentId
      });
      if (res.errorCode === 0) {
        this.lists = res.data;
      }
    },
    addClock() {
      this.$router.push({
        path: "/alarm-clock/add",
        query: { len: this.lists.length }
      });
    },
    editClock(id) {
      //   this.$router.push({
      //     path: "/alarm-clock/add",
      //     query: { id, len: index + 1 }
      //   });
    }
  },
  mounted() {
    this.getAlarmClock();
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
  }
};
</script>
<style lang="less" scoped>
.alarm {
  padding: 50px 30px;
  border-bottom: 1px solid #eee;
  div {
    color: #666666;
    &:nth-of-type(2) {
      padding-left: 20px;
      font-size: 24px;
    }
    &:nth-of-type(1) {
      padding-right: 20px;
      border-right: 1px solid #eee;
      p {
        &:nth-of-type(2) {
          font-size: 50px;
          font-weight: 600;
          color: #333;
          padding-top: 15px;
          span {
            font-size: 24px;
            color: #666;
            font-weight: 500;
          }
        }
      }
    }
    p {
      &:nth-of-type(2) {
        padding-top: 10px;
      }
    }
  }
}
</style>