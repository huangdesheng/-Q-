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
  name: "noticeViewClass",
  data() {
    return {
      query: {
        noticeId: this.$route.query.noticeId,
        status: this.$route.query.status
      },
      list: []
    };
  },
  computed: {
    statusText() {
      let text = "";
      if (this.query.status == 1) {
        return (text = "已阅读");
      } else if (this.query.status == 2) {
        return (text = "未阅读");
      } else {
        return (text = "未确认");
      }
    }
  },
  methods: {
    //园长端--公告通知班级详情
    async queryClassNotice(params = {}) {
      let res = await service.queryClassNotice(params);
      if (res.errorCode === 0) {
        this.list = res.data;
      }
    }
  },
  mounted() {
    this.queryClassNotice(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>