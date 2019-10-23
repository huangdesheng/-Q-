<template>
  <div class="flex-page">
    <div class="flex-bd">
      <!-- video视频区域 -->
      <div class="video-mod">
        <div class="video-main">
          <template v-if="0">
            <video ref="video" :src="info.videoUrl" controls></video>
          </template>
          <template v-else>
            <div class="video-mask">
              <van-icon name="play-circle" size="40px"></van-icon>
              <p class="ml-20">暂无视频播放</p>
            </div>
          </template>
        </div>
      </div>
      <div class="section mb-20 mt-20">
        <h3 class="mb-20">{{ this.$route.query.title }}</h3>
        <p style="color:#999">主讲：{{ this.$route.query.author }}</p>
        <span style="color:#84ce09">免费</span>
      </div>
      <div class="section">
        <h4 class="mb-20">小Q建议:</h4>
        <p>遇到孩子学不好英语，先不要急着看到他能取得多大成绩，家长要学会潜移默化的培养他的兴趣，给他看简单的英文电影，或是可以采取一些小小奖励。兴趣是最好的老师。</p>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "studyPlanShow",
  data() {
    return {};
  },
  methods: {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.video-mod {
  min-height: 360px;
  position: relative;
  background-color: rgba(0, 0, 0, 0.5);
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
  color: #fff;
  background-color: rgba(0, 0, 0, 0.3);
}
.video-main {
  height: 100%;
  video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.section {
  padding: 30px;
  background-color: #fff;
  p {
    line-height: 1.6;
    margin-bottom: 20px;
  }
  span {
    color: #7d7e80;
  }
}
</style>
