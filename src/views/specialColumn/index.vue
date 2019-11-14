<template>
  <div class="page">
    <div class="page-bd">
      <!-- -->
      <!-- <van-popup v-model="popupShow" position="bottom">
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
      </van-popup> -->
      <!-- <template v-if="roleType == 2">
        <qxRelease url="/fresh/add" />
      </template> -->

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
          v-for="(fresh, index) in list"
          :key="index"
          :disabled="roleType == 3"
          :on-close="onClose(fresh, index)"
        >
          <van-cell-group>
            <figure class="figure figure-skin-two" @click="go(fresh)">
              <div class="figure-bd">
                <div class="figure-info">
                  <figcaption size-18 class="text-ellipsis">
                    {{ fresh.title }}
                  </figcaption>
                  <div class="metedata flex">
                    <time class="time">{{ fresh.postTime }}</time>
                  </div>
                  <p class="line-clamp">{{ fresh.textContent | brReplace }}</p>

                  <!-- :style="{
                      backgroundImage:
                        'url(' + require('@/assets/avatar-bg@2x.png') + ')'
                    }" -->
                  <div
                    class="figure-thumb-medium"
                    v-if="fresh.topImage"
                    :style="{ backgroundImage: `url(${fresh.topImage})` }"
                  ></div>
                </div>
              </div>
              <div class="figure-ft">
                <div class="figure-icon">
                  <div class="user">
                    <div class="userImg">
                      <img v-if="fresh.photo" :src="fresh.photo" alt="" />
                      <img v-else src="@/assets/child-default@2x.png" alt="" />
                    </div>
                    <span class="name">{{ fresh.teacherName }}</span>
                  </div>
                  <div class="readNum">
                    <van-icon
                      name="eye-o"
                      size="16px"
                      color="#999999"
                    ></van-icon>
                    <span>{{ fresh.classReadCount }}</span>

                    <!-- <van-icon
                      class="vanIcon2"
                      name="comment-o"
                      size="16px"
                      color="#999999"
                    />
                    <span>{{ fresh.classCommentCount }}</span> -->
                  </div>
                </div>
              </div>
            </figure>
          </van-cell-group>
          <span slot="right" style="line-height: 80px;">删除</span>
        </van-swipe-cell>
      </van-list>
      <div class="empty" v-if="empty">
        <img src="@/assets/kong.png" alt />
        <p>暂无班级速报</p>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import qxRelease from "@/components/Release";
import classList from "@/mixins/classList";
export default {
  name: "fresh",
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
      totalPage: 1, //总页数
      query: {
        openId: this.$store.state.user.info.openId,
        classId: this.$store.state.user.info.classId,
        studentId: this.$store.state.user.info.studentId,
        page: 1,
        pageSize: 10
      },
      roleType: this.$store.state.user.info.roleType,
      list: []
    };
  },
  methods: {
    onLoad() {
      if (this.query.page < this.totalPage) {
        //加载数据
        this.query.page += 1;
        service.freshQuery(this.query).then(res => {
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
    onClose(fresh, index) {
      return (clickPosition, instance) => {
        switch (clickPosition) {
          case "right":
            this.$dialog
              .confirm({
                title: "提示",
                message: "确定删除该条速报吗？"
              })
              .then(async () => {
                let obj = {
                  openId: this.query.openId,
                  freshId: fresh.freshId
                };
                //删除速报
                let res = await service.deleteFresh(obj);
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
    go(fresh) {
      let { freshId, classId, studentId } = fresh;
      this.$router.push({
        path: "/specialColumn/details",
        query: {
          freshId,
          classId,
          studentId
        }
      });
    },
    //选择班级
    handleClassConfirm(obj) {
      this.popupShow = false;
      this.className = obj.className;
      this.query.page = 1;
      this.query.classId = obj.classId;
      //当切换班级时，重新设置为没有全部加载完成
      this.finished = false;
      this.freshQuery(this.query);
    },
    //删除速报
    async deleteFresh(params = {}) {
      let res = await service.deleteFresh(params);
      if (res.errorCode === 0) {
      }
    },
    //速报列表查询
    async freshQuery(params = {}) {
      let res = await service.freshQuery(params);
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
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  },
  mounted() {
    this.freshQuery(this.query);
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
  width: 100%;
  height: 100%;
  margin-right: 0;
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
    .vanIcon2 {
      margin-left: 40px;
    }
  }
}
.text-ellipsis {
  font-size: 36px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(37, 37, 37, 1);
  margin-bottom:28px;
}
</style>
