<template>
  <div class="page">
    <div class="page-bd">
      <template v-if="visibility">
        <div class="overlay" @click="visibility = false"></div>
        <div class="share-tip">
          <img src="@/assets/share-tip.png">
          <p size-18>请点击右上角按钮邀请好友吧</p>
        </div>
      </template>
      <div class="create-success">
        <img src="@/assets/create-success.png" alt>
        <div class="okapi">
          <a
            href="javascript:void(0);"
            class="btn btn-large btn-primary"
            @click="visibility = true"
          >邀请家长加入</a>
        </div>
        <p>分享至微信家长群可批量邀请家长加入</p>
      </div>
    </div>
  </div>
</template>
<script>
import wxapi from "@/config/wxapi";
import { API_ROOT } from "@/config/isdev";
export default {
  name: "teacherSuccess",
  data() {
    return {
      visibility: false,
      classId: this.$route.query.classId
    };
  },
  methods: {
    jump() {
      this.$router.replace({
        path: "/home"
      });
    },
    wxRegCallback() {
      //用于微信JS-SDK回调
      this.wxShareAppMessage();
    },
    wxShareAppMessage() {
      let that = this;
      let shareUrl =
        API_ROOT + "#/baby/share?classId=" + this.classId + "&id=0";
      let option = {
        title: "亲爱的用户您好", // 分享标题
        desc: "小Q智慧欢迎您的加入", // 分享描述
        link: shareUrl, // 分享链接，根据自身项目决定是否需要split
        success: () => {
          that.$toast("分享成功");
        },
        error: () => {
          that.$toast("已取消分享");
        }
      };
      wxapi.wxShareAppMessage(option);
    }
  },
  mounted() {
    wxapi.wxRegister(this.wxRegCallback);
  }
};
</script>
<style lang="less" scoped>
.create-success {
  text-align: center;
  padding-top: 200px;
  color: #999;
  > img {
    width: 480px;
    height: 385px;
  }
  .okapi {
    display: flex;
    justify-content: center;
    margin-top: 185px;
    margin-bottom: 95px;
    padding: 0 30px;
    > a {
      width: 320px !important;
    }
  }
}
</style>
