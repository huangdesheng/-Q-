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
      <!-- -->
      <article class="article" v-if="!parseInt(info.isDel)">
        <h1 size-24>{{ info.title }}</h1>
        <div class="article-hd title2">
          <div class="article-cell" v-if="info.name">
            <van-icon name="user-o" size="16px"></van-icon>
            <span style="margin-left:5px;">{{ info.name }}</span>
          </div>
          <div class="article-cell">
            <van-icon class="infoPhoto" name="contact" size="16px"></van-icon>
            <span>{{ info.teacherName }}</span>
            <time style="margin-left:8px;">{{ info.postTime }}</time>
          </div>
          <div class="article-cell">
            <van-icon name="eye-o" size="16px"></van-icon>
            <span class="readNum">{{ info.classReadCount }}</span>
          </div>
        </div>
        <section size-16 class="article-bd">
          <p v-html="info.textContent"></p>
          <template v-if="info.images">
            <p v-for="(img, index) in info.images" :key="index">
              <img :src="img.imageUrl" />
            </p>
          </template>
        </section>
      </article>
    </div>
    <div class="page-ft" v-if="!parseInt(info.isDel)">
      <div class="fixed-bottom" style="z-index: 100;">
        <!-- <template v-if="roleType != 3">
          <section class="mamba">
            <p
              @click="handleReaders(info)"
            >班级已读{{ info.classReadCount }}人，共{{ info.totalCount }}人，查看详情</p>
          </section>
        </template>
        <template v-if="roleType == 3">-->
        <!-- 确认标志 0-无需确认 1-需要确认 -->
        <!-- <template v-if="needConfirm">
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
        </template>-->
        <template v-if="roleType == 1 || roleType == 4">
          <section class="mamba">
            <p @click="handleReaders(info)">查看年级阅读详情</p>
          </section>
        </template>
        <template v-if="roleType == 2">
          <section class="mamba infoFooter">
            <p @click="handleReaders(info)">查看阅读详情</p>
          </section>
        </template>
        <template v-if="roleType == 3">
          <template v-if="needConfirm">
            <template v-if="experience != 1">
              <div v-if="info.confirmFlag === -1"></div>
              <div v-if="info.confirmFlag === 0" class="clickRead" @click="handleConfirmFlag">
                <p>点击确认阅读</p>
              </div>
              <div v-if="info.confirmFlag === 1" class="clickRead2">
                <p>已确认阅读</p>
              </div>
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
  name: "homeWorkShow",
  data() {
    return {
      readFlag: 0, //0-已读 1-未读
      query: {
        openId: this.$store.state.user.info.openId || this.$route.query.openId,
        homeId: this.$route.query.homeId,
        classId: this.$route.query.classId,
        studentId: this.$route.query.studentId
      },
      roleType:
        this.$store.state.user.info.roleType || this.$route.query.roleType,
      needConfirm: parseInt(this.$route.query.needConfirm), //0 不用确认
      info: {
        confirmFlag: -1
      }
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
      //判断是否已经确定过了
      if (!this.info.confirmFlag) {
        this.homeWorkConfirm(this.query);
      }
    },
    handleReaders(params) {
      let obj = {
        homeId: params.homeId,
        classId: this.$route.query.classId,
        needConfirm: this.$route.query.needConfirm
      };
      this.$router.push({
        path: "/home-work/read",
        query: obj
      });
    },
    //作业阅读确认
    async homeWorkConfirm(params = {}) {
      if (this.roleType == 3) {
        let res = await service.homeWorkConfirm(params);
        if (res.errorCode === 0) {
          //确认成功后设置为1
          this.info.confirmFlag = 1;
          this.$toast("作业确认成功");
        }
      }
    },
    //作业详情查询
    async homeworkDetail(params = {}) {
      let res = await service.homeworkDetail(params);
      if (res.errorCode === 0) {
        this.info = res.data;
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
    this.homeworkDetail(this.query);
  }
};
</script>
<style lang="less" scoped>
.mamba {
  font-size: 32px;
  color: #92cd36;
  padding: 30px 0;
  text-align: center;
  box-shadow: 0 0 15px 2px rgba(88, 88, 88, 0.1);
  background-color: #fff;
}
.icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.title2 {
  margin-top: 30px;
}
.infoPhoto {
  margin-right: 10px;
}
.readNum {
  margin-left: 15px;
}
.infoFooter,
.clickRead,
.clickRead2 {
  display: flex;
  justify-content: center;
  p {
    width: 500px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    background: linear-gradient(
      -10deg,
      rgba(170, 221, 90, 1),
      rgba(146, 205, 54, 1)
    );
    box-shadow: 0px 6px 10px 0px rgba(128, 199, 17, 0.3);
    border-radius: 40px;
    font-size: 36px;
    color: rgba(255, 255, 255, 1);
  }
}
.clickRead {
  height: 120px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 5px 0px rgba(21, 21, 21, 0.1);
  align-items: center;
}
.clickRead2 {
  height: 120px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 5px 0px rgba(21, 21, 21, 0.1);
  align-items: center;
  p {
    background: linear-gradient(
      -10deg,
      rgba(204, 204, 204, 1),
      rgba(204, 204, 204, 1)
    );
    box-shadow: 0px 6px 10px 0px rgba(204, 204, 204, 0.58);
  }
}
.page {
  margin-bottom: 200px;
}
</style>
