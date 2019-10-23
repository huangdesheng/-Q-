<template>
  <div class="page">
    <div class="page-bd">
      <form action ref="form" method="post">
        <div class="cells mb-20">
          <div class="cell">
            <div class="cell-bd" style="padding-left:0">
              <ul class="uploader-files">
                <li
                  class="uploader-file"
                  v-for="(file, index) in imagesList"
                  :key="index"
                  :style="{backgroundImage: `url(${file})`}"
                >
                  <van-icon
                    name="clear"
                    size="18px"
                    class="clear"
                    @click.stop="handleDelImg(index)"
                  ></van-icon>
                </li>
              </ul>
              <div class="uploader-input_box" @click="handleChooseImage">
                <van-icon name="plus" size="30px"></van-icon>
              </div>
            </div>
          </div>
          <p class="works-desc">上传班级相册，行动起来吧...</p>
        </div>
      </form>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" @click="handleSubmit">保存</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import wxHandle from "@/mixins/wx";
export default {
  name: "albumAdd",
  mixins: [wxHandle],
  data() {
    return {
      form: {
        channelId: this.$route.query.channelId,
        teacherId: this.$store.state.user.info.id,
        type: 0, // 0-图片 1-视频
        images: [],
        videoUrl: "" //视频URL
      },
      openId: this.$store.state.user.info.openId,
      imagesList: []
    };
  },
  methods: {
    handleSubmit() {
      if (!this.serverId.length) {
        this.$toast("请上传图片");
      } else {
        let params = {
          openId: this.openId,
          imgIds: this.serverId
        };
        service.imgIds(params).then(res => {
          if (res.errorCode === 0) {
            this.form.images = res.data.paths;
            //相册图片或视频上传
            service.albumImageAdd(this.form).then(res => {
              if (res.errorCode === 0) {
                this.$refs.form.reset();
                this.$router.go(-1);
              }else {
                this.$toast(`上传出错了~`);
              }
            });
          } else {
            this.$toast(`上传出错了~`);
          }
        });
      }
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.works-desc {
  line-height: 1.4;
  color: #999;
  font-size: 24px;
  padding: 0 30px 30px 30px;
}
</style>
