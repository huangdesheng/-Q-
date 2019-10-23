<template>
  <div class="page">
    <div class="page-bd">
      <!-- dialog -->
      <van-dialog
        v-model="dialogVisible"
        title="回复老师"
        show-cancel-button
        @cancel="dialogVisible = false"
        :before-close="handleSubmit"
      >
        <div class="cells" style="padding:15px 0 15px 0;">
          <div class="cell">
            <div class="cell-bd">
              <textarea
                class="textarea"
                placeholder="请输入您要回复的内容..."
                rows="6"
                v-model="form.textContent"
              ></textarea>
            </div>
          </div>
        </div>
      </van-dialog>
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        :offset="100"
      >
        <div class="feed-mod">
          <div
            class="feed"
          >
            <div class="feed-hd flex a-i-c j-c-s-b">
              <div class="avatar flex a-i-c">
                <img :src="studentPhoto" width="40" height="40" radius="50" v-if="studentPhoto" />
                <img src="@/assets/child-default@2x.png" width="40" height="40" radius="50" v-else />
                <p class="ml-20">{{ studentName }}</p>
              </div>
              <div class>
                <time v-if="roleType == 2">{{ list1.feedDate }}</time>
                <span style="color:#999" v-else>接收老师：{{teacherName }}</span>
              </div>
            </div>
            <div class="feed-bd">
              <p v-html="title" ></p>
              <div class="flex a-i-c j-c-s-b">
                <div class="time flex a-i-c" v-if="roleType == 3">
                  <time>{{ postTime }}</time>
                </div>
                <div
                  class="meta flex a-i-c j-c-f-e"
                  v-if="roleType == 3"
                  @click="handleReply(showId)"
                >
                  <van-icon name="comment" size="18px" color="#336d92"></van-icon>
                  <span style="color:#336d92">回复</span>
                </div>
              </div>
            </div>


            <!-- 处理回复信息 -->
            <div class="feed-mod">
              <div
                class="feed"
                v-for="(item, index) in list"
                :key="index"
              >
                <div v-if="item.type === 2" class="left">
                  <div class="feed-hd flex a-i-c j-c-s-b">
                    <div class="avatar flex a-i-c">
                      <img :src="item.photo" width="40" height="40" radius="50" v-if="item.photo" />
                      <img src="@/assets/child-default@2x.png" width="40" height="40" radius="50" v-else />
                      <p class="ml-20">{{ item.name }}</p>
                    </div>
                  </div>
                  <div class="feed-bd">
                    <p v-html="item.textContent" ></p>
                    <div class="flex a-i-c j-c-s-b">
                      <div class="time flex a-i-c" v-if="roleType == 3">
                        <time>{{ item.postTime }}</time>
                      </div>
                      <!-- <div
                        class="meta flex a-i-c j-c-f-e"
                        v-if="roleType == 3 && !item.status"
                        @click="handleReply(item)"
                      >
                        <van-icon name="comment" size="18px" color="#336d92"></van-icon>
                        <span style="color:#336d92">回复</span>
                      </div> -->
                      <!-- <div
                        v-if="roleType == 3 && !item.status"
                        class="check flex"
                        @click="toCheckoutTeacher(item)"
                      >
                        <span style="color:#336d92">查看</span>
                      </div> -->
                    </div>
                    
                  </div>
                  <div class="feed-ft" v-if="roleType == 2">
                    <div class="reply">
                      <span style="color:#336d92">老师回复:</span>
                      <span class="font-color">{{ item.replyTextContent }}</span>
                    </div>
                    <div class>
                      <time>{{ item.replyDate }}</time>
                    </div>
                  </div>
                </div>
                <div v-if="item.type === 1" class="right">
                  
                  <div class="feed-hd flex a-i-c j-c-s-b">
                    <div class="avatar flex a-i-c">
                      <img :src="item.photo" width="40" height="40" radius="50" v-if="item.photo" />
                      <img src="@/assets/child-default@2x.png" width="40" height="40" radius="50" v-else />
                      <p class="ml-20">{{ item.name }}</p>
                    </div>
                  </div>
                  <div class="feed-bd">
                    <p v-html="item.textContent" ></p>
                    <div class="flex a-i-c j-c-s-b">
                      <div class="time flex a-i-c" v-if="roleType == 3">
                        <time>{{ item.postTime }}</time>
                      </div>
                      <!-- <div
                        class="meta flex a-i-c j-c-f-e"
                        v-if="roleType == 3 && !item.status"
                        @click="handleReply(item)"
                      >
                        <van-icon name="comment" size="18px" color="#336d92"></van-icon>
                        <span style="color:#336d92">回复</span>
                      </div> -->
                      <!-- <div
                        v-if="roleType == 3 && !item.status"
                        class="check flex"
                        @click="toCheckoutTeacher(item)"
                      >
                        <span style="color:#336d92">查看</span>
                      </div> -->
                    </div>
                    
                  </div>
                  <div class="feed-ft" v-if="roleType == 2">
                    <div class="reply">
                      <span style="color:#336d92">老师回复:</span>
                      <span class="font-color">{{ item.replyTextContent }}</span>
                    </div>
                    <div class>
                      <time>{{ item.replyDate }}</time>
                    </div>
                  </div>
                </div>
              </div>
            </div>




            <div class="feed-ft" v-if="roleType == 2">
              <div class="reply">
                <span style="color:#336d92">老师回复:</span>
                <span class="font-color">{{ list1.replyTextContent }}</span>
              </div>
              <div class>
                <time>{{ list1.replyDate }}</time>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import qxRelease from "@/components/Release";
import { mapState } from "vuex";
export default {
  name: "feedCheckout",
  components: {
    qxRelease
  },
  data() {
    return {
    	showId: this.$route.query.id,
    	title: this.$route.query.title,
    	teacherName: this.$route.query.teacherName,
      postTime: this.$route.query.postTime,
      studentName: this.$route.query.studentName,
      studentPhoto: this.$route.query.studentPhoto,
      teacherPhoto: this.$route.query.teacherPhoto,
      dialogVisible: false,
      loading: false,
      finished: true,
      totalPage: 1, //总页数
      active: 0,
      query: {
        page: 1,
        pageSize: 50
      },
      form: {
        textContent: "",
        feedId: null,
        studentId: this.$store.state.user.info.studentId,
        openId: this.$store.state.user.info.openId,
      },
      list: [],
      receiveList: [],
      sendList: []
    };
  },
  computed: {
    ...mapState("user", {
      roleType: state => state.info.roleType,
      studentId: state => state.info.studentId,
      id: state => state.info.id,
      experience: state => state.info.experience, //0不是体验用户 1是
      
    })
  },
  methods: {
    handleReply(params) {
      this.dialogVisible = true;
      this.form.feedId = params;
    },
    async handleSubmit(action, done) {
      if (action === "confirm") {
        if (this.form.textContent == "") {
          this.$toast("请输入回复内容");
          done(false);
        } else {
          let res = await service.studentAddFeed(this.form);
          if (res.errorCode === 0) {
            this.form.textContent = "";
            this.form.feedId = null; //重置
            this.getListData(); //重新请求数据
            done();
          }
        }
      } else {
        done();
      }
    },
    //老师回复意见反馈
    async teacherBack(params = {}) {
      let res = await service.teacherBack(params);
      if (res.errorCode === 0) {
      }
    },
    //家长回复接收信息
    async studentAddFeed(params = {}) {
      let res = await service.studentAddFeed(params);
      if (res.errorCode === 0) {
        this.$route.go(-1);
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
    ,
    async getListData() {
      let res;
      let obj = Object.assign({},{id:this.showId});
      res = await service.queryFeedDetail(obj);
      this.list = res.data.reverse();
      for(var i = 0; i < this.list.length; i++) {
        if(this.list[i].type === 1) {
          this.sendList.push(this.list[i]);
        }else if(this.list[i].type === 2) {
          this.receiveList.push(this.list[i])
        }
      }
    }
  },
  mounted() {
    this.getListData();
  }
};
</script>
<style lang="less" scoped>
.feed {
  margin-bottom: 100px;
  position: relative;
  background-color: #fff;
  time {
    color: #999;
  }
  &-curr {
    //background-color: rgba(132, 206, 9, 0.1);
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
    .check {
      
    }
  }
  &-ft {
    padding: 0 30px 20px 30px;
    .reply {
      margin-bottom: 10px;
      padding: 20px;
      border-radius: 8px;
      line-height: 1.4;
      background-color: rgba(51, 109, 146, 0.1);
    }
  }
  
}
</style>
