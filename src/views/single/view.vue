<template>
  <div class="page">
    <div class="page-bd">
      <div class="cells" v-if="list.length">
        <div class="cell min-h100" style="padding: 0">
          <div class="flex-1 text-center">{{ tabIndex == 0 ? '行为名称':'课程名称' }}</div>
          <div class="flex-1 text-center">学生名字</div>
          <div class="flex-1 text-center">Q星数量</div>
        </div>
      </div>
      <div class="cells">
        <div style="padding: 0" class="cell min-h100" v-for="(item, index) in list" :key="index">
          <div class="flex-1 text-center">{{ item.name }}</div>
          <div class="flex-1 text-center">{{ item.studentName }}</div>
          <div class="flex-1 text-center">
            <van-rate
              v-model="item.starCount"
              :size="18"
              :count="5"
              color="#febf56"
              allow-half
              readonly
            ></van-rate>
          </div>
        </div>
      </div>
      <div class="empty" v-if="!list.length">
        <img src="@/assets/kong.png" alt />
        <p>暂无数据</p>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "",
  data() {
    return {
      tabIndex: this.$route.query.tabIndex,
      name: this.$route.query.name,
      query: {
        classId: this.$route.query.classId,
        startDate: this.$route.query.startDate,
        endDate: this.$route.query.endDate,
        actionId: this.$route.query.actionId,
        actionType: this.$route.query.actionType,
        number: this.$route.query.number
      },
      querys: {
        classId: this.$route.query.classId,
        lessonId: this.$route.query.lessonId,
        startDate: this.$route.query.startDate,
        endDate: this.$route.query.endDate,
        number: this.$route.query.number
      },
      list: []
    };
  },
  methods: {
    //行为详情（在家）
    async queryActionDetails(params = {}) {
      let res = await service.queryActionDetails(params);
      if (res.errorCode === 0) {
        this.list = res.data;
      }
    },
    //课程详情（在校）
    async queryLessonDetail(params = {}) {
      let res = await service.queryLessonDetail(params);
      if (res.errorCode === 0) {
        this.list = res.data;
      }
    }
  },
  activated() {
    if (this.tabIndex == 0) {
      this.queryActionDetails(this.query);
    } else {
      this.queryLessonDetail(this.querys);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
