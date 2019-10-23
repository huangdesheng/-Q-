<template>
  <div class="page">
    <div class="page-bd cover">
      <form action ref="form" class="join-form">
        <div class="join-head">
          <h2 size-18 class="text-ellipsis text-center">{{ info.schoolName }}</h2>
          <div class="address flex text-ellipsis">
            <van-icon name="location-o" size="16px"></van-icon>
            <span>{{ info.location }}</span>
          </div>
        </div>
        <div class="cells">
          <div class="cell">
            <div class="cell-hd">
              <label class="label">姓名</label>
            </div>
            <div class="cell-bd">
              <input class="input" placeholder="请输入老师姓名" maxlength="10" v-model="info.teacherName" />
            </div>
          </div>
          <div class="cell cell-select cell-select-after">
            <div class="cell-hd">
              <label for class="label">性别</label>
            </div>
            <div class="cell-bd">
              <select class="select" name dir="rtl" v-model="info.sex">
                <option
                  :value="option.id"
                  v-for="(option,index) in sexList"
                  :key="index"
                >{{ option.name }}</option>
              </select>
            </div>
          </div>
          <div class="cell">
            <div class="cell-hd">
              <label class="label">手机号码</label>
            </div>
            <div class="cell-bd">
              <input
                type="number"
                class="input"
                pattern="[0-9]*"
                placeholder="请输入手机号"
                readonly
                v-model="info.tel"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" @click="handleSubmit">添加</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import { sex } from "@/mixins/type";
import { isPhone } from "@/utils/validator";
export default {
  name: "schoolJoin",
  mixins: [sex],
  data() {
    return {
      query: {
        openId: this.$store.state.user.info.tel,
        tel: this.$route.query.tel
      },
      info: {}
    };
  },
  methods: {
    handleSubmit() {
      let { schoolCode, location, schoolName, teacherId, ...args } = this.info;
      if (args.teacherName == "" || !args.teacherName.length) {
        this.$toast("请输入老师姓名");
        return false;
      }
      let obj = Object.assign({}, args, { openId: this.query.openId });
      this.teacherJoin(obj);
    },
    //查询园长预先录入老师的信息
    async queryTeacherInfoByTel(params = {}) {
      let res = await service.queryTeacherInfoByTel(params);
      if (res.errorCode === 0) {
        this.info = res.data;
      }
    },
    //老师信息完善
    async teacherJoin(params = {}) {
      let res = await service.teacherJoin(params);
      if (res.errorCode === 0) {
        let { tel, ...args } = res.data;
        let _cookie = Cookies.getJSON("info");
        let obj = Object.assign({}, _cookie, args);
        this.$store.dispatch("user/setInfo", obj).then(data => {
          if (data.success === "ok") {
            this.$router.replace({
              path: "/home"
            });
          }
        });
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  },
  mounted() {
    this.queryTeacherInfoByTel(this.query);
  }
};
</script>
<style lang="less" scoped>
.join-head {
  padding-top: 75px;
  padding-left: 20px;
  padding-right: 20px;
}
.address {
  margin-top: 20px;
  margin-bottom: 50px;
  color: #92cd36;
  justify-content: center;
  align-items: center;
  span {
    margin-left: 10px;
  }
}
</style>
