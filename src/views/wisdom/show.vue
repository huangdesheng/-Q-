<template>
  <div class="page-page">
    <div class="page-bd">
      <!-- video视频区域 -->
      <div class="video-mod">
        <!-- <div class="video-mask">
          <van-icon name="play-circle" size="40px"></van-icon>
        </div>-->
        <!-- <div class="video-main">
          <video ref="video" src="@/assets/video01.mp4" controls></video>
        </div>-->
      </div>
      <article class="article">
        <div class="article-content">
          <h1>10种创意绘画方法,让孩子迷上美术活动!</h1>
          <p>美术活动没点子？绘画方式没创意？别担心，童老师为你准备了10个创意绘画方法，让你的美术活动趣味十足~</p>
          <p>1.鸡蛋托画</p>
          <p>准备材料：染料、画笔、鸡蛋托、毛根扭扭棒、塑料眼睛、剪刀、胶水、彩纸等。</p>
          <p>做法：1.里用鸡蛋托造型，把鸡蛋托剪成蜜蜂、蜻蜓、蝴蝶、乌龟等形状；</p>
          <p>2.为自己的小昆虫涂上颜色；</p>
          <p>3.最后粘贴上眼睛和触角等。</p>
          <p>2.掌印画</p>
          <p>准备材料：卡纸、染料、画笔</p>
          <p>做法：1.用手掌或者脚掌蘸取染料，印在卡纸上；</p>
          <p>2.然后借形想象，塑造各种形象。</p>
          <p>笑脸太阳：</p>
        </div>
      </article>
      <!-- 推荐 -->
      <div class>
        <p>为你推荐</p>
      </div>
      <!-- 评论 -->
      <div class="comment-box mt-20">
        <div class="comment-header flex a-i-c">
          <p size-16>评论</p>
        </div>
        <div class="comment-cell" v-for="(item, index) in commentList" :key="index">
          <div class="comment-hd flex a-i-c">
            <img :src="item.photo" width="40" height="40" radius="50">
            <span class="ml-20">{{ item.name }}</span>
          </div>
          <div class="comment-bd">
            <p>{{ item.textContent }}</p>
          </div>
          <div class="comment-ft">
            <time>{{ item.postTime }}</time>
          </div>
        </div>
      </div>
    </div>
    <div class="page-ft">
      <div class="handle flex a-i-c">
        <div class="handle-share">
          <van-icon name="share" size="20px"></van-icon>
          <div size-12>转发</div>
        </div>
        <div class="handle-comment">
          <van-icon name="like-o" size="20px"></van-icon>
          <div size-12>收藏</div>
        </div>
        <div class="handle-down">
          <van-button type="info" class="no-radius">评论</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { examPaperComment } from "@/mock";
export default {
  name: "wisdomShow",
  data() {
    return {
      commentList: []
    };
  },
  methods: {},
  mounted() {
    this.commentList = examPaperComment();
  }
};
</script>
<style lang="less" scoped>
.video-mod {
  min-height: 360px;
  position: relative;
  background-color: #fff;
  box-shadow: 0 1px 10px 0 rgba(204, 204, 204, 0.5);
}
.video-mask {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}
.video-main {
  height: 100%;
}
.handle {
  background-color: #fff;
  position: relative;
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
  > div {
    flex: 1;
    text-align: center;
  }
}
.comment-box {
  background-color: #fff;
}
.comment-header {
  min-height: 100px;
  padding: 0 30px;
}
.comment-cell {
  padding: 20px 30px;
  position: relative;
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
.comment-hd {
  color: #7d7e80;
}
.comment-bd {
  margin: 20px 0;
  p {
    line-height: 1.6;
  }
}
.comment-ft {
  color: #7d7e80;
}
</style>
