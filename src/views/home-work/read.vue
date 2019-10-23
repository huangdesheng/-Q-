<template>
  <div class="page">
    <div class="page-bd">
      <van-tabs v-model="active" :line-height="2" @click="handleTabClick">
        <van-tab title="已读">
          <div class="cell min-h120 read-cell" v-for="(read, index) in readList" :key="index">
            <div class="cell-hd">
              <img v-if="read.photo" :src="read.photo" :alt="read.studentName" />
              <img src="@/assets/child-default@2x.png" v-else />
            </div>
            <div class="cell-bd pl-20">
              <p class>{{ read.studentName }}</p>
            </div>
            <div class="cell-ft">
              <template v-if="needConfirm">
                <span v-if="read.confirmFlag === 0" style="color:#ff87b7">未确认通知</span>
                <span v-else style="color:#92cd36">已确认通知</span>
              </template>
            </div>
          </div>
        </van-tab>
        <van-tab title="未读">
          <div class="cell min-h120 read-cell" v-for="(unread, index) in unreadList" :key="index">
            <div class="cell-hd">
              <img v-if="unread.photo" :src="unread.photo" :alt="unread.studentName" />
              <img src="@/assets/child-default@2x.png" v-else />
            </div>
            <div class="cell-bd pl-20">
              <p class>{{ unread.studentName }}</p>
            </div>
            <div class="cell-ft">
              <template v-if="needConfirm">
                <span v-if="unread.confirmFlag === 0" style="color:#ff87b7">未确认通知</span>
                <span v-else style="color:#92cd36">已确认通知</span>
              </template>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "homeWorkRead",
  data() {
    return {
      active: 0,
      needConfirm: parseInt(this.$route.query.needConfirm), //0 不用确认
      query: {
        openId: this.$store.state.user.info.openId, //用户openid
        homeId: this.$route.query.homeId,
        classId: this.$route.query.classId,
        readFlag: 0 //0-已读 1-未读
      },
      readList: [],
      unreadList: []
    };
  },
  computed: {
    readCount() {
      return this.readList.length;
    },
    unReadCount() {
      return this.unreadList.length;
    }
  },
  methods: {
    handleTabClick(index) {
      this.query.readFlag = index;
      this.homeworkReaders(index);
    },
    //公告阅读人员查询
    async homeworkReaders(readFlag) {
      let obj = Object.assign({}, this.query, { readFlag });
      let res = await service.homeworkReaders(obj);
      if (res.errorCode === 0) {
        if (readFlag) {
          this.unreadList = res.data.readers || []; //后端有可能返回null
        } else {
          this.readList = res.data.readers || []; //后端有可能返回null
        }
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  },
  mounted() {
    this.homeworkReaders(0);
  }
};
</script>
<style lang="less" scoped>
.read-cell {
  background-color: #fff;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
}
</style>
