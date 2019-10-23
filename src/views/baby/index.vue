<template>
  <div class="page">
    <div class="page-bd">
      <div class="cells">
        <div
          class="cell student-box"
          v-for="(item, index) in studentList"
          :key="index"
          :class="[item.studentId == studentId ? 'curr-student': '']"
          @click="handleStudentChange(item)"
        >
          <div class="cell-bd">
            <div class="flex a-i-c">
              <img :src="item.photo" radius="50" v-if="item.photo" />
              <img src="@/assets/child-default@2x.png" radius="50" v-else />
              <strong>{{ item.name }}</strong>
              <span size-12>Q星: {{ item.totalStarCount }}</span>
            </div>
          </div>
          <div class="cell-ft">
            <span size-12 @click.stop="jump(item)">查看资料</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import Cookies from "js-cookie";
import { mapState } from "vuex";
export default {
  name: "boby",
  data() {
    return {
      studentList: []
    };
  },
  computed: {
    ...mapState("user", {
      roleType: state => state.info.roleType,
      openId: state => state.info.openId,
      studentId: state => state.info.studentId
    })
  },
  methods: {
    jump(params) {
      let { studentId } = params;
      this.$router.push({
        path: "/baby/edit",
        query: {
          studentId
        }
      });
    },
    //点击孩子进行切换操作
    handleStudentChange(params = {}) {
      //当前关联的不切换
      if (this.studentId == params.studentId) {
        this.$router.go(-1);
      } else {
        let _cookie = Cookies.getJSON("info");
        let obj = Object.assign({}, _cookie, params);
        this.$store.dispatch("user/setInfo", obj).then(data => {
          if (data.success === "ok") {
            let param = {
              openId: this.openId,
              studentId: obj.studentId,
              type: 1
            };
            this.switchingState(param);
            this.$router.go(-1);
          }
        });
      }
    },
    //查询学生列表
    async queryClassStudentList(params = {}) {
      let res = await service.queryClassStudentList(params);
      if (res.errorCode === 0) {
        this.studentList = res.data;
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
    this.queryClassStudentList({ openId: this.openId });
  }
};
</script>
<style lang="less" scoped>
.student-box {
  height: 120px;
  img {
    width: 90px;
    height: 90px;
  }
  strong {
    font-weight: normal;
    color: #2e2e2e;
    display: inline-block;
    margin: 0 40px;
  }
  span {
    color: #999;
  }
}
.handle-edit {
  color: #999;
  margin-top: 40px;
  padding-right: 30px;
}

.curr-student {
  border-left: 8px solid #84ce09;
}
</style>
