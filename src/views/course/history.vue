<template>
  <div class="page">
    <div class="page-hd">
      <div class="share-image flex a-i-c j-c-s-b min-h100">
        <p>
          {{ name }}已经坚持记录
          <time style="color:#f44;">{{ days }}</time>天
        </p>
        <div class="text-center" style="color:#ff9933" @click="shareHistoryImage(2)">
          <van-icon name="share" size="16px"></van-icon>
          <div size-12>晒一晒</div>
        </div>
      </div>
    </div>
    <div class="page-bd">
      <van-dialog v-model="dialogImage" close-on-click-overlay :show-confirm-button="false">
        <div class="cells">
          <img :src="shareImgUrl" />
          <p class="text-center pt-30 pb-30 share-desctext">长按图片保存或发给朋友</p>
        </div>
      </van-dialog>
      <van-collapse v-model="activeNames">
        <van-collapse-item :name="item.day" v-for="item in list" :key="item.day">
          <div class="flex" size-16 slot="title">
            <time>{{ item.day }}</time>
            <div class="ml-20 mr-20 flex">
              <span>获得</span>
              <span style="color:#f44;">{{ item.sumStar }}</span>颗Q星
            </div>
            <span v-show="item.comment === 0" style="color:#f44">补评价</span>
          </div>
          <div class="action-cells">
            <div
              class="action-cell flex a-i-c j-c-s-b"
              v-for="(lesson, index) in item.lessones"
              :key="index"
            >
              <div class="action-cell-bd flex a-i-c j-c-s-b">
                <div class="action-cell-label">
                  <div>{{ lesson.title }}</div>
                  <!-- 课堂时间 -->
                  <span v-show="lesson.startTime">{{ lesson.startTime }}-{{ lesson.endTime }}</span>
                </div>
                <van-rate
                  v-model="lesson.starCount"
                  :count="5"
                  :size="22"
                  color="#febf56"
                  void-color="#e5eee0"
                  disabled-color="#febf56"
                  :readonly="true"
                ></van-rate>
              </div>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
      <div class="empty" v-if="!list.length">
        <img src="@/assets/kong.png" alt />
        <p class="mt-30">还没有数据展示哦</p>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { mapState } from "vuex";
export default {
  name: "courseHistory",
  data() {
    return {
      dialogImage: false,
      shareImgUrl: "", //生成的分享图片地址
      activeNames: [],
      query: {
        studentId: this.$store.state.user.info.studentId,
        page: 1,
        pageSize: 10
      },
      totalPage: 1, //总页数
      list: []
    };
  },
  computed: {
    ...mapState("user", {
      name: state => state.info.name
    }),
    days() {
      if (this.list.length) {
        return this.list[0].days;
      } else {
        return 0;
      }
    }
  },
  methods: {
    //学生在校表现历史查询
    async queryLessonHistory(params = {}) {
      let res = await service.queryLessonHistory(params);
      if (res.errorCode === 0) {
        this.query.page = res.data.page;
        this.totalPage = res.data.totalPage;
        this.list = res.data.data || [];
      }
    },
    //生成历史图片分享
    async shareHistoryImage(type) {
      let params = {
        type,
        days: this.days,
        studentId: this.query.studentId
      };
      let res = await service.historyImage(params);
      if (res.errorCode === 0) {
        this.shareImgUrl = res.data;
        this.dialogImage = true;
      }
    }
  },
  mounted() {
    this.queryLessonHistory(this.query);
  }
};
</script>
<style lang="less" scoped>
.action-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 20px 0;
  i {
    vertical-align: top;
  }
  &-bd {
    flex: 1;
  }
}
.van-collapse-item {
  margin-bottom: 10px;
}
.share-image {
  padding: 0 30px;
}
.share-desctext {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
