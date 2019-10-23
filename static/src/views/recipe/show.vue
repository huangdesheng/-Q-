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
        <div class="article-hd">
          <div class="article-cell">
            <time>{{ info.postTime }}</time>
          </div>
          <div class="article-cell">
            <van-icon name="eye-o" size="16px"></van-icon>
            <b>{{ info.readCount }}</b>
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
        <div class="article-ft">
          <time>开始时间:{{ info.startDate }}</time>
          <time>结束时间:{{ info.endDate }}</time>
        </div>
      </article>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import { mapState } from "vuex";
export default {
  name: "recipeShow",
  data() {
    return {
      query: {
        openId: this.$store.state.user.info.openId || this.$route.query.openId,
        recipeId: this.$route.query.recipeId,
        studentId: this.$route.query.studentId
      },
      roleType: this.$store.state.user.info.roleType,
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
    //食谱详情查询
    async recipeDetail(params = {}) {
      let res = await service.recipeDetail(params);
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
    this.recipeDetail(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>
