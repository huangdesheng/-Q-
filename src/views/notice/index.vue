<template>
  <div class="page">
    <div class="page-hd">
      <template v-if="roleType == 2">
        <div class="button-sp-area flex" size-17>
          <a href="javascript:;" id="showDatePicker" @click="popupShow = true">
            <span>{{ className }}</span>
            <van-icon name="arrow-down" size="16px"></van-icon>
          </a>
        </div>
      </template>
    </div>
    <div class="page-bd">
      <van-popup v-model="popupShow" position="bottom">
        <div class="popup-class">
          <div class="cells">
            <div
              class="cell popup-box"
              v-for="(p, index) in classList"
              :key="index"
            >
              <div class="cell-hd">
                <img src="@/assets/kong.png" width="54" height="54" />
              </div>
              <div class="cell-bd pl-20">
                <p>{{ p.className }}</p>
              </div>
              <div class="cell-ft">
                <van-radio-group v-model="classId">
                  <van-radio
                    :name="p.classId"
                    checked-color="#92cd36"
                    @click="handleClassConfirm(p)"
                  ></van-radio>
                </van-radio-group>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
      <template v-if="roleType == 2">
        <qxRelease url="/notice/add" />
      </template>
      <!-- list -->
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        :offset="100"
        @load="onLoad"
      >
        <van-swipe-cell
          ref="swipeCell"
          :right-width="60"
          v-for="(notice, index) in list"
          :key="index"
          :disabled="roleType == 3"
          :on-close="onClose(notice, index)"
        >
          <van-cell-group>
            <figure class="figure figure-skin-one" @click="jump(notice)">
              <div class="figure-bd">
                <div
                  class="figure-thumb-small"
                  v-if="notice.topImage"
                  :style="{ backgroundImage: `url(${notice.topImage}` }"
                ></div>
                <div class="figure-info">
                  <figcaption style="marginBottom:12px" class="text-ellipsis">
                    <i v-if="!notice.status" style="width:6px;height:6px;"></i>
                    <span size-18 style="font-weight:600">{{
                      notice.title
                    }}</span>
                  </figcaption>
                  <p size-15 class="text-ellipsis">
                    {{ notice.textContent | brReplace }}
                  </p>
                  <div class="metedata flex">
                    <!-- <span class="name">{{ notice.name }}</span> -->
                    <time class="time">{{ notice.postTime }}</time>
                  </div>
                </div>
              </div>
              <div class="figure-ft">
                <div class="figure-total">
                  <!-- <span>已读{{ notice.classReadCount }}人</span>
                  <span v-if="roleType == 1 || roleType == 4">共{{ notice.totalCount }}人</span> -->
                  <div class="figure-icon">
                    <div class="user">
                      <div class="userImg">
                        <img v-if="notice.photo" :src="notice.photo" alt="">
                        <img v-else src="@/assets/child-default@2x.png" alt="" />
                      </div>
                      <span class="name">{{ notice.name }}</span>
                    </div>
                    <div class="readNum">
                      <van-icon name="eye-o" size="16px" color="#999999"></van-icon>
                      <span>{{ notice.classReadCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          </van-cell-group>
          <span slot="right" style="line-height: 80px;">删除</span>
        </van-swipe-cell>
      </van-list>
      <!-- list -->
      <div class="empty" v-if="empty">
        <img src="@/assets/kong.png" alt />
        <p>暂无通知公告</p>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import qxRelease from "@/components/Release";
import classList from "@/mixins/classList";
import { mapState } from "vuex";
export default {
  name: "notice",
  mixins: [classList],
  components: {
    qxRelease
  },
  data() {
    return {
      empty: false,
      loading: false,
      finished: false,
      popupShow: false,
      className: this.$store.state.user.info.className,
      classId: parseInt(this.$store.state.user.info.classId),
      index: 0,
      totalPage: 1, //总页数
      query: {
        openId: this.$store.state.user.info.openId,
        classId: this.$store.state.user.info.classId,
        studentId: this.$store.state.user.info.studentId,
        type: 0,
        page: 1,
        pageSize: 10
      },
      roleType: this.$store.state.user.info.roleType,
      list: []
    };
  },
  computed: {
    ...mapState("user", {
      name: state => state.info.name
    })
  },
  methods: {
    onLoad() {
      if (this.query.page < this.totalPage) {
        //加载数据
        this.query.page += 1;
        service.noticeQuery(this.query).then(res => {
          if (res.errorCode === 0) {
            let list = res.data.data;
            this.totalPage = res.data.totalPage;
            this.query.page = res.data.page;
            // 加载状态结束
            this.loading = false;
            for (let i = 0; i < list.length; i++) {
              this.list.push(list[i]);
            }
          }
        });
      } else {
        // 数据全部加载完成
        console.log("数据全部加载完成");
        this.loading = false;
        this.finished = true;
      }
    },
    onClose(notice, index) {
      return (clickPosition, instance) => {
        switch (clickPosition) {
          case "right":
            this.$dialog
              .confirm({
                title: "提示",
                message: "确认要删除该条公告吗?"
              })
              .then(async () => {
                let obj = {
                  openId: this.query.openId,
                  noticeId: notice.noticeId,
                  classId: notice.classId
                };
                //删除通知公告
                let res = await service.deleteNotice(obj);
                if (res.errorCode === 0) {
                  instance.close();
                  this.list.splice(index, 1);
                }
              })
              .catch(() => {
                instance.close();
              });
            break;
        }
      };
    },
    jump(notice) {
      let { noticeId, needConfirm, classId, studentId } = notice;
      let openId = this.query.openId;
      let roleType = this.roleType;
      this.$router.push({
        path: "/notice/show",
        query: {
          noticeId,
          needConfirm,
          classId,
          studentId
        }
      });
    },
    //选择班级
    handleClassConfirm(obj) {
      this.popupShow = false;
      this.className = obj.className;
      this.query.classId = obj.classId;
      this.query.page = 1;
      //当切换班级时，重新设置为没有全部加载完成
      this.finished = false;
      this.noticeQuery(this.query);
    },
    //设置标题
    setDocumentTitle() {
      if (this.roleType == 3) {
        let { title } = this.$route.meta;
        document.title = `${title}-${this.name}`;
      }
    },
    //公告通知列表查询
    async noticeQuery(params = {}) {
      let res = await service.noticeQuery(params);
      if (res.errorCode === 0) {
        this.popupShow = false;
        this.query.page = res.data.page;
        this.totalPage = res.data.totalPage;
        this.list = res.data.data || [];
        if (this.list.length) {
          this.empty = false;
        } else {
          this.empty = true;
        }
      }
    }
  },
  mounted() {
    this.noticeQuery(this.query);
    //this.setDocumentTitle();
  }
};
</script>
<style lang="less" scoped>
.page-hd {
  margin-bottom: 20px;
  background-color: #fff;
}
.figure-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .user {
    display: flex;
    align-items: center;
    .userImg {
      display: inline-block;
      margin-right: 14px;
      img {
        width: 40px;
        height: 40px;
      }
    }
    span {
      font-size: 24px;
      color: rgba(153, 153, 153, 1);
    }
  }
  .readNum {
    display: flex;
    align-items: center;
    span {
      margin-left: 21px;
      font-size: 26px;
      color: rgba(169, 169, 169, 1);
    }
  }
}
</style>
