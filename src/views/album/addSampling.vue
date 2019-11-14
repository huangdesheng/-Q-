<template>
  <div class="page">
    <div class="page-bd">
      <div class="empty">
        <div>
          <img :src="localData" alt />
          <p>点击照片可重新采样</p>
          <p style="margin-top:0">关注班级相册查看自动整理的孩子照片</p>
          <van-button type="info" size="large" class="no-radius addPic" @click="saveSampling">保存</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      localData: this.$route.query.localData,
      serverId: this.$route.query.serverId
    };
  },
  mounted() {
    console.log(this.$route.query);
  },
  methods: {
    saveSampling() {
      console.log(11111);
    }
  }
};
</script>

<style lang="less" scoped>
.empty {
  width: 100vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 300px;
    height: 300px;
    border-radius: 100%;
  }
  p {
    color: #999999;
    font-size: 32px;
    padding-top: 15px;
    color: #999999;
  }
}
.addPic {
  width: 300px;
  height: 90px;
  line-height: 90px;
  margin-top: 120px;
  border-radius: 100px !important;
}
</style>