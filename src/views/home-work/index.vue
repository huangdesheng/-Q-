
<template>
  <div class="page">
    <template v-if="roleType != 3">
      <div class="page-hd">
        <div class="button-sp-area flex" size-17>
          <a href="javascript:;" id="showDatePicker" @click="popupShow = true">
            <span>{{ className }}</span>
            <van-icon name="arrow-down" size="16px"></van-icon>
          </a>
        </div>
      </div>
    </template>
    <div class="page-bd">
      <!-- -->
      <van-popup v-model="popupShow" position="bottom">
        <van-picker
          :columns="classList"
          show-toolbar
          value-key="className"
          @cancel="popupShow = false"
          @confirm="handleClassConfirm"
        ></van-picker>
      </van-popup>
      <template v-if="roleType == 2">
        <qxRelease url="/home-work/add" />
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
          v-for="(homework, index) in list"
          :key="index"
          :disabled="roleType == 3"
          :on-close="onClose(homework, index)"
        >
          <van-cell-group>
            <figure class="figure figure-skin-two" @click="go(homework)">
              <div class="figure-bd">
                <!-- :style="{
                      backgroundImage:
                        'url(' + require('@/assets/teacher@2x.png') + ')'
                    }" -->
                <div
                  class="figure-thumb-small homeWorkImage"
                   v-if="homework.topImage"
                  :style="{ backgroundImage: `url(${homework.topImage})` }"
                ></div>
                <div class="figure-info">
                  <figcaption
                    style="marginBottom:12px"
                    size-18
                    class="text-ellipsis"
                  >
                    <i
                      v-if="!homework.status"
                      style="width:6px;height:6px;"
                    ></i>
                    <span size-18 style="font-weight:600">{{
                      homework.title
                    }}</span>
                  </figcaption>
                  <p class="line-clamp">
                    {{ homework.textContent | brReplace }}
                  </p>
                  <div class="metedata flex">
                    <time class="time">{{ homework.postTime }}</time>
                  </div>
                </div>
              </div>
              <div class="figure-ft">
                <div class="figure-total">
                  <div class="figure-icon">
                    <!-- <van-icon name="eye-o" size="16px"></van-icon>
                  <b>{{ homework.classReadCount }}</b> -->
                    <div class="user">
                      <div class="userImg">
                        <img
                          v-if="homework.photo"
                          :src="homework.photo"
                          alt=""
                        />
                        <img
                          v-else
                          src="@/assets/child-default@2x.png"
                          alt=""
                        />
                      </div>
                      <span class="name">{{ homework.teacherName }}</span>
                    </div>
                    <div class="readNum">
                      <van-icon
                        name="eye-o"
                        size="16px"
                        color="#999999"
                      ></van-icon>
                      <span>{{ homework.classReadCount }}</span>
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
        <p>暂无亲子作业</p>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import qxRelease from "@/components/Release";
import classList from "@/mixins/classList";
export default {
  name: "homeWork",
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
      className: decodeURI(this.$store.state.user.info.className),
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
      console.log("onLoad");
      //当组件滚动到底部时，会触发load事件
      if (this.query.page < this.totalPage) {
        //加载数据
        this.query.page += 1;
        service.homeworkQuery(this.query).then(res => {
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
    onClose(homework, index) {
      return (clickPosition, instance) => {
        switch (clickPosition) {
          case "right":
            this.$dialog
              .confirm({
                title: "提示",
                message: "确定删除该条作业吗？"
              })
              .then(async () => {
                let obj = {
                  openId: this.query.openId,
                  homeId: homework.homeId
                };
                //删除作业
                let res = await service.homeworkDelete(obj);
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
    go(homework) {
      let { classId, homeId, studentId, needConfirm } = homework;
      this.$router.push({
        path: "/home-work/show",
        query: {
          classId,
          homeId,
          studentId,
          needConfirm
        }
      });
    },
    //选择班级
    handleClassConfirm(value, index) {
      this.className = value.className;
      this.query.classId = value.classId;
      this.query.page = 1;
      //当切换班级时，重新设置为没有全部加载完成
      this.finished = false;
      this.homeworkQuery(this.query);
    },
    //作业列表查询
    async homeworkQuery(params = {}) {
      let res = await service.homeworkQuery(params);
      if (res.errorCode === 0) {
        this.popupShow = false;
        this.query.page = res.data.page || [];
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
    this.homeworkQuery(this.query);
  }
};
</script>
<style lang="less" scoped>
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
.figure-skin-two figcaption {
  padding: 0;
}
.figure-bd {
  padding-top: 20px;
  padding-bottom:20px;
}
</style>
