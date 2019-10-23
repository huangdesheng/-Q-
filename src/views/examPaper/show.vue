<template>
  <div class="page">
    <div class="page-bd">
      <!-- 评论 -->
      <van-dialog
        title="评论"
        v-model="dialogVisible"
        @cancel="dialogVisible = false"
        show-cancel-button
        :before-close="handleSubmit"
      >
        <div class="comment-form">
          <form ref="form" action method="post">
            <div class="cells" style="padding:15px 0 15px 0;">
              <div class="cell">
                <div class="cell-bd" style="padding-left:0">
                  <textarea
                    class="textarea"
                    placeholder="请输入评论内容..."
                    rows="6"
                    v-model="form.textContent"
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
      </van-dialog>
      <!-- 发送邮箱 -->
      <van-dialog
        title="请输入接收试卷的邮箱地址"
        v-model="dialogEailVisible"
        @cancel="dialogVisible = false"
        show-cancel-button
        :before-close="handleEailSubmit"
      >
        <div class="cells" style="padding:15px 0 15px 0;">
          <div class="cell">
            <div class="cell-bd">
              <input
                class="input"
                placeholder="请输入接收试卷的邮箱地址"
                v-model="sendForm.emailAddress"
                style="text-align:left;"
              />
            </div>
          </div>
        </div>
      </van-dialog>
      <div class="banner" @click="handleUserPay">
        <img src="@/assets/examPaper-banner@2x.png" alt />
      </div>
      <van-tabs v-model="actives" :line-height="2">
        <van-tab title="简介">
          <div class="section mb-20 mt-20">
            <h3 class="mb-20">{{ info.schoolName }}</h3>
            <p>{{ info.title }}</p>
            <span size-12>下载量：{{ info.downloadCount }}</span>
          </div>
          <div class="section">
            <h4 class="mb-20">试卷说明：</h4>
            <p>{{ info.textContent }}</p>
          </div>
        </van-tab>
        <van-tab title="评论列表">
          <div class="comment-box mt-20">
            <div class="comment-cell" v-for="(item, index) in commentList" :key="index">
              <div class="comment-hd flex a-i-c">
                <img :src="item.photo" width="40" height="40" radius="50" />
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
      <div class="fixed-bottom" style="z-index: 100;">
        <div class="handle flex a-i-c">
          <!-- <van-button
            type="info"
            class="no-radius"
            style="width:100%"
            @click="dialogVisible = true"
          >评论</van-button>-->
          <div class="handle-comment" @click="dialogVisible = true">
            <van-icon name="comment-o" size="20px"></van-icon>
            <div size-12>评论</div>
          </div>
          <!-- <div class="handle-share">
            <van-icon name="share" size="20px"></van-icon>
            <div size-12>转发</div>
          </div>-->
          <div class="handle-down">
            <template v-if="info.status == 0">
              <van-button
                type="info"
                class="no-radius"
                @click="handleUserPay"
                style="width:100%"
              >下载试卷{{ info.fee }}元/套</van-button>
            </template>
            <template v-else>
              <van-button
                type="primary"
                class="no-radius"
                @click="dialogEailVisible = true"
                style="width:100%"
              >试卷发送邮箱</van-button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import pageMixin from "@/mixins/page";
import { isEmail } from "@/utils/validator";
export default {
  name: "examPaperShow",
  mixins: [pageMixin],
  data() {
    return {
      dialogEailVisible: false,
      actives: 0,
      query: {
        openId: this.$store.state.user.info.openId,
        id: this.$route.query.detailId,
        studentId: this.$store.state.user.info.studentId
      },
      form: {
        openId: this.$store.state.user.info.openId,
        studentId: this.$store.state.user.info.studentId,
        id: this.$route.query.detailId,
        textContent: ""
      },
      sendForm: {
        emailAddress: "",
        fileUrl: ""
      },
      info: {},
      commentList: []
    };
  },
  methods: {
    //邮箱
    async handleEailSubmit(action, done) {
      if (action === "confirm") {
        if (isEmail(this.sendForm.emailAddress)) {
          let res = await service.sendEmail(this.sendForm);
          if (res.errorCode === 0) {
            this.$toast("文件已经发送到邮箱了，请您注意查收");
            this.dialogEailVisible = false;
            this.sendForm.emailAddress = "";
            done();
          } else {
            this.$toast(`${res.errorMsg}`);
            done(false);
          }
        } else {
          this.$toast("请输入正确的邮箱地址");
          done(false);
        }
      } else {
        done();
      }
    },
    //评论
    async handleSubmit(action, done) {
      if (action === "confirm") {
        if (this.form.textContent == "") {
          this.$toast("请输入评论内容");
          done(false);
        } else {
          let res = await service.examPaperComment(this.form);
          if (res.errorCode === 0) {
            this.dialogVisible = false;
            this.form.textContent = "";
            this.examPaperCommentQuery(this.query);
            done();
          }
        }
      } else {
        done();
      }
    },
    //发起支付
    async handleUserPay() {
      let that = this;
      let params = {
        outTradeNo: Math.random()
          .toString(36)
          .substring(2), //模拟测试
        openId: this.$store.state.user.info.openId,
        totalFee: this.info.fee || 1,
        type: 0,
        orderId: this.$route.query.detailId,
        studentId: this.query.studentId
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
            //支付成功后，设置状态为1
            that.info.status = 1;
            //that.examPaperDetail(that.query);
          },
          complete: function(res) {
            //that.$toast("无论成功或失败都会执行");
          },
          cancel: function(res) {
            that.$toast("已取消支付");
          },
          fail: function(res) {
            that.$toast("购买失败，请重新支付");
          }
        });
      }
    },
    //试卷详情查询
    async examPaperDetail(params = {}) {
      let res = await service.examPaperDetail(params);
      if (res.errorCode === 0) {
        this.info = res.data;
        this.sendForm.fileUrl = this.info.wordUrl; //文件地址
      }
    },
    //查询试卷评论
    async examPaperCommentQuery(params = {}) {
      let res = await service.examPaperCommentQuery(params);
      if (res.errorCode === 0) {
        this.commentList = res.data;
      }
    },
    //邮箱发送
    async sendEmail(params = {}) {
      let res = await service.sendEmail(params);
      if (res.errorCode === 0) {
        this.$toast("文件已经发送到邮箱了，请您查收");
        this.dialogEailVisible = false;
      }
    }
  },
  mounted() {
    this.examPaperDetail(this.query);
    this.examPaperCommentQuery(this.query);
  }
};
</script>
<style lang="less" scoped>
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
