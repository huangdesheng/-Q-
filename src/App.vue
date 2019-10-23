<template>
  <div id="app">
    <!-- 这里是会被缓存的视图组件，比如 Home！ -->
    <transition name="fade-transform" mode="out-in">
      <!-- 这里是会被缓存的视图组件，比如 Home！ -->
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view :key="$route.fullPath"></router-view>
      </keep-alive>
      <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  watch: {
    $route(to, from) {
      //console.log(to);
    }
  }
};
</script>

<style lang="less">
@import "./styles/site.less";
</style>
