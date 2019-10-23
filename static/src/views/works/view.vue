<template>
  <div class="page">
    <div class="page-bd"></div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "worksView",
  data() {
    return {
      query: {
        studentId: this.$store.state.user.info.studentId
      }
    };
  },
  methods: {
    //查询优秀上传作品
    async queryOnLineList(params = {}) {
      let res = await service.queryOnLineList(params);
      if (res.errorCode === 0) {
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>
