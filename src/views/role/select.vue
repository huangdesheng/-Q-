<template>
  <div class="flex-page">
    <div class="flex-bd">
      <div class="role-box flex a-i-c j-c-c">
        <div class="role-list">
          <div
            class="item"
            v-for="(item, index) in roleList"
            :key="index"
            @click.stop="changeRole(item)"
          >
            <div>
              <img
                src="@/assets/teacher@2x.png"
                v-if="item.roleType == 1 || item.roleType == 2 || item.roleType == 4"
              />
              <img src="@/assets/family@2x.png" v-else />
            </div>
            <p v-if="item.roleType == 1 || item.roleType == 2 || item.roleType == 4">我是老师</p>
            <p v-else-if="item.roleType == 3 || item.roleType == 9">我是家长</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import { mapState } from "vuex";
export default {
  name: "roelSelect",
  data() {
    return {
      roleList: [],
      roleType: parseInt(this.$store.state.user.info.roleType)
    };
  },
  computed: {
    ...mapState("user", {
      openId: state => state.info.openId
    })
  },
  methods: {
    changeRole(item) {
      //如果要切换的角色是当前角色，则不切换
      if (item.roleType == this.roleType) {
        this.$router.go(-1);
        return;
      }
      let _cookie = Cookies.getJSON("info");
      let obj = Object.assign({}, _cookie, item);
      console.log(obj);
      this.$store.dispatch("user/setInfo", obj).then(data => {
        if (data.success === "ok") {
          let params = {
            openId: this.openId,
            studentId: obj.studentId,
            type: 2
          };
          this.switchingState(params);
          this.$router.go(-1);
        }
      });
    },
    //多角色列表
    async queryRole(params = {}) {
      let res = await service.queryRole(params);
      console.log(res);

      if (res.errorCode === 0) {
        this.roleList = res.data;
      }
    },
    //最后登录状态记录
    async switchingState(params = {}) {
      let res = await service.switchingState(params);
      if (res.errorCode === 0) {
      }
    }
  },
  mounted() {
    this.queryRole({ openId: this.openId });
  }
};
</script>
<style lang="less" scoped>
.role-box {
  min-height: 100vh;
  background-color: #84ce09;
  .item {
    color: #fff;
    font-size: 32px;
    text-align: center;
    position: relative;
    p {
      padding-top: 30px;
    }
    img {
      width: 284px;
      height: 284px;
    }
    &:last-child {
      margin-top: 100px;
    }
  }
}
.role-item {
  strong {
    font-weight: normal;
    display: inline-block;
    margin-left: 30px;
  }
}
</style>
