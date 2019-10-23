<template>
  <div class="page">
    <div class="page-hd">
      <!-- 班级选择菜单 -->
      <div class="button-sp-area flex" size-17>
        <a href="javascript:;" id="showDatePicker" @click="popupShow = true">
          <span>{{ className }}</span>
          <van-icon name="arrow-down" size="16px"></van-icon>
        </a>
      </div>
      <!-- 班级选择菜单 -->
    </div>
    <div class="page-bd">
      <van-popup v-model="popupShow" position="bottom">
        <van-picker
          :columns="classList"
          show-toolbar
          value-key="className"
          @cancel="popupShow = false"
          @confirm="handleClassConfirm"
        ></van-picker>
      </van-popup>
      <div class="list" v-if="list.length">
        <!-- 分页 -->
        <van-list
          v-model="loading"
          :finished="finished"
          :immediate-check="false"
          :offset="100"
          @load="onLoad"
        >
          <div class="flex f-w-w" style="margin-left: -5px; margin-right: -5px;">
            <div class="suni" v-for="(item, i) in list" :key="i">
              <div class="suni-bd">
                <div class="suni-thumb" @click="handlePreviewImage(item.imageUrl, i)">
                  <img :src="item.smallUrl" alt />
                  <div class="zan flex a-i-c" v-if="item.praise">
                    <van-icon name="like" size="14px" color="#e64340"></van-icon>
                    <span>{{ item.praise }}</span>
                  </div>
                </div>
                <div class="suni-meta">
                  <p>{{ item.studentName }}</p>
                  <time>{{ item.postTime }}</time>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
      <div class="empty" v-else>
        <img src="@/assets/kong.png" alt />
        <p class="mt-30">暂无学生作品</p>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import classList from "@/mixins/classList";
export default {
  name: "worksTeacher",
  mixins: [classList],
  data() {
    return {
      loading: false,
      finished: false,
      totalPage: 1, //总页数
      popupShow: false,
      className: this.$store.state.user.info.className,
      query: {
        classId: this.$store.state.user.info.classId,
        page: 1,
        pageSize: 20
      },
      list: []
    };
  },
  methods: {
    onLoad() {
      console.log("onload");
      if (this.query.page < this.totalPage) {
        this.query.page += 1;
        service.queryWorkStudent(this.query).then(res => {
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
    //预览图片
    handlePreviewImage(imgUrl, index) {
      let result = [];
      let min = index - 2 <= 0 ? 0 : index - 2;
      let max = index + 2;
      let imgArr = this.list.filter((item, i) => {
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
    },
    handleClassConfirm(value, index) {
      this.className = value.className;
      this.query.classId = value.classId;
      this.query.page = 1;
      //当切换班级时，重新设置为没有全部加载完成
      this.finished = false;
      this.queryWorkStudent(this.query);
    },
    //学生作品
    async queryWorkStudent(params = {}) {
      let res = await service.queryWorkStudent(params);
      if (res.errorCode === 0) {
        this.popupShow = false;
        this.query.page = res.data.page;
        this.totalPage = res.data.totalPage;
        this.list = res.data.data || [];
      }
    }
  },
  mounted() {
    this.queryWorkStudent(this.query);
  }
};
</script>
<style lang="less" scoped>
.list {
  padding: 0 20px 20px 20px;
}
.suni {
  width: 50%;
  padding: 0 10px;
  margin-bottom: 30px;
  &-bd {
    border-radius: 8px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 1px 20px 0 rgba(204, 204, 204, 0.4);
  }
  &-meta {
    margin-top: 10px;
    font-size: 32px;
    time {
      font-size: 24px;
      color: #999;
    }
  }
  &-thumb {
    height: 160px;
    position: relative;
    padding-bottom: 100%;
    overflow: hidden;
    background-color: #e4f1ff;
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
</style>
