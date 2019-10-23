<template>
  <div class="page">
    <div class="page-hd">
      <van-tabs :line-height="2" v-model="actives" @click="handleTab">
        <van-tab :title="item.title" v-for="item in tabList" :key="item.lessonId"></van-tab>
      </van-tabs>
    </div>
    <div class="page-bd">
      <div class="score" v-for="(item, index) in list" :key="index">
        <template v-if="index === 0">
          <div class="score-content mt-20 mb-20">
            <p class="mb-30" size-17>{{ item.stageTitle }}</p>
            <div class="score-meta">
              <span>班级: {{ item.scoreRank }}</span>
              <span>学校: {{ item.schoolRank }}</span>
              <span>同城: {{ item.regionRank }}</span>
            </div>
            <strong class="mt-30 mb-30">{{ item.score }}分</strong>
            <div>
              <van-button
                round
                type="info"
                size="small"
                @click="jump(item)"
                style="width:170px;height:35px;font-size:18px;"
              >试卷讲解</van-button>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="item flex j-c-s-b a-i-c">
            <div class="info flex-1">
              <p class="mb-20">{{ item.stageTitle }}</p>
              <div class="goal flex j-c-s-b">
                <span>{{ item.score }}分</span>
                <van-button
                  round
                  type="info"
                  size="mini"
                  @click="jump(item)"
                  style="width:80px;height:22px;"
                >试卷讲解</van-button>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="empty" v-if="!list.length">
        <img src="@/assets/kong.png" alt>
        <p>尚未有成绩发布</p>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "score",
  data() {
    return {
      actives: parseInt(this.$route.query.index),
      query: {
        openId: this.$store.state.user.info.openId,
        studentId: this.$store.state.user.info.studentId,
        lessonId: this.$route.query.lessonId,
        page: 1,
        pageSize: 20
      },
      tabList: [],
      list: []
    };
  },
  methods: {
    handleTab() {
      let lesson = this.tabList[this.actives];
      if (lesson) {
        this.query.lessonId = lesson.lessonId;
        this.lessonScoreQuery(this.query);
      }
    },
    jump(item) {
      let { lessonId, stageId } = item;
      this.$router.push({
        path: "/examPaper",
        query: {
          lessonId,
          stageId
        }
      });
    },
    //查询课程列表
    async lessonInfoQuery() {
      let res = await service.lessonInfoQuery({});
      if (res.errorCode === 0) {
        this.tabList = res.data;
      }
    },
    //课程成绩查询列表
    async lessonScoreQuery(params = {}) {
      let res = await service.lessonScoreQuery(params);
      if (res.errorCode === 0) {
        this.list = res.data.data || [];
      }
    }
  },
  mounted() {
    this.lessonInfoQuery();
    this.lessonScoreQuery(this.query);
  }
};
</script>
<style lang="less" scoped>
.score {
  &-content {
    text-align: center;
    padding: 30px 0;
    min-height: 400px;
    background-color: #fff;

    strong {
      display: inline-block;
      font-size: 50px;
      color: #ff4d67;
    }
  }
  &-meta {
    color: #999;
  }
  .item {
    min-height: 160px;
    padding: 0 30px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 1px 10px 0 rgba(204, 204, 204, 0.5);
    a {
      color: #92cd36;
    }
  }
  .goal {
    color: #ff4d67;
    font-size: 40px;
  }
}
</style>
