<template>
  <div class="page">
    <div class="page-bd">
      <!-- video视频区域 -->
      <div class="video-mod">
        <div class="video-main">
          <template v-if="payStatus">
            <video ref="video" :src="info.videoUrl" controls></video>
          </template>
          <template v-else>
            <div class="video-mask">
              <template>
                <div class="text-center">
                  <p class="mb-20">观看本课程需支付0.01元</p>
                  <van-button round type="info" size="small" @click="handleUserPay">购买</van-button>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
      <van-tabs v-model="actives" :line-height="2">
        <van-tab title="简介">
          <div class="section mb-20 mt-20">
            <h3 class="mb-20">一年级语文：认识生字</h3>
            <p>233小学</p>
            <!-- <span>下载量: 160</span>
            <span>满意度: 98%</span>-->
          </div>
          <div class="section">
            <h4 class="mb-20">课程内容:</h4>
            <p>对于一年级的学生而言，识字是一个重点，也是一个难点，但是一年级的学生好动且缺乏耐心，本节课将教学生学习“天地人“三个字。</p>
          </div>
        </van-tab>
        <van-tab title="评论列表">
          <div class="comment-box mt-20">
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
        </van-tab>
      </van-tabs>
    </div>
    <div class="page-ft">
      <!-- <div class="handle flex a-i-c"> -->
      <!-- <div class="handle-comment" @click="dialogVisible = true">
          <van-icon name="comment-o" size="20px"></van-icon>
          <div size-12>评论</div>
      </div>-->
      <!-- <div class="handle-down">
          <van-button type="info" class="no-radius" @click="handleUserPay" style="width:100%">购买</van-button>
      </div>-->
      <!-- <div class="handle-share">
          <van-icon name="share" size="20px"></van-icon>
          <div size-12>转发</div>
        </div>
        <div class="handle-comment">
          <van-icon name="like-o" size="20px"></van-icon>
          <div size-12>收藏</div>
      </div>-->
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "courseShow",
  data() {
    return {
      actives: 0,
      payStatus: false, //支付状态
      info: {
        videoUrl:
          "http://ax.qxiao.net/video/f925dce4-3ef8-47e1-846b-d5c2db28829d.mp4"
      },
      commentList: [
        {
          photo: "http://dummyimage.com/50x50",
          name: "L陆嘉诚",
          textContent: "讲解到位，家里孩子喜欢看呢~",
          postTime: "2019-03-16 12:40:13"
        },
        {
          photo: "http://dummyimage.com/50x50",
          name: "四凡啊",
          textContent: "接下来最好的事莫过于多看看这个视频",
          postTime: "2019-04-01 13:00:47"
        },
        {
          photo: "http://dummyimage.com/50x50",
          name: "往南是片海",
          textContent: "嗓音早就有了",
          postTime: "2019-05-28 09:52:30"
        }
      ]
    };
  },
  methods: {
    async handleUserPay() {
      let that = this;
      let params = {
        outTradeNo: Math.random()
          .toString(36)
          .substring(2), //模拟测试
        openId: this.$store.state.user.info.openId,
        totalFee: 1
      };
      let res = await service.userPay(params);
      if (Object.keys(res).length) {
        wx.chooseWXPay({
          timestamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: res.signType,
          paySign: res.paySign,
          success: function(res) {
            that.$toast("支付成功");
            that.payStatus = true;
          },
          cancel: function(res) {
            that.$toast("已取消支付");
          },
          fail: function(res) {
            that.payStatus = false;
            that.$toast("购买失败，请重新支付");
          }
        });
      }
    }
  },
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
.handle {
  min-height: 88px;
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
