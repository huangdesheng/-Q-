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
      <!-- <div v-show="memuActive==2 && !empty">
        <div class="album-content">
         
          <van-list v-model="loading" :finished="finished" :immediate-check="false" :offset="100">
            <div class="article-cell">
              <time style="color:#8d8d8d;">2019-10-30 22:30</time>
            </div>
            <div class="grid-content flex f-w-w" style="margin-left: -5px; margin-right: -5px;">
              <div
                class="album-img mb-20"
                v-for="(pic, index) in myChildList"
                :key="index"
                @click="handlePreviewImage(pic.imageUrl, index)"
              >
                <div class="suni">
                
                  <img :src="pic.smallUrl" />
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </div>-->
      <div class="empty" v-if="empty">
        <div>
          <img src="@/assets/kong.png" alt />
          <p>暂无相册</p>
        </div>
        <!-- <div v-if="memuActive==2">
          <img src="@/assets/kong.png" alt />
          <p>您小孩还没有采样照片</p>
          <p style="margin-top:0">请先去添加照片</p>
          <van-button type="info" size="large" class="no-radius addPic" @click="addSampling">去添加</van-button>
        </div>-->
      </div>
    </div>
    <div class="page-ft">
      <template v-if="roleType == 2">
        <div class="fixed-bottom" style="z-index: 100;">
          <van-button type="info" size="large" class="no-radius" @click="dialogVisible = true">新增栏目</van-button>
        </div>
      </template>
      <!-- <template v-if="roleType == 3">
        <div class="fixed-bottom" style="z-index: 100;">
          <div class="flex">
            <van-button
              size="large"
              type="danger"
              @click="classAlbum(1)"
              :class="['no-radius',{'on':memuActive==1}]"
            >班级相册</van-button>
            <van-button
              size="large"
              type="info"
              :class="['no-radius',{'on':memuActive==2}]"
              @click="myChild(2)"
            >我的小孩</van-button>
          </div>
        </div>
      </template>-->
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
      list: [],
      memuActive: 1,

      loading: false,
      finished: false,
      totalPage: 1, //总页数
      myChildList: [],

      query1: {
        channelId: 9,
        openId: "oUQwt1Q2v5WE4niZ-bzP7Kj_Wxmc",
        page: 1,
        pageSize: 20
      }
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
        // this.list = [];
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
    },

    classAlbum(index) {
      console.log(index);
      this.memuActive = index;
      this.albumChannelQuery(this.query);
    },

    myChild(index) {
      console.log(index);
      this.memuActive = index;
      this.albumChannelDetail();
    },

    async albumChannelDetail() {
      let res = await service.albumChannelDetail(this.query1);
      console.log(res);
      if (res.errorCode === 0) {
        // this.myChildList = res.data.data;
        this.myChildList = [];
        if (this.myChildList.length) {
          this.empty = false;
        } else {
          this.empty = true;
        }
      }
    },

    addSampling() {
      this.$router.push({
        path: "/album/sampling"
      });
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

.flex {
  button {
    background: #fff;
    border: 1px solid #fff;
    color: #999;
  }
  .on {
    color: #84ce09;
  }
}
.album-content {
  overflow: hidden;
}
.album-img {
  width: 33.33333%;
  padding: 0 10px;
  .suni {
    position: relative;
    overflow: hidden;
    padding-bottom: 100%;
    img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }
}
.album-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 10px;
  text-align: right;
  background-color: rgba(0, 0, 0, 0.6);
}

.article-cell {
  padding: 30px 20px;
}
.empty {
  width: 100vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 300px;
    height: 300px;
  }
  p {
    color: #999999;
    font-size: 35px;
  }
}
.addPic {
  height: 70px;
  line-height: 70px;
  margin-top: 120px;
  border-radius: 100px !important;
  // padding: 10px 0;
}
</style>
