<template>
  <div class="page">
    <div class="page-bd">
      <div class="empty">
        <img src="@/assets/kong.png" alt />
        <p class="mt-30">正在建设中~</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "readRecommend",
  data() {
    return {};
  },
  mounted() {
    let timestamp = new Date().getTime();
    console.log(timestamp);
  }
};
</script>
<style lang="less" scoped>
</style>