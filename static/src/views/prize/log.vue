<template>
  <div class="page">
    <div class="page-bd">
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        :offset="100"
        @load="onLoad"
      >
        <div class="cells">
          <div class="cell min-h160" v-for="item in list" :key="item.exchangeId">
            <div class="cell-bd">
              <p>{{ item.textContent }}</p>
              <div size-14>x{{ item.times }}</div>
              <time size-12 style="color:#7d7e80">{{ item.postTime }}</time>
            </div>
            <div class="cell-ft">
              <span style="color:#ff4d67">{{ item.starCount * item.times }}颗</span>
            </div>
          </div>
        </div>
      </van-list>
      <div class="empty" v-if="!list.length">
        <img src="@/assets/kong.png" alt />
        <p class="mt-30">您还没有任何兑换记录哦</p>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "prizeExchangeLog",
  data() {
    return {
      loading: false,
      finished: false,
      totalPage: 1, //总页数
      query: {
        openId: this.$store.state.user.info.openId,
        studentId: this.$store.state.user.info.studentId,
        page: 1,
        pageSize: 10
      },
      list: []
    };
  },
  methods: {
    onLoad() {
      if (this.query.page < this.totalPage) {
        this.query.page += 1;
        service.prizeExchangeLog(this.query).then(res => {
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
    //兑奖记录查询
    async prizeExchangeLog(params = {}) {
      let res = await service.prizeExchangeLog(params);
      if (res.errorCode === 0) {
        this.query.page = res.data.page;
        this.totalPage = res.data.totalPage;
        this.list = res.data.data || [];
      }
    }
  },
  mounted() {
    this.prizeExchangeLog(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>
