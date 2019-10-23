<template>
  <div class="flex-page">
    <div class="flex-bd" style="background-color:#fff;">
      <div class="page-swiper">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide>
            <div class="slide">
              <img src="@/assets/welcome-slide-1@2x.png" />
              <img src="@/assets/welcome-slide-4@2x.png" width="106" height="26" class="channel" />
              <p>
                个性添加
                <img src="@/assets/welcome-slide-7@2x.png" width="52" height="15" />
              </p>
              <p>
                坚持成就
                <img src="@/assets/welcome-slide-8@2x.png" width="52" height="15" />
              </p>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="slide">
              <img src="@/assets/welcome-slide-2@2x.png" />
              <img src="@/assets/welcome-slide-5@2x.png" width="106" height="26" class="channel" />
              <p class="text-center">
                <img src="@/assets/shouhuan-1.png" width="15" height="15" />
                <span>智慧</span>
                <span>连接</span>
                <span>课堂动态</span>
              </p>
              <p class="text-center">
                <img src="@/assets/shouhuan-2.png" width="15" height="15" />
                <span>爱好</span>
                <span>偏科</span>
                <span>家长先知</span>
              </p>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="slide">
              <img src="@/assets/welcome-slide-3@2x.png" />
              <img src="@/assets/welcome-slide-6@2x.png" width="106" height="26" class="channel" />
              <p>
                <span>作业</span>
                <span>通知</span>
                <span>家校通</span>
              </p>
              <button class="experience" @click="jump">立即体验</button>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </div>
  </div>
</template>
<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "welcome",
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        }
      }
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  methods: {
    jump() {
      this.$router.replace({
        path: "/home"
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    //给window对象添加一个属性
    window.toast = this.$toast.loading({
      mask: true,
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: "加载中..."
    });
    next();
  }
};
</script>
<style lang="less" scoped>
.slide {
  position: relative;
  height: 100vh;
  text-align: center;
  p {
    color: #666;
    margin: 10px 0;
  }
  .color-one {
    color: #84ce09;
  }
  .channel {
    margin-top: 80px;
    margin-bottom: 50px;
  }
  .experience {
    display: inline-block;
    width: 210px;
    height: 60px;
    margin-top: 40px;
    color: #84ce09;
    border-radius: 60px;
    border: 4px solid #84ce09;
    background-color: #fff;
  }
}
</style>
