<template>
  <div class="page">
    <div class="page-bd">
      <div class="remark" v-for="(item, index) in list" :key="index">
        <div class="remark-bd">
          <div class="remark-teacher flex mb-30">
            <span>老师:</span>
            <p class="ml-20">{{ item.teacherText }}</p>
          </div>
          <div class="remark-sys flex mb-30">
            <span>系统:</span>
            <p class="ml-20">{{ item.sysText }}</p>
          </div>
          <div class="remark-time">{{ item.sysTime }}</div>
        </div>
      </div>
      <div class="empty" v-if="!list.length">
        <img src="@/assets/kong.png" alt>
        <p>暂无评语</p>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "remark",
  data() {
    return {
      query: {
        openId: this.$store.state.user.info.openId,
        studentId: this.$store.state.user.info.studentId,
        page: 1,
        pageSize: 20
      },
      list: []
    };
  },
  methods: {
    //评语列表查询
    async remarkListQuery(params = {}) {
      let res = await service.remarkListQuery(params);
      if (res.errorCode === 0) {
        this.list = res.data.data || [];
      }
    }
  },
  mounted() {
    this.remarkListQuery(this.query);
  }
};
</script>
<style lang="less" scoped>
.remark {
  padding: 30px 20px;
  margin-bottom: 20px;
  text-align: justify;
  background-color: #fff;
  &-time {
    color: #b5b5b5;
    text-align: right;
  }
  span {
    display: inline-block;
  }
  p {
    flex: 1;
    line-height: 1.4;
  }
}
</style>
