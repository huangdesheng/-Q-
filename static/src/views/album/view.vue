<template>
  <div class="page">
    <div class="page-bd">
      <van-dialog
        v-model="dialogVisible"
        title="相册名称"
        show-cancel-button
        @cancel="dialogVisible = false"
        :before-close="handleSubmit"
      >
        <div class="cells" style="padding:15px 0 15px 0;">
          <div class="cell">
            <div class="cell-bd" style="padding-left:0">
              <input
                class="input"
                placeholder="请输入相册名称"
                maxlength="10"
                v-model="title"
                style="text-align:left;"
              />
            </div>
          </div>
        </div>
      </van-dialog>
      <div class="album-show">
        <van-swipe-cell
          ref="swipeCell"
          :right-width="60"
          v-for="(channel, index) in list"
          :key="index"
          :disabled="roleType == 3"
          :on-close="onClose(channel, index)"
        >
          <van-cell-group>
            <div class="album-channel flex" @click="handleJump(channel)">
              <div class="album-thumb">
                <img v-if="channel.image" :src="channel.image" alt />
                <img v-else src="@/assets/kong.png" alt />
              </div>
              <div class="album-box">
                <p size-16>{{ channel.title }}</p>
                <div style="margin-top: 6px;margin-bottom: 6px;">
                  <span>共{{ channel.imagesCount }}张</span>
                  <span>查看{{ channel.readCount }}次</span>
                </div>
                <time>更新于{{ channel.updateTime }}</time>
              </div>
            </div>
          </van-cell-group>
          <span slot="right" style="line-height: 100px;">删除</span>
        </van-swipe-cell>
      </div>
      <div class="empty" v-if="empty">
        <img src="@/assets/kong.png" alt />
        <p>暂无相册列表</p>
      </div>
    </div>
    <div class="page-ft">
      <template v-if="roleType == 2">
        <div class="fixed-bottom" style="z-index: 100;">
          <van-button type="info" size="large" class="no-radius" @click="dialogVisible = true">新增栏目</van-button>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "albumChannel",
  data() {
    return {
      empty: false,
      title: "",
      dialogVisible: false,
      roleType: this.$store.state.user.info.roleType,
      query: {
        openId: this.$store.state.user.info.openId,
        classId: this.$route.query.classId
      },
      list: []
    };
  },
  methods: {
    onClose(channel, index) {
      return (clickPosition, instance) => {
        switch (clickPosition) {
          case "right":
            this.$dialog
              .confirm({
                title: "提示",
                message: "确定删除该相册栏目吗？"
              })
              .then(async () => {
                let { channelId } = channel;
                //删除栏目
                let res = await service.deleteChannel({ channelId });
                if (res.errorCode === 0) {
                  this.$toast("栏目删除成功");
                  instance.close();
                  this.albumChannelQuery(this.query);
                }
              })
              .catch(() => {
                instance.close();
              });
            break;
        }
      };
    },
    handleJump(params) {
      let { channelId, title, updateTime } = params;
      this.$router.push({
        path: "/album/show",
        query: { channelId, updateTime }
      });
    },
    handleDelete() {},
    handleSubmit(action, done) {
      if (action === "confirm") {
        if (this.title == "") {
          this.$toast("请输入相册名称");
          done(false);
        } else {
          let obj = Object.assign({}, this.query, { title: this.title });
          this.addChannel(obj);
          done();
        }
      } else {
        done();
      }
    },
    //查询班级所属的相册栏目
    async albumChannelQuery(params = {}) {
      let res = await service.albumChannelQuery(params);
      if (res.errorCode === 0) {
        this.list = res.data;
        if (this.list.length) {
          this.empty = false;
        } else {
          this.empty = true;
        }
      }
    },
    //新增相册栏目
    async addChannel(params = {}) {
      let res = await service.addChannel(params);
      if (res.errorCode === 0) {
        this.dialogVisible = false;
        this.title = "";
        this.albumChannelQuery(this.query);
      }
    }
  },
  mounted() {
    this.albumChannelQuery(this.query);
  }
};
</script>
<style lang="less" scoped>
.album-channel {
  position: relative;
  padding: 24px 30px;
  justify-content: flex-start;
  background-color: #fff;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #e5e5e5;
    color: #e5e5e5;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 15px;
    z-index: 2;
  }
  .album-thumb {
    width: 160px;
    height: 160px;
    position: relative;
    overflow: hidden;
    margin-right: 20px;
    img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .album-box {
    p {
      font-weight: bold;
    }
    span {
      color: #8d8d8d;
    }
    time {
      color: #92cd36;
    }
  }
}
</style>
