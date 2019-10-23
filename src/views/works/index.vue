<template>
  <div class="page">
    <div class="paeg-bd">
      <van-tabs v-model="active" :line-height="2">
        <van-tab title="优秀作品">
          <!-- 学生个人作品 -->
          <div class="cells-title a-i-c">
            <p size-17>我的上榜</p>
            <!-- <div class="flex">
              <span>更多</span>
              <van-icon name="arrow" size="16px"></van-icon>
            </div>-->
          </div>
          <div class="page-swiper">
            <template v-if="onLineList.length">
              <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide class="slide" v-for="(item, index) in onLineList" :key="index">
                  <div
                    class="slide-img"
                    :style="{backgroundImage: `url(${item.smallUrl})`}"
                    @click="handlePreviewImage(item.imageUrl, index)"
                  ></div>
                  <div class="zan flex a-i-c" v-if="item.praise">
                    <van-icon name="like" size="14px" color="#e64340"></van-icon>
                    <span>{{ item.praise }}</span>
                  </div>
                </swiper-slide>
              </swiper>
            </template>
            <template v-else>
              <p style="padding: 30px 0;color:#999;line-height:1.4;" class="text-center">
                优秀作品将被推荐到全市科普电子屏上播放
                <br />快去上传吧~
              </p>
            </template>
          </div>
          <div class="cells-title a-i-c">
            <p size-17>优秀作品展示</p>
          </div>
          <!-- 优秀作品 -->
          <div class="good-works" v-if="worksList.length">
            <van-list
              v-model="loading"
              :finished="finished"
              :immediate-check="false"
              :offset="100"
              @load="onLoad"
            >
              <div class="flex f-w-w">
                <div class="item" v-for="(item, index) in worksList" :key="item.worksId">
                  <div
                    class="good-image"
                    @click="handlePreviewImage(worksList, item.imageUrl, index)"
                  >
                    <img :src="item.smallUrl" alt />
                    <div class="zan flex a-i-c" @click.stop="handleAddPraise(item)">
                      <van-icon name="like" size="14px" color="#e64340"></van-icon>
                      <span>{{ item.praise }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </van-list>
          </div>
          <div class="empty" v-if="!worksList.length">
            <img src="@/assets/kong.png" alt />
            <p>目前还没有优秀作品呢</p>
          </div>
        </van-tab>
        <van-tab title="我的上传" :disabled="studentId == 0">
          <template v-if="list.length">
            <div class="time-works mt-20">
              <div class="item" v-for="(item, index) in list" :key="index">
                <time size-16>{{ item.postTime }}</time>
                <div class="flex f-w-w" style="margin-left:-5px;margin-right:-5px;">
                  <div class="suni-box mt-30" v-for="(work, i) in item.works" :key="i">
                    <div class="suni" @click="handlePreviewImage(item.works, work.imageUrl, i)">
                      <!-- 删除蒙版 -->
                      <div class="works-mask" style="z-index: 9527" v-show="mask">
                        <van-checkbox-group v-model="checkList">
                          <van-checkbox
                            :key="work.worksId"
                            :name="work.worksId"
                            checked-color="#92cd36"
                          ></van-checkbox>
                        </van-checkbox-group>
                      </div>
                      <img :src="work.smallUrl" alt />
                      <div
                        class="works-status"
                        size-12
                        v-if="work.verifyStatus == 2"
                        style="background-color:#e64340;"
                      >不通过</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="empty">
              <img src="@/assets/kong.png" alt />
              <p class="mt-30">您还没有上传作品，小Q期待您的作品哦</p>
            </div>
          </template>
        </van-tab>
      </van-tabs>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <template v-if="active == 0">
          <van-button type="info" size="large" class="no-radius" @click="handleWorkAdd">上传作品</van-button>
        </template>
        <template v-else>
          <div class="flex">
            <van-button
              size="large"
              type="default"
              class="no-radius"
              v-show="mask"
              @click="handleCancel"
            >取消</van-button>
            <van-button
              size="large"
              type="default"
              class="no-radius"
              v-show="!mask"
              @click="mask = true"
            >编辑</van-button>
            <van-button
              size="large"
              type="danger"
              class="no-radius"
              v-show="mask"
              @click="handleDelImage"
            >删除</van-button>
            <van-button
              size="large"
              type="info"
              class="no-radius"
              v-show="!mask"
              to="/works/add"
            >上传作品</van-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import eventBus from "@/utils/eventBus";
import { mapState } from "vuex";
export default {
  name: "works",
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      loading: false,
      finished: false,
      totalPage: 1, //总页数
      active: 0,
      mask: false,
      swiperOption: {
        slidesPerView: "auto",
        freeMode: true,
        spaceBetween: 12,
        observer: true
      },
      query: {
        studentId: this.$store.state.user.info.studentId,
        page: 1,
        pageSize: 10
      },
      querys: {
        page: 1,
        pageSize: 10
      },
      list: [], //我的上传
      onLineList: [], //上榜作品
      worksList: [], //优秀作品展
      checkList: [] //checkbox 选中项
    };
  },
  computed: {
    ...mapState("user", {
      roleType: state => state.info.roleType,
      studentId: state => state.info.studentId
    }),
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  methods: {
    onLoad() {
      console.log("onload");
      if (this.querys.page < this.totalPage) {
        this.querys.page += 1;
        service.excellentWorks(this.querys).then(res => {
          if (res.errorCode === 0) {
            let list = res.data.data;
            this.totalPage = res.data.totalPage;
            this.querys.page = res.data.page;
            // 加载状态结束
            this.loading = false;
            for (let i = 0; i < list.length; i++) {
              this.worksList.push(list[i]);
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
    handleWorkAdd() {
      if (this.studentId == 0) {
        this.$toast("您尚未关注小孩，请先关注");
      } else {
        this.$router.push({
          path: "/works/add"
        });
      }
    },
    //作品点赞
    async handleAddPraise(params) {
      if (this.studentId == 0) {
        this.$toast("您尚未关注小孩，请先关注");
        return;
      }
      let { worksId } = params;
      let res = await service.addPraise({ worksId });
      if (res.errorCode === 0) {
        params.praise = res.data.praise;
      }
    },
    commonPreviewImage(list = [], imgUrl = "", index = 0) {
      if (list.length && imgUrl) {
        let result = [];
        let min = index - 2 <= 0 ? 0 : index - 2;
        let max = index + 2;
        let imgArr = list.filter((item, i) => {
          return i >= min && i <= max;
        });
        if (imgArr.length) {
          for (let i = 0; i < imgArr.length; i++) {
            result.push(imgArr[i].imageUrl);
          }
        }
        wx.previewImage({
          current: encodeURI(imgUrl),
          urls: result || [imgUrl]
        });
      }
    },
    //预览图片
    handlePreviewImage(list, imgUrl, index) {
      this.commonPreviewImage(list, imgUrl, index);
    },
    handleDelImage() {
      if (this.checkList.length) {
        this.deleteImage({ images: this.checkList });
      } else {
        this.$toast("没有选择图片");
      }
    },
    handleCancel() {
      this.mask = false;
      this.checkList = [];
    },
    //删除作品
    async deleteImage(params = {}) {
      let res = await service.deleteImage(params);
      if (res.errorCode === 0) {
        this.mask = false;
        this.checkList = [];
        this.queryMyUpload(this.query);
      }
    },
    //我的上榜作品
    async queryOnLineList(params = {}) {
      let res = await service.queryOnLineList(params);
      if (res.errorCode === 0) {
        this.onLineList = res.data.data || [];
      }
    },
    //优秀作品
    async excellentWorks(params = {}) {
      let res = await service.excellentWorks(params);
      if (res.errorCode === 0) {
        this.querys.page = res.data.page;
        this.totalPage = res.data.totalPage;
        this.worksList = res.data.data || [];
      }
    },
    //查询我的上传作品
    async queryMyUpload(params = {}) {
      let res = await service.queryMyUpload(params);
      if (res.errorCode === 0) {
        this.list = res.data || [];
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (to.path === "/works" && from.path === "/works/add") {
      next(vm => {
        vm.active = 1;
      });
      return;
    }
    next();
  },
  created() {},
  mounted() {
    this.queryOnLineList(this.query);
    this.excellentWorks(this.querys);
    this.queryMyUpload(this.query);
  },
  activated() {
    //console.log("activated");
  },
  beforeDestroy() {
    //console.log("beforeDestroy20");
  },
  destroyed() {
    //console.log("destroyed20");
  }
};
</script>
<style lang="less" scoped>
.cells-title {
  color: #252525;
  margin: 20px 0 0 0;
  padding: 30px;
  background-color: #fff;
}
.page-swiper {
  position: relative;
  padding-left: 30px;
  padding-bottom: 40px;
  background-color: #fff;
}
.slide {
  width: 260px;
  height: 180px;
  position: relative;
  .slide-img {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    border-radius: 10px;
    background-size: cover;
    background-repeat: no-repeat;
  }
}
.zan {
  position: absolute;
  right: 8%;
  bottom: 8%;
  color: #fff;
  padding: 6px 20px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  span {
    display: inline-block;
    margin-left: 10px;
  }
}
.good-works {
  margin-bottom: 20px;
  background-color: #fff;
  .item {
    width: 50%;
    padding: 0 30px;
    position: relative;
    margin-bottom: 30px;
  }
  .good-image {
    height: 300px;
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
      border-radius: 10px;
    }
  }
}
.time-works {
  background-color: #fff;
  .item {
    padding: 30px 20px;
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
    .suni-box {
      width: 25%;
      padding: 0 10px;
    }
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
        border-radius: 8px;
      }
    }
    .works-status {
      color: #fff;
      padding: 6px 10px;
      border-radius: 20px;
      position: absolute;
      right: 6%;
      bottom: 6px;
      background-color: #252525;
    }
  }
}
.works-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: right;
  border-radius: 8px;
  padding: 10px 10px 0 0;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
