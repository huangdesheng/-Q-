<template>
  <div class="page">
    <div class="page-bd">
      <div class="cells mb-20">
        <div class="cell min-h100">
          <div class="cell-hd">
            <label class="label f-w">班级</label>
          </div>
          <div class="cell-bd">
            <p class="text-right f-w">{{ statusText }}</p>
          </div>
        </div>
      </div>
      <div class="cells">
        <div class="cell min-h100" v-for="item in list" :key="item.className">
          <div class="cell-hd">
            <label class="label">{{ item.className }}</label>
          </div>
          <div class="cell-bd">
            <p class="text-right">{{ item.quantity }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "clockView",
  data() {
    return {
      query: {
        schoolId: this.$store.state.user.info.id,
        date: this.$route.query.date,
        status: this.$route.query.status,
        gradeId: this.$route.query.gradeId
      },
      list: []
    };
  },
  computed: {
    statusText() {
      let text = "";
      if (this.query.status == 0) {
        return (text = "应到人数");
      } else if (this.query.status == 1) {
        return (text = "实到人数");
      } else if (this.query.status == 2) {
        return (text = "请假人数");
      } else {
        return (text = "缺勤人数");
      }
    }
  },
  methods: {
    //园长考勤统计详情
    async gradeDefual(params = {}) {
      let res = await service.gradeDefual(params);
      if (res.errorCode === 0) {
        this.popupShow = false;
        this.list = res.data;
      }
    }
  },
  mounted() {
    this.gradeDefual(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>