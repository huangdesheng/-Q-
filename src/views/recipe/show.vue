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
        <div class="article-hd articleTwo">
          <div class="article-cell">
            <van-icon class="teacherPhoto" name="user-o" size="16px"></van-icon>
            <span>{{ info.tacherName }}</span>
          </div>
          <div class="article-cell">
            <!-- <van-icon name="clock-o" size="16px"></van-icon> -->
            <time style="margin-left:5px;">{{ info.postTime }}</time>
          </div>
          <div class="article-cell">
            <van-icon name="eye-o" size="16px"></van-icon>
            <span class="classReadCount">{{ info.readCount }}</span>
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
        <div class="deadline">
          <van-icon name="clock-o" size="16px"></van-icon>
          <span class="startDate">{{ info.startDate }}</span>
          <span>~</span>
          <span class="endDate">{{ info.endDate }}</span>
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
        <!-- <template v-if="roleType == 1||roleType == 4">
          <section class="mamba">
            <p @click="handleReaders(info)">
              班级已读{{ info.readCount }}人，共{{
                info.totalCount
              }}人，查看详情
            </p>
          </section>
        </template> -->
        <template v-if="roleType == 3">
          <template v-if="needConfirm">
            <template v-if="experience != 1">
              <van-button
                type="info"
                size="large"
                class="no-radius"
                :disabled="info.confirmFlag == 1"
                @click="handleConfirmFlag"
                >{{ info.confirmFlag ? "已确认" : "确认" }}</van-button
              >
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
      studentId: this.$route.query.studentId,
      query: {
        recipeId: this.$route.query.recipeId
      },
      query2: {
        recipeId: this.$route.query.recipeId,
        openId: this.$store.state.user.info.openId || this.$route.query.openId,
        studentId: this.$store.state.user.info.studentId
      },
      openId: this.$store.state.user.info.openId || this.$route.query.openId, //用户openid
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
          openId: this.openId,
          roleType: this.roleType,
          studentId: this.$route.query.studentId
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
    //点击查看年级阅读详情
    handleReaders(params) {
      let obj = {
        recipeId: this.query.recipeId
      };
      this.$router.push({
        path: "/recipe/read",
        query: obj
      });
    },
    //园长端--营养食谱列表
    async recipeInfo(params = {}) {
      let res = await service.recipeInfo(params);
      if (res.errorCode === 0) {
        this.info = res.data;
      }
    },
    //营养食谱详情
    async recipeDetail(params = {}) {
      let res = await service.recipeDetail(params);
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
    console.log(this.roleType);
    if (this.roleType == 1 || this.roleType == 4) {
      this.recipeInfo(this.query);
    } else {
      this.recipeDetail(this.query2);
    }
  }
};
</script>
<style lang="less" scoped>
.articleTwo {
  margin-top: 20px;
}
.classReadCount {
  margin-left: 21px;
}
.icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.mamba {
  height: 120px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 5px 0px rgba(21, 21, 21, 0.1);
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    font-size: 36px;
    color: rgba(255, 255, 255, 1);
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
  }
}
.deadline {
  display: flex;
  align-items: center;
  font-size: 30px;
  color: rgba(102, 102, 102, 1);
  line-height: 30px;
}
.startDate {
  margin-left: 21px;
  margin-right: 10px;
}
.endDate {
  margin-left: 10px;
}
.teacherPhoto {
  margin-right: 21px;
}
</style>
