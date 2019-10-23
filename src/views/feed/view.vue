<template>
  <div class="page">
    <div class="page-bd">
      <!-- dialog -->
      <van-dialog
        v-model="dialogVisible"
        title="互动内容"
        show-cancel-button
        @cancel="dialogVisible = false"
        :before-close="handleSubmit"
      >
        <div class="cells" style="padding:15px 0 15px 0;">
          <div class="cell">
            <div class="cell-bd">
              <textarea
                class="textarea"
                placeholder="请输入互动的内容..."
                rows="6"
                v-model="form.textContent"
              ></textarea>
            </div>
          </div>
        </div>
      </van-dialog>
      <!-- dialog -->
      <div class="feed-mod mb-20">
        <div class="feed feed-curr">
          <div class="feed-hd flex a-i-c j-c-s-b">
            <div class="avatar flex a-i-c">
              <template v-if="info.type == 2">
                <img
                  :src="info.teacherPhoto"
                  width="40"
                  height="40"
                  radius="50"
                  v-if="info.teacherPhoto"
                />
                <p class="ml-20">{{ info.teacherName }}</p>
              </template>
              <template v-if="info.type == 1">
                <img
                  :src="info.studentPhoto"
                  width="40"
                  height="40"
                  radius="50"
                  v-if="info.studentPhoto"
                />
                <p class="ml-20">{{ info.studentName }}</p>
              </template>
            </div>
          </div>
          <div class="feed-bd">
            <p v-html="info.title"></p>
          </div>
          <div class="feed-ft flex a-i-c j-c-s-b">
            <div class>
              <time>{{ info.postTime }}</time>
            </div>
            <div class="reply">
              <span style="color:#336d92" @click="handleReply">回复</span>
            </div>
          </div>
        </div>
      </div>
      <!-- list -->
      <div class="feed-mod">
        <div class="feed" v-for="(item, index) in list" :key="index">
          <div class="feed-hd flex a-i-c j-c-s-b">
            <div class="avatar flex a-i-c">
              <template v-if="info.type == 2">
                <img :src="item.photo" width="40" height="40" radius="50" v-if="item.photo" />
                <p class="ml-20">{{ item.name }}</p>
              </template>
              <template v-if="info.type == 1">
                <img :src="item.photo" width="40" height="40" radius="50" v-if="item.photo" />
                <p class="ml-20">{{ item.name }}</p>
              </template>
            </div>
          </div>
          <div class="feed-bd">
            <p v-html="item.textContent"></p>
          </div>
          <div class="feed-ft">
            <div class>
              <time>{{ item.postTime }}</time>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { mapState } from "vuex";
export default {
  name: "feedDetail",
  data() {
    return {
      dialogVisible: false,
      info: {
        ...this.$route.query
      },
      query: {
        id: this.$route.query.id
      },
      form: {
        openId: this.$store.state.user.info.openId,
        id: this.$route.query.id,
        textContent: ""
      },
      list: []
    };
  },
  computed: {
    ...mapState("user", {
      roleType: state => state.info.roleType
    })
  },
  methods: {
    handleReply() {
      this.dialogVisible = true;
    },
    async handleSubmit(action, done) {
      if (action === "confirm") {
        if (this.form.textContent == "") {
          this.$toast("请输入互动内容");
          done(false);
        } else {
          let res;
          let obj;
          if (this.roleType == 2) {
            let teacherId = this.$store.state.user.info.id;
            obj = Object.assign({}, this.form, { teacherId });
            res = await service.teacherAddFeed(obj);
          } else {
            let studentId = this.$store.state.user.info.studentId;
            obj = Object.assign({}, this.form, { studentId });
            res = await service.studentAddFeed(obj);
          }
          if (res.errorCode === 0) {
            this.form.textContent = "";
            this.queryFeedDetail(this.query);
            done();
          }
        }
      } else {
        done();
      }
    },
    //互动详情
    async queryFeedDetail(params = {}) {
      let res = await service.queryFeedDetail(params);
      if (res.errorCode === 0) {
        this.list = res.data || [];
      }
    }
  },
  mounted() {
    this.queryFeedDetail(this.query);
  }
};
</script>
<style lang="less" scoped>
.hih {
  background-color: #92cd36;
}
.feed {
  margin-bottom: 4px;
  position: relative;
  background-color: #fff;
  time {
    color: #999;
  }
  &-curr {
    // background-color: rgba(132, 206, 9, 0.1);
  }
  &-hd {
    padding: 30px 30px 0 30px;
  }
  &-bd {
    p {
      padding: 20px 30px;
      line-height: 1.4;
    }
    .time {
      padding: 0 30px;
      padding-bottom: 20px;
    }
    .meta {
      height: 85px;
      color: #999;
      padding: 0 20px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 1px;
        border-top: 1px solid #ededed;
        color: #e5e5e5;
        transform-origin: 0 0;
        transform: scaleY(0.5);
        z-index: 2;
      }
    }
  }
  &-ft {
    padding: 0 30px 20px 30px;
    .reply {
    }
  }
}
</style>