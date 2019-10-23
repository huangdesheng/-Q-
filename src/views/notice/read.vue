<template>
  <div class="page">
    <div class="page-bd">
      <!-- 园长端查看 -->
      <template v-if="roleType == 1 || roleType == 4">
        <div div class="cells">
          <div class="cell min-h120" size-17>
            <div class="cell-bd text-center">年级</div>
            <div class="cell-bd text-center">已阅读</div>
            <div class="cell-bd text-center">未阅读</div>
            <div class="cell-bd text-center">未确认</div>
          </div>
        </div>
        <div class="cells">
          <div
            class="cell min-h100"
            v-for="(item, index) in gradeList"
            :key="index"
          >
            <div class="cell-bd">
              <div class="text-center">{{ item.gradeName }}</div>
            </div>
            <div class="cell-bd">
              <div class="text-center" style="color:#9cd248" @click="jump(1)">
                {{ item.read }}
              </div>
            </div>
            <div class="cell-bd">
              <div class="text-center" style="color:#9cd248" @click="jump(2)">
                {{ item.unRead }}
              </div>
            </div>
            <div class="cell-bd">
              <div class="text-center" style="color:#9cd248" @click="jump(3)">
                {{ item.unConfirmFlag }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- 园长端查看 -->
      <template v-if="roleType == 2">
        <van-tabs v-model="active" :line-height="2" @click="handleTabClick">
          <van-tab title="已读">
            <div class="readTitle">已阅读公告通知({{ readCount2 }})</div>
            <div
              class="cell min-h120 read-cell"
              v-for="(read, index) in readList"
              :key="index"
            >
              <div class="cell-hd">
                <div class="serial">
                  {{ index > 10 ? index : `0${index + 1}` }}
                </div>
                <img
                  v-if="read.photo"
                  :src="read.photo"
                  :alt="read.studentName"
                />
                <img src="@/assets/child-default@2x.png" v-else />
              </div>
              <div class="cell-bd pl-20">
                <p class>{{ read.studentName }}</p>
              </div>
              <div class="cell-ft">
                <template v-if="needConfirm">
                  <span v-if="read.confirmFlag === 0" style="color:#FEBF56"
                    >未确认通知</span
                  >
                  <div class="readTime" v-else>
                    <p>{{ read.postTime }}</p>
                    <span style="color:#92cd36">已确认通知</span>
                  </div>
                </template>
              </div>
            </div>
          </van-tab>
          <van-tab title="未读">
            <div class="readTitle">
              当前还未阅读公告通知({{ unReadCount2 }})
            </div>
            <div
              class="cell min-h120 read-cell"
              v-for="(unread, index) in unreadList"
              :key="index"
            >
              <div class="cell-hd">
                <div class="serial">
                  {{ index > 10 ? index + 1 : `0${index + 1}` }}
                </div>
                <img
                  v-if="unread.photo"
                  :src="unread.photo"
                  :alt="unread.studentName"
                />
                <img src="@/assets/child-default@2x.png" v-else />
              </div>
              <div class="cell-bd pl-20">
                <p class>{{ unread.studentName }}</p>
              </div>
              <div class="cell-ft">
                <template v-if="needConfirm">
                  <span v-if="unread.confirmFlag === 0" style="color:#FEBF56"
                    >未确认通知</span
                  >
                  <div class="readTime" v-else>
                    <p>{{ unread.postTime }}</p>
                    <span style="color:#92cd36">已确认通知</span>
                  </div>
                </template>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </template>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "noticeRead",
  data() {
    return {
      readCount2: "",
      unReadCount2: "",
      active: 0,
      needConfirm: parseInt(this.$route.query.needConfirm), //0 不用确认
      roleType: this.$store.state.user.info.roleType,
      query: {
        openId: this.$store.state.user.info.openId || this.$route.query.openId, //用户openid
        noticeId: this.$route.query.noticeId,
        classId: this.$route.query.classId,
        readFlag: 0 //0-已读 1-未读
      },
      readList: [],
      unreadList: [],
      gradeList: [] //级统计
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
      this.noticeReaders(index);
    },
    jump(status) {
      let { noticeId } = this.query;
      this.$router.push({
        path: "/notice/view-class",
        query: {
          noticeId,
          status
        }
      });
    },
    //公告阅读人员查询
    async noticeReaders(readFlag) {
      let obj = Object.assign({}, this.query, { readFlag });
      let res = await service.noticeReaders(obj);
      if (res.errorCode === 0) {
        if (readFlag) {
          this.unreadList = res.data.readers || []; //后端有可能返回null
          this.unReadCount2 = res.data.unReadCount;
        } else {
          this.readList = res.data.readers || []; //后端有可能返回null
          this.readCount2 = res.data.readCount;
        }
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    },
    //园长端--公告通知年级统计
    async queryleader(params = {}) {
      let res = await service.queryleader(params);
      if (res.errorCode === 0) {
        this.gradeList = res.data;
      }
    }
  },
  mounted() {
    if (this.roleType == 2) {
      this.noticeReaders(0);
    } else {
      this.queryleader({ noticeId: this.query.noticeId });
    }
  }
};
</script>
<style lang="less" scoped>
// .cell {
//   padding: 0;
// }
.read-cell {
  background-color: #fff;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
}
.readTitle {
  font-size: 36px;
  color: rgba(153, 153, 153, 1);
  line-height: 72px;
  margin: 10px 0 10px 33px;
}
.serial {
  font-size: 30px;
  margin-right: 40px;
  color: rgba(51, 51, 51, 1);
}
.readTime {
  p {
    font-size: 26px;
    color: rgba(153, 153, 153, 1);
  }
  span {
    width: 100%;
    display: inline-block;
    text-align: right;
    margin-top: 15px;
  }
}
.min-h120{
  height: 140px;
}
</style>
