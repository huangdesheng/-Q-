<template>
  <div class="page">
    <div class="page-bd">
      <van-cell title="关于我们" is-link size="large" to="/about"></van-cell>
      <van-cell title="使用帮助" is-link size="large" to="/help-center/view"></van-cell>
      <van-cell title="客服电话" size="large">
        <div class="flex a-i-c j-c-f-e">
          <van-icon name="phone" size="20px"></van-icon>
          <a href="tel:020-89285132" class="ml-10">020-89285132</a>
        </div>
      </van-cell>
    </div>
  </div>
</template>
<script>
export default {
  name: "helpCenter",
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
</style>
