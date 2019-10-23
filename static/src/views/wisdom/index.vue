<template>
  <div class="page">
    <div class="page-bd">
      <!-- layout one -->
      <div class="wisdom-user flex a-i-c j-c-c gradient-three">
        <div class="wisdom-box">
          <div class="flex a-i-c j-c-c">
            <img :src="photo" width="50" height="50" radius="50">
            <div class="js-user-change ml-20">{{ name }}</div>
          </div>
          <p size-12 class="mt-20 mb-20">当你在平台上分享你的作品，不可思议的事件就会让你成长</p>
          <router-link to="/works" tag="div" class="text-center">
            <span size-12>作品: 160幅</span>
            <span size-12>上榜: 9幅</span>
          </router-link>
        </div>
      </div>
      <!-- 文章 start -->
      <div class="news">
        <div class="news-item" v-for="(item,index) in list" :key="index" @click="jump(index)">
          <div class="news-bd flex">
            <div class="news-thumb">
              <img :src="item.photo" alt width="80" height="80">
            </div>
            <div class="news-info">
              <h3 class="text-ellipsis mb-20">{{ item.title }}</h3>
              <p class="line-clamp">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 文章 end -->
    </div>
    <div class="page-ft">
      <qxFooter></qxFooter>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import qxFooter from "@/components/Footer";
import { wisdomList } from "@/mock";
export default {
  name: "wisdom",
  components: {
    qxFooter
  },
  data() {
    return {
      photo: this.$store.state.user.info.photo,
      name: this.$store.state.user.info.name,
      list: []
    };
  },
  methods: {
    jump(index) {
      this.$router.push({
        path: "/wisdom/show",
        query: {
          index
        }
      });
    }
  },
  mounted() {
    this.list = wisdomList();
    console.log(this.list);
  }
};
</script>
<style lang="less" scoped>
.wisdom-user {
  color: #fff;
  position: relative;
  height: 240px;
}
.news {
  position: relative;
  background-color: #fff;
  &-item {
    position: relative;
    padding: 20px;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 1px;
      border-top: 1px solid #e5e5e5;
      color: #e5e5e5;
      transform-origin: 0 0;
      transform: scaleY(0.5);
      z-index: 2;
    }
  }
  &-info {
    flex: 1;
    overflow: hidden;
    padding-left: 30px;
  }
  &-thumb {
  }
}
</style>
