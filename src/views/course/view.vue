<template>
  <div class="page">
    <div class="page-bd">
      <div class="gazelle">
        <div class="gazelle-head">
          <img :src="photo" width="40" height="40" radius="50" v-if="photo">
          <img src="@/assets/child-default@2x.png" width="40" height="40" radius="50" v-else>
          <p size-16 class="ml-20">{{ name }}</p>
        </div>
        <div class="gazelle-body">
          <p class="tip">小Q手环温馨提示您</p>
          <van-rate
            v-model="startCount"
            :count="5"
            :size="20"
            color="#09e2bb"
            void-color="#e5eee0"
            readonly
          ></van-rate>
          <p class="tips">{{ title }}课堂表现</p>
        </div>
        <div class="gazelle-ft"></div>
      </div>
      <div class="cells-title">
        <p>小Q手环数据分析</p>
      </div>
      <div class="cells">
        <div class="cell min-h100">
          <div class="cell-bd">
            <p>活跃时间</p>
          </div>
          <div class="cell-ft">15分钟</div>
        </div>
        <div class="cell min-h100">
          <div class="cell-bd">
            <p>前20分钟表现</p>
          </div>
          <div class="cell-ft">A</div>
        </div>
        <div class="cell min-h100">
          <div class="cell-bd">
            <p>后20分钟表现</p>
          </div>
          <div class="cell-ft">A</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { mapState } from "vuex";
export default {
  name: "courseView",
  data() {
    return {
      startCount: 5,
      title: this.$route.query.title
    };
  },
  computed: {
    ...mapState("user", {
      photo: state => state.info.photo,
      name: state => state.info.name
    })
  },
  methods: {
    jump() {
      this.$router.push({
        path: "/course/show",
        query: {}
      });
    }
  }
};
</script>
<style lang="less" scoped>
.gazelle {
  position: relative;
  margin: 20px;
  border-radius: 20px;
  background-color: #fff;
  &-head {
    display: flex;
    align-items: center;
    padding: 30px 0 0 30px;
  }
  &-body {
    color: #999;
    text-align: center;
    padding-bottom: 30px;
    .tip {
      font-size: 36px;
      color: #84ce09;
      margin-top: 20px;
      margin-bottom: 60px;
    }
    .tips {
      margin-top: 30px;
    }
  }
}
.cells-title {
  color: #2e2e2e;
}
</style>
