<template>
  <div class="flex-page">
    <div class="flex-bd">
      <form action ref="form">
        <div class="cells-title">完善学生信息</div>
        <div class="cells">
          <div class="cell">
            <div class="cell-hd">
              <label class="label">学生姓名</label>
            </div>
            <div class="cell-bd">
              <input
                type="text"
                class="input"
                placeholder="请输入学生姓名"
                maxlength="4"
                v-model="form.studentName"
              />
            </div>
          </div>
          <div class="cell cell-select cell-select-after">
            <div class="cell-hd">
              <label for class="label">性别</label>
            </div>
            <div class="cell-bd">
              <select class="select" name dir="rtl" v-model="form.sex">
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
              <label class="label">家长手机号</label>
            </div>
            <div class="cell-bd">
              <input
                type="number"
                class="input"
                pattern="[0-9]*"
                placeholder="请输入手机号"
                readonly
                v-model="form.tel"
              />
            </div>
          </div>
          <div class="cell cell-select cell-select-after">
            <div class="cell-hd">
              <label for class="label">学生和家长关系</label>
            </div>
            <div class="cell-bd">
              <select class="select" name dir="rtl" v-model="form.relation">
                <option
                  :value="option.id"
                  v-for="(option,index) in relationList"
                  :key="index"
                >{{ option.name }}</option>
              </select>
            </div>
          </div>
          <div class="cell">
            <div class="cell-hd">
              <label for class="label">学生所在班级</label>
            </div>
            <div class="cell-bd"></div>
            <div class="cell-ft">
              <p class="cell-p">{{ form.className }}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="flex-ft">
      <van-button type="info" size="large" class="no-radius" @click="handleSubmit">提交</van-button>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import { sex, relation } from "@/mixins/type";
import { isPhone } from "@/utils/validator";
export default {
  name: "bobySupply",
  mixins: [sex, relation],
  data() {
    return {
      classList: [],
      query: {
        openId: this.$store.state.user.info.tel || this.$route.query.openId,
        tel: this.$route.query.tel
      },
      form: {}
    };
  },
  methods: {
    handleSubmit() {
      let { studentName, tel } = this.form;
      if (studentName == "" || !studentName.length) {
        this.$toast("请输入学生姓名");
        return false;
      }
      if (isPhone(tel)) {
        let obj = Object.assign({}, this.form, { openId: this.query.openId });
        this.studentSupply(obj);
      } else {
        this.$toast("请正确填写手机号");
      }
    },
    //学生信息查询
    async studentQuery(params = {}) {
      let res = await service.studentQuery(params);
      if (res.errorCode === 0) {
        this.form = res.data[0];
      }
    },
    //学生信息完善
    async studentSupply(params = {}) {
      let res = await service.studentSupply(params);
      if (res.errorCode === 0) {
        this.$refs.form.reset();
        let _cookie = Cookies.getJSON("info");
        let { tel, ...args } = res.data;
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
    this.studentQuery(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>
