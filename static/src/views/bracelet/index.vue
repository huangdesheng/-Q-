<template>
  <div class="page">
    <div class="page-bd">
      <!-- 用户 -->
      <!-- <div class="flex a-i-c home-user gradient-two">
        <div class="flex a-i-c">
          <template v-if="name">
            <div class="avatar-circle flex a-i-c j-c-c">
              <img :src="photo" width="60" height="60" radius="50" v-if="photo" />
              <img src="@/assets/child-default@2x.png" width="60" height="60" radius="50" v-else />
            </div>
            <div class="js-user-change">
              <h3 class="mb-20" size-18>{{ name }}</h3>
              <p size-12>运动需要坚持才能长存</p>
            </div>
          </template>
        </div>
      </div>-->
      <!-- 用户 -->
      <div class="empty" v-if="isBindBracelet == 0">
        <img src="@/assets/kong.png" alt />
        <p class="mt-30">小Q手环智能连接课堂动态...开发中,期待~~</p>
      </div>
    </div>
    <!-- <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button
          type="info"
          size="large"
          class="no-radius"
          to="/device"
          v-if="isBindBracelet == 0"
        >去绑定</van-button>
      </div>
    </div>-->
  </div>
</template>
<script>
import service from "@/api";
import { mapState } from "vuex";
export default {
  name: "bracelet",
  data() {
    return {
      query: {
        studentId: this.$store.state.user.info.studentId,
        openId: this.$store.state.user.info.openId
      }
    };
  },
  computed: {
    ...mapState("user", {
      name: state => state.info.name,
      photo: state => state.info.photo,
      isBindBracelet: state => state.info.isBindBracelet //0表示没有绑定手环 1表示有
    })
  },
  methods: {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.home-user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 180px;
  padding: 0 30px;
  color: #fff;
  .js-user-change {
    margin-left: 20px;
  }
}
</style>
