<template>
  <div class="page">
    <div class="page-bd">
      <van-tabs :line-height="2" v-model="actives" @click="handleTab">
        <van-tab :title="item.title" v-for="item in tabList" :key="item.lessonId">
          <div class="cells">
            <div class="cell min-h120 score" v-for="(item, index) in list" :key="index">
              <div class="cell-hd">
                <p>{{ item.day }}</p>
              </div>
              <div class="cell-bd">
                <p class="text-center text-ellipsis">{{ item.stageTitle }}</p>
              </div>
              <div class="cell-ft">
                <strong>{{ item.score }}分</strong>
              </div>
            </div>
          </div>
          <template v-show="lists.length">
            <div class="cells-title">其他学校试卷</div>
            <!-- 其他学校试卷列表查询 -->
            <div class="search">
              <div class="flex a-i-c search-container">
                <van-icon name="search" size="24px"></van-icon>
                <input
                  v-model="querys.schoolName"
                  type="text"
                  placeholder="请输入学校名称查询"
                  maxlength="26"
                  class="input flex-1 text-left"
                  @input="handleSearch($event)"
                />
              </div>
            </div>
            <div class="cells">
              <div
                class="cell exam"
                v-for="(item, index) in lists"
                :key="index"
                @click="jump(item)"
              >
                <div class="cell-hd">
                  <img src="@/assets/examPaper-icon@2x.png" alt />
                </div>
                <div class="cell-bd exam-bd">
                  <p class="mb-20 text-ellipsis">{{ item.schoolName }}</p>
                  <p size-12 class="text-ellipsis" style="color:#999">{{ item.title }}</p>
                </div>
              </div>
            </div>
          </template>
        </van-tab>
      </van-tabs>
      <div class="empty" v-if="!lists.length">
        <img src="@/assets/kong.png" alt />
        <p>暂无试卷内容</p>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "examPaper",
  data() {
    return {
      query: {
        openId: this.$store.state.user.info.openId,
        lessonId: this.$route.query.lessonId,
        studentId: this.$store.state.user.info.studentId,
        page: 1,
        pageSize: 20
      },
      querys: {
        lessonId: this.$route.query.lessonId,
        gradeId: this.$route.query.gradeId,
        schoolName: "",
        page: 1,
        pageSize: 20
      },
      tabList: [],
      list: [],
      lists: []
    };
  },
  computed: {
    actives: {
      get() {
        return this.tabList.findIndex(
          item => item.lessonId == this.query.lessonId
        );
      },
      set(newValue) {}
    }
  },
  methods: {
    handleTab(tabIndex, title) {
      let lessonId = this.tabList[tabIndex].lessonId;
      this.query.lessonId = lessonId;
      this.querys.lessonId = lessonId;
      this.init();
    },
    //搜索功能
    handleSearch(event) {
      let value = event.target.value;
      this.querys.schoolName = value;
      this.queryOtherSchool(this.querys);
    },
    jump(params) {
      let { detailId } = params;
      this.$router.push({
        path: "/examPaper/show",
        query: {
          detailId
        }
      });
    },
    init() {
      this.lessonScoreQuery(this.query);
      this.queryOtherSchool(this.querys);
    },
    //查询课程列表
    async lessonInfoQuery() {
      let res = await service.lessonInfoQuery({});
      if (res.errorCode === 0) {
        this.tabList = res.data;
      }
    },
    //试卷列表查询
    async lessonScoreQuery(params = {}) {
      let res = await service.lessonScoreQuery(params);
      if (res.errorCode === 0) {
        this.list = res.data.data || [];
      }
    },
    //其他学校试卷列表查询
    async queryOtherSchool(params = {}) {
      let res = await service.queryOtherSchool(params);
      if (res.errorCode === 0) {
        this.lists = res.data.data || [];
      }
    }
  },
  mounted() {
    this.lessonInfoQuery();
    this.init();
  }
};
</script>
<style lang="less" scoped>
.search {
  position: relative;
  padding: 20px 0;
  background-color: #fff;
  &-container {
    width: 600px;
    margin: 0 auto;
    padding: 0 20px;
    border-radius: 50px;
    background-color: #f1f0f0;
    i {
      color: #999;
    }
    input {
      padding-left: 20px;
      height: 80px;
    }
  }
}
.score {
  strong {
    font-size: 36px;
    color: #ff4d67;
  }
}
.exam {
  min-height: 160px;
  &-bd {
    overflow: hidden;
    padding-left: 30px;
    span {
      color: #999;
    }
  }
  img {
    width: 120px;
    height: 120px;
  }
}
</style>
