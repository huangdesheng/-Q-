<template>
  <div class="page">
    <div class="page-bd">
      <div class="empty" v-if="parseInt(info.isDel)">
        <img src="@/assets/kong.png" alt />
        <p>内容已被删除了</p>
      </div>
      <!-- 返回首页 -->
      <div class="back-home" @click="handleBackHome">
        <van-icon name="home-o" size="30px"></van-icon>
        <div>首页</div>
      </div>
      <article class="article" v-if="!parseInt(info.isDel)">
        <h1 size-24>{{ info.title }}</h1>
        <div class="article-hd title2">
          <div class="article-cell" v-if="info.name">
            <van-icon name="user-o" size="16px"></van-icon>
            <span style="margin-left:5px;">{{ info.name }}</span>
          </div>
          <div class="article-cell">
            <van-icon name="contact" size="16px" />
            <span>刘家明园长</span>
            <time style="margin-left:5px;">{{ info.postTime }}</time>
          </div>
          <div class="article-cell">
            <van-icon name="eye-o" size="16px"></van-icon>
            <b>{{ info.classReadCount }}</b>
          </div>
        </div>
        <div size-16 class="article-bd">
          <p v-html="info.textContent"></p>
          <template v-if="info.images">
            <p v-for="(img, index) in info.images" :key="index">
              <img :src="img.imageUrl" />
            </p>
          </template>
        </div>
      </article>
    </div>
    <div class="page-ft" v-show="!parseInt(info.isDel)">
      <div class="fixed-bottom" style="z-index: 100;">
        <template v-if="roleType == 1 || roleType == 4">
          <section class="mamba">
            <p @click="handleReaders(info)">查看年级阅读详情</p>
          </section>
        </template>
        <template v-if="roleType == 2">
          <section class="mamba">
            <p
              @click="handleReaders(info)"
            >班级已读{{ info.classReadCount }}人，共{{ info.totalCount }}人，查看详情</p>
          </section>
        </template>
        <template v-if="roleType == 3">
          <template v-if="needConfirm">
            <template v-if="experience != 1">
              <van-button
                type="info"
                size="large"
                class="no-radius"
                :disabled="info.confirmFlag == 1"
                @click="handleConfirmFlag"
              >{{ info.confirmFlag ? '已确认':'确认' }}</van-button>
            </template>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import { mapState } from "vuex";
export default {
  name: "noticeShow",
  data() {
    return {
      query: {
        openId: this.$store.state.user.info.openId || this.$route.query.openId, //用户openid
        noticeId: this.$route.query.noticeId,
        classId: this.$route.query.classId,
        studentId: this.$route.query.studentId
      },
      roleType:
        this.$store.state.user.info.roleType || this.$route.query.roleType,
      needConfirm: parseInt(this.$route.query.needConfirm), //0 不用确认
      info: {}
    };
  },
  computed: {
    ...mapState("user", {
      experience: state => state.info.experience //0不是体验用户 1是
    })
  },
  methods: {
    handleBackHome() {
      //体验用户
      if (this.experience == 1) {
        this.$router.push({
          path: "/home"
        });
      } else {
        let obj = {
          id: this.$store.state.user.info.id,
          openId: this.query.openId,
          roleType: this.roleType,
          studentId: this.query.studentId
        };
        this.backPage(obj);
      }
    },
    handleConfirmFlag() {
      //0-无需确认 1-需要确认
      if (!this.info.confirmFlag) {
        let { openId, noticeId, studentId } = this.query;
        this.noticeConfirm({ openId, noticeId, studentId });
      }
    },
    handleReaders(params) {
      let obj = {
        noticeId: params.noticeId,
        openId: this.query.openId,
        classId: this.$route.query.classId,
        needConfirm: this.$route.query.needConfirm
      };
      this.$router.push({
        path: "/notice/read",
        query: obj
      });
    },
    //园长端--公告通知详情
    async querySchoolNoticeDefaul(params = {}) {
      let res = await service.querySchoolNoticeDefaul(params);
      if (res.errorCode === 0) {
        this.info = res.data;
      }
    },
    //公告通知详情
    async noticeDetail(params = {}) {
      let res = await service.noticeDetail(params);
      if (res.errorCode === 0) {
        this.info = res.data;
      }
    },
    //公告确认
    async noticeConfirm(params = {}) {
      if (this.roleType == 3) {
        let res = await service.noticeConfirm(params);
        if (res.errorCode === 0) {
          this.info.confirmFlag = 1;
          this.$toast("通知确认成功");
        }
      }
    },
    //返回首页
    async backPage(params = {}) {
      let res = await service.backPage(params);
      if (res.errorCode === 0) {
        let _cookie = Cookies.getJSON("info");
        let obj = Object.assign({}, _cookie, res.data);
        this.$store.dispatch("user/setInfo", obj).then(data => {
          if (data.success === "ok") {
            this.$router.push({
              path: "/home"
            });
          }
        });
      } else {
        this.$toast(`返回出错啦~`);
      }
    }
  },
  activated() {
    if (this.roleType == 1 || this.roleType == 4) {
      this.querySchoolNoticeDefaul(this.query);
    } else {
      this.noticeDetail(this.query);
    }
  }
};
</script>
<style lang="less" scoped>
.icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.mamba {
  font-size: 32px;
  color: #92cd36;
  padding: 30px 0;
  text-align: center;
  box-shadow: 0 0 15px 2px rgba(88, 88, 88, 0.1);
  background-color: #fff;
}
.title2{
  margin-top:30px;
}
</style>
