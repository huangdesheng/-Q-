<template>
  <div class="flex-page">
    <div class="flex-bd">
      <div class="qcode">
        <div class="qcode-box">
          <img :src="imgUrl" alt>
          <p>亲爱的用户您好，请按以下方法加入小Q智慧:</p>
          <ul>
            <li>1、长按识别二维码，关注小Q智慧公众号。</li>
            <li>2、进入公众号后，点击公众号页面的提示链接，按提示完善信息即可使用。</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "",
  data() {
    return {
      imgUrl: "",
      query: {
        classId: this.$route.query.classId,
        id: this.$route.query.id
      }
    };
  },
  methods: {
    //二维码链接
    async getRQcode(params = {}) {
      let res = await service.getRQcode(params);
      if (res.errorCode === 0) {
        this.imgUrl = res.data.url;
      }
    }
  },
  mounted() {
    this.getRQcode(this.query);
  }
};
</script>
<style lang="less" scoped>
.qcode {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: #cbf4fa;
  &-box {
    padding: 0 30px;
    text-align: center;
    img {
      width: 350px;
      height: 350px;
    }
    p {
      margin: 80px 0 40px 0;
      color: #9acb4d;
      font-weight: bold;
    }
    ul {
      line-height: 1.6;
      text-align: left;
    }
  }
}
</style>
