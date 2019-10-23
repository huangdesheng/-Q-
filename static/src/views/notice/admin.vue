<template>
  <div class="page">
    <div class="page-bd">
      <qxRelease url="/notice/add" />
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
          :on-close="onClose(notice, index)"
        >
          <van-cell-group>
            <figure class="figure figure-skin-one" @click="jump(notice)">
              <div class="figure-bd">
                <div
                  class="figure-thumb-small"
                  v-if="notice.topImage"
                  :style="{backgroundImage: `url(${notice.topImage})`}"
                ></div>
                <div class="figure-info">
                  <figcaption class="text-ellipsis">
                    <span size-18>{{ notice.title }}</span>
                  </figcaption>
                  <p size-15 class="text-ellipsis">{{ notice.textContent | brReplace }}</p>
                  <div class="metedata flex">
                    <span class="name">{{ notice.name }}</span>
                    <time class="time">{{ notice.postTime }}</time>
                  </div>
                </div>
              </div>
              <div class="figure-ft">
                <div class="figure-total">
                  <span>已读{{ notice.classReadCount }}人</span>
                </div>
              </div>
            </figure>
          </van-cell-group>
          <span slot="right" style="line-height: 80px;">删除</span>
        </van-swipe-cell>
      </van-list>
      <!-- list -->
      <div class="empty" v-if="!list.length">
        <img src="@/assets/kong.png" alt />
        <p>暂无通知公告</p>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import qxRelease from "@/components/Release";
export default {
  name: "noticeAdmin",
  components: {
    qxRelease
  },
  data() {
    return {
      loading: false,
      finished: false,
      openId: this.$store.state.user.info.openId,
      query: {
        schoolId: this.$store.state.user.info.id,
        page: 1,
        pageSize: 10
      },
      totalPage: 1, //总页数
      list: []
    };
  },
  methods: {
    onLoad() {
      if (this.query.page < this.totalPage) {
        this.query.page += 1;
        service.querySchoolNotice(this.query).then(res => {
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
                  openId: this.openId,
                  noticeId: notice.noticeId,
                  classId: 0
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
    jump(params) {
      let { noticeId, needConfirm, classId, studentId } = params;
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
    //园长端--公告通知列表查询
    async querySchoolNotice(params = {}) {
      let res = await service.querySchoolNotice(params);
      if (res.errorCode === 0) {
        this.query.page = res.data.page;
        this.totalPage = res.data.totalPage;
        this.list = res.data.data || [];
      }
    }
  },
  mounted() {
    this.querySchoolNotice(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>