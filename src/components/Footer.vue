<template>
  <div class="footer" style="z-index: 100;">
    <div class="item">
      <router-link :to="{ path: singleUrl }">
        <div>小Q表现</div>
      </router-link>
    </div>
    <div class="item">
      <router-link to="/home">
        <div>小Q班级</div>
      </router-link>
    </div>
    <div class="item">
      <router-link to="/user">
        <div>个人中心</div>
      </router-link>
    </div>
    <div class="item">
      <router-link to="/device">
        <div>手环设备123</div>
      </router-link>
    </div>

    <!-- <div class="item">
      <router-link to="/device/studentList">
        <div>手环设备</div>
      </router-link>
    </div>-->

    <!-- <div class="item">
      <router-link to="/Handband">
        <div>手环设备</div>
      </router-link>
    </div>-->
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "qxFooter",
  data() {
    return {};
  },
  computed: {
    ...mapState("user", {
      roleType: state => state.info.roleType
    }),
    singleUrl() {
      if (this.roleType == 1 || this.roleType == 4) {
        return `/single/admin`;
      } else if (this.roleType == 2) {
        return `/single/teacher`;
      } else {
        return `/single`;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  font-size: 28px;
  display: flex;
  background-color: #fff;
  box-shadow: 0 -1px 30px #e5e5e5;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #e5e5e5;
    color: #e5e5e5;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    z-index: 2;
  }
  .item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    a {
      display: block;
      text-align: center;
      &.router-link-active {
        color: #92cd36;
      }
    }
  }
}
</style>
