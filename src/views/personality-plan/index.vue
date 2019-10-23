<template>
  <div class="flex-page">
    <div class="flex-bd">
      <div class="cells-title min-h100 a-i-c">
        <div class="flex a-i-c">
          <img src="@/assets/learning-icon@2x.png" width="24" height="24" />
          <!-- <van-icon name="like-o" size="22px"></van-icon> -->
          <p class="ml-20" size-17>我的定制</p>
        </div>
        <!-- <div class="flex a-i-c">
          <span>全部</span>
          <van-icon name="arrow" size="16px"></van-icon>
        </div>-->
      </div>
      <!-- swiper start -->
      <div class="page-swiper">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide>
            <div class @click="jump('/personality-plan/show')">
              <!-- <img src="@/assets/swiper-slide@2x.png"> -->
              <div class="slide-info">
                <p class="text-ellipsis" size-16>该如何培养孩子的自控力</p>
                <div class="flex slide-meta">
                  <!-- <div class="mr-40">课程：0/6</div>
                  <div class="mr-40">时间：1/30</div>-->
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <!-- swiper end -->
      <div class="cells-title min-h100 a-i-c">
        <div class="flex a-i-c">
          <img src="@/assets/learning-icon@2x.png" width="24" height="24" />
          <!-- <van-icon name="star-o" size="22px"></van-icon> -->
          <p class="ml-20" size-17>个性计划推荐</p>
        </div>
        <!-- <div class="flex a-i-c">
          <span>全部</span>
          <van-icon name="arrow" size="16px"></van-icon>
        </div>-->
      </div>
      <!-- swiper start -->
      <div class="page-swiper">
        <swiper :options="params" ref="plan">
          <swiper-slide class="plan-slide">
            <div class="plan" @click="jump('/personality-plan/show3')">
              <!-- <img src="@/assets/personality-plan-1.png"> -->
              <div class="plan-info">
                <h3 class="text-ellipsis">如何培养孩子的阅读习惯？</h3>
                <p class="text-ellipsis">必须培养他懂得这些科学计划方法。</p>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide class="plan-slide">
            <div class="plan" @click="jump('/personality-plan/show2')">
              <!-- <img src="@/assets/swiper-slide-2@2x.png"> -->
              <div class="plan-info">
                <h3 class="text-ellipsis">让孩子个性化学习</h3>
                <p class="text-ellipsis">必须培养他懂得这些科学计划方法。写天2019年的跑步运动培养计划...</p>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide class="plan-slide">
            <div class="plan" @click="jump('/personality-plan/show4')">
              <!-- <img src="@/assets/personality-plan-6.png"> -->
              <div class="plan-info">
                <h3 class="text-ellipsis">学生行为养成十大教育内容</h3>
                <p class="text-ellipsis">学生文明行为习惯养成教育主要内容</p>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <!-- swiper end -->
    </div>
  </div>
</template>
<script>
import service from "@/api";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "personalityPlan",
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      swiperOption: {},
      params: {
        freeMode: true,
        slidesPerView: "auto",
        spaceBetween: 15,
        observer: true,
        centeredSlides: true
      }
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    plan() {
      return this.$refs.plan.swiper;
    }
  },
  methods: {
    jump(url) {
      this.$router.push({
        path: url,
        query: {}
      });
    }
  },
  mounted() {
    this.plan.slideTo(1, 500, false);
  }
};
</script>
<style lang="less" scoped>
.cells-title {
  margin: 0;
  background-color: #fff;
}

.page-swiper {
  position: relative;
  background-color: #fff;
  margin-bottom: 30px;
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
.slide-info {
  padding: 20px 30px;
  overflow: hidden;
}
.slide-meta {
  color: #999;
  font-size: 24px;
}

.plan-slide {
  padding: 30px 0;
  width: 537px;
  .plan {
    position: relative;
    overflow: hidden;
    &-info {
      position: absolute;
      left: 0;
      bottom: 0;
      color: #fff;
      width: 100%;
      padding-left: 20px;
      padding-bottom: 20px;
      h3 {
        margin-bottom: 10px;
      }
    }
  }
  img {
    width: 100%;
    height: 315px;
  }
}
</style>
